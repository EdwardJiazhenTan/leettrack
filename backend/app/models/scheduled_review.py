from datetime import datetime
from app import db

class ScheduledReview(db.Model):
    """Scheduled review model"""
    __tablename__ = 'scheduled_reviews'
    
    scheduled_review_id = db.Column(db.Integer, primary_key=True)
    schedule_id = db.Column(db.Integer, db.ForeignKey('review_schedule.schedule_id', ondelete='CASCADE'), nullable=False)
    user_question_id = db.Column(db.Integer, db.ForeignKey('user_questions.user_question_id', ondelete='CASCADE'), nullable=False)
    is_reviewed = db.Column(db.Boolean, default=False)
    reviewed_at = db.Column(db.DateTime(timezone=True))
    new_rating = db.Column(db.Integer)  # Rating from 1-5
    
    # Relationships
    schedule = db.relationship('ReviewSchedule', back_populates='scheduled_reviews')
    user_question = db.relationship('UserQuestion', back_populates='scheduled_reviews')
    
    __table_args__ = (
        db.UniqueConstraint('schedule_id', 'user_question_id', name='schedule_question_unique'),
    )
    
    def __repr__(self):
        return f"<ScheduledReview {self.schedule_id}:{self.user_question_id}>" 