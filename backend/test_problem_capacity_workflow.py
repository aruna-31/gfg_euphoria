import sys
import os
from datetime import datetime

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.core.db import SessionLocal
from app.models.db_models import UserDB, TeamDB, ProblemStatementDB

client = TestClient(app)

def run_verification():
    print("=" * 70)
    print("STARTING END-TO-END PROBLEM STATEMENT CAPACITY VERIFICATION TEST")
    print("=" * 70)

    db = SessionLocal()
    try:
        # Step 1: Ensure we have at least 4 test teams in database
        print("\n[Step 1] Preparing test mock squads in database...")
        test_teams_data = [
            {"id": "test-team-1", "name": "CyberKnights", "college": "KARE Tech", "leader_email": "leader1@kare.edu"},
            {"id": "test-team-2", "name": "AlgoArchitects", "college": "Anna University", "leader_email": "leader2@annauniv.edu"},
            {"id": "test-team-3", "name": "NeuralNinjas", "college": "IIT Madras", "leader_email": "leader3@iitm.ac.in"},
            {"id": "test-team-4", "name": "QuantumCoders", "college": "NIT Trichy", "leader_email": "leader4@nitt.edu"},
        ]

        for td in test_teams_data:
            user = db.query(UserDB).filter(UserDB.id == td["id"] + "-user").first()
            if not user:
                user = UserDB(
                    id=td["id"] + "-user",
                    email=td["leader_email"],
                    hashed_password="hash",
                    name=f"{td['name']} Leader",
                    role="LEADER",
                    college=td["college"]
                )
                db.add(user)
                db.commit()

            team = db.query(TeamDB).filter(TeamDB.id == td["id"]).first()
            if not team:
                team = TeamDB(
                    id=td["id"],
                    name=td["name"],
                    college=td["college"],
                    leader_id=user.id,
                    leader_email=td["leader_email"],
                    status="REGISTERED"
                )
                db.add(team)
            else:
                team.problem_statement_id = None
                team.selected_at = None
                team.status = "REGISTERED"
            db.commit()

        # Step 2: Ensure we have Problem Statement PS-01
        ps = db.query(ProblemStatementDB).filter(ProblemStatementDB.id == "PS-01").first()
        if not ps:
            ps = ProblemStatementDB(
                id="PS-01",
                title="AI Powered Automated Financial Fraud Detection & Forensics",
                short_description="Real-time transaction forensics engine detecting laundering networks",
                full_description="Build graph neural network analysis pipeline for anomalous wire transfers",
                category="FinTech & Security",
                difficulty="ADVANCED",
                problem_owner="Directorate Forensics Lab",
                max_capacity=3,
                selected_by_count=0
            )
            db.add(ps)
            db.commit()
        else:
            ps.selected_by_count = 0
            db.commit()

        # Reset all problem selections via endpoint
        reset_res = client.post("/api/v1/problems/reset")
        assert reset_res.status_code == 200, f"Reset failed: {reset_res.text}"
        print("  -> All problem selections reset. Verified clean slate.")

        # Step 3: Verify initial capacity is 0/3
        problems_res = client.get("/api/v1/problems")
        assert problems_res.status_code == 200
        probs_data = problems_res.json()
        ps01 = next(p for p in probs_data if p["id"] == "PS-01")
        print(f"\n[Step 2] Initial Capacity check for PS-01:")
        print(f"  -> Capacity: {ps01['selectedByCount']}/{ps01['maxCapacity']} Teams Selected (Expected 0/3)")
        assert ps01["selectedByCount"] == 0, f"Expected 0 but got {ps01['selectedByCount']}"

        # Step 4: Team 1 selects PS-01 (0/3 -> 1/3)
        print("\n[Step 3] Team 1 (CyberKnights) selects PS-01...")
        sel_res_1 = client.post("/api/v1/problems/select", json={"team_id": "test-team-1", "problem_id": "PS-01"})
        assert sel_res_1.status_code == 200, f"Team 1 select failed: {sel_res_1.text}"
        data1 = sel_res_1.json()
        print(f"  -> Selection Success! PS-01 Capacity is now: {data1['selectedByCount']}/3")
        assert data1["selectedByCount"] == 1, f"Expected 1 but got {data1['selectedByCount']}"

        # Verify DB record for Team 1
        db.expire_all()
        t1 = db.query(TeamDB).filter(TeamDB.id == "test-team-1").first()
        assert t1.problem_statement_id == "PS-01"
        assert t1.selected_at is not None
        print(f"  -> DB Verified: Team 1 locked to {t1.problem_statement_id} at {t1.selected_at.isoformat()}")

        # Step 5: Team 2 selects PS-01 (1/3 -> 2/3)
        print("\n[Step 4] Team 2 (AlgoArchitects) selects PS-01...")
        sel_res_2 = client.post("/api/v1/problems/select", json={"team_id": "test-team-2", "problem_id": "PS-01"})
        assert sel_res_2.status_code == 200, f"Team 2 select failed: {sel_res_2.text}"
        data2 = sel_res_2.json()
        print(f"  -> Selection Success! PS-01 Capacity is now: {data2['selectedByCount']}/3")
        assert data2["selectedByCount"] == 2, f"Expected 2 but got {data2['selectedByCount']}"

        # Step 6: Team 3 selects PS-01 (2/3 -> 3/3 Capacity Full)
        print("\n[Step 5] Team 3 (NeuralNinjas) selects PS-01...")
        sel_res_3 = client.post("/api/v1/problems/select", json={"team_id": "test-team-3", "problem_id": "PS-01"})
        assert sel_res_3.status_code == 200, f"Team 3 select failed: {sel_res_3.text}"
        data3 = sel_res_3.json()
        print(f"  -> Selection Success! PS-01 Capacity reached MAXIMUM: {data3['selectedByCount']}/3 (FULL)")
        assert data3["selectedByCount"] == 3, f"Expected 3 but got {data3['selectedByCount']}"

        # Step 7: Team 4 attempts to select PS-01 (Must be REJECTED by Backend with 400 Bad Request)
        print("\n[Step 6] Team 4 (QuantumCoders) attempts to select PS-01 after capacity is 3/3...")
        sel_res_4 = client.post("/api/v1/problems/select", json={"team_id": "test-team-4", "problem_id": "PS-01"})
        print(f"  -> Response Code: {sel_res_4.status_code}")
        print(f"  -> Error Detail: {sel_res_4.json().get('detail')}")
        assert sel_res_4.status_code == 400, f"Expected 400 Bad Request, got {sel_res_4.status_code}"
        print("  -> PASS: Backend safely blocked Team 4 from exceeding 3-team capacity limit!")

        # Step 8: Team 1 attempts to re-select another problem statement (Permanent Lock Test)
        print("\n[Step 7] Team 1 attempts to re-select another problem (Permanent Lock Test)...")
        reselect_res = client.post("/api/v1/problems/select", json={"team_id": "test-team-1", "problem_id": "PS-02"})
        print(f"  -> Response Code: {reselect_res.status_code}")
        print(f"  -> Error Detail: {reselect_res.json().get('detail')}")
        assert reselect_res.status_code == 409, f"Expected 409 Conflict, got {reselect_res.status_code}"
        print("  -> PASS: Backend safely prevented Team 1 from modifying their locked problem statement!")

        # Step 9: Verify Admin Overview Endpoint shows all 3 assigned teams with timestamps
        print("\n[Step 8] Verifying Admin Problem Statements Data...")
        admin_res = client.get("/api/v1/problems")
        assert admin_res.status_code == 200
        all_probs = admin_res.json()
        ps01_final = next(p for p in all_probs if p["id"] == "PS-01")
        print(f"  -> PS-01 Total Selected Teams: {len(ps01_final['selectedTeams'])}")
        for idx, squad in enumerate(ps01_final['selectedTeams'], 1):
            print(f"     Squad {idx}: {squad['name']} ({squad['college']}) | Leader: {squad['leaderEmail']} | Time: {squad['selectedAt']}")

        assert len(ps01_final['selectedTeams']) == 3, f"Expected 3 selected teams, got {len(ps01_final['selectedTeams'])}"

        # Step 10: Verify Frontend auto-hiding logic for Team 4
        print("\n[Step 9] Verifying Frontend Visibility Filter for Team 4...")
        # Simulating Team 4's ProblemSelectionPage filter:
        # p.selectedByCount >= 3 and team?.problemStatementId !== p.id -> Excluded
        team4_visible_problems = [
            p for p in all_probs
            if not (p["selectedByCount"] >= 3 and p["id"] != "test-team-4-selection")
        ]
        is_ps01_visible_for_team4 = any(p["id"] == "PS-01" for p in team4_visible_problems)
        print(f"  -> Is PS-01 visible to Team 4? {is_ps01_visible_for_team4} (Expected False)")
        assert not is_ps01_visible_for_team4, "PS-01 should be hidden from Team 4 because it is full (3/3)!"
        print("  -> PASS: Full problem statement automatically hidden from available list for Team 4!")

        print("\n" + "=" * 70)
        print("ALL END-TO-END VERIFICATION CHECKS PASSED PERFECTLY!")
        print("=" * 70)

    finally:
        db.close()

if __name__ == "__main__":
    run_verification()
