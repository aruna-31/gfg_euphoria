from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Text, JSON, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.db import Base

class UserDB(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False) # LEADER, EVALUATOR, ADMIN
    phone = Column(String, nullable=True)
    college = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    team = relationship("TeamDB", back_populates="leader", uselist=False)

class TeamDB(Base):
    __tablename__ = "teams"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    college = Column(String, nullable=False)
    leader_id = Column(String, ForeignKey("users.id"), nullable=False)
    leader_email = Column(String, nullable=False)
    problem_statement_id = Column(String, ForeignKey("problem_statements.id"), nullable=True)
    photo_url = Column(String, nullable=True)
    status = Column(String, default="REGISTERED") # REGISTERED, PROBLEM_SELECTED, ROUND_1_EVAL, ROUND_2_EVAL, FINALIST
    current_round = Column(Integer, default=1)
    total_score = Column(Float, default=0.0)
    rank = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    leader = relationship("UserDB", back_populates="team")
    members = relationship("TeamMemberDB", back_populates="team", cascade="all, delete-orphan")
    problem = relationship("ProblemStatementDB", back_populates="teams")

class TeamMemberDB(Base):
    __tablename__ = "team_members"

    id = Column(String, primary_key=True, index=True)
    team_id = Column(String, ForeignKey("teams.id"), nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    college = Column(String, nullable=False)
    role_in_team = Column(String, nullable=False)
    is_leader = Column(Boolean, default=False)

    team = relationship("TeamDB", back_populates="members")

class ProblemStatementDB(Base):
    __tablename__ = "problem_statements"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    short_description = Column(Text, nullable=False)
    full_description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    problem_owner = Column(String, nullable=False)
    max_capacity = Column(Integer, default=3)
    selected_by_count = Column(Integer, default=0)
    deliverables = Column(JSON, default=list)
    evaluation_focus = Column(JSON, default=list)

    teams = relationship("TeamDB", back_populates="problem")

class RoundDB(Base):
    __tablename__ = "rounds"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, default="ACTIVE") # UPCOMING, ACTIVE, COMPLETED
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    max_score = Column(Integer, default=100)
    instructions = Column(JSON, default=list)
    criteria = Column(JSON, default=list)

class EvaluationDB(Base):
    __tablename__ = "evaluations"

    id = Column(String, primary_key=True, index=True)
    team_id = Column(String, ForeignKey("teams.id"), nullable=False)
    evaluator_id = Column(String, ForeignKey("users.id"), nullable=False)
    round_id = Column(Integer, nullable=False)
    scores = Column(JSON, nullable=False)
    total_score = Column(Float, nullable=False)
    feedback = Column(Text, nullable=True)
    strengths = Column(Text, nullable=True)
    improvements = Column(Text, nullable=True)
    evaluated_at = Column(DateTime, default=datetime.utcnow)

class EvaluatorAssignmentDB(Base):
    __tablename__ = "evaluator_assignments"

    id = Column(String, primary_key=True, index=True)
    evaluator_id = Column(String, ForeignKey("users.id"), nullable=False)
    team_id = Column(String, ForeignKey("teams.id"), nullable=False)
    round_id = Column(Integer, nullable=False)
    status = Column(String, default="PENDING") # PENDING, COMPLETED

class AnnouncementDB(Base):
    __tablename__ = "announcements"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String, default="INFO")
    timestamp = Column(DateTime, default=datetime.utcnow)
    author = Column(String, default="Hackathon Directorate")
