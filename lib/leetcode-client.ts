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

const QUESTION_BY_ID_QUERY = `
  query questionDetails($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      questionFrontendId
      title
      titleSlug
      content
      translatedTitle
      translatedContent
      isPaidOnly
      difficulty
      likes
      dislikes
      isLiked
      similarQuestions
      exampleTestcases
      categoryTitle
      contributors {
        username
        profileUrl
        avatarUrl
        __typename
      }
      topicTags {
        name
        slug
        translatedName
        __typename
      }
      companyTagStats
      codeSnippets {
        lang
        langSlug
        code
        __typename
      }
      stats
      hints
      solution {
        id
        canSeeDetail
        paidOnly
        hasVideoSolution
        paidOnlyVideo
        __typename
      }
      status
      sampleTestCase
      metaData
      judgerAvailable
      judgeType
      mysqlSchemas
      enableRunCode
      enableTestMode
      enableDebugger
      envInfo
      libraryUrl
      adminUrl
      challengeQuestion {
        id
        date
        incompleteChallengeCount
        streakCount
        type
        __typename
      }
      __typename
    }
  }
`;

const QUESTIONS_BY_TAG_QUERY = `
  query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
      categorySlug: $categorySlug
      limit: $limit
      skip: $skip
      filters: $filters
    ) {
      total: totalNum
      questions: data {
        acRate
        difficulty
        freqBar
        frontendQuestionId: questionFrontendId
        isFavor
        paidOnly: isPaidOnly
        status
        title
        titleSlug
        topicTags {
          name
          id
          slug
        }
        hasSolution
        hasVideoSolution
      }
    }
  }
`;

const ALL_QUESTIONS_COUNT_QUERY = `
  query allQuestionsCount {
    allQuestionsCount {
      difficulty
      count
    }
  }
`;

const USER_PROFILE_QUERY = `
  query userProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      username
      socialAccounts
      githubUrl
      contributions {
        points
        questionCount
        testcaseCount
      }
      profile {
        realName
        websites
        countryName
        skillTags
        company
        school
        starRating
        aboutMe
        userAvatar
        reputation
        ranking
      }
      submissionCalendar
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      badges {
        id
        displayName
        icon
        creationDate
      }
      upcomingBadges {
        name
        icon
      }
      activeBadge {
        id
        displayName
        icon
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
        details: data.errors[0]?.message || 'Unknown Graphql error'
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

export async function getQuestionBySlug(titleSlug: string) {
  try {
    const response = await fetch(LEETCODE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: QUESTION_BY_ID_QUERY,
        variables: { titleSlug },
        operationName: 'questionDetails'
      }),
    });

    if (!response.ok) {
      return {
        error: `HTTP ${response.status}: ${response.statusText}`,
        details: 'Failed to fetch question from leetcode api'
      };
    }

    const data = await response.json();

    if (data.errors) {
      return {
        error: 'GraphQL API error',
        details: data.errors[0]?.message || 'Unknown GraphQL error'
      };
    }

    if (!data.data.question) {
      return {
        error: 'Question not found',
        details: `No question found with slug: ${titleSlug}`
      };
    }

    return data.data.question;
  } catch (error) {
    return {
      error: 'Network error',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function getQuestionsByTag(tags: string[], limit: number = 20, skip: number = 0, difficulty?: string) {
  try {
    const filters: any = {};

    if (tags && tags.length > 0) {
      filters.tags = tags;
    }

    if (difficulty) {
      filters.difficulty = difficulty.toUpperCase();
    }

    const response = await fetch(LEETCODE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: QUESTIONS_BY_TAG_QUERY,
        variables: {
          categorySlug: "",
          limit,
          skip,
          filters
        },
        operationName: 'problemsetQuestionList'
      }),
    });

    if (!response.ok) {
      return {
        error: `HTTP ${response.status}: ${response.statusText}`,
        details: 'Failed to fetch questions from leetcode api'
      };
    }

    const data = await response.json();

    if (data.errors) {
      return {
        error: 'GraphQL API error',
        details: data.errors[0]?.message || 'Unknown GraphQL error'
      };
    }

    return data.data.problemsetQuestionList;
  } catch (error) {
    return {
      error: 'Network error',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function getAllQuestionsCount() {
  try {
    const response = await fetch(LEETCODE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: ALL_QUESTIONS_COUNT_QUERY,
        operationName: 'allQuestionsCount'
      }),
    });

    if (!response.ok) {
      return {
        error: `HTTP ${response.status}: ${response.statusText}`,
        details: 'Failed to fetch questions count from leetcode api'
      };
    }

    const data = await response.json();

    if (data.errors) {
      return {
        error: 'GraphQL API error',
        details: data.errors[0]?.message || 'Unknown GraphQL error'
      };
    }

    return data.data.allQuestionsCount;
  } catch (error) {
    return {
      error: 'Network error',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function getUserProfile(username: string) {
  try {
    const response = await fetch(LEETCODE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: USER_PROFILE_QUERY,
        variables: { username },
        operationName: 'userProfile'
      }),
    });

    if (!response.ok) {
      return {
        error: `HTTP ${response.status}: ${response.statusText}`,
        details: 'Failed to fetch user profile from leetcode api'
      };
    }

    const data = await response.json();

    if (data.errors) {
      return {
        error: 'GraphQL API error',
        details: data.errors[0]?.message || 'Unknown GraphQL error'
      };
    }

    if (!data.data.matchedUser) {
      return {
        error: 'User not found',
        details: `No user found with username: ${username}`
      };
    }

    return {
      user: data.data.matchedUser,
      allQuestionsCount: data.data.allQuestionsCount
    };
  } catch (error) {
    return {
      error: 'Network error',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
