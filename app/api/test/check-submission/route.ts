import { NextRequest, NextResponse } from 'next/server';

const LEETCODE_ENDPOINT = 'https://leetcode.com/graphql';

/**
 * Query to check recent submissions for a user on a specific question
 * This attempts to get submission history filtered by question
 */
const USER_RECENT_SUBMISSIONS_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
      statusDisplay
      lang
    }
  }
`;

/**
 * Alternative query - get all submission calendar data
 * submissionCalendar is a JSON string with timestamp->count mapping
 */
const USER_SUBMISSION_CALENDAR_QUERY = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submissionCalendar
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
  }
`;

/**
 * Query to check question status for a user
 * This shows if they've solved a specific question
 */
const QUESTION_STATUS_QUERY = `
  query questionStatus($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      questionFrontendId
      title
      titleSlug
      status
    }
  }
`;

/**
 * GET /api/test/check-submission
 * Test endpoint to check if we can verify user submissions on LeetCode
 *
 * Query parameters:
 * - username: LeetCode username
 * - questionSlug: (optional) specific question titleSlug
 * - limit: (optional) number of recent submissions to fetch (default 20)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const questionSlug = searchParams.get('questionSlug');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!username) {
      return NextResponse.json(
        { success: false, message: 'Username parameter is required' },
        { status: 400 }
      );
    }

    console.log(`Checking submissions for user: ${username}`);

    // Try method 1: Get recent AC submissions
    console.log('Trying recentAcSubmissionList query...');
    const recentSubmissions = await fetch(LEETCODE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: USER_RECENT_SUBMISSIONS_QUERY,
        variables: { username, limit },
        operationName: 'recentAcSubmissions'
      }),
    });

    const recentData = await recentSubmissions.json();
    console.log('Recent submissions response:', JSON.stringify(recentData, null, 2));

    // Try method 2: Get submission calendar
    console.log('Trying submissionCalendar query...');
    const calendarResponse = await fetch(LEETCODE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: USER_SUBMISSION_CALENDAR_QUERY,
        variables: { username },
        operationName: 'userProfile'
      }),
    });

    const calendarData = await calendarResponse.json();
    console.log('Submission calendar response:', JSON.stringify(calendarData, null, 2));

    // Try method 3: If questionSlug provided, check question status
    let questionStatus = null;
    if (questionSlug) {
      console.log(`Trying question status query for: ${questionSlug}...`);
      const statusResponse = await fetch(LEETCODE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: QUESTION_STATUS_QUERY,
          variables: { titleSlug: questionSlug },
          operationName: 'questionStatus'
        }),
      });

      questionStatus = await statusResponse.json();
      console.log('Question status response:', JSON.stringify(questionStatus, null, 2));
    }

    return NextResponse.json({
      success: true,
      findings: {
        method1_recentSubmissions: {
          available: !recentData.errors,
          data: recentData,
          note: 'Attempts to get recent accepted submissions list'
        },
        method2_submissionCalendar: {
          available: !calendarData.errors,
          data: calendarData,
          note: 'Gets submission calendar (timestamp -> count mapping)'
        },
        method3_questionStatus: questionSlug ? {
          available: !questionStatus?.errors,
          data: questionStatus,
          note: 'Checks if specific question is solved (requires auth)'
        } : null
      },
      summary: {
        canCheckRecentSubmissions: !recentData.errors && recentData.data?.recentAcSubmissionList,
        canCheckCalendar: !calendarData.errors && calendarData.data?.matchedUser,
        canCheckQuestionStatus: questionSlug ? (!questionStatus?.errors && questionStatus?.data?.question) : 'not_tested',
        recommendation: 'See detailed findings above'
      }
    });
  } catch (error) {
    console.error('Error checking submissions:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
