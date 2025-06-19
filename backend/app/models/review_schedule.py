from datetime import date
from app import db


class ReviewSchedule(db.Model):
    """Review schedule model"""

    __tablename__ = "review_schedule"

    schedule_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False
    )
    review_date = db.Column(db.Date, nullable=False, default=date.today)
    is_completed = db.Column(db.Boolean, default=False)

    # Relationships
    user = db.relationship("User", back_populates="review_schedules")
    scheduled_reviews = db.relationship(
        "ScheduledReview", back_populates="schedule", cascade="all, delete-orphan"
    )

    __table_args__ = (
        db.UniqueConstraint("user_id", "review_date", name="user_date_unique"),
    )

    def __repr__(self):
        return f"<ReviewSchedule {self.user_id}:{self.review_date}>"
