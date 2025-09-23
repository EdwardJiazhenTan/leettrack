import { GET } from '../../../../app/api/leetcode/user/[username]/route';
import {
  mockUserProfileResponse,
  mockLeetCodeError,
  mockGetUserProfile
} from '../../../mocks/leetcode-client';

// Mock the leetcode-client module
jest.mock('../../../../lib/leetcode-client');

import { getUserProfile } from '../../../../lib/leetcode-client';
const mockedGetUserProfile = getUserProfile as jest.MockedFunction<typeof getUserProfile>;

describe('/api/leetcode/user/[username]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return user profile when API call succeeds', async () => {
      // Arrange
      const username = 'testuser';
      const request = new Request('http://localhost:3000/api/leetcode/user/testuser');
      const params = { params: { username } };

      mockedGetUserProfile.mockResolvedValue(mockUserProfileResponse);

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockUserProfileResponse);
      expect(mockedGetUserProfile).toHaveBeenCalledWith(username);
      expect(mockedGetUserProfile).toHaveBeenCalledTimes(1);
    });

    it('should return 400 error when username is missing', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/leetcode/user/');
      const params = { params: { username: '' } };

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        status: 'error',
        message: 'Username is required'
      });
      expect(mockedGetUserProfile).not.toHaveBeenCalled();
    });

    it('should return 404 error when user is not found', async () => {
      // Arrange
      const username = 'nonexistentuser';
      const request = new Request('http://localhost:3000/api/leetcode/user/nonexistentuser');
      const params = { params: { username } };

      const userNotFoundError = {
        error: 'User not found',
        details: `No user found with username: ${username}`
      };

      mockedGetUserProfile.mockResolvedValue(userNotFoundError);

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(responseData).toEqual({
        status: 'error',
        message: userNotFoundError.error,
        details: userNotFoundError.details
      });
      expect(mockedGetUserProfile).toHaveBeenCalledWith(username);
      expect(mockedGetUserProfile).toHaveBeenCalledTimes(1);
    });

    it('should return 500 error for other LeetCode API errors', async () => {
      // Arrange
      const username = 'testuser';
      const request = new Request('http://localhost:3000/api/leetcode/user/testuser');
      const params = { params: { username } };

      const networkError = {
        error: 'Network error',
        details: 'Failed to connect to LeetCode API'
      };

      mockedGetUserProfile.mockResolvedValue(networkError);

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        status: 'error',
        message: networkError.error,
        details: networkError.details
      });
      expect(mockedGetUserProfile).toHaveBeenCalledWith(username);
      expect(mockedGetUserProfile).toHaveBeenCalledTimes(1);
    });

    it('should return error response when an exception is thrown', async () => {
      // Arrange
      const username = 'testuser';
      const request = new Request('http://localhost:3000/api/leetcode/user/testuser');
      const params = { params: { username } };
      const errorMessage = 'Network connection failed';

      mockedGetUserProfile.mockRejectedValue(new Error(errorMessage));

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        status: 'error',
        message: 'An error occurred while fetching user profile',
        details: errorMessage
      });
      expect(mockedGetUserProfile).toHaveBeenCalledWith(username);
      expect(mockedGetUserProfile).toHaveBeenCalledTimes(1);
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      const username = 'testuser';
      const request = new Request('http://localhost:3000/api/leetcode/user/testuser');
      const params = { params: { username } };

      mockedGetUserProfile.mockRejectedValue('String error');

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        status: 'error',
        message: 'An error occurred while fetching user profile',
        details: 'Unknown error'
      });
    });

    it('should handle various valid usernames', async () => {
      // Arrange
      const testUsernames = [
        'user123',
        'test_user',
        'coding-ninja',
        'LeetCodeUser2023'
      ];

      for (const username of testUsernames) {
        const request = new Request(`http://localhost:3000/api/leetcode/user/${username}`);
        const params = { params: { username } };

        mockedGetUserProfile.mockResolvedValue(mockUserProfileResponse);

        // Act
        const response = await GET(request, params);

        // Assert
        expect(response.status).toBe(200);
        expect(mockedGetUserProfile).toHaveBeenCalledWith(username);

        // Reset for next iteration
        jest.clearAllMocks();
      }
    });

    it('should handle usernames with special characters', async () => {
      // Arrange
      const username = 'user-with-dashes_and_underscores';
      const request = new Request(`http://localhost:3000/api/leetcode/user/${username}`);
      const params = { params: { username } };

      mockedGetUserProfile.mockResolvedValue(mockUserProfileResponse);

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockUserProfileResponse);
      expect(mockedGetUserProfile).toHaveBeenCalledWith(username);
    });

    it('should handle case-sensitive usernames correctly', async () => {
      // Arrange
      const username = 'TestUser';
      const request = new Request(`http://localhost:3000/api/leetcode/user/${username}`);
      const params = { params: { username } };

      mockedGetUserProfile.mockResolvedValue(mockUserProfileResponse);

      // Act
      const response = await GET(request, params);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockUserProfileResponse);
      expect(mockedGetUserProfile).toHaveBeenCalledWith(username);
    });
  });
});