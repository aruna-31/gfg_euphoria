import csv
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.db import engine, Base, SessionLocal
from app.models.db_models import ProblemStatementDB

def import_problem_statements(csv_file_path: str = None):
    if not csv_file_path:
        csv_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Problem Statement.csv")

    if not os.path.exists(csv_file_path):
        print(f"File not found: {csv_file_path}")
        return

    print(f"Importing Problem Statements from {csv_file_path}...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        with open(csv_file_path, mode="r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            count = 1
            for row in reader:
                title = row.get("title", "").strip()
                desc = row.get("description", "").strip()
                reqs = row.get("requirements", "").strip()
                expectations = row.get("expectations", "").strip()

                if not title:
                    continue

                prob_id = f"PS-{count:03d}"

                # Parse requirements & expectations into lists
                req_list = [r.strip() for r in reqs.split("\n") if r.strip()]
                exp_list = [e.strip() for e in expectations.split("\n") if e.strip()]

                # Categorize based on title
                category = "Autonomous Systems & AI"
                if "Schedule" in title or "Manufacturing" in desc:
                    category = "Industry 4.0 & Smart Manufacturing"
                elif "Release" in title or "Software" in title:
                    category = "DevOps & Software Engineering"
                elif "Supply" in title or "Inventory" in title or "Dispatch" in title:
                    category = "Supply Chain & Logistics"
                elif "Healthcare" in title or "Patient" in title or "ICU" in title:
                    category = "Healthcare & BioTech"
                elif "Fraud" in title or "Payment" in title or "Financial" in title:
                    category = "FinTech & Security"

                existing = db.query(ProblemStatementDB).filter(ProblemStatementDB.id == prob_id).first()
                if not existing:
                    new_prob = ProblemStatementDB(
                        id=prob_id,
                        title=title,
                        short_description=desc[:220] + "..." if len(desc) > 220 else desc,
                        full_description=desc,
                        category=category,
                        difficulty="ADVANCED",
                        problem_owner="GeeksforGeeks • KARE National Hackathon Panel",
                        max_capacity=10,
                        selected_by_count=0,
                        deliverables=req_list,
                        evaluation_focus=exp_list
                    )
                    db.add(new_prob)
                
                count += 1

            db.commit()
            print(f"Successfully loaded {count-1} Problem Statements from CSV into database!")
    finally:
        db.close()

if __name__ == "__main__":
    import_problem_statements()
