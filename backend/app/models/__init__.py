# Import all models so Flask-Migrate can detect them
from .user import User
from .question import Question
from .user_question import UserQuestion
from .review_schedule import ReviewSchedule
from .scheduled_review import ScheduledReview
from .learning_path import LearningPath
from .path_question import PathQuestion 