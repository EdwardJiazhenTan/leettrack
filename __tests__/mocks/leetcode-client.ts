import type {
  DailyChallengeResponse,
  QuestionDetails,
  QuestionListResponse,
  UserProfileResponse,
  LeetCodeError
} from '../../types/leetcode';

export const mockDailyProblemResponse: DailyChallengeResponse = {
  data: {
    activeDailyCodingChallengeQuestion: {
      date: "2025-01-15",
      userStatus: "NotStarted",
      link: "https://leetcode.com/problems/two-sum/",
      question: {
        acRate: 49.3,
        difficulty: "Easy",
        freqBar: null,
        frontendQuestionId: "1",
        isFavor: false,
        paidOnly: false,
        status: null,
        title: "Two Sum",
        titleSlug: "two-sum",
        hasVideoSolution: true,
        hasSolution: true,
        topicTags: [
          {
            name: "Array",
            id: "1",
            slug: "array"
          },
          {
            name: "Hash Table",
            id: "2",
            slug: "hash-table"
          }
        ]
      }
    }
  }
};

export const mockQuestionDetails: QuestionDetails = {
  questionId: "1",
  questionFrontendId: "1",
  title: "Two Sum",
  titleSlug: "two-sum",
  content: "<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>",
  translatedTitle: "Two Sum",
  translatedContent: "",
  isPaidOnly: false,
  difficulty: "Easy",
  likes: 32567,
  dislikes: 1038,
  isLiked: false,
  similarQuestions: "[]",
  exampleTestcases: "[2,7,11,15]\n9",
  categoryTitle: "Algorithms",
  contributors: [
    {
      username: "admin",
      profileUrl: "https://leetcode.com/admin/",
      avatarUrl: "https://assets.leetcode.com/users/admin/avatar_1.png"
    }
  ],
  topicTags: [
    {
      name: "Array",
      id: "1",
      slug: "array",
      translatedName: "Array"
    },
    {
      name: "Hash Table",
      id: "2",
      slug: "hash-table",
      translatedName: "Hash Table"
    }
  ],
  companyTagStats: "{}",
  codeSnippets: [
    {
      lang: "JavaScript",
      langSlug: "javascript",
      code: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};"
    }
  ],
  stats: "{\"totalAccepted\": \"4.5M\", \"totalSubmission\": \"9.1M\", \"totalAcceptedRaw\": 4500000, \"totalSubmissionRaw\": 9100000, \"acRate\": \"49.5%\"}",
  hints: [
    "A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it's best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.",
    "So, if we fix one of the numbers, say <code>x</code>, we have to scan the entire array to find the next number <code>y</code> which is <code>value - x</code> where value is the input parameter. Can we change our array somehow so that this search becomes faster?",
    "The second train of thought is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?"
  ],
  solution: {
    id: "7",
    canSeeDetail: true,
    paidOnly: false,
    hasVideoSolution: true,
    paidOnlyVideo: false
  },
  status: null,
  sampleTestCase: "[2,7,11,15]\n9",
  metaData: "{\"name\": \"twoSum\", \"params\": [{\"name\": \"nums\", \"type\": \"integer[]\"}]}",
  judgerAvailable: true,
  judgeType: "large",
  mysqlSchemas: [],
  enableRunCode: true,
  enableTestMode: false,
  enableDebugger: true,
  envInfo: "{\"cpp\": [\"C++\", \"<p>Compiled with <code>clang 11</code></p>\"]}",
  libraryUrl: null,
  adminUrl: null,
  challengeQuestion: null
};

export const mockQuestionListResponse: QuestionListResponse = {
  total: 2500,
  questions: [
    {
      acRate: 49.3,
      difficulty: "Easy",
      freqBar: null,
      frontendQuestionId: "1",
      isFavor: false,
      paidOnly: false,
      status: null,
      title: "Two Sum",
      titleSlug: "two-sum",
      hasVideoSolution: true,
      hasSolution: true,
      topicTags: [
        {
          name: "Array",
          id: "1",
          slug: "array"
        }
      ]
    },
    {
      acRate: 38.2,
      difficulty: "Medium",
      freqBar: null,
      frontendQuestionId: "2",
      isFavor: false,
      paidOnly: false,
      status: null,
      title: "Add Two Numbers",
      titleSlug: "add-two-numbers",
      hasVideoSolution: false,
      hasSolution: true,
      topicTags: [
        {
          name: "Linked List",
          id: "3",
          slug: "linked-list"
        }
      ]
    }
  ]
};

export const mockUserProfileResponse: UserProfileResponse = {
  user: {
    username: "testuser",
    socialAccounts: "",
    githubUrl: "",
    contributions: {
      points: 1250,
      questionCount: 0,
      testcaseCount: 0
    },
    profile: {
      realName: "Test User",
      websites: [],
      countryName: "United States",
      skillTags: [],
      company: "Test Company",
      school: "Test University",
      starRating: 4.5,
      aboutMe: "I love coding!",
      userAvatar: "https://assets.leetcode.com/users/default_avatar.jpg",
      reputation: 100,
      ranking: 150000
    },
    submissionCalendar: "{\"1640995200\": 3, \"1641081600\": 1}",
    submitStats: {
      acSubmissionNum: [
        {
          difficulty: "All",
          count: 85,
          submissions: 150
        },
        {
          difficulty: "Easy",
          count: 45,
          submissions: 70
        },
        {
          difficulty: "Medium",
          count: 35,
          submissions: 65
        },
        {
          difficulty: "Hard",
          count: 5,
          submissions: 15
        }
      ],
      totalSubmissionNum: [
        {
          difficulty: "All",
          count: 150,
          submissions: 150
        }
      ]
    },
    badges: [
      {
        id: "annual-badge-2023",
        displayName: "Annual Badge 2023",
        icon: "https://assets.leetcode.com/static_assets/others/2023.png",
        creationDate: "2023-01-01"
      }
    ],
    upcomingBadges: [
      {
        name: "100 Days",
        icon: "https://assets.leetcode.com/static_assets/others/100days.png"
      }
    ],
    activeBadge: {
      id: "annual-badge-2023",
      displayName: "Annual Badge 2023",
      icon: "https://assets.leetcode.com/static_assets/others/2023.png"
    }
  },
  allQuestionsCount: [
    {
      difficulty: "Easy",
      count: 850
    },
    {
      difficulty: "Medium",
      count: 1650
    },
    {
      difficulty: "Hard",
      count: 750
    }
  ]
};

export const mockLeetCodeError: LeetCodeError = {
  error: "Network error",
  details: "Failed to fetch from LeetCode API"
};

// Mock the actual functions
export const mockGetDailyProblem = jest.fn();
export const mockGetQuestionBySlug = jest.fn();
export const mockGetQuestionsByTag = jest.fn();
export const mockGetUserProfile = jest.fn();