from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth schemas
class LeaderRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    college: str
    team_name: str
    member2_name: Optional[str] = None
    member2_email: Optional[str] = None
    member2_role: Optional[str] = None
    member3_name: Optional[str] = None
    member3_email: Optional[str] = None
    member3_role: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

# Team Member schema
class TeamMemberSchema(BaseModel):
    id: str
    name: str
    email: str
    college: str
    teamId: str
    isLeader: bool
    roleInTeam: str

    class Config:
        from_attributes = True

# Team Schema
class TeamSchema(BaseModel):
    id: str
    name: str
    college: str
    leaderName: str
    leaderEmail: str
    leaderPhone: Optional[str] = None
    members: List[TeamMemberSchema] = []
    problemStatementId: Optional[str] = None
    photoUrl: Optional[str] = None
    currentRound: int = 1
    totalScore: float = 0.0
    status: str = "REGISTERED"
    selectedAt: Optional[str] = None
    rank: int = 1

    class Config:
        from_attributes = True

# Problem Statement Schema
class ProblemStatementSchema(BaseModel):
    id: str
    title: str
    shortDescription: str
    fullDescription: str
    category: str
    difficulty: str
    problemOwner: str
    maxCapacity: int = 3
    selectedByCount: int = 0
    selectedTeams: List[Dict[str, Any]] = []
    deliverables: List[str] = []
    evaluationFocus: List[str] = []

    class Config:
        from_attributes = True

# Select Problem Request
class ProblemSelectRequest(BaseModel):
    team_id: str
    problem_id: str

# Evaluation Submit Request
class EvaluationSubmitRequest(BaseModel):
    team_id: str
    round_id: int
    scores: Dict[str, float]
    total_score: float
    feedback: Optional[str] = ""
    strengths: Optional[str] = ""
    improvements: Optional[str] = ""

class CredentialCsvImportRequest(BaseModel):
    account_type: str
    csv_content: str
