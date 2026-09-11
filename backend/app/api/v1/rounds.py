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

@router.get("/announcements", response_model=List[Dict[str, Any]])
def get_announcements(db: Session = Depends(get_db)):
    ann = db.query(AnnouncementDB).all()
    return [
        {
            "id": a.id,
            "title": a.title,
            "content": a.content,
            "category": a.category,
            "timestamp": a.timestamp.isoformat(),
            "author": a.author
        } for a in ann
    ]
