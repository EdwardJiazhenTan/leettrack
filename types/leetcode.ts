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
