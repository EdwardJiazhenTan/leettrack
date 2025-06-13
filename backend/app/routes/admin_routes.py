from flask import Blueprint, jsonify
from app.models.user import User
from app.models.question import Question
from app.models.user_question import UserQuestion
from app.models.review_schedule import ReviewSchedule
from app.models.scheduled_review import ScheduledReview
from app.models.learning_path import LearningPath
from app.models.path_question import PathQuestion
from app.models.user_learning_path import UserLearningPath
from app.models.user_path_question import UserPathQuestion
from app.utils.security import admin_required
import logging

logger = logging.getLogger(__name__)

admin = Blueprint('admin', __name__, url_prefix='/api/v1/admin')

@admin.route('/stats', methods=['GET'])
@admin_required
def get_admin_stats():
    """Get basic website statistics for admin dashboard"""
    try:
        # Get counts from each table
        stats = {
            'total_users': User.query.count(),
            'total_questions': Question.query.count(),
            'total_learning_paths': LearningPath.query.count(),
            'total_user_questions': UserQuestion.query.count(),
            'total_user_learning_paths': UserLearningPath.query.count(),
            'total_path_questions': PathQuestion.query.count(),
            'total_review_schedules': ReviewSchedule.query.count(),
            'total_scheduled_reviews': ScheduledReview.query.count(),
            'total_user_path_questions': UserPathQuestion.query.count()
        }

        # Additional useful metrics
        active_users = User.query.filter_by(is_active=True).count()
        public_paths = LearningPath.query.filter_by(is_public=True, is_active=True).count()
        admin_users = User.query.filter_by(is_admin=True).count()

        stats.update({
            'active_users': active_users,
            'public_learning_paths': public_paths,
            'admin_users': admin_users
        })

        return jsonify({
            'status': 'success',
            'message': 'Admin statistics retrieved successfully',
            'summary': stats
        }), 200

    except Exception as e:
        logger.error(f"Error fetching admin stats: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'An error occurred while fetching admin statistics: {str(e)}'
        }), 500 