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
    get_learning_path_with_questions,
    create_company_paths,
    create_topic_paths,
    create_pattern_paths,
)
from app.utils.security import admin_required
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

learning_paths_bp = Blueprint("learning_paths", __name__)


@learning_paths_bp.route("/api/v1/learning-paths", methods=["GET"])
def get_all_learning_paths():
    """Get all public learning paths"""
    try:
        paths = LearningPath.query.filter_by(is_public=True, is_active=True).all()

        paths_data = []
        for path in paths:
            # Get question count for each path
            question_count = PathQuestion.query.filter_by(path_id=path.path_id).count()

            paths_data.append(
                {
                    "path_id": path.path_id,
                    "name": path.name,
                    "description": path.description,
                    "difficulty_level": path.difficulty_level,
                    "estimated_hours": path.estimated_hours,
                    "tags": path.tags.split(",") if path.tags else [],
                    "question_count": question_count,
                    "created_at": (
                        path.created_at.isoformat() if path.created_at else None
                    ),
                    "source": path.source,
                }
            )

        return jsonify({"status": "success", "data": paths_data}), 200

    except Exception as e:
        logger.error(f"Error getting learning paths: {str(e)}")
        return (
            jsonify(
                {"status": "error", "message": "Failed to retrieve learning paths"}
            ),
            500,
        )


@learning_paths_bp.route("/api/v1/learning-paths/<int:path_id>", methods=["GET"])
def get_learning_path(path_id):
    """Get a specific learning path with all its questions"""
    try:
        path_data = get_learning_path_with_questions(path_id)

        if not path_data:
            return (
                jsonify({"status": "error", "message": "Learning path not found"}),
                404,
            )

        path = path_data["path"]
        questions = path_data["questions"]

        # Format the response
        response_data = {
            "path_id": path.path_id,
            "name": path.name,
            "description": path.description,
            "difficulty_level": path.difficulty_level,
            "estimated_hours": path.estimated_hours,
            "tags": path.tags.split(",") if path.tags else [],
            "created_at": path.created_at.isoformat() if path.created_at else None,
            "source": path.source,
            "questions": [
                {
                    "sequence_number": q["sequence_number"],
                    "question_id": q["question"].question_id,
                    "leetcode_id": q["question"].leetcode_id,
                    "title": q["question"].title,
                    "url": q["question"].url,
                    "difficulty": q["question"].difficulty,
                    "tags": q["question"].tags.split(",") if q["question"].tags else [],
                    "notes": q["notes"],
                    "estimated_minutes": q["estimated_minutes"],
                    "importance": q["importance"],
                }
                for q in questions
            ],
        }

        return jsonify({"status": "success", "data": response_data}), 200

    except Exception as e:
        logger.error(f"Error getting learning path {path_id}: {str(e)}")
        return (
            jsonify({"status": "error", "message": "Failed to retrieve learning path"}),
            500,
        )


@learning_paths_bp.route("/api/v1/learning-paths", methods=["POST"])
@jwt_required()
def create_new_learning_path():
    """Create a new learning path"""
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()

        # Validate required fields
        required_fields = ["name", "description"]
        for field in required_fields:
            if field not in data:
                return (
                    jsonify(
                        {
                            "status": "error",
                            "message": f"Missing required field: {field}",
                        }
                    ),
                    400,
                )

        # Create the learning path
        path = create_learning_path(
            name=data["name"],
            description=data["description"],
            difficulty_level=data.get("difficulty_level", "Intermediate"),
            estimated_hours=data.get("estimated_hours"),
            tags=data.get("tags"),
            source="User",
            creator_id=current_user_id,
            is_public=data.get("is_public", False),
        )

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Learning path created successfully",
                    "data": {
                        "path_id": path.path_id,
                        "name": path.name,
                        "description": path.description,
                    },
                }
            ),
            201,
        )

    except Exception as e:
        logger.error(f"Error creating learning path: {str(e)}")
        return (
            jsonify({"status": "error", "message": "Failed to create learning path"}),
            500,
        )


@learning_paths_bp.route(
    "/api/v1/learning-paths/<int:path_id>/questions", methods=["POST"]
)
@jwt_required()
def add_question_to_learning_path(path_id):
    """Add a question to a learning path"""
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()

        # Check if user owns the path or if it's a system path
        path = LearningPath.query.get(path_id)
        if not path:
            return (
                jsonify({"status": "error", "message": "Learning path not found"}),
                404,
            )

        if path.creator_id != current_user_id and path.source != "System":
            return jsonify({"status": "error", "message": "Permission denied"}), 403

        # Validate required fields
        if "question_title_slug" not in data or "sequence_number" not in data:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Missing required fields: question_title_slug, sequence_number",
                    }
                ),
                400,
            )

        # Add the question
        path_question = add_question_to_path(
            path_id=path_id,
            question_title_slug=data["question_title_slug"],
            sequence_number=data["sequence_number"],
            notes=data.get("notes"),
            estimated_minutes=data.get("estimated_minutes"),
            importance=data.get("importance", 3),
        )

        if not path_question:
            return (
                jsonify(
                    {"status": "error", "message": "Failed to add question to path"}
                ),
                500,
            )

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Question added to learning path successfully",
                }
            ),
            201,
        )

    except Exception as e:
        logger.error(f"Error adding question to path {path_id}: {str(e)}")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Failed to add question to learning path",
                }
            ),
            500,
        )


@learning_paths_bp.route("/api/v1/user/learning-paths", methods=["GET"])
@jwt_required()
def get_user_learning_paths():
    """Get learning paths that the user has enrolled in"""
    try:
        current_user_id = int(get_jwt_identity())

        # Get user's enrolled paths
        user_paths = (
            db.session.query(UserLearningPath, LearningPath)
            .join(LearningPath, UserLearningPath.path_id == LearningPath.path_id)
            .filter(UserLearningPath.user_id == current_user_id)
            .all()
        )

        paths_data = []
        for user_path, path in user_paths:
            # Get question count and progress
            total_questions = PathQuestion.query.filter_by(path_id=path.path_id).count()

            paths_data.append(
                {
                    "path_id": path.path_id,
                    "name": path.name,
                    "description": path.description,
                    "difficulty_level": path.difficulty_level,
                    "estimated_hours": path.estimated_hours,
                    "tags": path.tags.split(",") if path.tags else [],
                    "question_count": total_questions,
                    "enrolled_at": (
                        user_path.started_at.isoformat()
                        if user_path.started_at
                        else None
                    ),
                    "progress_percentage": user_path.completion_percentage or 0,
                    "is_completed": user_path.completed_at is not None,
                }
            )

        return jsonify({"status": "success", "data": paths_data}), 200

    except Exception as e:
        logger.error(f"Error getting user learning paths: {str(e)}")
        return (
            jsonify(
                {"status": "error", "message": "Failed to retrieve user learning paths"}
            ),
            500,
        )


@learning_paths_bp.route(
    "/api/v1/user/learning-paths/<int:path_id>/enroll", methods=["POST"]
)
@jwt_required()
def enroll_in_learning_path(path_id):
    """Enroll user in a learning path"""
    try:
        current_user_id = int(get_jwt_identity())

        # Check if path exists
        path = LearningPath.query.get(path_id)
        if not path:
            return (
                jsonify({"status": "error", "message": "Learning path not found"}),
                404,
            )

        # Check if user is already enrolled
        existing_enrollment = UserLearningPath.query.filter_by(
            user_id=current_user_id, path_id=path_id
        ).first()

        if existing_enrollment:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Already enrolled in this learning path",
                    }
                ),
                400,
            )

        # Create enrollment
        enrollment = UserLearningPath(
            user_id=current_user_id,
            path_id=path_id,
            started_at=datetime.utcnow(),
            completion_percentage=0.0,
            is_active=True,
        )

        db.session.add(enrollment)
        db.session.commit()

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Successfully enrolled in learning path",
                }
            ),
            201,
        )

    except Exception as e:
        logger.error(f"Error enrolling in learning path {path_id}: {str(e)}")
        db.session.rollback()
        return (
            jsonify(
                {"status": "error", "message": "Failed to enroll in learning path"}
            ),
            500,
        )


# ---------------------------------------------------------------------------
# Admin Endpoints
# ---------------------------------------------------------------------------


@learning_paths_bp.route("/api/v1/admin/learning-paths", methods=["POST"])
@admin_required
def admin_create_learning_path():
    """Admin: Create a new system learning path (is_active & public configurable)."""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ["name", "description"]
        for field in required_fields:
            if field not in data:
                return (
                    jsonify(
                        {
                            "status": "error",
                            "message": f"Missing required field: {field}",
                        }
                    ),
                    400,
                )

        current_user_id = int(get_jwt_identity())

        path = create_learning_path(
            name=data["name"],
            description=data["description"],
            difficulty_level=data.get("difficulty_level", "Intermediate"),
            estimated_hours=data.get("estimated_hours"),
            tags=data.get("tags"),
            source="System",  # Mark as system path
            creator_id=current_user_id,
            is_public=data.get("is_public", True),
        )

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Learning path created successfully",
                    "data": {
                        "path_id": path.path_id,
                        "name": path.name,
                        "description": path.description,
                        "is_public": path.is_public,
                    },
                }
            ),
            201,
        )

    except Exception as e:
        logger.error(f"[ADMIN] Error creating learning path: {str(e)}")
        return (
            jsonify({"status": "error", "message": "Failed to create learning path"}),
            500,
        )


@learning_paths_bp.route("/api/v1/admin/learning-paths", methods=["GET"])
@admin_required
def admin_get_all_learning_paths():
    """Admin: Get all learning paths including inactive ones"""
    try:
        paths = LearningPath.query.all()

        paths_data = []
        for path in paths:
            question_count = PathQuestion.query.filter_by(path_id=path.path_id).count()
            enrollment_count = (
                db.session.query(UserLearningPath)
                .filter_by(path_id=path.path_id)
                .count()
            )

            paths_data.append(
                {
                    "path_id": path.path_id,
                    "name": path.name,
                    "description": path.description,
                    "difficulty_level": path.difficulty_level,
                    "estimated_hours": path.estimated_hours,
                    "tags": path.tags.split(",") if path.tags else [],
                    "question_count": question_count,
                    "enrollment_count": enrollment_count,
                    "created_at": (
                        path.created_at.isoformat() if path.created_at else None
                    ),
                    "updated_at": (
                        path.updated_at.isoformat() if path.updated_at else None
                    ),
                    "source": path.source,
                    "is_public": path.is_public,
                    "is_active": path.is_active,
                    "creator_id": path.creator_id,
                }
            )

        return jsonify({"status": "success", "data": paths_data}), 200

    except Exception as e:
        logger.error(f"[ADMIN] Error getting all learning paths: {str(e)}")
        return (
            jsonify(
                {"status": "error", "message": "Failed to retrieve learning paths"}
            ),
            500,
        )


@learning_paths_bp.route("/api/v1/admin/learning-paths/<int:path_id>", methods=["PUT"])
@admin_required
def admin_update_learning_path(path_id):
    """Admin: Update a learning path"""
    try:
        path = LearningPath.query.get(path_id)
        if not path:
            return (
                jsonify({"status": "error", "message": "Learning path not found"}),
                404,
            )

        data = request.get_json()

        # Update fields if provided
        if "name" in data:
            path.name = data["name"]
        if "description" in data:
            path.description = data["description"]
        if "difficulty_level" in data:
            path.difficulty_level = data["difficulty_level"]
        if "estimated_hours" in data:
            path.estimated_hours = data["estimated_hours"]
        if "tags" in data:
            path.tags = (
                ",".join(data["tags"])
                if isinstance(data["tags"], list)
                else data["tags"]
            )
        if "is_public" in data:
            path.is_public = data["is_public"]
        if "is_active" in data:
            path.is_active = data["is_active"]

        path.updated_at = datetime.utcnow()
        db.session.commit()

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Learning path updated successfully",
                    "data": {
                        "path_id": path.path_id,
                        "name": path.name,
                        "description": path.description,
                        "is_public": path.is_public,
                        "is_active": path.is_active,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        logger.error(f"[ADMIN] Error updating learning path {path_id}: {str(e)}")
        return (
            jsonify({"status": "error", "message": "Failed to update learning path"}),
            500,
        )


@learning_paths_bp.route(
    "/api/v1/admin/learning-paths/<int:path_id>", methods=["DELETE"]
)
@admin_required
def admin_delete_learning_path(path_id):
    """Admin: Delete a learning path (or deactivate if it has enrollments)"""
    try:
        path = LearningPath.query.get(path_id)
        if not path:
            return (
                jsonify({"status": "error", "message": "Learning path not found"}),
                404,
            )

        # Check if path has enrollments
        enrollment_count = (
            db.session.query(UserLearningPath).filter_by(path_id=path_id).count()
        )

        if enrollment_count > 0:
            # Deactivate instead of delete
            path.is_active = False
            path.updated_at = datetime.utcnow()
            db.session.commit()

            return (
                jsonify(
                    {
                        "status": "success",
                        "message": f"Learning path deactivated (had {enrollment_count} enrollments)",
                    }
                ),
                200,
            )
        else:
            # Safe to delete
            db.session.delete(path)
            db.session.commit()

            return (
                jsonify(
                    {
                        "status": "success",
                        "message": "Learning path deleted successfully",
                    }
                ),
                200,
            )

    except Exception as e:
        db.session.rollback()
        logger.error(f"[ADMIN] Error deleting learning path {path_id}: {str(e)}")
        return (
            jsonify({"status": "error", "message": "Failed to delete learning path"}),
            500,
        )


@learning_paths_bp.route(
    "/api/v1/admin/learning-paths/<int:path_id>/questions", methods=["POST"]
)
@admin_required
def admin_add_question_to_path(path_id):
    """Admin: Add a question to a learning path"""
    try:
        path = LearningPath.query.get(path_id)
        if not path:
            return (
                jsonify({"status": "error", "message": "Learning path not found"}),
                404,
            )

        data = request.get_json()

        # Validate required fields
        required_fields = ["question_title_slug", "sequence_number"]
        for field in required_fields:
            if field not in data:
                return (
                    jsonify(
                        {
                            "status": "error",
                            "message": f"Missing required field: {field}",
                        }
                    ),
                    400,
                )

        # Add the question
        path_question = add_question_to_path(
            path_id=path_id,
            question_title_slug=data["question_title_slug"],
            sequence_number=data["sequence_number"],
            notes=data.get("notes"),
            estimated_minutes=data.get("estimated_minutes"),
            importance=data.get("importance", 3),
        )

        if not path_question:
            return (
                jsonify(
                    {"status": "error", "message": "Failed to add question to path"}
                ),
                500,
            )

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Question added to learning path successfully",
                    "data": {
                        "path_question_id": path_question.path_question_id,
                        "sequence_number": path_question.sequence_number,
                    },
                }
            ),
            201,
        )

    except Exception as e:
        logger.error(f"[ADMIN] Error adding question to path {path_id}: {str(e)}")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Failed to add question to learning path",
                }
            ),
            500,
        )


@learning_paths_bp.route(
    "/api/v1/admin/learning-paths/<int:path_id>/questions/<int:path_question_id>",
    methods=["PUT"],
)
@admin_required
def admin_update_path_question(path_id, path_question_id):
    """Admin: Update a question in a learning path"""
    try:
        path_question = PathQuestion.query.filter_by(
            path_question_id=path_question_id, path_id=path_id
        ).first()

        if not path_question:
            return (
                jsonify({"status": "error", "message": "Path question not found"}),
                404,
            )

        data = request.get_json()

        # Update fields if provided
        if "sequence_number" in data:
            # Check for conflicts
            existing = (
                PathQuestion.query.filter_by(
                    path_id=path_id, sequence_number=data["sequence_number"]
                )
                .filter(PathQuestion.path_question_id != path_question_id)
                .first()
            )

            if existing:
                return (
                    jsonify(
                        {
                            "status": "error",
                            "message": f'Sequence number {data["sequence_number"]} already exists',
                        }
                    ),
                    400,
                )

            path_question.sequence_number = data["sequence_number"]

        if "notes" in data:
            path_question.notes = data["notes"]
        if "estimated_minutes" in data:
            path_question.estimated_minutes = data["estimated_minutes"]
        if "importance" in data:
            path_question.importance = data["importance"]

        db.session.commit()

        return (
            jsonify(
                {"status": "success", "message": "Path question updated successfully"}
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        logger.error(
            f"[ADMIN] Error updating path question {path_question_id}: {str(e)}"
        )
        return (
            jsonify({"status": "error", "message": "Failed to update path question"}),
            500,
        )


@learning_paths_bp.route(
    "/api/v1/admin/learning-paths/<int:path_id>/questions/<int:path_question_id>",
    methods=["DELETE"],
)
@admin_required
def admin_remove_question_from_path(path_id, path_question_id):
    """Admin: Remove a question from a learning path"""
    try:
        path_question = PathQuestion.query.filter_by(
            path_question_id=path_question_id, path_id=path_id
        ).first()

        if not path_question:
            return (
                jsonify({"status": "error", "message": "Path question not found"}),
                404,
            )

        db.session.delete(path_question)
        db.session.commit()

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Question removed from learning path successfully",
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        logger.error(f"[ADMIN] Error removing question from path {path_id}: {str(e)}")
        return (
            jsonify(
                {"status": "error", "message": "Failed to remove question from path"}
            ),
            500,
        )


@learning_paths_bp.route(
    "/api/v1/admin/learning-paths/<int:path_id>/questions/reorder", methods=["PUT"]
)
@admin_required
def admin_reorder_path_questions(path_id):
    """Admin: Reorder questions in a learning path"""
    try:
        path = LearningPath.query.get(path_id)
        if not path:
            return (
                jsonify({"status": "error", "message": "Learning path not found"}),
                404,
            )

        data = request.get_json()
        if "question_orders" not in data:
            return (
                jsonify(
                    {"status": "error", "message": "Missing question_orders field"}
                ),
                400,
            )

        # question_orders should be: [{'path_question_id': 1, 'sequence_number': 1}, ...]
        question_orders = data["question_orders"]

        for order in question_orders:
            path_question = PathQuestion.query.filter_by(
                path_question_id=order["path_question_id"], path_id=path_id
            ).first()

            if path_question:
                path_question.sequence_number = order["sequence_number"]

        db.session.commit()

        return (
            jsonify(
                {"status": "success", "message": "Questions reordered successfully"}
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        logger.error(f"[ADMIN] Error reordering questions in path {path_id}: {str(e)}")
        return (
            jsonify({"status": "error", "message": "Failed to reorder questions"}),
            500,
        )


@learning_paths_bp.route("/api/v1/admin/learning-paths/bulk-create", methods=["POST"])
@admin_required
def admin_bulk_create_paths():
    """Admin: Bulk create predefined learning paths"""
    try:
        data = request.get_json()
        path_type = data.get("path_type")

        if path_type not in ["company", "topic", "pattern"]:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Invalid path_type. Must be: company, topic, or pattern",
                    }
                ),
                400,
            )

        current_user_id = int(get_jwt_identity())
        created_paths = []

        if path_type == "company":
            created_paths = create_company_paths(current_user_id)
        elif path_type == "topic":
            created_paths = create_topic_paths(current_user_id)
        elif path_type == "pattern":
            created_paths = create_pattern_paths(current_user_id)

        return (
            jsonify(
                {
                    "status": "success",
                    "message": f"Created {len(created_paths)} {path_type} learning paths",
                    "data": {
                        "created_paths": [
                            {
                                "path_id": path.path_id,
                                "name": path.name,
                                "description": path.description,
                            }
                            for path in created_paths
                        ]
                    },
                }
            ),
            201,
        )

    except Exception as e:
        logger.error(f"[ADMIN] Error bulk creating paths: {str(e)}")
        return (
            jsonify(
                {"status": "error", "message": "Failed to bulk create learning paths"}
            ),
            500,
        )
