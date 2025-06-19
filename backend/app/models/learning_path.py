from datetime import datetime
from app import db


class LearningPath(db.Model):
    """Learning path model"""

    __tablename__ = "learning_paths"

    path_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    source = db.Column(db.String(50))  # 'AI', 'User', 'System'
    creator_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    is_public = db.Column(db.Boolean, default=True)
    difficulty_level = db.Column(
        db.String(20)
    )  # 'Beginner', 'Intermediate', 'Advanced'
    estimated_hours = db.Column(db.Integer)
    tags = db.Column(db.String(500))  # Comma-separated list of tags
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )
    is_active = db.Column(db.Boolean, default=True)

    # Relationships
    questions = db.relationship(
        "PathQuestion", back_populates="path", cascade="all, delete-orphan"
    )
    creator = db.relationship("User", back_populates="created_paths")
    user_paths = db.relationship(
        "UserLearningPath", back_populates="path", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<LearningPath {self.name}>"
