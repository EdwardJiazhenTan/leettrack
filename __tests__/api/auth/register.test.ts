import { POST } from '../../../app/api/auth/register/route';
import { clearMockData } from '../../../lib/auth';
import { mockCreateUserRequest } from '../../mocks/auth';

// Mock the auth module
jest.mock('../../../lib/auth');

import {
  createUser,
  checkEmailExists,
  checkUsernameExists,
  createSession
} from '../../../lib/auth';

const mockedCreateUser = createUser as jest.MockedFunction<typeof createUser>;
const mockedCheckEmailExists = checkEmailExists as jest.MockedFunction<typeof checkEmailExists>;
const mockedCheckUsernameExists = checkUsernameExists as jest.MockedFunction<typeof checkUsernameExists>;
const mockedCreateSession = createSession as jest.MockedFunction<typeof createSession>;

describe('/api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const mockUser = {
        user_id: 'user_123',
        email: mockCreateUserRequest.email,
        username: mockCreateUserRequest.username,
        leetcode_username: mockCreateUserRequest.leetcode_username,
        created_at: '2025-01-15T10:00:00.000Z',
        updated_at: '2025-01-15T10:00:00.000Z',
      };

      mockedCheckEmailExists.mockReturnValue(false);
      mockedCheckUsernameExists.mockReturnValue(false);
      mockedCreateUser.mockReturnValue(mockUser);
      mockedCreateSession.mockReturnValue('mock_token_123');

      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockCreateUserRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(responseData.success).toBe(true);
      expect(responseData.user).toEqual(mockUser);
      expect(responseData.token).toBe('mock_token_123');
      expect(responseData.message).toBe('User registered successfully');

      expect(mockedCheckEmailExists).toHaveBeenCalledWith(mockCreateUserRequest.email);
      expect(mockedCheckUsernameExists).toHaveBeenCalledWith(mockCreateUserRequest.username);
      expect(mockedCreateUser).toHaveBeenCalledWith(mockCreateUserRequest);
      expect(mockedCreateSession).toHaveBeenCalledWith(mockUser.user_id);
    });

    it('should return 400 error when required fields are missing', async () => {
      // Arrange
      const incompleteRequest = {
        email: 'test@example.com',
        // missing username and password
      };

      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incompleteRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Email, username, and password are required');
    });

    it('should return 400 error for invalid email format', async () => {
      // Arrange
      const invalidEmailRequest = {
        ...mockCreateUserRequest,
        email: 'invalid-email'
      };

      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidEmailRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Invalid email format');
    });

    it('should return 400 error for short password', async () => {
      // Arrange
      const shortPasswordRequest = {
        ...mockCreateUserRequest,
        password: '123'
      };

      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shortPasswordRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Password must be at least 6 characters long');
    });

    it('should return 409 error when email already exists', async () => {
      // Arrange
      mockedCheckEmailExists.mockReturnValue(true);

      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockCreateUserRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(409);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Email already registered');
      expect(mockedCheckEmailExists).toHaveBeenCalledWith(mockCreateUserRequest.email);
    });

    it('should return 409 error when username already exists', async () => {
      // Arrange
      mockedCheckEmailExists.mockReturnValue(false);
      mockedCheckUsernameExists.mockReturnValue(true);

      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockCreateUserRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(409);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Username already taken');
      expect(mockedCheckUsernameExists).toHaveBeenCalledWith(mockCreateUserRequest.username);
    });

    it('should return 500 error when an exception occurs', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('An error occurred during registration');
    });
  });
});