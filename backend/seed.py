import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.db import engine, Base, SessionLocal
from app.models.db_models import UserDB, TeamDB, TeamMemberDB, ProblemStatementDB, RoundDB, AnnouncementDB, EvaluatorAssignmentDB
from app.core.security import get_password_hash

def seed_database():
    print("Initializing Database Tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 1. Seed Problem Statements from Problem Statement.csv
        from import_problems import import_problem_statements
        import_problem_statements()

        # 2. Seed Rounds if empty
        if db.query(RoundDB).count() == 0:
            print("Seeding Hackathon Rounds...")
            rounds = [
                RoundDB(
                    id=1,
                    name="Checkpoint 1",
                    title="Ideation, Architecture & Problem Validation",
                    description="Submit architectural blueprints, ERDs, component diagrams, and initial GitHub repository structure.",
                    status="COMPLETED",
                    start_time="Day 1 • 09:00 AM IST",
                    end_time="Day 1 • 02:00 PM IST",
                    max_score=100,
                    instructions=["Public GitHub repo link committed", "System architecture diagram uploaded", "10-slide slide deck submitted"],
                    criteria=[
                        {"id": "c1", "name": "Round 1 Evaluation Score", "maxScore": 100, "description": "Overall problem understanding, technical feasibility, and blueprint quality"}
                    ]
                ),
                RoundDB(
                    id=2,
                    name="Checkpoint 2",
                    title="Working Prototype & Core Integration",
                    description="Demonstrate functional end-to-end user journeys, live API integrations, database schema deployment, and working frontend-backend communication.",
                    status="ACTIVE",
                    start_time="Day 1 • 06:00 PM IST",
                    end_time="Day 1 • 11:30 PM IST",
                    max_score=100,
                    instructions=["Working live demo URL or local host execution", "REST API integration verified", "Database connectivity verified", "Verified team group photo uploaded"],
                    criteria=[
                        {"id": "c2", "name": "Round 2 Evaluation Score", "maxScore": 100, "description": "Overall functional prototype execution, engineering quality, and UI/UX"}
                    ]
                ),
                RoundDB(
                    id=3,
                    name="Final Grand Pitch",
                    title="Grand Finale Demo & Performance Stress Testing",
                    description="Top 10 finalists present live before the national executive jury panel on the main auditorium stage.",
                    status="UPCOMING",
                    start_time="Day 2 • 10:00 AM IST",
                    end_time="Day 2 • 04:00 PM IST",
                    max_score=100,
                    instructions=["5-minute live stage pitch", "3-minute live stress test execution", "Executive Q&A round"],
                    criteria=[
                        {"id": "c3", "name": "Grand Finale Score", "maxScore": 100, "description": "Overall product polish, scalability, impact, and stage presentation"}
                    ]
                )
            ]
            db.add_all(rounds)
            db.commit()

        # 3. Seed Users & Teams from CSVs if present
        base_dir = os.path.dirname(os.path.abspath(__file__))
        leaders_csv = os.path.join(base_dir, "teamleaders.csv")
        evaluators_csv = os.path.join(base_dir, "evaulator.csv")
        admins_csv = os.path.join(base_dir, "admin.csv")

        from import_csv import import_team_leaders, import_evaluators, import_admins

        if os.path.exists(leaders_csv):
            import_team_leaders(leaders_csv)
        if os.path.exists(evaluators_csv):
            import_evaluators(evaluators_csv)
        if os.path.exists(admins_csv):
            import_admins(admins_csv)

        # 4. Seed Announcements
        if db.query(AnnouncementDB).count() == 0:
            print("Seeding Announcements...")
            announcements = [
                AnnouncementDB(
                    id="ann-1",
                    title="Round 2 Jury Evaluation Protocol Active",
                    content="Evaluators are actively visiting team tables. Please ensure your prototype is running on localhost or staging and your verified group photo is uploaded.",
                    category="IMPORTANT",
                    author="Directorate Operations Desk"
                ),
                AnnouncementDB(
                    id="ann-2",
                    title="Problem Statement Locks Are Final",
                    content="As per national hackathon guidelines, once a Team Leader confirms their problem statement selection, it cannot be modified.",
                    category="RULES",
                    author="Technical Steering Committee"
                )
            ]
            db.add_all(announcements)
            db.commit()

        print("Successfully Seeded Database!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

