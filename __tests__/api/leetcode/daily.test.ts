import { NextRequest } from 'next/server';
import { GET } from '../../../app/api/leetcode/daily/route';
import {
  mockDailyProblemResponse,
  mockLeetCodeError,
  mockGetDailyProblem
} from '../../mocks/leetcode-client';

// Mock the leetcode-client module
jest.mock('../../../lib/leetcode-client');

import { getDailyProblem } from '../../../lib/leetcode-client';
const mockedGetDailyProblem = getDailyProblem as jest.MockedFunction<typeof getDailyProblem>;

describe('/api/leetcode/daily', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return daily problem data when API call succeeds', async () => {
      // Arrange
      mockedGetDailyProblem.mockResolvedValue(mockDailyProblemResponse);

      // Act
      const response = await GET();
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockDailyProblemResponse);
      expect(mockedGetDailyProblem).toHaveBeenCalledTimes(1);
    });

    it('should return error response when LeetCode API returns an error', async () => {
      // Arrange
      mockedGetDailyProblem.mockResolvedValue(mockLeetCodeError);

      // Act
      const response = await GET();
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        status: 'error',
        message: mockLeetCodeError.error,
        details: mockLeetCodeError.details
      });
      expect(mockedGetDailyProblem).toHaveBeenCalledTimes(1);
    });

    it('should return error response when an exception is thrown', async () => {
      // Arrange
      const errorMessage = 'Network connection failed';
      mockedGetDailyProblem.mockRejectedValue(new Error(errorMessage));

      // Act
      const response = await GET();
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        status: 'error',
        message: 'an error occured while fetching daily questions',
        details: errorMessage
      });
      expect(mockedGetDailyProblem).toHaveBeenCalledTimes(1);
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      mockedGetDailyProblem.mockRejectedValue('String error');

      // Act
      const response = await GET();
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        status: 'error',
        message: 'an error occured while fetching daily questions',
        details: 'Unknown error'
      });
    });
  });
});