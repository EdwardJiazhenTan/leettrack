"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { authApi, leetcodeApi } from "../services/api";

interface QuestionForReview {
  user_question_id: number;
  question_id: number;
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  confidence: string;
  times_reviewed: number;
  last_reviewed: string | null;
  next_review: string | null;
}

interface QuestionNeedingRating {
  user_question_id: number;
  question_id: number;
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  solved_at: string | null;
  times_reviewed: number;
}

interface DailyQuestionType {
  titleSlug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  likes?: number;
  dislikes?: number;
  content?: string;
  topicTags?: Array<{ name: string }>;
  questionId?: string | number;
  questionFrontendId?: string | number;
  isPaidOnly?: boolean;
}

interface DailyQuestionResponse {
  date: string;
  link: string;
  question: DailyQuestionType;
}

const TodayPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [reviewsDue, setReviewsDue] = useState<QuestionForReview[]>([]);
  const [questionsNeedingRating, setQuestionsNeedingRating] = useState<
    QuestionNeedingRating[]
  >([]);
  const [dailyQuestion, setDailyQuestion] =
    useState<DailyQuestionResponse | null>(null);

  // Loading states for individual sections
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [ratingsLoading, setRatingsLoading] = useState(false);

  const fetchTodaysData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch all three data sources in parallel
      const [reviewsResponse, ratingsResponse, dailyResponse] =
        await Promise.all([
          authApi.getTodaysReviews(),
          authApi.getQuestionsNeedingRating(),
          leetcodeApi.getDailyQuestion(),
        ]);

      // Handle reviews due today
      if (reviewsResponse.error) {
        console.error("Error fetching reviews:", reviewsResponse.error);
      } else {
        const reviewsData = reviewsResponse.data as {
          data?: { reviews?: QuestionForReview[] };
        };
        setReviewsDue(reviewsData?.data?.reviews || []);
      }

      // Handle questions needing rating
      if (ratingsResponse.error) {
        console.error("Error fetching ratings:", ratingsResponse.error);
      } else {
        const ratingsData = ratingsResponse.data as {
          data?: { questions?: QuestionNeedingRating[] };
        };
        setQuestionsNeedingRating(ratingsData?.data?.questions || []);
      }

      // Handle daily question
      if (dailyResponse.error) {
        console.error("Error fetching daily question:", dailyResponse.error);
      } else {
        setDailyQuestion(dailyResponse.data as DailyQuestionResponse);
      }
    } catch (err) {
      console.error("Error fetching today's data:", err);
      setError("Failed to load today's questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !authLoading) {
      fetchTodaysData();
    }
  }, [user, authLoading]);

  const handleCompleteReview = async (
    userQuestionId: number,
    confidence?: string
  ) => {
    setReviewsLoading(true);
    try {
      const response = await authApi.completeReview(userQuestionId, {
        confidence,
      });
      if (response.error) {
        throw new Error(response.error);
      }
      // Refresh the reviews list
      await fetchTodaysData();
    } catch (err) {
      console.error("Error completing review:", err);
      setError("Failed to complete review");
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleRateQuestion = async (
    userQuestionId: number,
    confidence: string
  ) => {
    setRatingsLoading(true);
    try {
      const response = await authApi.rateQuestion(userQuestionId, {
        confidence,
      });
      if (response.error) {
        throw new Error(response.error);
      }
      // Refresh the ratings list
      await fetchTodaysData();
    } catch (err) {
      console.error("Error rating question:", err);
      setError("Failed to rate question");
    } finally {
      setRatingsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-[#a6e3a1] text-[#1e1e2e] border-[#a6e3a1]";
      case "Medium":
        return "bg-[#f9e2af] text-[#1e1e2e] border-[#f9e2af]";
      case "Hard":
        return "bg-[#f38ba8] text-[#1e1e2e] border-[#f38ba8]";
      default:
        return "bg-[#6c7086] text-[#cdd6f4] border-[#6c7086]";
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "mastered":
        return "text-[#a6e3a1]";
      case "confident":
        return "text-[#89b4fa]";
      case "understood":
        return "text-[#f9e2af]";
      case "struggled":
        return "text-[#fab387]";
      case "confused":
        return "text-[#f38ba8]";
      default:
        return "text-[#a6adc8]";
    }
  };

  const confidenceOptions = [
    { value: "mastered", label: "MASTERED", color: "bg-[#a6e3a1]" },
    { value: "confident", label: "CONFIDENT", color: "bg-[#89b4fa]" },
    { value: "understood", label: "UNDERSTOOD", color: "bg-[#f9e2af]" },
    { value: "struggled", label: "STRUGGLED", color: "bg-[#fab387]" },
    { value: "confused", label: "CONFUSED", color: "bg-[#f38ba8]" },
  ];

  // Handle auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#1e1e2e]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="bg-[#313244] border-4 border-[#45475a] p-8 shadow-[4px_4px_0px_0px_#11111b] inline-block">
              <p className="text-xl font-mono text-[#cdd6f4] tracking-wider">
                [AUTHENTICATING...]
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1e1e2e]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="bg-[#313244] border-4 border-[#f38ba8] p-8 shadow-[4px_4px_0px_0px_#11111b] inline-block">
              <h2 className="text-xl font-mono font-bold mb-4 text-[#f38ba8] tracking-wider">
                [ACCESS_DENIED]
              </h2>
              <p className="text-lg font-mono text-[#cdd6f4] tracking-wider mb-4">
                &gt; Please log in to view your daily questions
              </p>
              <a
                href="/login"
                className="inline-block bg-[#89b4fa] text-[#1e1e2e] px-6 py-3 font-mono font-bold border-4 border-[#89b4fa] hover:bg-[#74c7ec] hover:border-[#74c7ec] transition-all duration-200 shadow-[3px_3px_0px_0px_#11111b] tracking-wider"
              >
                [LOGIN]
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalQuestions =
    reviewsDue.length + questionsNeedingRating.length + (dailyQuestion ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#1e1e2e]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 bg-[#313244] border-4 border-[#89b4fa] p-6 shadow-[4px_4px_0px_0px_#11111b]">
          <h1 className="text-3xl font-mono font-bold text-[#cdd6f4] tracking-wider mb-2">
            [TODAY&apos;S_QUESTIONS]
          </h1>
          <p className="text-lg font-mono text-[#a6adc8] tracking-wide">
            &gt; Total questions for today:{" "}
            <span className="text-[#89b4fa] font-bold">{totalQuestions}</span>
          </p>
          {totalQuestions === 0 && (
            <p className="text-lg font-mono text-[#a6e3a1] tracking-wide mt-2">
              &gt; All caught up! 🎉
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-[#313244] border-4 border-[#f38ba8] p-6 shadow-[4px_4px_0px_0px_#11111b]">
            <p className="text-[#f38ba8] font-mono font-bold">[ERROR]</p>
            <p className="text-[#f38ba8] font-mono text-sm mt-1">{error}</p>
            <button
              onClick={fetchTodaysData}
              className="mt-3 px-4 py-2 bg-[#f9e2af] text-[#1e1e2e] font-mono font-bold border-2 border-[#f9e2af] hover:bg-[#fab387] hover:border-[#fab387] transition-all duration-200 shadow-[2px_2px_0px_0px_#11111b] tracking-wider"
            >
              [RETRY]
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="bg-[#313244] border-4 border-[#45475a] p-8 shadow-[4px_4px_0px_0px_#11111b] inline-block">
              <p className="text-xl font-mono text-[#cdd6f4] tracking-wider">
                [LOADING_TODAY&apos;S_QUESTIONS...]
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Daily LeetCode Challenge */}
            {dailyQuestion && (
              <div className="bg-[#313244] border-4 border-[#f9e2af] p-6 shadow-[4px_4px_0px_0px_#11111b]">
                <h2 className="text-xl font-mono font-bold mb-4 text-[#f9e2af] tracking-wider">
                  [DAILY_LEETCODE_CHALLENGE]
                </h2>
                <div className="bg-[#1e1e2e] border-2 border-[#45475a] p-4 shadow-[2px_2px_0px_0px_#11111b]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-mono font-bold text-[#89b4fa]">
                      {dailyQuestion.question.title}
                    </h3>
                    <span
                      className={`px-3 py-1 font-mono font-bold border-2 shadow-[2px_2px_0px_0px_#11111b] ${getDifficultyColor(
                        dailyQuestion.question.difficulty
                      )}`}
                    >
                      [{dailyQuestion.question.difficulty?.toUpperCase()}]
                    </span>
                  </div>
                  <p className="font-mono text-sm text-[#a6adc8] mb-4">
                    <span className="text-[#fab387]">&gt;</span> Date:{" "}
                    <span className="text-[#f9e2af]">{dailyQuestion.date}</span>
                  </p>
                  <a
                    href={`https://leetcode.com/problems/${dailyQuestion.question.titleSlug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#89b4fa] text-[#1e1e2e] px-4 py-2 font-mono font-bold border-4 border-[#89b4fa] hover:bg-[#74c7ec] hover:border-[#74c7ec] transition-all duration-200 shadow-[3px_3px_0px_0px_#11111b] tracking-wider"
                  >
                    [SOLVE_DAILY_CHALLENGE]
                  </a>
                </div>
              </div>
            )}

            {/* Reviews Due Today */}
            {reviewsDue.length > 0 && (
              <div className="bg-[#313244] border-4 border-[#a6e3a1] p-6 shadow-[4px_4px_0px_0px_#11111b]">
                <h2 className="text-xl font-mono font-bold mb-4 text-[#a6e3a1] tracking-wider">
                  [REVIEWS_DUE_TODAY] ({reviewsDue.length})
                </h2>
                <div className="space-y-4">
                  {reviewsDue.map((question) => (
                    <div
                      key={question.user_question_id}
                      className="bg-[#1e1e2e] border-2 border-[#45475a] p-4 shadow-[2px_2px_0px_0px_#11111b]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-mono font-bold text-[#cdd6f4]">
                          {question.title}
                        </h3>
                        <span
                          className={`px-3 py-1 font-mono font-bold border-2 shadow-[2px_2px_0px_0px_#11111b] ${getDifficultyColor(
                            question.difficulty
                          )}`}
                        >
                          [{question.difficulty?.toUpperCase()}]
                        </span>
                      </div>
                      <div className="mb-4 space-y-1">
                        <p className="font-mono text-sm text-[#a6adc8]">
                          <span className="text-[#fab387]">&gt;</span> Current
                          confidence:
                          <span
                            className={`font-bold ml-1 ${getConfidenceColor(
                              question.confidence
                            )}`}
                          >
                            [{question.confidence?.toUpperCase()}]
                          </span>
                        </p>
                        <p className="font-mono text-sm text-[#a6adc8]">
                          <span className="text-[#fab387]">&gt;</span> Times
                          reviewed:
                          <span className="text-[#f9e2af] font-bold ml-1">
                            {question.times_reviewed}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        <a
                          href={question.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-[#89b4fa] text-[#1e1e2e] px-4 py-2 font-mono font-bold border-4 border-[#89b4fa] hover:bg-[#74c7ec] hover:border-[#74c7ec] transition-all duration-200 shadow-[3px_3px_0px_0px_#11111b] tracking-wider"
                        >
                          [REVIEW_PROBLEM]
                        </a>
                        {confidenceOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() =>
                              handleCompleteReview(
                                question.user_question_id,
                                option.value
                              )
                            }
                            disabled={reviewsLoading}
                            className={`px-3 py-2 font-mono font-bold text-xs border-2 shadow-[2px_2px_0px_0px_#11111b] transition-all duration-200 ${
                              option.color
                            } text-[#1e1e2e] border-[${
                              option.color.split("[")[1].split("]")[0]
                            }] hover:opacity-80 disabled:opacity-50`}
                          >
                            [{option.label}]
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questions Needing Rating */}
            {questionsNeedingRating.length > 0 && (
              <div className="bg-[#313244] border-4 border-[#cba6f7] p-6 shadow-[4px_4px_0px_0px_#11111b]">
                <h2 className="text-xl font-mono font-bold mb-4 text-[#cba6f7] tracking-wider">
                  [RATE_RECENT_SOLUTIONS] ({questionsNeedingRating.length})
                </h2>
                <div className="space-y-4">
                  {questionsNeedingRating.map((question) => (
                    <div
                      key={question.user_question_id}
                      className="bg-[#1e1e2e] border-2 border-[#45475a] p-4 shadow-[2px_2px_0px_0px_#11111b]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-mono font-bold text-[#cdd6f4]">
                          {question.title}
                        </h3>
                        <span
                          className={`px-3 py-1 font-mono font-bold border-2 shadow-[2px_2px_0px_0px_#11111b] ${getDifficultyColor(
                            question.difficulty
                          )}`}
                        >
                          [{question.difficulty?.toUpperCase()}]
                        </span>
                      </div>
                      <p className="font-mono text-sm text-[#a6adc8] mb-4">
                        <span className="text-[#fab387]">&gt;</span> Solved at:
                        <span className="text-[#f9e2af] font-bold ml-1">
                          {question.solved_at
                            ? new Date(question.solved_at).toLocaleDateString()
                            : "Unknown"}
                        </span>
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        <a
                          href={question.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-[#89b4fa] text-[#1e1e2e] px-4 py-2 font-mono font-bold border-4 border-[#89b4fa] hover:bg-[#74c7ec] hover:border-[#74c7ec] transition-all duration-200 shadow-[3px_3px_0px_0px_#11111b] tracking-wider"
                        >
                          [VIEW_PROBLEM]
                        </a>
                        {confidenceOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() =>
                              handleRateQuestion(
                                question.user_question_id,
                                option.value
                              )
                            }
                            disabled={ratingsLoading}
                            className={`px-3 py-2 font-mono font-bold text-xs border-2 shadow-[2px_2px_0px_0px_#11111b] transition-all duration-200 ${
                              option.color
                            } text-[#1e1e2e] border-[${
                              option.color.split("[")[1].split("]")[0]
                            }] hover:opacity-80 disabled:opacity-50`}
                          >
                            [{option.label}]
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {totalQuestions === 0 && !loading && (
              <div className="text-center py-12">
                <div className="bg-[#313244] border-4 border-[#a6e3a1] p-8 shadow-[4px_4px_0px_0px_#11111b] inline-block">
                  <h2 className="text-xl font-mono font-bold mb-4 text-[#a6e3a1] tracking-wider">
                    [ALL_CAUGHT_UP!]
                  </h2>
                  <p className="text-lg font-mono text-[#cdd6f4] tracking-wider mb-4">
                    &gt; No questions for today. Great job!
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link
                      href="/paths"
                      className="inline-block bg-[#f38ba8] text-[#1e1e2e] px-6 py-3 font-mono font-bold border-4 border-[#f38ba8] hover:bg-[#eba0ac] hover:border-[#eba0ac] transition-all duration-200 shadow-[3px_3px_0px_0px_#11111b] tracking-wider"
                    >
                      [EXPLORE_PATHS]
                    </Link>
                    <Link
                      href="/profile"
                      className="inline-block bg-[#89b4fa] text-[#1e1e2e] px-6 py-3 font-mono font-bold border-4 border-[#89b4fa] hover:bg-[#74c7ec] hover:border-[#74c7ec] transition-all duration-200 shadow-[3px_3px_0px_0px_#11111b] tracking-wider"
                    >
                      [VIEW_PROGRESS]
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TodayPage;
