from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime
from app.core.db import get_db
from app.models.db_models import ProblemStatementDB, TeamDB
from app.models.schemas import ProblemStatementSchema, ProblemSelectRequest

router = APIRouter()

@router.get("", response_model=List[ProblemStatementSchema])
def get_all_problems(db: Session = Depends(get_db)):
    problems = db.query(ProblemStatementDB).all()
    
    # Calculate real-time count and list of teams for each problem statement
    team_map: Dict[str, List[Dict[str, Any]]] = {}
    teams = db.query(TeamDB).filter(TeamDB.problem_statement_id.isnot(None)).all()
    for t in teams:
        if t.problem_statement_id:
            if t.problem_statement_id not in team_map:
                team_map[t.problem_statement_id] = []
            team_map[t.problem_statement_id].append({
                "id": t.id,
                "name": t.name,
                "college": t.college,
                "leaderEmail": t.leader_email,
                "photoUrl": t.photo_url,
                "status": t.status,
                "selectedAt": t.selected_at.isoformat() if t.selected_at else (t.created_at.isoformat() if t.created_at else None)
            })

    return [
        ProblemStatementSchema(
            id=p.id,
            title=p.title,
            shortDescription=p.short_description,
            fullDescription=p.full_description,
            category=p.category,
            difficulty=p.difficulty,
            problemOwner=p.problem_owner,
            maxCapacity=3,
            selectedByCount=len(team_map.get(p.id, [])),
            selectedTeams=team_map.get(p.id, []),
            deliverables=p.deliverables or [],
            evaluationFocus=p.evaluation_focus or []
        ) for p in problems
    ]

@router.post("/select", response_model=ProblemStatementSchema)
def select_problem(req: ProblemSelectRequest, db: Session = Depends(get_db)):
    clean_team_id = req.team_id.strip()
    team = db.query(TeamDB).filter(
        (TeamDB.id == clean_team_id) | 
        (TeamDB.leader_id == clean_team_id) | 
        (TeamDB.leader_email == clean_team_id.lower())
    ).first()

    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Team {req.team_id} not found in database")

    # Strict Backend Guard: Check if problem is already locked for this team
    if team.problem_statement_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Conflict: Your squad is already permanently locked to Problem Statement {team.problem_statement_id} and cannot change it."
        )

    # Concurrency Lock on Problem Statement row for race condition protection
    try:
        prob = db.query(ProblemStatementDB).filter(ProblemStatementDB.id == req.problem_id).with_for_update().first()
    except Exception:
        prob = db.query(ProblemStatementDB).filter(ProblemStatementDB.id == req.problem_id).first()

    if not prob:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Problem Statement {req.problem_id} not found")

    # Strict Concurrent Capacity Check: Stop at 3 teams max
    current_selected_count = db.query(TeamDB).filter(TeamDB.problem_statement_id == req.problem_id).count()
    if current_selected_count >= 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Problem Statement '{prob.title}' ({req.problem_id}) has reached its maximum capacity of 3 teams and is no longer available."
        )

    # Apply Lock immediately
    now = datetime.utcnow()
    team.problem_statement_id = prob.id
    team.selected_at = now
    team.status = "ROUND_1_EVAL" if team.photo_url else "PROBLEM_SELECTED"
    prob.selected_by_count = current_selected_count + 1

    db.commit()
    db.refresh(prob)
    db.refresh(team)

    # Fetch updated selected teams list for this problem
    selected_teams_query = db.query(TeamDB).filter(TeamDB.problem_statement_id == prob.id).all()
    selected_teams = [{
        "id": t.id,
        "name": t.name,
        "college": t.college,
        "leaderEmail": t.leader_email,
        "photoUrl": t.photo_url,
        "status": t.status,
        "selectedAt": t.selected_at.isoformat() if t.selected_at else now.isoformat()
    } for t in selected_teams_query]

    return ProblemStatementSchema(
        id=prob.id,
        title=prob.title,
        shortDescription=prob.short_description,
        fullDescription=prob.full_description,
        category=prob.category,
        difficulty=prob.difficulty,
        problemOwner=prob.problem_owner,
        maxCapacity=3,
        selectedByCount=len(selected_teams),
        selectedTeams=selected_teams,
        deliverables=prob.deliverables or [],
        evaluationFocus=prob.evaluation_focus or []
    )

@router.post("/reset")
def reset_all_problem_selections(db: Session = Depends(get_db)):
    teams = db.query(TeamDB).all()
    for t in teams:
        t.problem_statement_id = None
        t.selected_at = None
        if t.status == "PROBLEM_SELECTED":
            t.status = "REGISTERED"

    probs = db.query(ProblemStatementDB).all()
    for p in probs:
        p.selected_by_count = 0

    db.commit()
    return {"status": "success", "message": "All team problem selections, timestamps, and counts have been reset."}

