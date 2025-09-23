export interface Question {
  acRate: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  freqBar: number | null;
  frontendQuestionId: string;
  isFavor: boolean;
  paidOnly: boolean;
  status: string | null;
  title: string;
  titleSlug: string;
  hasVideoSolution: boolean;
  hasSolution: boolean;
  topicTags: TopicTag[];
}

export interface TopicTag {
  name: string;
  id: string;
  slug: string;
}

export interface DailyChallengeResponse {
  data: {
    activeDailyCodingChallengeQuestion: {
      date: string;
      userStatus: string;
      link: string;
      question: Question;
    };
  };
}

export interface LeetCodeError {
  error: string;
  details?: string;
}

export interface QuestionDetails {
  questionId: string;
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  content: string;
  translatedTitle: string;
  translatedContent: string;
  isPaidOnly: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  likes: number;
  dislikes: number;
  isLiked: boolean;
  similarQuestions: string;
  exampleTestcases: string;
  categoryTitle: string;
  contributors: Array<{
    username: string;
    profileUrl: string;
    avatarUrl: string;
  }>;
  topicTags: TopicTag[];
  companyTagStats: string;
  codeSnippets: Array<{
    lang: string;
    langSlug: string;
    code: string;
  }>;
  stats: string;
  hints: string[];
  solution: {
    id: string;
    canSeeDetail: boolean;
    paidOnly: boolean;
    hasVideoSolution: boolean;
    paidOnlyVideo: boolean;
  };
  status: string;
  sampleTestCase: string;
  metaData: string;
  judgerAvailable: boolean;
  judgeType: string;
  mysqlSchemas: any[];
  enableRunCode: boolean;
  enableTestMode: boolean;
  enableDebugger: boolean;
  envInfo: string;
  libraryUrl: string;
  adminUrl: string;
  challengeQuestion: {
    id: string;
    date: string;
    incompleteChallengeCount: number;
    streakCount: number;
    type: string;
  } | null;
}

export interface QuestionListResponse {
  total: number;
  questions: Question[];
}

export interface UserProfile {
  username: string;
  socialAccounts: string;
  githubUrl: string;
  contributions: {
    points: number;
    questionCount: number;
    testcaseCount: number;
  };
  profile: {
    realName: string;
    websites: string[];
    countryName: string;
    skillTags: string[];
    company: string;
    school: string;
    starRating: number;
    aboutMe: string;
    userAvatar: string;
    reputation: number;
    ranking: number;
  };
  submissionCalendar: string;
  submitStats: {
    acSubmissionNum: Array<{
      difficulty: string;
      count: number;
      submissions: number;
    }>;
    totalSubmissionNum: Array<{
      difficulty: string;
      count: number;
      submissions: number;
    }>;
  };
  badges: Array<{
    id: string;
    displayName: string;
    icon: string;
    creationDate: string;
  }>;
  upcomingBadges: Array<{
    name: string;
    icon: string;
  }>;
  activeBadge: {
    id: string;
    displayName: string;
    icon: string;
  } | null;
}

export interface UserProfileResponse {
  user: UserProfile;
  allQuestionsCount: Array<{
    difficulty: string;
    count: number;
  }>;
}
