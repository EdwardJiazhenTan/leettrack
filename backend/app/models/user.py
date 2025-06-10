from datetime import datetime
from app import db

class User(db.Model):
    """User model"""
    __tablename__ = 'users'
    
    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    leetcode_username = db.Column(db.String(50))
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    last_login = db.Column(db.DateTime(timezone=True))
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    user_questions = db.relationship('UserQuestion', back_populates='user', cascade='all, delete-orphan')
    review_schedules = db.relationship('ReviewSchedule', back_populates='user', cascade='all, delete-orphan')
    created_paths = db.relationship('LearningPath', back_populates='creator')
    learning_paths = db.relationship('UserLearningPath', back_populates='user', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f"<User {self.email}>" 