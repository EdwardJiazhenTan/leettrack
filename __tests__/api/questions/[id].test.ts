import { GET, PUT, DELETE } from '../../../app/api/questions/[id]/route';
import {
  mockQuestion,
  mockCustomQuestion,
  mockUpdateQuestionRequest,
  mockToken
} from '../../mocks/questions';

// Mock the modules
jest.mock('../../../lib/auth');
jest.mock('../../../lib/questions');

import { getUserFromRequest } from '../../../lib/auth';
import {
  findQuestionById,
  updateQuestion,
  deleteQuestion,
  checkSlugExists
} from '../../../lib/questions';

const mockedGetUserFromRequest = getUserFromRequest as jest.MockedFunction<typeof getUserFromRequest>;
const mockedFindQuestionById = findQuestionById as jest.MockedFunction<typeof findQuestionById>;
const mockedUpdateQuestion = updateQuestion as jest.MockedFunction<typeof updateQuestion>;
const mockedDeleteQuestion = deleteQuestion as jest.MockedFunction<typeof deleteQuestion>;
const mockedCheckSlugExists = checkSlugExists as jest.MockedFunction<typeof checkSlugExists>;

describe('/api/questions/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return question by ID successfully', async () => {
      // Arrange
      mockedFindQuestionById.mockReturnValue(mockQuestion);

      const request = new Request('http://localhost:3000/api/questions/question_123');
      const params = { params: { id: 'question_123' } };

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockQuestion);
      expect(mockedFindQuestionById).toHaveBeenCalledWith('question_123');
    });

    it('should return 400 error when ID is missing', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/questions/');
      const params = { params: { id: '' } };

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('Question ID is required');
    });

    it('should return 404 error when question not found', async () => {
      // Arrange
      mockedFindQuestionById.mockReturnValue(null);

      const request = new Request('http://localhost:3000/api/questions/nonexistent');
      const params = { params: { id: 'nonexistent' } };

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('Question not found');
    });

    it('should return 500 error when an exception occurs', async () => {
      // Arrange
      mockedFindQuestionById.mockImplementation(() => {
        throw new Error('Database error');
      });

      const request = new Request('http://localhost:3000/api/questions/question_123');
      const params = { params: { id: 'question_123' } };

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('An error occurred while fetching the question');
    });
  });

  describe('PUT', () => {
    it('should update custom question successfully', async () => {
      // Arrange
      const updatedQuestion = {
        ...mockCustomQuestion,
        ...mockUpdateQuestionRequest,
        updated_at: '2025-01-15T11:00:00.000Z'
      };

      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindQuestionById.mockReturnValue(mockCustomQuestion);
      mockedCheckSlugExists.mockReturnValue(false);
      mockedUpdateQuestion.mockReturnValue(updatedQuestion);

      const request = new Request('http://localhost:3000/api/questions/question_456', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mockToken
        },
        body: JSON.stringify(mockUpdateQuestionRequest),
      });
      const params = { params: { id: 'question_456' } };

      // Act
      const response = await PUT(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(updatedQuestion);
      expect(mockedUpdateQuestion).toHaveBeenCalledWith('question_456', mockUpdateQuestionRequest);
    });

    it('should return 401 error when not authenticated', async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue(null);

      const request = new Request('http://localhost:3000/api/questions/question_456', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockUpdateQuestionRequest),
      });
      const params = { params: { id: 'question_456' } };

      // Act
      const response = await PUT(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('Authentication required');
    });

    it('should return 404 error when question not found', async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindQuestionById.mockReturnValue(null);

      const request = new Request('http://localhost:3000/api/questions/nonexistent', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mockToken
        },
        body: JSON.stringify(mockUpdateQuestionRequest),
      });
      const params = { params: { id: 'nonexistent' } };

      // Act
      const response = await PUT(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('Question not found');
    });

    it('should return 403 error when user does not own custom question', async () => {
      // Arrange
      const questionByOtherUser = {
        ...mockCustomQuestion,
        created_by: 'other_user'
      };

      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindQuestionById.mockReturnValue(questionByOtherUser);

      const request = new Request('http://localhost:3000/api/questions/question_456', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mockToken
        },
        body: JSON.stringify(mockUpdateQuestionRequest),
      });
      const params = { params: { id: 'question_456' } };

      // Act
      const response = await PUT(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(403);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('You can only edit questions you created');
    });

    it('should allow updating non-custom questions', async () => {
      // Arrange
      const updatedQuestion = {
        ...mockQuestion,
        ...mockUpdateQuestionRequest,
        updated_at: '2025-01-15T11:00:00.000Z'
      };

      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindQuestionById.mockReturnValue(mockQuestion);
      mockedUpdateQuestion.mockReturnValue(updatedQuestion);

      const request = new Request('http://localhost:3000/api/questions/question_123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mockToken
        },
        body: JSON.stringify(mockUpdateQuestionRequest),
      });
      const params = { params: { id: 'question_123' } };

      // Act
      const response = await PUT(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(updatedQuestion);
    });

    it('should return 400 error for invalid difficulty', async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindQuestionById.mockReturnValue(mockCustomQuestion);

      const invalidUpdate = {
        difficulty: 'Invalid'
      };

      const request = new Request('http://localhost:3000/api/questions/question_456', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mockToken
        },
        body: JSON.stringify(invalidUpdate),
      });
      const params = { params: { id: 'question_456' } };

      // Act
      const response = await PUT(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('Difficulty must be Easy, Medium, or Hard');
    });

    it('should return 400 error for invalid slug format', async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindQuestionById.mockReturnValue(mockCustomQuestion);

      const invalidUpdate = {
        slug: 'Invalid Slug!'
      };

      const request = new Request('http://localhost:3000/api/questions/question_456', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mockToken
        },
        body: JSON.stringify(invalidUpdate),
      });
      const params = { params: { id: 'question_456' } };

      // Act
      const response = await PUT(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('Slug must contain only lowercase letters, numbers, and hyphens');
    });

    it('should return 409 error when slug already exists', async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindQuestionById.mockReturnValue(mockCustomQuestion);
      mockedCheckSlugExists.mockReturnValue(true);

      const updateWithExistingSlug = {
        slug: 'existing-slug'
      };

      const request = new Request('http://localhost:3000/api/questions/question_456', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mockToken
        },
        body: JSON.stringify(updateWithExistingSlug),
      });
      const params = { params: { id: 'question_456' } };

      // Act
      const response = await PUT(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(409);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('A question with this slug already exists');
    });

    it('should return 400 error when tags is not an array', async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindQuestionById.mockReturnValue(mockCustomQuestion);

      const invalidUpdate = {
        tags: 'not-an-array'
      };

      const request = new Request('http://localhost:3000/api/questions/question_456', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mockToken
        },
        body: JSON.stringify(invalidUpdate),
      });
      const params = { params: { id: 'question_456' } };

      // Act
      const response = await PUT(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('Tags must be an array');
    });
  });

  describe('DELETE', () => {
    it('should delete custom question successfully', async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindQuestionById.mockReturnValue(mockCustomQuestion);
      mockedDeleteQuestion.mockReturnValue(true);

      const request = new Request('http://localhost:3000/api/questions/question_456', {
        method: 'DELETE',
        headers: { 'Authorization': mockToken },
      });
      const params = { params: { id: 'question_456' } };

      // Act
      const response = await DELETE(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.message).toBe('Question deleted successfully');
      expect(mockedDeleteQuestion).toHaveBeenCalledWith('question_456');
    });

    it('should return 401 error when not authenticated', async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue(null);

      const request = new Request('http://localhost:3000/api/questions/question_456', {
        method: 'DELETE',
      });
      const params = { params: { id: 'question_456' } };

      // Act
      const response = await DELETE(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('Authentication required');
    });

    it('should return 404 error when question not found', async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindQuestionById.mockReturnValue(null);

      const request = new Request('http://localhost:3000/api/questions/nonexistent', {
        method: 'DELETE',
        headers: { 'Authorization': mockToken },
      });
      const params = { params: { id: 'nonexistent' } };

      // Act
      const response = await DELETE(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('Question not found');
    });

    it('should return 403 error when user does not own custom question', async () => {
      // Arrange
      const questionByOtherUser = {
        ...mockCustomQuestion,
        created_by: 'other_user'
      };

      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindQuestionById.mockReturnValue(questionByOtherUser);

      const request = new Request('http://localhost:3000/api/questions/question_456', {
        method: 'DELETE',
        headers: { 'Authorization': mockToken },
      });
      const params = { params: { id: 'question_456' } };

      // Act
      const response = await DELETE(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(403);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('You can only delete questions you created');
    });

    it('should return 500 error when delete fails', async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindQuestionById.mockReturnValue(mockCustomQuestion);
      mockedDeleteQuestion.mockReturnValue(false);

      const request = new Request('http://localhost:3000/api/questions/question_456', {
        method: 'DELETE',
        headers: { 'Authorization': mockToken },
      });
      const params = { params: { id: 'question_456' } };

      // Act
      const response = await DELETE(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('Failed to delete question');
    });
  });
});