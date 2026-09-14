import csv
import sys
import os
import argparse

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.db import engine, Base, SessionLocal
from app.models.db_models import UserDB, TeamDB, TeamMemberDB
from app.core.security import get_password_hash

def import_team_leaders(csv_path: str):
    print(f"Importing Team Leaders from {csv_path}...")
    db = SessionLocal()
    try:
        with open(csv_path, mode="r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                # Normalize keys to lowercase stripped
                row_map = {k.strip().lower(): (v or "").strip() for k, v in row.items() if k}

                # Email resolution
                leader_email = (
                    row_map.get("registered email id") or 
                    row_map.get("email") or 
                    row_map.get("leader email") or 
                    row_map.get("leader_email") or 
                    row_map.get("registered email") or ""
                ).lower()

                # Password resolution
                leader_pass = (
                    row_map.get("password") or 
                    row_map.get("leader password") or 
                    row_map.get("pass") or ""
                )

                if not leader_email or not leader_pass:
                    continue

                count += 1
                default_prefix = leader_email.split("@")[0].replace(".", " ").title()

                leader_name = (
                    row_map.get("team leader's name") or 
                    row_map.get("team leader name") or 
                    row_map.get("leader's name") or 
                    row_map.get("leader name") or 
                    row_map.get("name") or 
                    default_prefix
                )

                team_id = (
                    row_map.get("team id") or 
                    row_map.get("team_id") or 
                    f"TEAM-{count:03d}"
                )
                team_name = (
                    row_map.get("team name") or 
                    row_map.get("team_name") or 
                    f"Team {leader_name}"
                )
                college = (
                    row_map.get("college name") or 
                    row_map.get("college") or 
                    row_map.get("university") or 
                    row_map.get("institution") or 
                    "University"
                )
                leader_phone = (
                    row_map.get("leader phone") or 
                    row_map.get("phone") or 
                    row_map.get("leader_phone") or 
                    ""
                )

                user_id = f"usr-ldr-{team_id}"

                # 1. Upsert User
                existing_user = db.query(UserDB).filter(UserDB.email == leader_email).first()
                if not existing_user:
                    user = UserDB(
                        id=user_id,
                        email=leader_email,
                        hashed_password=get_password_hash(leader_pass),
                        name=leader_name,
                        role="LEADER",
                        phone=leader_phone,
                        college=college
                    )
                    db.add(user)
                    db.flush()
                else:
                    user = existing_user
                    user.hashed_password = get_password_hash(leader_pass)
                    user.name = leader_name
                    user.college = college
                    if leader_phone:
                        user.phone = leader_phone
                    db.flush()
                    user_id = user.id

                # 2. Upsert Team
                existing_team = db.query(TeamDB).filter((TeamDB.id == team_id) | (TeamDB.leader_id == user_id) | (TeamDB.leader_email == leader_email)).first()
                if not existing_team:
                    team = TeamDB(
                        id=team_id,
                        name=team_name,
                        college=college,
                        leader_id=user_id,
                        leader_email=leader_email,
                        problem_statement_id=None,
                        status="REGISTERED",
                        current_round=1,
                        total_score=0.0
                    )
                    db.add(team)
                    db.flush()
                else:
                    team = existing_team
                    team.name = team_name
                    team.college = college
                    team.leader_email = leader_email
                    team.leader_id = user_id
                    db.flush()

                # 3. Clear existing members for this team to re-sync cleanly
                db.query(TeamMemberDB).filter(TeamMemberDB.team_id == team.id).delete()

                # Add leader member
                m1 = TeamMemberDB(
                    id=f"m-{team.id}-leader",
                    team_id=team.id,
                    name=leader_name,
                    email=leader_email,
                    college=college,
                    role_in_team="Team Leader",
                    is_leader=True
                )
                db.add(m1)

                # Support squad members from columns:
                # "team member 1", "team member 2", "team member 3"
                for m_idx in range(1, 6):
                    m_val = (
                        row_map.get(f"team member {m_idx}") or
                        row_map.get(f"team member_{m_idx}") or
                        row_map.get(f"teammember{m_idx}") or
                        row_map.get(f"member {m_idx} name") or 
                        row_map.get(f"member{m_idx}_name") or 
                        row_map.get(f"member {m_idx}")
                    )
                    if m_val and m_val.strip().lower() != leader_name.strip().lower():
                        # Do NOT generate or store dummy emails for other squad members
                        mem_db = TeamMemberDB(
                            id=f"m-{team.id}-{m_idx}",
                            team_id=team.id,
                            name=m_val.strip(),
                            email="", # No email for squad members per hackathon single-identity rules
                            college=college,
                            role_in_team=f"Member {m_idx}",
                            is_leader=False
                        )
                        db.add(mem_db)

            db.commit()
            print(f"Successfully processed {count} Team Leaders & Teams.")
    finally:
        db.close()

def import_evaluators(csv_path: str):
    print(f"Importing Evaluators from {csv_path}...")
    db = SessionLocal()
    try:
        with open(csv_path, mode="r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                row_map = {k.strip().lower(): (v or "").strip() for k, v in row.items() if k}
                eval_id = row_map.get("evaluator id") or row_map.get("evaluator_id") or row_map.get("id") or f"usr-eval-{count+1}"
                name = row_map.get("name") or row_map.get("evaluator name") or row_map.get("evaluator") or "Evaluator"
                email = (
                    row_map.get("evaluator") or
                    row_map.get("email") or 
                    row_map.get("evaluator email") or 
                    row_map.get("evaluator_email") or 
                    row_map.get("registered email") or ""
                ).lower()
                password = row_map.get("password") or row_map.get("pass") or ""
                college = row_map.get("college") or row_map.get("department") or row_map.get("institution") or "KARE"

                if not email or not password or "@" not in email:
                    continue

                existing = db.query(UserDB).filter(UserDB.email == email).first()
                if not existing:
                    user = UserDB(
                        id=eval_id,
                        email=email,
                        hashed_password=get_password_hash(password),
                        name=name,
                        role="EVALUATOR",
                        college=college
                    )
                    db.add(user)
                    count += 1
                else:
                    existing.hashed_password = get_password_hash(password)
                    existing.name = name
                    existing.role = "EVALUATOR"
                    existing.college = college
                    count += 1
            db.commit()
            print(f"Successfully processed {count} Evaluators.")
    finally:
        db.close()

def import_admins(csv_path: str):
    print(f"Importing Admins from {csv_path}...")
    db = SessionLocal()
    try:
        with open(csv_path, mode="r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                row_map = {k.strip().lower(): (v or "").strip() for k, v in row.items() if k}
                admin_id = row_map.get("admin id") or row_map.get("admin_id") or f"usr-admin-{count+1}"
                name = row_map.get("name") or row_map.get("admin name") or "Administrator"
                email = (
                    row_map.get("admin") or
                    row_map.get("email") or 
                    row_map.get("admin email") or 
                    row_map.get("admin_email") or 
                    row_map.get("registered email") or ""
                ).lower()
                password = row_map.get("password") or row_map.get("pass") or ""
                college = row_map.get("college") or row_map.get("organization") or "Directorate"

                if not email or not password or "@" not in email:
                    continue

                existing = db.query(UserDB).filter(UserDB.email == email).first()
                if not existing:
                    user = UserDB(
                        id=admin_id,
                        email=email,
                        hashed_password=get_password_hash(password),
                        name=name,
                        role="ADMIN",
                        college=college
                    )
                    db.add(user)
                    count += 1
                else:
                    existing.hashed_password = get_password_hash(password)
                    existing.name = name
                    existing.role = "ADMIN"
                    existing.college = college
                    count += 1
            db.commit()
            print(f"Successfully processed {count} Admins.")
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import CSV files into GFG Euphoria Database")
    parser.add_argument("--type", choices=["leaders", "evaluators", "admins"], required=True, help="Type of CSV to import")
    parser.add_argument("--file", required=True, help="Path to CSV file")
    args = parser.parse_args()

    Base.metadata.create_all(bind=engine)

    if args.type == "leaders":
        import_team_leaders(args.file)
    elif args.type == "evaluators":
        import_evaluators(args.file)
    elif args.type == "admins":
        import_admins(args.file)

