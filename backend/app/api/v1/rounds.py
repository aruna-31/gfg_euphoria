from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.db import get_db
from app.models.db_models import RoundDB, AnnouncementDB

router = APIRouter()

@router.get("", response_model=List[Dict[str, Any]])
def get_all_rounds(db: Session = Depends(get_db)):
    rounds = db.query(RoundDB).order_by(RoundDB.id).all()
    return [
        {
            "id": r.id,
            "number": r.id,
            "name": r.name,
            "title": r.title,
            "description": r.description,
            "status": r.status,
            "startTime": r.start_time,
            "endTime": r.end_time,
            "maxScore": r.max_score,
            "instructions": r.instructions or [],
            "criteria": r.criteria or []
        } for r in rounds
    ]

@router.put("/{round_id}/status")
def update_round_status(round_id: int, status_update: Dict[str, str], db: Session = Depends(get_db)):
    status_val = status_update.get("status", "").upper()
    if status_val not in {"UPCOMING", "ACTIVE", "COMPLETED"}:
        return {"error": "Status must be UPCOMING, ACTIVE, or COMPLETED"}
    
    round_obj = db.query(RoundDB).filter(RoundDB.id == round_id).first()
    if not round_obj:
        return {"error": f"Round {round_id} not found"}
    
    round_obj.status = status_val
    db.commit()
    return {"status": "success", "round_id": round_id, "new_status": status_val}

@router.post("/reset")
def reset_rounds_status(db: Session = Depends(get_db)):
    """
    Resets rounds to standard initial state:
    Round 1 -> ACTIVE
    Round 2 -> UPCOMING
    Round 3 -> UPCOMING
    """
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
    return {"status": "success", "message": "All rounds have been reset: Round 1 (ACTIVE), Round 2 (UPCOMING), Round 3 (UPCOMING)."}

