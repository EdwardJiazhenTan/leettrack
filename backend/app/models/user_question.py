from datetime import datetime, timedelta
from app import db

class UserQuestion(db.Model):
    """User-Question relationship model"""
    __tablename__ = 'user_questions'
    
    user_question_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.question_id', ondelete='CASCADE'), nullable=False)
    review_rating = db.Column(db.Integer)  # Rating from 1-5 (legacy)
    review_confidence = db.Column(db.String(20))  # 'mastered', 'confident', 'understood', 'struggled', 'confused'
    solved_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    last_reviewed = db.Column(db.DateTime(timezone=True))
    next_review = db.Column(db.DateTime(timezone=True))
    times_reviewed = db.Column(db.Integer, default=0)
    review_notes = db.Column(db.Text)
    needs_rating = db.Column(db.Boolean, default=True)  # Whether user needs to rate this question
    
    # Relationships
    user = db.relationship('User', back_populates='user_questions')
    question = db.relationship('Question', back_populates='user_questions')
    scheduled_reviews = db.relationship('ScheduledReview', back_populates='user_question', cascade='all, delete-orphan')
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'question_id', name='user_question_unique'),
    )
    
    # Review confidence levels with corresponding intervals
    CONFIDENCE_INTERVALS = {
        'mastered': [],  # No more reviews needed
        'confident': [7, 21, 60],  # 7 days, 3 weeks, 2 months
        'understood': [3, 7, 21],  # 3 days, 1 week, 3 weeks
        'struggled': [1, 3, 7, 14, 30],  # Daily reinforcement then spaced
        'confused': [1, 3, 7, 14, 30]  # Daily reinforcement then spaced
    }
    
    def set_review_confidence(self, confidence):
        """Set the user's confidence level and schedule next review"""
        if confidence not in self.CONFIDENCE_INTERVALS:
            raise ValueError(f"Invalid confidence level: {confidence}")
        
        self.review_confidence = confidence
        self.needs_rating = False
        self.last_reviewed = datetime.utcnow()
        
        # Schedule next review based on confidence and review count
        if confidence == 'mastered':
            self.next_review = None  # No more reviews needed
        else:
            intervals = self.CONFIDENCE_INTERVALS[confidence]
            if self.times_reviewed < len(intervals):
                days_to_add = intervals[self.times_reviewed]
                self.next_review = datetime.utcnow() + timedelta(days=days_to_add)
            else:
                # Use the last interval for subsequent reviews
                days_to_add = intervals[-1]
                self.next_review = datetime.utcnow() + timedelta(days=days_to_add)
        
        self.times_reviewed += 1
    
    def is_due_for_review(self):
        """Check if this question is due for review today"""
        if not self.next_review:
            return False
        return self.next_review.date() <= datetime.utcnow().date()
    
    def mark_as_completed(self):
        """Mark the question as completed for the first time"""
        self.solved_at = datetime.utcnow()
        self.needs_rating = True
    
    def __repr__(self):
        return f"<UserQuestion {self.user_id}:{self.question_id}>" 