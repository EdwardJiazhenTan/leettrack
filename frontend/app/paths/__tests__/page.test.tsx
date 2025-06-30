/**
 * Learning Paths Page Tests - Would have caught the data structure mismatch
 */

import { render, screen, waitFor } from '@testing-library/react'
import PathsPage from '../page'

// Mock the API config
jest.mock('../../config/api', () => ({
  getApiUrl: (endpoint: string) => `http://localhost:5000${endpoint}`,
}))

// Mock fetch globally
global.fetch = jest.fn()

describe('PathsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display learning paths when API returns data', async () => {
    const mockApiResponse = {
      status: 'success',
      data: {
        learning_paths: [
          {
            path_id: 1,
            name: 'Test Learning Path',
            description: 'A test learning path',
            difficulty_level: 'Intermediate',
            estimated_hours: 20,
            question_count: 10,
            tags: ['Test', 'Algorithm'],
            source: 'System',
          },
        ],
      },
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    })

    render(<PathsPage />)

    // Should show loading initially
    expect(screen.getByText(/LOADING LEARNING PATHS/i)).toBeInTheDocument()

    // Wait for the API call and data to load
    await waitFor(() => {
      expect(screen.getByText('Test Learning Path')).toBeInTheDocument()
    })

    // Verify the path details are displayed
    expect(screen.getByText('A test learning path')).toBeInTheDocument()
    expect(screen.getByText('10 questions')).toBeInTheDocument()
    expect(screen.getByText('[INTERMEDIATE]')).toBeInTheDocument()

    // Verify API was called correctly
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/v1/learning-paths'
    )
  })

  it('should display no paths message when data array is empty', async () => {
    const mockApiResponse = {
      status: 'success',
      data: {
        learning_paths: [],
      },
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    })

    render(<PathsPage />)

    await waitFor(() => {
      expect(screen.getByText('[NO_PATHS_AVAILABLE]')).toBeInTheDocument()
    })
  })

  it('should handle API errors gracefully', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(<PathsPage />)

    await waitFor(() => {
      expect(screen.getByText('[NO_PATHS_AVAILABLE]')).toBeInTheDocument()
    })

    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch paths: HTTP', 500)
    consoleSpy.mockRestore()
  })

  it('should handle network failures', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'))

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(<PathsPage />)

    await waitFor(() => {
      expect(screen.getByText('[NO_PATHS_AVAILABLE]')).toBeInTheDocument()
    })

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching paths:', expect.any(Error))
    consoleSpy.mockRestore()
  })

  it('should handle malformed API response (the bug we had)', async () => {
    // This test would have caught our production bug!
    const malformedResponse = {
      status: 'success',
      data: [
        // Wrong structure - array directly in data instead of learning_paths
        {
          path_id: 1,
          name: 'Test Path',
        },
      ],
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(malformedResponse),
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(<PathsPage />)

    await waitFor(() => {
      // Should handle the malformed response gracefully
      expect(screen.getByText('[NO_PATHS_AVAILABLE]')).toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })

  it('should properly structure API calls with correct endpoint', () => {
    const mockApiResponse = {
      status: 'success',
      data: { learning_paths: [] },
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    })

    render(<PathsPage />)

    // Verify the API endpoint is correctly formatted
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/v1/learning-paths'
    )
  })
})