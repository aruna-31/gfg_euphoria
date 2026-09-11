from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.db import get_db
from app.models.db_models import TeamDB, TeamMemberDB, UserDB
from app.models.schemas import TeamSchema, TeamMemberSchema

router = APIRouter()

def build_team_schema(t: TeamDB) -> TeamSchema:
    return TeamSchema(
        id=t.id,
        name=t.name,
        college=t.college,
        leaderName=t.leader.name if t.leader else "Leader",
        leaderEmail=t.leader_email,
        leaderPhone=t.leader.phone if t.leader else None,
        members=[
            TeamMemberSchema(
                id=m.id,
                name=m.name,
                email=m.email,
                college=m.college,
                teamId=m.team_id,
                isLeader=m.is_leader,
                roleInTeam=m.role_in_team
            ) for m in t.members
        ],
        problemStatementId=t.problem_statement_id,
        photoUrl=t.photo_url,
        currentRound=t.current_round,
        totalScore=t.total_score,
        status=t.status,
        rank=t.rank
    )

@router.get("", response_model=List[TeamSchema])
def get_all_teams(db: Session = Depends(get_db)):
    teams = db.query(TeamDB).all()
    return [build_team_schema(t) for t in teams]

@router.get("/{team_id}", response_model=TeamSchema)
def get_team_by_id(team_id: str, db: Session = Depends(get_db)):
    clean_id = team_id.strip()
    team = db.query(TeamDB).filter(
        (TeamDB.id == clean_id) | 
        (TeamDB.leader_id == clean_id) | 
        (TeamDB.leader_email == clean_id.lower())
    ).first()
    
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Team {team_id} not found")
    return build_team_schema(team)

@router.put("/{team_id}/photo", response_model=TeamSchema)
def update_team_photo(team_id: str, photo_url: str = Body(..., embed=True), db: Session = Depends(get_db)):
    clean_id = team_id.strip()
    team = db.query(TeamDB).filter(
        (TeamDB.id == clean_id) | 
        (TeamDB.leader_id == clean_id) | 
        (TeamDB.leader_email == clean_id.lower())
    ).first()
    
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Team {team_id} not found")

    team.photo_url = photo_url
    if team.problem_statement_id:
        team.status = "ROUND_1_EVAL"

    db.commit()
    db.refresh(team)
    return build_team_schema(team)
