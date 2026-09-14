"""
Script to manually inspect and reset Hackathon Round statuses.
Usage:
    python reset_rounds.py                     # Resets to Round 1 ACTIVE, Round 2 & 3 UPCOMING
    python reset_rounds.py --round 1 --status ACTIVE
    python reset_rounds.py --round 2 --status COMPLETED
"""
import argparse
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.db import SessionLocal
from app.models.db_models import RoundDB, TeamDB

def manage_rounds(target_round: int = None, target_status: str = None):
    db = SessionLocal()
    try:
        if target_round and target_status:
            target_status = target_status.strip().upper()
            r = db.query(RoundDB).filter(RoundDB.id == target_round).first()
            if not r:
                print(f"[ERROR] Round {target_round} not found in database.")
                return
            r.status = target_status
            db.commit()
            print(f"[OK] Round {target_round} ('{r.name}') status updated to: {target_status}")
        else:
            # Full Reset
            print("[INFO] Resetting all rounds to initial state...")
            r1 = db.query(RoundDB).filter(RoundDB.id == 1).first()
            if r1:
                r1.status = "ACTIVE"
            r2 = db.query(RoundDB).filter(RoundDB.id == 2).first()
            if r2:
                r2.status = "UPCOMING"
            r3 = db.query(RoundDB).filter(RoundDB.id == 3).first()
            if r3:
                r3.status = "UPCOMING"
            
            db.commit()
            print("[OK] Successfully reset all rounds!")

        # Print current statuses
        print("\n=== Current Round Statuses ===")
        all_rounds = db.query(RoundDB).order_by(RoundDB.id).all()
        for r in all_rounds:
            print(f" - Round {r.id} ({r.name}): [{r.status}] {r.title}")

    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Manage / Reset Hackathon Round Statuses")
    parser.add_argument("--round", type=int, default=None, help="Round ID (1, 2, or 3)")
    parser.add_argument("--status", type=str, default=None, choices=["UPCOMING", "ACTIVE", "COMPLETED", "upcoming", "active", "completed"], help="Target status")
    args = parser.parse_args()

    manage_rounds(args.round, args.status)
