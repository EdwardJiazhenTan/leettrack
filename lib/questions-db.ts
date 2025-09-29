import { query, queryOne } from './database';
import type { Question, CreateQuestionRequest, UpdateQuestionRequest, QuestionSearchParams, QuestionListResponse, QuestionStats } from '../types/question';

export async function createQuestion(questionData: CreateQuestionRequest, created_by?: string): Promise<Question> {
  const questionResult = await queryOne<Question>(`
    INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `, [
    questionData.leetcode_id || null,
    questionData.title,
    questionData.slug,
    questionData.difficulty,
    questionData.description || null,
    questionData.url || null,
    !questionData.leetcode_id,
    created_by || null
  ]);

  if (!questionResult) {
    throw new Error('Failed to create question');
  }

  // Insert tags
  if (questionData.tags && questionData.tags.length > 0) {
    for (const tag of questionData.tags) {
      await query(`
        INSERT INTO question_tags (question_id, tag)
        VALUES ($1, $2)
        ON CONFLICT (question_id, tag) DO NOTHING
      `, [questionResult.id, tag]);
    }
  }

  // Fetch the complete question with tags
  return await findQuestionById(questionResult.id) || questionResult;
}

export async function findQuestionById(id: string): Promise<Question | null> {
  const question = await queryOne<Question>(`
    SELECT * FROM questions WHERE id = $1
  `, [id]);

  if (!question) {
    return null;
  }

  // Get tags
  const tags = await query<{tag: string}>(`
    SELECT tag FROM question_tags WHERE question_id = $1
  `, [id]);

  return {
    ...question,
    tags: tags.map(t => t.tag)
  };
}

export async function findQuestionBySlug(slug: string): Promise<Question | null> {
  const question = await queryOne<Question>(`
    SELECT * FROM questions WHERE slug = $1
  `, [slug]);

  if (!question) {
    return null;
  }

  // Get tags
  const tags = await query<{tag: string}>(`
    SELECT tag FROM question_tags WHERE question_id = $1
  `, [question.id]);

  return {
    ...question,
    tags: tags.map(t => t.tag)
  };
}

export async function findQuestionByLeetCodeId(leetcode_id: string): Promise<Question | null> {
  const question = await queryOne<Question>(`
    SELECT * FROM questions WHERE leetcode_id = $1
  `, [leetcode_id]);

  if (!question) {
    return null;
  }

  // Get tags
  const tags = await query<{tag: string}>(`
    SELECT tag FROM question_tags WHERE question_id = $1
  `, [question.id]);

  return {
    ...question,
    tags: tags.map(t => t.tag)
  };
}

export async function updateQuestion(id: string, updates: UpdateQuestionRequest): Promise<Question | null> {
  const question = await queryOne<Question>(`
    UPDATE questions
    SET title = COALESCE($2, title),
        slug = COALESCE($3, slug),
        difficulty = COALESCE($4, difficulty),
        description = COALESCE($5, description),
        url = COALESCE($6, url),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `, [
    id,
    updates.title || null,
    updates.slug || null,
    updates.difficulty || null,
    updates.description || null,
    updates.url || null
  ]);

  if (!question) {
    return null;
  }

  // Update tags if provided
  if (updates.tags) {
    // Delete existing tags
    await query(`DELETE FROM question_tags WHERE question_id = $1`, [id]);

    // Insert new tags
    for (const tag of updates.tags) {
      await query(`
        INSERT INTO question_tags (question_id, tag)
        VALUES ($1, $2)
      `, [id, tag]);
    }
  }

  return await findQuestionById(id);
}

export async function deleteQuestion(id: string): Promise<boolean> {
  const result = await query(`DELETE FROM questions WHERE id = $1`, [id]);
  return result.length === 0; // PostgreSQL returns empty array for successful DELETE
}

export async function searchQuestions(params: QuestionSearchParams): Promise<QuestionListResponse> {
  let whereConditions: string[] = [];
  let queryParams: any[] = [];
  let paramCount = 0;

  // Build WHERE conditions
  if (params.query) {
    paramCount++;
    whereConditions.push(`(
      q.title ILIKE $${paramCount} OR
      q.description ILIKE $${paramCount} OR
      EXISTS (SELECT 1 FROM question_tags qt WHERE qt.question_id = q.id AND qt.tag ILIKE $${paramCount})
    )`);
    queryParams.push(`%${params.query}%`);
  }

  if (params.difficulty) {
    paramCount++;
    whereConditions.push(`q.difficulty = $${paramCount}`);
    queryParams.push(params.difficulty);
  }

  if (params.tags && params.tags.length > 0) {
    paramCount++;
    whereConditions.push(`EXISTS (
      SELECT 1 FROM question_tags qt
      WHERE qt.question_id = q.id AND qt.tag = ANY($${paramCount})
    )`);
    queryParams.push(params.tags);
  }

  if (params.is_custom !== undefined) {
    paramCount++;
    whereConditions.push(`q.is_custom = $${paramCount}`);
    queryParams.push(params.is_custom);
  }

  if (params.created_by) {
    paramCount++;
    whereConditions.push(`q.created_by = $${paramCount}`);
    queryParams.push(params.created_by);
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // Build ORDER BY
  const sortBy = params.sort_by || 'created_at';
  const sortOrder = params.sort_order || 'desc';
  let orderBy = '';

  if (sortBy === 'difficulty') {
    orderBy = `ORDER BY CASE
      WHEN q.difficulty = 'Easy' THEN 1
      WHEN q.difficulty = 'Medium' THEN 2
      WHEN q.difficulty = 'Hard' THEN 3
      ELSE 4 END ${sortOrder.toUpperCase()}`;
  } else {
    orderBy = `ORDER BY q.${sortBy} ${sortOrder.toUpperCase()}`;
  }

  // Get total count
  const totalResult = await queryOne<{count: string}>(`
    SELECT COUNT(*) as count FROM questions q ${whereClause}
  `, queryParams);

  const total = parseInt(totalResult?.count || '0');

  // Get paginated results
  const limit = params.limit || 20;
  const offset = params.offset || 0;

  paramCount += 2;
  const questions = await query<Question>(`
    SELECT q.* FROM questions q
    ${whereClause}
    ${orderBy}
    LIMIT $${paramCount - 1} OFFSET $${paramCount}
  `, [...queryParams, limit, offset]);

  // Get tags for each question
  const questionsWithTags = await Promise.all(
    questions.map(async (question) => {
      const tags = await query<{tag: string}>(`
        SELECT tag FROM question_tags WHERE question_id = $1
      `, [question.id]);

      return {
        ...question,
        tags: tags.map(t => t.tag)
      };
    })
  );

  return {
    questions: questionsWithTags,
    total,
    limit,
    offset,
    has_more: offset + limit < total,
  };
}

export async function getQuestionStats(): Promise<QuestionStats> {
  const stats = await queryOne<{
    total_questions: string;
    easy_count: string;
    medium_count: string;
    hard_count: string;
    custom_questions: string;
    leetcode_questions: string;
  }>(`
    SELECT
      COUNT(*) as total_questions,
      COUNT(*) FILTER (WHERE difficulty = 'Easy') as easy_count,
      COUNT(*) FILTER (WHERE difficulty = 'Medium') as medium_count,
      COUNT(*) FILTER (WHERE difficulty = 'Hard') as hard_count,
      COUNT(*) FILTER (WHERE is_custom = TRUE) as custom_questions,
      COUNT(*) FILTER (WHERE is_custom = FALSE) as leetcode_questions
    FROM questions
  `);

  const popularTags = await query<{tag: string; count: string}>(`
    SELECT tag, COUNT(*) as count
    FROM question_tags
    GROUP BY tag
    ORDER BY COUNT(*) DESC
    LIMIT 10
  `);

  return {
    total_questions: parseInt(stats?.total_questions || '0'),
    easy_count: parseInt(stats?.easy_count || '0'),
    medium_count: parseInt(stats?.medium_count || '0'),
    hard_count: parseInt(stats?.hard_count || '0'),
    custom_questions: parseInt(stats?.custom_questions || '0'),
    leetcode_questions: parseInt(stats?.leetcode_questions || '0'),
    popular_tags: popularTags.map(t => ({
      tag: t.tag,
      count: parseInt(t.count)
    }))
  };
}

export async function checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
  let query_str = 'SELECT COUNT(*) as count FROM questions WHERE slug = $1';
  let params: any[] = [slug];

  if (excludeId) {
    query_str += ' AND id != $2';
    params.push(excludeId);
  }

  const result = await queryOne<{count: string}>(query_str, params);
  return parseInt(result?.count || '0') > 0;
}

export async function getAllQuestions(): Promise<Question[]> {
  const questions = await query<Question>('SELECT * FROM questions ORDER BY created_at DESC');

  // Get tags for each question
  const questionsWithTags = await Promise.all(
    questions.map(async (question) => {
      const tags = await query<{tag: string}>(`
        SELECT tag FROM question_tags WHERE question_id = $1
      `, [question.id]);

      return {
        ...question,
        tags: tags.map(t => t.tag)
      };
    })
  );

  return questionsWithTags;
}
