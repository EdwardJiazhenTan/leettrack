import { GET } from '../../../app/api/questions/stats/route';
import { mockQuestionStats } from '../../mocks/questions';

// Mock the questions module
jest.mock('../../../lib/questions');

import { getQuestionStats } from '../../../lib/questions';

const mockedGetQuestionStats = getQuestionStats as jest.MockedFunction<typeof getQuestionStats>;

describe('/api/questions/stats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return question statistics successfully', async () => {
      // Arrange
      mockedGetQuestionStats.mockReturnValue(mockQuestionStats);

      const request = new Request('http://localhost:3000/api/questions/stats');

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockQuestionStats);
      expect(mockedGetQuestionStats).toHaveBeenCalledTimes(1);
    });

    it('should return 500 error when an exception occurs', async () => {
      // Arrange
      mockedGetQuestionStats.mockImplementation(() => {
        throw new Error('Database error');
      });

      const request = new Request('http://localhost:3000/api/questions/stats');

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.status).toBe('error');
      expect(responseData.message).toBe('An error occurred while fetching question statistics');
    });
  });
});