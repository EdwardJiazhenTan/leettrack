import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  user_id: string;
  username: string;
  leetcode_username?: string;
  email?: string;
}

interface Options {
  redirectIfNotAuth?: boolean | string;
  redirectIfAuth?: boolean | string;
}

export function useAuth(options?: Options) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [])

  const handleRedirect = (redirectOption: boolean | string | undefined, defaultPath: string) => {
    if (redirectOption) {
      const redirectTo = typeof redirectOption === 'string'
        ? redirectOption
        : defaultPath;
      router.push(redirectTo);
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        handleRedirect(options?.redirectIfNotAuth, "/auth/login");
        return;
      }

      // verify token by fetching user info
      const response = await fetch("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsAuthenticated(true);
          setUser(data.user);
          handleRedirect(options?.redirectIfAuth, "/today");
        } else {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
          handleRedirect(options?.redirectIfNotAuth, "/auth/login");
        }
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
        handleRedirect(options?.redirectIfNotAuth, "/auth/login");
      }
    } catch (error) {
      // TODO: ridirect to error page
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/auth/login");
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    checkAuth,
    logout,
  }
}
