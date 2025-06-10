from app import db
from datetime import datetime

class UserPathQuestion(db.Model):
    """User path question model to track progress on questions within a learning path"""
    __tablename__ = 'user_path_questions'
    
    user_path_question_id = db.Column(db.Integer, primary_key=True)
    user_path_id = db.Column(db.Integer, db.ForeignKey('user_learning_paths.user_path_id'), nullable=False)
    path_question_id = db.Column(db.Integer, db.ForeignKey('path_questions.path_question_id'), nullable=False)
    is_completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime(timezone=True))
    
    # Relationships
    user_path = db.relationship('UserLearningPath', back_populates='question_progress')
    path_question = db.relationship('PathQuestion', back_populates='user_path_questions')
    
    __table_args__ = (
        db.UniqueConstraint('user_path_id', 'path_question_id', name='uq_user_path_question'),
    )
    
    def __repr__(self):
        return f"<UserPathQuestion path_question_id={self.path_question_id} completed={self.is_completed}>"
    
    def mark_as_completed(self):
        """Mark the question as completed and update timestamp"""
        self.is_completed = True
        self.completed_at = datetime.utcnow()
        
        # Update the parent user_learning_path completion percentage
        if self.user_path:
            self.user_path.calculate_completion_percentage()
            
        return self 