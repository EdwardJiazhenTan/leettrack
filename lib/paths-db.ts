import { query, queryOne } from './database';
import type {
  Path,
  CreatePathRequest,
  UpdatePathRequest,
  PathListResponse,
  UserPathProgress,
  PathStats
} from '../types/path';

// Database functions for learning paths

export async function createPath(pathData: CreatePathRequest, created_by?: string): Promise<Path> {
  try {
    // Insert the path
    const path = await queryOne<Path>(
      `INSERT INTO learning_paths (title, description, difficulty, estimated_hours, is_public, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        pathData.title,
        pathData.description,
        pathData.difficulty,
        pathData.estimated_hours || 1,
        pathData.is_public !== undefined ? pathData.is_public : false,
        created_by || null
      ]
    );

    if (!path) {
      throw new Error('Failed to create path');
    }

    // Insert tags
    if (pathData.tags && pathData.tags.length > 0) {
      for (const tag of pathData.tags) {
        await query(
          'INSERT INTO path_tags (path_id, tag) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [path.id, tag]
        );
      }
    }

    // Add questions if provided
    if (pathData.question_ids && pathData.question_ids.length > 0) {
      for (let i = 0; i < pathData.question_ids.length; i++) {
        await query(
          'INSERT INTO path_questions (path_id, question_id, order_index) VALUES ($1, $2, $3)',
          [path.id, pathData.question_ids[i], i]
        );
      }
    }

    // Fetch complete path with tags and questions
    return await findPathById(path.id) || path;
  } catch (error) {
    console.error('Create path error:', error);
    throw new Error('Failed to create path');
  }
}

export async function findPathById(id: string): Promise<Path | null> {
  try {
    const path = await queryOne<Path>(
      'SELECT * FROM learning_paths WHERE id = $1',
      [id]
    );

    if (!path) {
      return null;
    }

    // Get tags
    const tags = await query<{ tag: string }>(
      'SELECT tag FROM path_tags WHERE path_id = $1',
      [id]
    );

    // Get question IDs
    const questions = await query<{ question_id: string }>(
      'SELECT question_id FROM path_questions WHERE path_id = $1 ORDER BY order_index',
      [id]
    );

    return {
      ...path,
      tags: tags.map(t => t.tag),
      question_ids: questions.map(q => q.question_id)
    };
  } catch (error) {
    console.error('Find path by ID error:', error);
    return null;
  }
}

export async function findPathsByCreator(created_by: string): Promise<Path[]> {
  try {
    const paths = await query<Path>(
      'SELECT * FROM learning_paths WHERE created_by = $1 ORDER BY created_at DESC',
      [created_by]
    );

    // Fetch tags and questions for each path
    const pathsWithDetails = await Promise.all(
      paths.map(async (path) => {
        const tags = await query<{ tag: string }>(
          'SELECT tag FROM path_tags WHERE path_id = $1',
          [path.id]
        );
        const questions = await query<{ question_id: string }>(
          'SELECT question_id FROM path_questions WHERE path_id = $1 ORDER BY order_index',
          [path.id]
        );
        return {
          ...path,
          tags: tags.map(t => t.tag),
          question_ids: questions.map(q => q.question_id)
        };
      })
    );

    return pathsWithDetails;
  } catch (error) {
    console.error('Find paths by creator error:', error);
    return [];
  }
}

export async function updatePath(id: string, updates: UpdatePathRequest): Promise<Path | null> {
  try {
    const path = await queryOne<Path>(
      `UPDATE learning_paths
       SET title = COALESCE($2, title),
           description = COALESCE($3, description),
           difficulty = COALESCE($4, difficulty),
           estimated_hours = COALESCE($5, estimated_hours),
           is_public = COALESCE($6, is_public),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [
        id,
        updates.title || null,
        updates.description || null,
        updates.difficulty || null,
        updates.estimated_hours || null,
        updates.is_public !== undefined ? updates.is_public : null
      ]
    );

    if (!path) {
      return null;
    }

    // Update tags if provided
    if (updates.tags) {
      await query('DELETE FROM path_tags WHERE path_id = $1', [id]);
      for (const tag of updates.tags) {
        await query(
          'INSERT INTO path_tags (path_id, tag) VALUES ($1, $2)',
          [id, tag]
        );
      }
    }

    return await findPathById(id);
  } catch (error) {
    console.error('Update path error:', error);
    return null;
  }
}

export async function deletePath(id: string): Promise<boolean> {
  try {
    await query('DELETE FROM learning_paths WHERE id = $1', [id]);
    return true;
  } catch (error) {
    console.error('Delete path error:', error);
    return false;
  }
}

export async function searchPaths(params: {
  query?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  tags?: string[];
  is_public?: boolean;
  created_by?: string;
  limit?: number;
  offset?: number;
}): Promise<PathListResponse> {
  try {
    let whereConditions: string[] = [];
    let queryParams: any[] = [];
    let paramCount = 0;

    // Build WHERE conditions
    if (params.query) {
      paramCount++;
      whereConditions.push(`(
        lp.title ILIKE $${paramCount} OR
        lp.description ILIKE $${paramCount} OR
        EXISTS (SELECT 1 FROM path_tags pt WHERE pt.path_id = lp.id AND pt.tag ILIKE $${paramCount})
      )`);
      queryParams.push(`%${params.query}%`);
    }

    if (params.difficulty) {
      paramCount++;
      whereConditions.push(`lp.difficulty = $${paramCount}`);
      queryParams.push(params.difficulty);
    }

    if (params.tags && params.tags.length > 0) {
      paramCount++;
      whereConditions.push(`EXISTS (
        SELECT 1 FROM path_tags pt
        WHERE pt.path_id = lp.id AND pt.tag = ANY($${paramCount})
      )`);
      queryParams.push(params.tags);
    }

    if (params.is_public !== undefined) {
      paramCount++;
      whereConditions.push(`lp.is_public = $${paramCount}`);
      queryParams.push(params.is_public);
    }

    if (params.created_by) {
      paramCount++;
      whereConditions.push(`lp.created_by = $${paramCount}`);
      queryParams.push(params.created_by);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const totalResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM learning_paths lp ${whereClause}`,
      queryParams
    );
    const total = parseInt(totalResult?.count || '0');

    // Get paginated results
    const limit = params.limit || 20;
    const offset = params.offset || 0;

    paramCount += 2;
    const paths = await query<Path>(
      `SELECT lp.* FROM learning_paths lp
       ${whereClause}
       ORDER BY lp.created_at DESC
       LIMIT $${paramCount - 1} OFFSET $${paramCount}`,
      [...queryParams, limit, offset]
    );

    // Fetch tags and questions for each path
    const pathsWithDetails = await Promise.all(
      paths.map(async (path) => {
        const tags = await query<{ tag: string }>(
          'SELECT tag FROM path_tags WHERE path_id = $1',
          [path.id]
        );
        const questions = await query<{ question_id: string }>(
          'SELECT question_id FROM path_questions WHERE path_id = $1 ORDER BY order_index',
          [path.id]
        );
        return {
          ...path,
          tags: tags.map(t => t.tag),
          question_ids: questions.map(q => q.question_id)
        };
      })
    );

    return {
      paths: pathsWithDetails,
      total,
      limit,
      offset,
      has_more: offset + limit < total,
    };
  } catch (error) {
    console.error('Search paths error:', error);
    return {
      paths: [],
      total: 0,
      limit: params.limit || 20,
      offset: params.offset || 0,
      has_more: false,
    };
  }
}

export async function enrollInPath(user_id: string, path_id: string): Promise<UserPathProgress | null> {
  try {
    const enrollment = await queryOne<UserPathProgress>(
      `INSERT INTO user_path_enrollments (user_id, path_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, path_id) DO UPDATE
       SET is_active = true
       RETURNING
         id,
         user_id,
         path_id,
         enrolled_at,
         completion_percentage as progress_percentage,
         enrolled_at as last_activity,
         NULL as completed_at,
         ARRAY[]::uuid[] as completed_questions`,
      [user_id, path_id]
    );

    return enrollment;
  } catch (error) {
    console.error('Enroll in path error:', error);
    return null;
  }
}

export async function updatePathProgress(
  user_id: string,
  path_id: string,
  completed_question_id: string
): Promise<UserPathProgress | null> {
  try {
    // Record the question completion
    await query(
      `INSERT INTO user_question_progress (user_id, question_id, path_id, status, completed_at)
       VALUES ($1, $2, $3, 'completed', NOW())
       ON CONFLICT (user_id, question_id, path_id)
       DO UPDATE SET status = 'completed', completed_at = NOW(), updated_at = NOW()`,
      [user_id, completed_question_id, path_id]
    );

    // Get total and completed question counts
    const stats = await queryOne<{ total: string; completed: string }>(
      `SELECT
         COUNT(*) as total,
         COUNT(CASE WHEN uqp.status = 'completed' THEN 1 END) as completed
       FROM path_questions pq
       LEFT JOIN user_question_progress uqp ON
         uqp.question_id = pq.question_id AND
         uqp.path_id = pq.path_id AND
         uqp.user_id = $1
       WHERE pq.path_id = $2`,
      [user_id, path_id]
    );

    const total = parseInt(stats?.total || '0');
    const completed = parseInt(stats?.completed || '0');
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update enrollment
    await query(
      `UPDATE user_path_enrollments
       SET completion_percentage = $3
       WHERE user_id = $1 AND path_id = $2`,
      [user_id, path_id, percentage]
    );

    return await getUserPathProgress(user_id, path_id);
  } catch (error) {
    console.error('Update path progress error:', error);
    return null;
  }
}

export async function getUserPathProgress(user_id: string, path_id: string): Promise<UserPathProgress | null> {
  try {
    const enrollment = await queryOne<{
      id: string;
      user_id: string;
      path_id: string;
      enrolled_at: string;
      completion_percentage: number;
    }>(
      `SELECT id, user_id, path_id, enrolled_at, completion_percentage
       FROM user_path_enrollments
       WHERE user_id = $1 AND path_id = $2`,
      [user_id, path_id]
    );

    if (!enrollment) {
      return null;
    }

    // Get completed questions
    const completedQuestions = await query<{ question_id: string }>(
      `SELECT question_id
       FROM user_question_progress
       WHERE user_id = $1 AND path_id = $2 AND status = 'completed'`,
      [user_id, path_id]
    );

    return {
      id: enrollment.id,
      user_id: enrollment.user_id,
      path_id: enrollment.path_id,
      completed_questions: completedQuestions.map(q => q.question_id),
      progress_percentage: enrollment.completion_percentage,
      enrolled_at: enrollment.enrolled_at,
      last_activity: enrollment.enrolled_at,
      completed_at: enrollment.completion_percentage === 100 ? enrollment.enrolled_at : undefined,
    };
  } catch (error) {
    console.error('Get user path progress error:', error);
    return null;
  }
}

export async function getUserEnrolledPaths(user_id: string): Promise<UserPathProgress[]> {
  try {
    const enrollments = await query<{
      id: string;
      user_id: string;
      path_id: string;
      enrolled_at: string;
      completion_percentage: number;
    }>(
      `SELECT id, user_id, path_id, enrolled_at, completion_percentage
       FROM user_path_enrollments
       WHERE user_id = $1 AND is_active = true
       ORDER BY enrolled_at DESC`,
      [user_id]
    );

    const progressList = await Promise.all(
      enrollments.map(async (enrollment) => {
        const completedQuestions = await query<{ question_id: string }>(
          `SELECT question_id
           FROM user_question_progress
           WHERE user_id = $1 AND path_id = $2 AND status = 'completed'`,
          [user_id, enrollment.path_id]
        );

        return {
          id: enrollment.id,
          user_id: enrollment.user_id,
          path_id: enrollment.path_id,
          completed_questions: completedQuestions.map(q => q.question_id),
          progress_percentage: enrollment.completion_percentage,
          enrolled_at: enrollment.enrolled_at,
          last_activity: enrollment.enrolled_at,
          completed_at: enrollment.completion_percentage === 100 ? enrollment.enrolled_at : undefined,
        };
      })
    );

    return progressList;
  } catch (error) {
    console.error('Get user enrolled paths error:', error);
    return [];
  }
}

export async function getPathStats(): Promise<PathStats> {
  try {
    const stats = await queryOne<{
      total_paths: string;
      beginner_count: string;
      intermediate_count: string;
      advanced_count: string;
    }>(
      `SELECT
         COUNT(*) as total_paths,
         COUNT(CASE WHEN difficulty = 'Beginner' THEN 1 END) as beginner_count,
         COUNT(CASE WHEN difficulty = 'Intermediate' THEN 1 END) as intermediate_count,
         COUNT(CASE WHEN difficulty = 'Advanced' THEN 1 END) as advanced_count
       FROM learning_paths`
    );

    const mostPopular = await query<Path>(
      `SELECT lp.* FROM learning_paths lp
       WHERE lp.is_public = true
       ORDER BY (
         SELECT COUNT(*) FROM user_path_enrollments upe
         WHERE upe.path_id = lp.id
       ) DESC
       LIMIT 5`
    );

    const recentlyCreated = await query<Path>(
      `SELECT * FROM learning_paths
       WHERE is_public = true
       ORDER BY created_at DESC
       LIMIT 5`
    );

    return {
      total_paths: parseInt(stats?.total_paths || '0'),
      beginner_count: parseInt(stats?.beginner_count || '0'),
      intermediate_count: parseInt(stats?.intermediate_count || '0'),
      advanced_count: parseInt(stats?.advanced_count || '0'),
      most_popular: mostPopular,
      recently_created: recentlyCreated,
    };
  } catch (error) {
    console.error('Get path stats error:', error);
    return {
      total_paths: 0,
      beginner_count: 0,
      intermediate_count: 0,
      advanced_count: 0,
      most_popular: [],
      recently_created: [],
    };
  }
}

export async function addQuestionToPath(path_id: string, question_id: string): Promise<Path | null> {
  try {
    // Get the current max order_index
    const maxOrder = await queryOne<{ max_order: number }>(
      'SELECT COALESCE(MAX(order_index), -1) as max_order FROM path_questions WHERE path_id = $1',
      [path_id]
    );

    const newOrder = (maxOrder?.max_order ?? -1) + 1;

    // Insert the question
    await query(
      'INSERT INTO path_questions (path_id, question_id, order_index) VALUES ($1, $2, $3)',
      [path_id, question_id, newOrder]
    );

    return await findPathById(path_id);
  } catch (error) {
    console.error('Add question to path error:', error);
    return null;
  }
}

export async function removeQuestionFromPath(path_id: string, question_id: string): Promise<Path | null> {
  try {
    await query(
      'DELETE FROM path_questions WHERE path_id = $1 AND question_id = $2',
      [path_id, question_id]
    );

    return await findPathById(path_id);
  } catch (error) {
    console.error('Remove question from path error:', error);
    return null;
  }
}
