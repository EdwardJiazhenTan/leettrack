from datetime import datetime
from app import db

class UserQuestion(db.Model):
    """User-Question relationship model"""
    __tablename__ = 'user_questions'
    
    user_question_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.question_id', ondelete='CASCADE'), nullable=False)
    review_rating = db.Column(db.Integer)  # Rating from 1-5
    solved_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    last_reviewed = db.Column(db.DateTime(timezone=True))
    next_review = db.Column(db.DateTime(timezone=True))
    times_reviewed = db.Column(db.Integer, default=0)
    review_notes = db.Column(db.Text)
    
    # Relationships
    user = db.relationship('User', back_populates='user_questions')
    question = db.relationship('Question', back_populates='user_questions')
    scheduled_reviews = db.relationship('ScheduledReview', back_populates='user_question', cascade='all, delete-orphan')
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'question_id', name='user_question_unique'),
    )
    
    def __repr__(self):
        return f"<UserQuestion {self.user_id}:{self.question_id}>" 