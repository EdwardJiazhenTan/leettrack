import { POST } from "../../../app/api/auth/login/route";
import { mockLoginRequest } from "../../mocks/auth";

// Mock the auth module
jest.mock("../../../lib/auth");

import {
  findUserByEmail,
  verifyPassword,
  createSession,
} from "../../../lib/auth";

const mockedFindUserByEmail = findUserByEmail as jest.MockedFunction<
  typeof findUserByEmail
>;
const mockedVerifyPassword = verifyPassword as jest.MockedFunction<
  typeof verifyPassword
>;
const mockedCreateSession = createSession as jest.MockedFunction<
  typeof createSession
>;

describe("/api/auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST", () => {
    it("should login user successfully with valid credentials", async () => {
      // Arrange
      const mockUserWithPassword = {
        user_id: "user_123",
        email: "test@example.com",
        username: "testuser",
        password_hash: "hashed_password",
        leetcode_username: "leetcode_user",
        created_at: "2025-01-15T10:00:00.000Z",
        updated_at: "2025-01-15T10:00:00.000Z",
      };

      mockedFindUserByEmail.mockReturnValue(mockUserWithPassword);
      mockedVerifyPassword.mockResolvedValue(true);
      mockedCreateSession.mockReturnValue("mock_token_123");

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockLoginRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.user).toEqual({
        user_id: mockUserWithPassword.user_id,
        email: mockUserWithPassword.email,
        username: mockUserWithPassword.username,
        leetcode_username: mockUserWithPassword.leetcode_username,
        created_at: mockUserWithPassword.created_at,
        updated_at: mockUserWithPassword.updated_at,
      });
      expect(responseData.token).toBe("mock_token_123");
      expect(responseData.message).toBe("Login successful");

      expect(mockedFindUserByEmail).toHaveBeenCalledWith(
        mockLoginRequest.email,
      );
      expect(mockedVerifyPassword).toHaveBeenCalledWith(
        mockLoginRequest.password,
        mockUserWithPassword.password_hash,
      );
      expect(mockedCreateSession).toHaveBeenCalledWith(
        mockUserWithPassword.user_id,
        mockUserWithPassword.email,
      );
    });

    it("should return 400 error when required fields are missing", async () => {
      // Arrange
      const incompleteRequest = {
        email: "test@example.com",
        // missing password
      };

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incompleteRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Email and password are required");
    });

    it("should return 401 error when user does not exist", async () => {
      // Arrange
      mockedFindUserByEmail.mockReturnValue(null);

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockLoginRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Invalid email or password");
      expect(mockedFindUserByEmail).toHaveBeenCalledWith(
        mockLoginRequest.email,
      );
    });

    it("should return 401 error when password is invalid", async () => {
      // Arrange
      const mockUserWithPassword = {
        user_id: "user_123",
        email: "test@example.com",
        username: "testuser",
        password_hash: "hashed_password",
        leetcode_username: "leetcode_user",
        created_at: "2025-01-15T10:00:00.000Z",
        updated_at: "2025-01-15T10:00:00.000Z",
      };

      mockedFindUserByEmail.mockReturnValue(mockUserWithPassword);
      mockedVerifyPassword.mockResolvedValue(false);

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockLoginRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Invalid email or password");
      expect(mockedVerifyPassword).toHaveBeenCalledWith(
        mockLoginRequest.password,
        mockUserWithPassword.password_hash,
      );
    });

    it("should return 500 error when an exception occurs", async () => {
      // Arrange
      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid json",
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("An error occurred during login");
    });
  });
});
