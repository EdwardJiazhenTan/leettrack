from app import db

class Question(db.Model):
    """Question model"""
    __tablename__ = 'questions'
    
    question_id = db.Column(db.Integer, primary_key=True)
    leetcode_id = db.Column(db.Integer, unique=True)
    title = db.Column(db.String(255), nullable=False)
    url = db.Column(db.String(255), nullable=False)
    difficulty = db.Column(db.String(20))  # Easy, Medium, Hard
    description = db.Column(db.Text)
    tags = db.Column(db.String(500))  # Comma-separated list of tags
    acceptance_rate = db.Column(db.Float)
    frequency = db.Column(db.Float)  # LeetCode frequency score
    last_updated = db.Column(db.DateTime(timezone=True))
    
    # Relationships
    user_questions = db.relationship('UserQuestion', back_populates='question', cascade='all, delete-orphan')
    path_questions = db.relationship('PathQuestion', back_populates='question', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f"<Question {self.title}>" 