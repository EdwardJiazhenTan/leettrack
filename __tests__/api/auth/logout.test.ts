import { POST } from '../../../app/api/auth/logout/route';
import { mockToken } from '../../mocks/auth';

// Mock the auth module
jest.mock('../../../lib/auth');

import { destroySession } from '../../../lib/auth';

const mockedDestroySession = destroySession as jest.MockedFunction<typeof destroySession>;

describe('/api/auth/logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should logout user successfully with valid token', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mockToken
        },
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.message).toBe('Logout successful');
      expect(mockedDestroySession).toHaveBeenCalledWith('mock_token_123');
    });

    it('should return 401 error when authorization header is missing', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Authorization token required');
      expect(mockedDestroySession).not.toHaveBeenCalled();
    });

    it('should return 401 error when authorization header format is invalid', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'InvalidFormat token123'
        },
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Authorization token required');
      expect(mockedDestroySession).not.toHaveBeenCalled();
    });


    it('should return 500 error when an exception occurs', async () => {
      // Arrange
      mockedDestroySession.mockImplementation(() => {
        throw new Error('Session error');
      });

      const request = new Request('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mockToken
        },
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('An error occurred during logout');
    });
  });
});