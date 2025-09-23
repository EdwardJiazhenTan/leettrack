import { GET } from '../../../../app/api/leetcode/question/[slug]/route';
import {
  mockQuestionDetails,
  mockLeetCodeError,
  mockGetQuestionBySlug
} from '../../../mocks/leetcode-client';

// Mock the leetcode-client module
jest.mock('../../../../lib/leetcode-client');

import { getQuestionBySlug } from '../../../../lib/leetcode-client';
const mockedGetQuestionBySlug = getQuestionBySlug as jest.MockedFunction<typeof getQuestionBySlug>;

describe('/api/leetcode/question/[slug]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return question details when API call succeeds', async () => {
      // Arrange
      const slug = 'two-sum';
      const request = new Request('http://localhost:3000/api/leetcode/question/two-sum');
      const params = { params: { slug } };

      mockedGetQuestionBySlug.mockResolvedValue(mockQuestionDetails);

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockQuestionDetails);
      expect(mockedGetQuestionBySlug).toHaveBeenCalledWith(slug);
      expect(mockedGetQuestionBySlug).toHaveBeenCalledTimes(1);
    });

    it('should return 400 error when slug is missing', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/leetcode/question/');
      const params = { params: { slug: '' } };

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        status: 'error',
        message: 'Question slug is required'
      });
      expect(mockedGetQuestionBySlug).not.toHaveBeenCalled();
    });

    it('should return error response when LeetCode API returns an error', async () => {
      // Arrange
      const slug = 'non-existent-question';
      const request = new Request('http://localhost:3000/api/leetcode/question/non-existent-question');
      const params = { params: { slug } };

      const errorResponse = {
        error: 'Question not found',
        details: `No question found with slug: ${slug}`
      };

      mockedGetQuestionBySlug.mockResolvedValue(errorResponse);

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        status: 'error',
        message: errorResponse.error,
        details: errorResponse.details
      });
      expect(mockedGetQuestionBySlug).toHaveBeenCalledWith(slug);
      expect(mockedGetQuestionBySlug).toHaveBeenCalledTimes(1);
    });

    it('should return error response when an exception is thrown', async () => {
      // Arrange
      const slug = 'two-sum';
      const request = new Request('http://localhost:3000/api/leetcode/question/two-sum');
      const params = { params: { slug } };
      const errorMessage = 'Network connection failed';

      mockedGetQuestionBySlug.mockRejectedValue(new Error(errorMessage));

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        status: 'error',
        message: 'An error occurred while fetching the question',
        details: errorMessage
      });
      expect(mockedGetQuestionBySlug).toHaveBeenCalledWith(slug);
      expect(mockedGetQuestionBySlug).toHaveBeenCalledTimes(1);
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      const slug = 'two-sum';
      const request = new Request('http://localhost:3000/api/leetcode/question/two-sum');
      const params = { params: { slug } };

      mockedGetQuestionBySlug.mockRejectedValue('String error');

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        status: 'error',
        message: 'An error occurred while fetching the question',
        details: 'Unknown error'
      });
    });

    it('should handle various valid slugs', async () => {
      // Arrange
      const testCases = [
        'two-sum',
        'reverse-linked-list',
        'longest-substring-without-repeating-characters'
      ];

      for (const slug of testCases) {
        const request = new Request(`http://localhost:3000/api/leetcode/question/${slug}`);
        const params = { params: { slug } };

        mockedGetQuestionBySlug.mockResolvedValue(mockQuestionDetails);

        // Act
        const response = await GET(request, params);

        // Assert
        expect(response.status).toBe(200);
        expect(mockedGetQuestionBySlug).toHaveBeenCalledWith(slug);

        // Reset for next iteration
        jest.clearAllMocks();
      }
    });
  });
});