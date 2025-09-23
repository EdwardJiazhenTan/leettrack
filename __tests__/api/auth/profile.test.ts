import { GET, PUT } from '../../../app/api/auth/profile/route';
import { mockToken, mockUser, mockUserProfile } from '../../mocks/auth';

// Mock the auth module
jest.mock('../../../lib/auth');

import {
  getUserFromRequest,
  findUserById,
  updateUser,
  checkUsernameExists,
  checkEmailExists
} from '../../../lib/auth';

const mockedGetUserFromRequest = getUserFromRequest as jest.MockedFunction<typeof getUserFromRequest>;
const mockedFindUserById = findUserById as jest.MockedFunction<typeof findUserById>;
const mockedUpdateUser = updateUser as jest.MockedFunction<typeof updateUser>;
const mockedCheckUsernameExists = checkUsernameExists as jest.MockedFunction<typeof checkUsernameExists>;
const mockedCheckEmailExists = checkEmailExists as jest.MockedFunction<typeof checkEmailExists>;

describe('/api/auth/profile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return user profile successfully', async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindUserById.mockReturnValue(mockUser);

      const request = new Request('http://localhost:3000/api/auth/profile', {
        method: 'GET',
        headers: { 'Authorization': mockToken },
      });

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.user).toEqual(mockUser);
      expect(responseData.stats).toEqual(mockUserProfile.stats);
      expect(mockedGetUserFromRequest).toHaveBeenCalledWith(request);
      expect(mockedFindUserById).toHaveBeenCalledWith('user_123');
    });

    it('should return 401 error when not authenticated', async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue(null);

      const request = new Request('http://localhost:3000/api/auth/profile', {
        method: 'GET',
      });

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('Authentication required');
    });

    it('should return 404 error when user not found', async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindUserById.mockReturnValue(null);

      const request = new Request('http://localhost:3000/api/auth/profile', {
        method: 'GET',
        headers: { 'Authorization': mockToken },
      });

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('User not found');
    });

    it('should return 500 error when an exception occurs', async () => {
      // Arrange
      mockedGetUserFromRequest.mockImplementation(() => {
        throw new Error('Auth error');
      });

      const request = new Request('http://localhost:3000/api/auth/profile', {
        method: 'GET',
        headers: { 'Authorization': mockToken },
      });

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('An error occurred while fetching profile');
    });
  });

  describe('PUT', () => {
    it('should update user profile successfully', async () => {
      // Arrange
      const updateData = {
        username: 'newusername',
        leetcode_username: 'new_leetcode_user'
      };

      const updatedUser = {
        ...mockUser,
        ...updateData,
        updated_at: '2025-01-15T11:00:00.000Z'
      };

      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindUserById.mockReturnValue(mockUser);
      mockedCheckUsernameExists.mockReturnValue(false);
      mockedUpdateUser.mockReturnValue(updatedUser);

      const request = new Request('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mockToken
        },
        body: JSON.stringify(updateData),
      });

      // Act
      const response = await PUT(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(updatedUser);
      expect(mockedUpdateUser).toHaveBeenCalledWith('user_123', updateData);
    });

    it('should return 401 error when not authenticated', async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue(null);

      const request = new Request('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'newusername' }),
      });

      // Act
      const response = await PUT(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('Authentication required');
    });

    it('should return 400 error for invalid email format', async () => {
      // Arrange
      const updateData = {
        email: 'invalid-email'
      };

      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindUserById.mockReturnValue(mockUser);

      const request = new Request('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mockToken
        },
        body: JSON.stringify(updateData),
      });

      // Act
      const response = await PUT(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('Invalid email format');
    });

    it('should return 409 error when email already exists', async () => {
      // Arrange
      const updateData = {
        email: 'existing@example.com'
      };

      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindUserById.mockReturnValue(mockUser);
      mockedCheckEmailExists.mockReturnValue(true);

      const request = new Request('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mockToken
        },
        body: JSON.stringify(updateData),
      });

      // Act
      const response = await PUT(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(409);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('Email already in use');
    });

    it('should return 409 error when username already exists', async () => {
      // Arrange
      const updateData = {
        username: 'existinguser'
      };

      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindUserById.mockReturnValue(mockUser);
      mockedCheckUsernameExists.mockReturnValue(true);

      const request = new Request('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mockToken
        },
        body: JSON.stringify(updateData),
      });

      // Act
      const response = await PUT(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(409);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('Username already taken');
    });

    it('should allow updating to same email/username', async () => {
      // Arrange
      const updateData = {
        email: mockUser.email,
        username: mockUser.username
      };

      const updatedUser = {
        ...mockUser,
        updated_at: '2025-01-15T11:00:00.000Z'
      };

      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindUserById.mockReturnValue(mockUser);
      mockedCheckEmailExists.mockReturnValue(true);
      mockedCheckUsernameExists.mockReturnValue(true);
      mockedUpdateUser.mockReturnValue(updatedUser);

      const request = new Request('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mockToken
        },
        body: JSON.stringify(updateData),
      });

      // Act
      const response = await PUT(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(updatedUser);
    });

    it('should return 500 error when update fails', async () => {
      // Arrange
      const updateData = {
        username: 'newusername'
      };

      mockedGetUserFromRequest.mockReturnValue('user_123');
      mockedFindUserById.mockReturnValue(mockUser);
      mockedCheckUsernameExists.mockReturnValue(false);
      mockedUpdateUser.mockReturnValue(null);

      const request = new Request('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mockToken
        },
        body: JSON.stringify(updateData),
      });

      // Act
      const response = await PUT(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('Failed to update user');
    });
  });
});