"""
Script to reset all problem statement selections for all teams or a specific team.
Run from backend directory:
    python reset_problem_selections.py
Or for a specific team:
    python reset_problem_selections.py --team TEAM-001
"""
import argparse
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.db import SessionLocal
from app.models.db_models import TeamDB, ProblemStatementDB

def reset_selections(target_team_id: str = None):
    db = SessionLocal()
    try:
        if target_team_id:
            team = db.query(TeamDB).filter(
                (TeamDB.id == target_team_id) | 
                (TeamDB.leader_email == target_team_id.lower())
            ).first()
            if not team:
                print(f"❌ Team {target_team_id} not found.")
                return
            
            old_problem_id = team.problem_statement_id
            team.problem_statement_id = None
            team.status = "REGISTERED"
            
            if old_problem_id:
                prob = db.query(ProblemStatementDB).filter(ProblemStatementDB.id == old_problem_id).first()
                if prob and prob.selected_by_count > 0:
                    prob.selected_by_count -= 1

            db.commit()
            print(f"✅ Reset problem statement selection for team: {team.name} ({team.id})")
        else:
            # Reset all teams
            teams = db.query(TeamDB).all()
            for t in teams:
                t.problem_statement_id = None
                if t.status == "PROBLEM_SELECTED":
                    t.status = "REGISTERED"

            # Reset counts on all problem statements
            probs = db.query(ProblemStatementDB).all()
            for p in probs:
                p.selected_by_count = 0

            db.commit()
            print(f"✅ Successfully reset problem selections for all {len(teams)} teams.")
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Reset Problem Statement Selections")
    parser.add_argument("--team", type=str, default=None, help="Optional Team ID or Leader Email to reset only one team")
    args = parser.parse_args()

    reset_selections(args.team)
