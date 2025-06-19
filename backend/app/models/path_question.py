from app import db


class PathQuestion(db.Model):
    """Path question model to link questions to learning paths"""

    __tablename__ = "path_questions"

    path_question_id = db.Column(db.Integer, primary_key=True)
    path_id = db.Column(
        db.Integer, db.ForeignKey("learning_paths.path_id"), nullable=False
    )
    question_id = db.Column(
        db.Integer, db.ForeignKey("questions.question_id"), nullable=False
    )
    sequence_number = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text)
    estimated_minutes = db.Column(db.Integer)
    importance = db.Column(db.Integer)  # 1-5 scale of importance

    # Relationships
    path = db.relationship("LearningPath", back_populates="questions")
    question = db.relationship("Question", back_populates="path_questions")
    user_path_questions = db.relationship(
        "UserPathQuestion", back_populates="path_question", cascade="all, delete-orphan"
    )

    __table_args__ = (
        db.UniqueConstraint("path_id", "question_id", name="uq_path_question"),
        db.UniqueConstraint("path_id", "sequence_number", name="uq_path_sequence"),
    )

    def __repr__(self):
        return f"<PathQuestion {self.path_id}:{self.question_id}>"
