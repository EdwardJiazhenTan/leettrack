/**
 * API Service Tests - Critical for catching data structure mismatches
 */

import { fetchApi, learningPathsApi, leetcodeApi, authApi } from '../api'

// Mock fetch globally
global.fetch = jest.fn()

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Learning Paths API', () => {
    it('should parse learning paths response correctly', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          learning_paths: [
            {
              path_id: 1,
              name: 'Test Path',
              description: 'Test Description',
              difficulty_level: 'Intermediate',
              question_count: 10,
              estimated_hours: 20,
              tags: ['test'],
              source: 'System',
            },
          ],
        },
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await learningPathsApi.getPaths()
      
      expect(result.data).toEqual(mockResponse)
      expect(result.error).toBeNull()
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/v1/learning-paths?',
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })

    it('should handle API errors gracefully', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Internal Server Error' }),
      })

      const result = await learningPathsApi.getPaths()
      
      expect(result.data).toBeNull()
      expect(result.error).toBe('Internal Server Error')
      expect(result.status).toBe(500)
    })

    it('should handle network failures', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const result = await learningPathsApi.getPaths()
      
      expect(result.data).toBeNull()
      expect(result.error).toBe('Network error')
      expect(result.status).toBe(0)
    })
  })

  describe('LeetCode API', () => {
    it('should fetch daily question correctly', async () => {
      const mockDailyQuestion = {
        date: '2025-06-30',
        question: {
          title: 'Test Question',
          titleSlug: 'test-question',
          difficulty: 'Medium',
        },
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDailyQuestion),
      })

      const result = await leetcodeApi.getDailyQuestion()
      
      expect(result.data).toEqual(mockDailyQuestion)
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/v1/leetcode/daily',
        expect.objectContaining({
          method: 'GET',
        })
      )
    })
  })

  describe('Auth API', () => {
    it('should include authorization header for authenticated requests', async () => {
      // Mock localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => 'test-token'),
        },
      })

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { reviews: [] } }),
      })

      await authApi.getTodaysReviews()
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/v1/auth/user/reviews/today',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      )
    })

    it('should handle missing auth token', async () => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => null),
        },
      })

      const result = await authApi.getTodaysReviews()
      
      expect(result.data).toBeNull()
      expect(result.error).toBe('No access token found')
      expect(result.status).toBe(401)
    })
  })

  describe('URL Building', () => {
    it('should build API URLs correctly', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      })

      await fetchApi('/api/v1/test-endpoint')
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/v1/test-endpoint',
        expect.any(Object)
      )
    })

    it('should handle trailing slashes in base URL', async () => {
      // Test that our URL building logic handles various base URL formats
      const originalEnv = process.env.NEXT_PUBLIC_API_URL
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000/'

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      })

      // Dynamic import to get fresh config
      const { fetchApi: freshFetchApi } = await import('../api')
      await freshFetchApi('/api/v1/test')
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/v1/test',
        expect.any(Object)
      )

      process.env.NEXT_PUBLIC_API_URL = originalEnv
    })
  })
})