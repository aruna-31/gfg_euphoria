from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.db_models import UserDB, TeamDB, TeamMemberDB
from app.models.schemas import LeaderRegisterRequest, LoginRequest, TokenResponse, CredentialCsvImportRequest
import uuid
import csv
from io import StringIO

router = APIRouter()

@router.post("/register-leader", response_model=TokenResponse)
def register_leader(req: LeaderRegisterRequest, db: Session = Depends(get_db)):
    clean_email = req.email.strip().lower()
    
    # Check if user email already exists
    existing = db.query(UserDB).filter(UserDB.email == clean_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration Error: An account with this registered email address already exists."
        )

    # Generate IDs
    user_id = f"usr-{uuid.uuid4().hex[:8]}"
    team_id = f"TEAM-{uuid.uuid4().hex[:4].upper()}"

    # 1. Create User
    new_user = UserDB(
        id=user_id,
        email=clean_email,
        hashed_password=get_password_hash(req.password),
        name=req.name,
        role="LEADER",
        phone=req.phone,
        college=req.college
    )
    db.add(new_user)

    # 2. Create Team
    new_team = TeamDB(
        id=team_id,
        name=req.team_name,
        college=req.college,
        leader_id=user_id,
        leader_email=clean_email,
        problem_statement_id=None, # Unselected
        status="REGISTERED",
        current_round=1,
        total_score=0.0
    )
    db.add(new_team)

    # 3. Create Leader Member Record
    leader_member = TeamMemberDB(
        id=f"m-{uuid.uuid4().hex[:6]}",
        team_id=team_id,
        name=req.name,
        email=clean_email,
        college=req.college,
        role_in_team="Team Leader",
        is_leader=True
    )
    db.add(leader_member)

    # Additional Members if provided
    if req.member2_name and req.member2_email:
        m2 = TeamMemberDB(
            id=f"m-{uuid.uuid4().hex[:6]}",
            team_id=team_id,
            name=req.member2_name,
            email=req.member2_email.strip().lower(),
            college=req.college,
            role_in_team=req.member2_role or "Member",
            is_leader=False
        )
        db.add(m2)

    if req.member3_name and req.member3_email:
        m3 = TeamMemberDB(
            id=f"m-{uuid.uuid4().hex[:6]}",
            team_id=team_id,
            name=req.member3_name,
            email=req.member3_email.strip().lower(),
            college=req.college,
            role_in_team=req.member3_role or "Member",
            is_leader=False
        )
        db.add(m3)

    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(subject=new_user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "role": new_user.role,
            "college": new_user.college,
            "teamId": team_id
        }
    }

@router.post("/login-leader", response_model=TokenResponse)
def login_leader(req: LoginRequest, db: Session = Depends(get_db)):
    clean_email = req.email.strip().lower()
    
    user = db.query(UserDB).filter(UserDB.email == clean_email).first()
    if not user or user.role != "LEADER":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed. Verify registered Team Leader email."
        )

    if not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed. Invalid password."
        )

    team = db.query(TeamDB).filter(
        (TeamDB.leader_id == user.id) | (TeamDB.leader_email == user.email.lower())
    ).first()
    team_id = team.id if team else None

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "college": user.college,
            "teamId": team_id
        }
    }

@router.post("/login-evaluator", response_model=TokenResponse)
def login_evaluator(req: LoginRequest, db: Session = Depends(get_db)):
    clean_email = req.email.strip().lower()
    
    user = db.query(UserDB).filter(UserDB.email == clean_email).first()
    if not user or user.role != "EVALUATOR":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed. Invalid Evaluator credentials."
        )

    if not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed. Invalid jury security passcode."
        )

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "college": user.college
        }
    }

@router.post("/login-admin", response_model=TokenResponse)
def login_admin(req: LoginRequest, db: Session = Depends(get_db)):
    clean_email = req.email.strip().lower()
    
    user = db.query(UserDB).filter(UserDB.email == clean_email).first()
    if not user or user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed. Unauthorized administrator account."
        )

    if not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed. Invalid admin master password."
        )

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "college": user.college
        }
    }

@router.post("/import-credentials")
def import_credentials(req: CredentialCsvImportRequest, db: Session = Depends(get_db)):
    account_type = req.account_type.strip().upper()
    if account_type not in {"LEADER", "EVALUATOR", "ADMIN"}:
        raise HTTPException(status_code=400, detail="account_type must be LEADER, EVALUATOR, or ADMIN.")

    rows = csv.DictReader(StringIO(req.csv_content))
    headers = {str(header).strip().lower() for header in (rows.fieldnames or [])}
    required = {"email", "name", "password"}
    if not required.issubset(headers):
        raise HTTPException(status_code=400, detail="CSV must include email, name, password columns.")
    if account_type == "LEADER" and not {"team_id", "team_name"}.issubset(headers):
        raise HTTPException(status_code=400, detail="Leader CSV must also include team_id and team_name columns.")

    imported, skipped, errors = 0, 0, []
    for row_number, row in enumerate(rows, start=2):
        data = {str(key).strip().lower(): (value or "").strip() for key, value in row.items()}
        email, name, password = data.get("email", "").lower(), data.get("name", ""), data.get("password", "")
        if not email or not name or not password:
            errors.append({"row": row_number, "message": "email, name, and password are required"})
            continue
        if db.query(UserDB).filter(UserDB.email == email).first():
            skipped += 1
            continue

        user_id = f"usr-{uuid.uuid4().hex[:10]}"
        college = data.get("college") or "Not supplied"
        team_id, team_name = data.get("team_id", ""), data.get("team_name", "")
        if account_type == "LEADER" and (not team_id or not team_name or db.query(TeamDB).filter(TeamDB.id == team_id).first()):
            errors.append({"row": row_number, "message": "team_id must be new and team_name is required"})
            continue

        user = UserDB(id=user_id, email=email, hashed_password=get_password_hash(password), name=name, role=account_type, college=college, phone=data.get("phone") or None)
        db.add(user)
        if account_type == "LEADER":
            db.add(TeamDB(id=team_id, name=team_name, college=college, leader_id=user_id, leader_email=email, status="REGISTERED", current_round=1, total_score=0.0))
            db.add(TeamMemberDB(id=f"m-{uuid.uuid4().hex[:10]}", team_id=team_id, name=name, email=email, college=college, role_in_team="Team Leader", is_leader=True))
        imported += 1
    db.commit()
    return {"imported": imported, "skipped_existing": skipped, "errors": errors}

