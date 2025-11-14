import { renderHook, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/useAuth";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock fetch
global.fetch = jest.fn();

describe("useAuth Hook", () => {
  const mockPush = jest.fn();
  const mockToken = "mock_jwt_token";
  const mockUser = {
    user_id: "user_123",
    username: "testuser",
    email: "test@example.com",
    leetcode_username: "leetcode_user",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    mockedUseRouter.mockReturnValue({
      push: mockPush,
    } as any);
  });

  describe("Authentication Status Check", () => {
    it("should set isAuthenticated to true when valid token exists", async () => {
      // Arrange
      localStorageMock.setItem("token", mockToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: mockUser,
        }),
      });

      // Act
      const { result } = renderHook(() => useAuth());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });

    it("should set isAuthenticated to false when no token exists", async () => {
      // Arrange - no token in localStorage

      // Act
      const { result } = renderHook(() => useAuth());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it("should set isAuthenticated to false when token is invalid", async () => {
      // Arrange
      localStorageMock.setItem("token", "invalid_token");
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      // Act
      const { result } = renderHook(() => useAuth());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(localStorageMock.getItem("token")).toBeNull();
    });
  });

  describe("Redirect Options", () => {
    it("should redirect to /auth/login when redirectIfNotAuth is true and not authenticated", async () => {
      // Arrange - no token

      // Act
      renderHook(() => useAuth({ redirectIfNotAuth: true }));

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/auth/login");
      });
    });

    it("should redirect to custom path when redirectIfNotAuth is a string", async () => {
      // Arrange - no token

      // Act
      renderHook(() => useAuth({ redirectIfNotAuth: "/custom-login" }));

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/custom-login");
      });
    });

    it("should redirect to /today when redirectIfAuth is true and authenticated", async () => {
      // Arrange
      localStorageMock.setItem("token", mockToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: mockUser,
        }),
      });

      // Act
      renderHook(() => useAuth({ redirectIfAuth: true }));

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/today");
      });
    });

    it("should redirect to custom path when redirectIfAuth is a string", async () => {
      // Arrange
      localStorageMock.setItem("token", mockToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: mockUser,
        }),
      });

      // Act
      renderHook(() => useAuth({ redirectIfAuth: "/dashboard" }));

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("should NOT redirect when no redirect options are provided", async () => {
      // Arrange
      localStorageMock.setItem("token", mockToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: mockUser,
        }),
      });

      // Act
      renderHook(() => useAuth());

      // Assert
      await waitFor(() => {
        expect(mockPush).not.toHaveBeenCalled();
      });
    });
  });

  describe("Logout Function", () => {
    it("should clear token and redirect to login", async () => {
      // Arrange
      localStorageMock.setItem("token", mockToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: mockUser,
        }),
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      // Act
      result.current.logout();

      // Assert
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
        expect(localStorageMock.getItem("token")).toBeNull();
        expect(mockPush).toHaveBeenCalledWith("/auth/login");
      });
    });
  });

  describe("Loading State", () => {
    it("should start with isLoading true and set to false after check", async () => {
      // Arrange
      localStorageMock.setItem("token", mockToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: mockUser,
        }),
      });

      // Act
      const { result } = renderHook(() => useAuth());

      // Assert - initial state
      expect(result.current.isLoading).toBe(true);

      // Assert - after loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
