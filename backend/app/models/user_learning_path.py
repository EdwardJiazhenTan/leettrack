from app import db
from datetime import datetime

class UserLearningPath(db.Model):
    """User learning path model to track progress on learning paths"""
    __tablename__ = 'user_learning_paths'
    
    user_path_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    path_id = db.Column(db.Integer, db.ForeignKey('learning_paths.path_id'), nullable=False)
    started_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    completed_at = db.Column(db.DateTime(timezone=True))
    is_active = db.Column(db.Boolean, default=True)
    completion_percentage = db.Column(db.Float, default=0)
    
    # Relationships
    user = db.relationship('User', back_populates='learning_paths')
    path = db.relationship('LearningPath', back_populates='user_paths')
    question_progress = db.relationship('UserPathQuestion', back_populates='user_path', cascade='all, delete-orphan')
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'path_id', name='uq_user_path'),
    )
    
    def __repr__(self):
        return f"<UserLearningPath user_id={self.user_id} path_id={self.path_id}>"
    
    def calculate_completion_percentage(self):
        """Calculate the completion percentage based on completed questions"""
        if not self.question_progress:
            return 0.0
        
        total_questions = len(self.question_progress)
        if total_questions == 0:
            return 0.0
        
        completed_questions = sum(1 for q in self.question_progress if q.is_completed)
        percentage = (completed_questions / total_questions) * 100
        
        # Update the stored percentage
        self.completion_percentage = percentage
        
        return percentage 