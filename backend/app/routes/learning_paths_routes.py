"""
Learning Paths API Routes
Handles CRUD operations for learning paths and their questions
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.learning_path import LearningPath
from app.models.path_question import PathQuestion
from app.models.question import Question
from app.models.user_learning_path import UserLearningPath
from app.utils.learning_paths import (
    create_learning_path, 
    add_question_to_path, 
    get_learning_path_with_questions
)
import logging

logger = logging.getLogger(__name__)

learning_paths_bp = Blueprint('learning_paths', __name__)

@learning_paths_bp.route('/api/v1/learning-paths', methods=['GET'])
def get_all_learning_paths():
    """Get all public learning paths"""
    try:
        paths = LearningPath.query.filter_by(is_public=True, is_active=True).all()
        
        paths_data = []
        for path in paths:
            # Get question count for each path
            question_count = PathQuestion.query.filter_by(path_id=path.path_id).count()
            
            paths_data.append({
                'path_id': path.path_id,
                'name': path.name,
                'description': path.description,
                'difficulty_level': path.difficulty_level,
                'estimated_hours': path.estimated_hours,
                'tags': path.tags.split(',') if path.tags else [],
                'question_count': question_count,
                'created_at': path.created_at.isoformat() if path.created_at else None,
                'source': path.source
            })
        
        return jsonify({
            'status': 'success',
            'data': paths_data
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting learning paths: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve learning paths'
        }), 500

@learning_paths_bp.route('/api/v1/learning-paths/<int:path_id>', methods=['GET'])
def get_learning_path(path_id):
    """Get a specific learning path with all its questions"""
    try:
        path_data = get_learning_path_with_questions(path_id)
        
        if not path_data:
            return jsonify({
                'status': 'error',
                'message': 'Learning path not found'
            }), 404
        
        path = path_data['path']
        questions = path_data['questions']
        
        # Format the response
        response_data = {
            'path_id': path.path_id,
            'name': path.name,
            'description': path.description,
            'difficulty_level': path.difficulty_level,
            'estimated_hours': path.estimated_hours,
            'tags': path.tags.split(',') if path.tags else [],
            'created_at': path.created_at.isoformat() if path.created_at else None,
            'source': path.source,
            'questions': [
                {
                    'sequence_number': q['sequence_number'],
                    'question_id': q['question'].question_id,
                    'leetcode_id': q['question'].leetcode_id,
                    'title': q['question'].title,
                    'url': q['question'].url,
                    'difficulty': q['question'].difficulty,
                    'tags': q['question'].tags.split(',') if q['question'].tags else [],
                    'notes': q['notes'],
                    'estimated_minutes': q['estimated_minutes'],
                    'importance': q['importance']
                }
                for q in questions
            ]
        }
        
        return jsonify({
            'status': 'success',
            'data': response_data
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting learning path {path_id}: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve learning path'
        }), 500

@learning_paths_bp.route('/api/v1/learning-paths', methods=['POST'])
@jwt_required()
def create_new_learning_path():
    """Create a new learning path"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'description']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'status': 'error',
                    'message': f'Missing required field: {field}'
                }), 400
        
        # Create the learning path
        path = create_learning_path(
            name=data['name'],
            description=data['description'],
            difficulty_level=data.get('difficulty_level', 'Intermediate'),
            estimated_hours=data.get('estimated_hours'),
            tags=data.get('tags'),
            source='User',
            creator_id=current_user_id,
            is_public=data.get('is_public', False)
        )
        
        return jsonify({
            'status': 'success',
            'message': 'Learning path created successfully',
            'data': {
                'path_id': path.path_id,
                'name': path.name,
                'description': path.description
            }
        }), 201
        
    except Exception as e:
        logger.error(f"Error creating learning path: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to create learning path'
        }), 500

@learning_paths_bp.route('/api/v1/learning-paths/<int:path_id>/questions', methods=['POST'])
@jwt_required()
def add_question_to_learning_path(path_id):
    """Add a question to a learning path"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Check if user owns the path or if it's a system path
        path = LearningPath.query.get(path_id)
        if not path:
            return jsonify({
                'status': 'error',
                'message': 'Learning path not found'
            }), 404
        
        if path.creator_id != current_user_id and path.source != 'System':
            return jsonify({
                'status': 'error',
                'message': 'Permission denied'
            }), 403
        
        # Validate required fields
        if 'question_title_slug' not in data or 'sequence_number' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields: question_title_slug, sequence_number'
            }), 400
        
        # Add the question
        path_question = add_question_to_path(
            path_id=path_id,
            question_title_slug=data['question_title_slug'],
            sequence_number=data['sequence_number'],
            notes=data.get('notes'),
            estimated_minutes=data.get('estimated_minutes'),
            importance=data.get('importance', 3)
        )
        
        if not path_question:
            return jsonify({
                'status': 'error',
                'message': 'Failed to add question to path'
            }), 500
        
        return jsonify({
            'status': 'success',
            'message': 'Question added to learning path successfully'
        }), 201
        
    except Exception as e:
        logger.error(f"Error adding question to path {path_id}: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to add question to learning path'
        }), 500

@learning_paths_bp.route('/api/v1/user/learning-paths', methods=['GET'])
@jwt_required()
def get_user_learning_paths():
    """Get learning paths that the user has enrolled in"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get user's enrolled paths
        user_paths = db.session.query(UserLearningPath, LearningPath).join(
            LearningPath, UserLearningPath.path_id == LearningPath.path_id
        ).filter(UserLearningPath.user_id == current_user_id).all()
        
        paths_data = []
        for user_path, path in user_paths:
            # Get question count and progress
            total_questions = PathQuestion.query.filter_by(path_id=path.path_id).count()
            
            paths_data.append({
                'path_id': path.path_id,
                'name': path.name,
                'description': path.description,
                'difficulty_level': path.difficulty_level,
                'estimated_hours': path.estimated_hours,
                'tags': path.tags.split(',') if path.tags else [],
                'question_count': total_questions,
                'enrolled_at': user_path.enrolled_at.isoformat() if user_path.enrolled_at else None,
                'progress_percentage': user_path.progress_percentage or 0,
                'is_completed': user_path.is_completed or False
            })
        
        return jsonify({
            'status': 'success',
            'data': paths_data
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting user learning paths: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve user learning paths'
        }), 500

@learning_paths_bp.route('/api/v1/user/learning-paths/<int:path_id>/enroll', methods=['POST'])
@jwt_required()
def enroll_in_learning_path(path_id):
    """Enroll user in a learning path"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if path exists
        path = LearningPath.query.get(path_id)
        if not path:
            return jsonify({
                'status': 'error',
                'message': 'Learning path not found'
            }), 404
        
        # Check if user is already enrolled
        existing_enrollment = UserLearningPath.query.filter_by(
            user_id=current_user_id,
            path_id=path_id
        ).first()
        
        if existing_enrollment:
            return jsonify({
                'status': 'error',
                'message': 'Already enrolled in this learning path'
            }), 400
        
        # Create enrollment
        from datetime import datetime
        enrollment = UserLearningPath(
            user_id=current_user_id,
            path_id=path_id,
            enrolled_at=datetime.utcnow(),
            progress_percentage=0,
            is_completed=False
        )
        
        db.session.add(enrollment)
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Successfully enrolled in learning path'
        }), 201
        
    except Exception as e:
        logger.error(f"Error enrolling in learning path {path_id}: {str(e)}")
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': 'Failed to enroll in learning path'
        }), 500 