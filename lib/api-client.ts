// Client-side API utilities

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function fetchUserProfile(): Promise<ApiResponse<any>> {
  try {
    // In a real app, this would use the actual auth token from localStorage/cookies
    const mockToken = 'mock-jwt-token';

    const response = await fetch('/api/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${mockToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function fetchQuestionStats(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch('/api/questions/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching question stats:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}