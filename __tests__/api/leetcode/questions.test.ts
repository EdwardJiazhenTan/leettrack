import { GET } from '../../../app/api/leetcode/questions/route';
import {
  mockQuestionListResponse,
  mockLeetCodeError,
  mockGetQuestionsByTag
} from '../../mocks/leetcode-client';

// Mock the leetcode-client module
jest.mock('../../../lib/leetcode-client');

import { getQuestionsByTag } from '../../../lib/leetcode-client';
const mockedGetQuestionsByTag = getQuestionsByTag as jest.MockedFunction<typeof getQuestionsByTag>;

describe('/api/leetcode/questions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return questions list with default parameters', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/leetcode/questions');
      mockedGetQuestionsByTag.mockResolvedValue(mockQuestionListResponse);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockQuestionListResponse);
      expect(mockedGetQuestionsByTag).toHaveBeenCalledWith([], 20, 0, undefined);
      expect(mockedGetQuestionsByTag).toHaveBeenCalledTimes(1);
    });

    it('should return questions list with single tag', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/leetcode/questions?tags=array');
      mockedGetQuestionsByTag.mockResolvedValue(mockQuestionListResponse);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockQuestionListResponse);
      expect(mockedGetQuestionsByTag).toHaveBeenCalledWith(['array'], 20, 0, undefined);
      expect(mockedGetQuestionsByTag).toHaveBeenCalledTimes(1);
    });

    it('should return questions list with multiple tags', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/leetcode/questions?tags=array,hash-table,two-pointers');
      mockedGetQuestionsByTag.mockResolvedValue(mockQuestionListResponse);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockQuestionListResponse);
      expect(mockedGetQuestionsByTag).toHaveBeenCalledWith(['array', 'hash-table', 'two-pointers'], 20, 0, undefined);
      expect(mockedGetQuestionsByTag).toHaveBeenCalledTimes(1);
    });

    it('should return questions list with custom limit and skip', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/leetcode/questions?limit=50&skip=100');
      mockedGetQuestionsByTag.mockResolvedValue(mockQuestionListResponse);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockQuestionListResponse);
      expect(mockedGetQuestionsByTag).toHaveBeenCalledWith([], 50, 100, undefined);
      expect(mockedGetQuestionsByTag).toHaveBeenCalledTimes(1);
    });

    it('should return questions list with difficulty filter', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/leetcode/questions?difficulty=Easy&tags=array');
      mockedGetQuestionsByTag.mockResolvedValue(mockQuestionListResponse);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockQuestionListResponse);
      expect(mockedGetQuestionsByTag).toHaveBeenCalledWith(['array'], 20, 0, 'Easy');
      expect(mockedGetQuestionsByTag).toHaveBeenCalledTimes(1);
    });

    it('should return questions list with all parameters combined', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/leetcode/questions?tags=array,string&limit=25&skip=50&difficulty=Medium');
      mockedGetQuestionsByTag.mockResolvedValue(mockQuestionListResponse);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockQuestionListResponse);
      expect(mockedGetQuestionsByTag).toHaveBeenCalledWith(['array', 'string'], 25, 50, 'Medium');
      expect(mockedGetQuestionsByTag).toHaveBeenCalledTimes(1);
    });

    it('should return 400 error when limit exceeds maximum', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/leetcode/questions?limit=150');

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        status: 'error',
        message: 'Limit cannot exceed 100'
      });
      expect(mockedGetQuestionsByTag).not.toHaveBeenCalled();
    });

    it('should handle tags with spaces correctly', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/leetcode/questions?tags=hash table, dynamic programming');
      mockedGetQuestionsByTag.mockResolvedValue(mockQuestionListResponse);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(mockedGetQuestionsByTag).toHaveBeenCalledWith(['hash table', 'dynamic programming'], 20, 0, undefined);
    });

    it('should return error response when LeetCode API returns an error', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/leetcode/questions?tags=invalid-tag');
      mockedGetQuestionsByTag.mockResolvedValue(mockLeetCodeError);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        status: 'error',
        message: mockLeetCodeError.error,
        details: mockLeetCodeError.details
      });
      expect(mockedGetQuestionsByTag).toHaveBeenCalledTimes(1);
    });

    it('should return error response when an exception is thrown', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/leetcode/questions');
      const errorMessage = 'Network connection failed';
      mockedGetQuestionsByTag.mockRejectedValue(new Error(errorMessage));

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        status: 'error',
        message: 'An error occurred while fetching questions',
        details: errorMessage
      });
      expect(mockedGetQuestionsByTag).toHaveBeenCalledTimes(1);
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/leetcode/questions');
      mockedGetQuestionsByTag.mockRejectedValue('String error');

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        status: 'error',
        message: 'An error occurred while fetching questions',
        details: 'Unknown error'
      });
    });

    it('should handle edge cases for numeric parameters', async () => {
      // Arrange - invalid numeric parameters should be handled gracefully
      const request = new Request('http://localhost:3000/api/leetcode/questions?limit=abc&skip=def');
      mockedGetQuestionsByTag.mockResolvedValue(mockQuestionListResponse);

      // Act
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(200);
      // parseInt of invalid strings returns NaN
      expect(mockedGetQuestionsByTag).toHaveBeenCalledWith([], NaN, NaN, undefined);
    });
  });
});