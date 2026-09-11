import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.core.db import SessionLocal
from app.models.db_models import TeamDB, ProblemStatementDB, UserDB

client = TestClient(app)

def test_all_teams():
    leaders_credentials = [
        ("arunalavanuru1@gmail.com", "Aruna@2006", "Aruna"),
        ("akshithavalluru@gmail.com", "Akshitha@20", "Ram"),
        ("haritha@gmail.com", "Haritha@212", "Vishnu"),
        ("vikas31@gmail.com", "vikas@22", "Harshini"),
    ]

    print("==================================================")
    print(" 1. TESTING LOGIN & PROFILE FOR ALL 4 TEAMS")
    print("==================================================")
    team_ids = []
    for email, password, expected_name in leaders_credentials:
        resp = client.post("/api/v1/auth/login-leader", json={
            "email": email,
            "password": password
        })
        assert resp.status_code == 200, f"Login failed for {email}: {resp.text}"
        data = resp.json()
        user = data["user"]
        team_id = user["teamId"]
        team_ids.append(team_id)
        print(f"\n[OK] Logged in: {user['name']} ({email}) -> Team ID: {team_id}")

        # Fetch Team Profile
        t_resp = client.get(f"/api/v1/teams/{team_id}")
        assert t_resp.status_code == 200, f"Failed to get team {team_id}"
        t_data = t_resp.json()
        print(f"     Team Name: {t_data['name']} | University: {t_data['college']}")
        print(f"     Team Members ({len(t_data['members'])} total):")
        for m in t_data['members']:
            role_badge = "[LEADER]" if m['isLeader'] else "[MEMBER]"
            print(f"      - {role_badge} {m['name']} ({m['college']}) | Role: {m['roleInTeam']}")

    print("\n==================================================")
    print(" 2. TESTING 3-TEAM LOCK WITH 4 TEAMS ON PS-001")
    print("==================================================")
    # Reset all 4 teams and PS-001 count
    db = SessionLocal()
    for tid in team_ids:
        t = db.query(TeamDB).filter(TeamDB.id == tid).first()
        if t:
            t.problem_statement_id = None
    p1 = db.query(ProblemStatementDB).filter(ProblemStatementDB.id == "PS-001").first()
    p1.selected_by_count = 0
    db.commit()
    db.close()

    # Team 1 selects PS-001
    r1 = client.post("/api/v1/problems/select", json={"team_id": team_ids[0], "problem_id": "PS-001"})
    assert r1.status_code == 200, r1.text
    print(f"Team 1 ({team_ids[0]}) selected PS-001 -> Slots used: 1/3")

    # Team 2 selects PS-001
    r2 = client.post("/api/v1/problems/select", json={"team_id": team_ids[1], "problem_id": "PS-001"})
    assert r2.status_code == 200, r2.text
    print(f"Team 2 ({team_ids[1]}) selected PS-001 -> Slots used: 2/3")

    # Team 3 selects PS-001 (Fills the problem to max 3)
    r3 = client.post("/api/v1/problems/select", json={"team_id": team_ids[2], "problem_id": "PS-001"})
    assert r3.status_code == 200, r3.text
    print(f"Team 3 ({team_ids[2]}) selected PS-001 -> Slots used: 3/3 (LOCKED)")

    # Team 4 tries to select PS-001 -> MUST BE REJECTED with 400
    r4 = client.post("/api/v1/problems/select", json={"team_id": team_ids[3], "problem_id": "PS-001"})
    print(f"Team 4 ({team_ids[3]}) attempted selection on PS-001 -> Status: {r4.status_code}")
    assert r4.status_code == 400, "Team 4 should have been blocked!"
    print(f"Rejection Message: {r4.json()['detail']}")

    # Team 4 selects PS-002 instead -> MUST SUCCEED
    r4_alt = client.post("/api/v1/problems/select", json={"team_id": team_ids[3], "problem_id": "PS-002"})
    assert r4_alt.status_code == 200
    print(f"Team 4 ({team_ids[3]}) selected alternative PS-002 -> Slots used: 1/3")

    # Reset selections after test
    db = SessionLocal()
    for tid in team_ids:
        t = db.query(TeamDB).filter(TeamDB.id == tid).first()
        if t:
            t.problem_statement_id = None
    p1 = db.query(ProblemStatementDB).filter(ProblemStatementDB.id == "PS-001").first()
    p1.selected_by_count = 0
    p2 = db.query(ProblemStatementDB).filter(ProblemStatementDB.id == "PS-002").first()
    p2.selected_by_count = 0
    db.commit()
    db.close()

    print("\n ALL 4 TEAMS, PROFILE DATA, AND 3-TEAM LOCKING PASSED 100%! ")

if __name__ == "__main__":
    test_all_teams()
