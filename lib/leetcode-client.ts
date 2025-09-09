const LEETCODE_ENDPOINT = 'https://leetcode.com/graphql';

const DAILY_QUERY = `
  query questionOfToday {
    activeDailyCodingChallengeQuestion {
      date
      userStatus
      link
      question {
        acRate
        difficulty
        freqBar
        frontendQuestionId: questionFrontendId
        isFavor
        paidOnly: isPaidOnly
        status
        title
        titleSlug
        hasVideoSolution
        hasSolution
        topicTags {
          name
          id
          slug
        }
      }
    }
  }
`;

export async function getDailyProblem(){
  try{
    const response = await fetch(LEETCODE_ENDPOINT, {
      method : 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({ 
        query: DAILY_QUERY, 
          operationName: 'questionOfToday'
      } ),
    });

    if (!response.ok) {
      return {
        error: `HTTP ${response.status}: ${response.statusText}`,
        details: 'Failed to fetch from leetcode api'
      };
    }

    const data = await response.json();

    if (data.errors) {
      return {
        error: 'graphql api error',
        details: data.error[0]?.message || 'Unknown Graphql error'
      };
    }
    return data;
  } catch (error) {
    return {
      error: 'Network error',
      details: error instanceof Error ? error.message: 'Unknown error' 
    };
  }
}
