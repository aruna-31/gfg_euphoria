from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.db import get_db
from app.models.db_models import EvaluationDB, EvaluatorAssignmentDB, TeamDB
from app.models.schemas import EvaluationSubmitRequest
import uuid

router = APIRouter()

@router.get("/assigned/{evaluator_id}", response_model=List[Dict[str, Any]])
def get_assigned_teams(evaluator_id: str, db: Session = Depends(get_db)):
    assignments = db.query(EvaluatorAssignmentDB).filter(EvaluatorAssignmentDB.evaluator_id == evaluator_id).all()
    results = []
    for asg in assignments:
        team = db.query(TeamDB).filter(TeamDB.id == asg.team_id).first()
        if team:
            results.append({
                "assignmentId": asg.id,
                "teamId": team.id,
                "teamName": team.name,
                "college": team.college,
                "problemStatementId": team.problem_statement_id,
                "photoUrl": team.photo_url,
                "roundId": asg.round_id,
                "status": asg.status
            })
    return results

@router.post("/submit")
def submit_evaluation(req: EvaluationSubmitRequest, db: Session = Depends(get_db)):
    eval_id = f"ev-{uuid.uuid4().hex[:8]}"
    
    evaluation = EvaluationDB(
        id=eval_id,
        team_id=req.team_id,
        evaluator_id="usr-eval-1", # default or from token
        round_id=req.round_id,
        scores=req.scores,
        total_score=req.total_score,
        feedback=req.feedback,
        strengths=req.strengths,
        improvements=req.improvements
    )
    db.add(evaluation)

    # Update Team Score
    team = db.query(TeamDB).filter(TeamDB.id == req.team_id).first()
    if team:
        team.total_score += req.total_score

    # Mark Assignment Completed
    asg = db.query(EvaluatorAssignmentDB).filter(
        EvaluatorAssignmentDB.team_id == req.team_id,
        EvaluatorAssignmentDB.round_id == req.round_id
    ).first()
    if asg:
        asg.status = "COMPLETED"

    db.commit()
    return {"message": "Evaluation submitted successfully", "evaluationId": eval_id}
