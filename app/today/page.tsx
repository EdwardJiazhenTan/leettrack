"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";
import Navbar from "@/app/Navbar";
import { useAuth } from "@/lib/useAuth";

const inter = Inter({ subsets: ["latin"] });

interface Question {
  id: string;
  recommendation_id?: string;
  title: string;
  slug: string;
  difficulty: string;
  url: string;
  leetcode_id?: string;
  tags: string[];
  source_type: "path" | "daily" | "review";
  path_id?: string;
  path_title?: string;
  priority_score: number;
}

export default function HomePage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [breakdown, setBreakdown] = useState({ path: 0, review: 0, daily: 0 });
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      fetchTodaysQuestions();
    }
  }, [authLoading, isAuthenticated]);

  const fetchTodaysQuestions = async () => {
    try {
      if (!isAuthenticated) {
        // fetch only daily questions
        const response = await fetch("/api/leetcode/daily");
        if (response.ok) {
          const data = await response.json();
          const challenge = data.data.activeDailyCodingChallengeQuestion;
          const dailyQuestion: Question = {
            id: challenge.question.frontendQuestionId,
            title: challenge.question.title,
            slug: challenge.question.titleSlug,
            difficulty: challenge.question.difficulty,
            url: `https://leetcode.com${challenge.link}`,
            leetcode_id: challenge.question.frontendQuestionId,
            tags: challenge.question.topicTags?.map((t: any) => t.name) || [],
            source_type: "daily",
            priority_score: 1.0,
          };

          setQuestions([dailyQuestion]);
          setDate(new Date().toISOString().split('T')[0]);
          // manually set the breakdown count
          setBreakdown({ path: 0, review: 0, daily: 1 })
        }
      } else {
        // authenticated, fetch personalized questions
        const token = localStorage.getItem("token");

        await fetch("/api/daily/sync", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch((err) => console.warn("failed to sync daily challenges", err));

        // fetch all todays questions
        const response = await fetch("/api/daily/today", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }

        const data = await response.json();
        if (data.success) {
          setQuestions(data.questions);
          setDate(data.date);
          setBreakdown(data.breakdown);
        }
      }
    } catch (error) {
      // TODO: create an error page to handle errors instead of a console error
      console.error("Error fetching today's questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (question: Question) => {
    setProcessingId(question.id);
    try {
      const response = await fetch("/api/daily/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          question_id: question.id,
          path_id: question.path_id,
          source_type: question.source_type,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setQuestions(questions.filter((q) => q.id !== question.id));

        // Update breakdown count based on source_type
        setBreakdown((prev) => ({
          ...prev,
          [question.source_type]: Math.max(0, prev[question.source_type] - 1),
        }));
      } else {
        alert(data.message || "Failed to mark question as complete");
      }
    } catch (error) {
      console.error("Error marking question as complete:", error);
      alert("Failed to mark question as complete");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReview = async (question: Question) => {
    setProcessingId(question.id);
    try {
      const response = await fetch("/api/daily/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          question_id: question.id,
          path_id: question.path_id,
          source_type: question.source_type,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setQuestions(questions.filter((q) => q.id !== question.id));

        // Update breakdown count based on source_type
        setBreakdown((prev) => ({
          ...prev,
          [question.source_type]: Math.max(0, prev[question.source_type] - 1),
        }));
      } else {
        alert(data.message || "Failed to schedule question for review");
      }
    } catch (error) {
      console.error("Error scheduling question for review:", error);
      alert("Failed to schedule question for review");
    } finally {
      setProcessingId(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "hard":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getSourceColor = (type: string) => {
    switch (type) {
      case "path":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "review":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "daily":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleLoadMorePath = async () => {
    setLoadingMore(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/daily/more-path", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.question) {
        setQuestions([...questions, data.question]);
      } else {
        alert(data.message || "No more path questions available");
      }
    } catch (error) {
      console.error("Error loading more path questions:", error);
      alert("Failed to load more path questions");
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div
        className={`${inter.className} min-h-screen bg-gray-50 flex items-center justify-center`}
      >
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            Today&apos;s Questions
          </h1>
          <p className="text-gray-500">
            {date &&
              new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </p>
        </div>


        {/* Login prompt for unauthenticated users */}
        {!isAuthenticated && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 font-medium mb-2">
              Want personalized path questions and track your progress?
            </p>
            <p className="text-blue-700 text-sm mb-3">
              Sign up to get daily recommendations from your learning paths, spaced repetition reviews, and progress tracking.
            </p>
            <Link
              href="/auth/login"
              className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In / Sign Up
            </Link>
          </div>
        )}

        {/* Stats */}
        {isAuthenticated ? (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-light text-gray-900">
                {breakdown.path}
              </div>
              <div className="text-sm text-gray-500">from paths</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-light text-gray-900">
                {breakdown.review}
              </div>
              <div className="text-sm text-gray-500">reviews</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-light text-gray-900">
                {breakdown.daily}
              </div>
              <div className="text-sm text-gray-500">daily</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 opacity-60">
              <div className="text-2xl font-light text-gray-500">🔒</div>
              <div className="text-sm text-gray-500">from paths</div>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 opacity-60">
              <div className="text-2xl font-light text-gray-500">🔒</div>
              <div className="text-sm text-gray-500">reviews</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-light text-gray-900">1</div>
              <div className="text-sm text-gray-500">daily</div>
            </div>
          </div>
        )}

        {questions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-2">No questions for today</p>
            <p className="text-gray-400">
              Check back tomorrow for new questions
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((question) => (
              <div
                key={question.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <a
                        href={question.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-normal text-gray-900 hover:text-black transition-colors"
                      >
                        {question.leetcode_id && `${question.leetcode_id}. `}
                        {question.title}
                      </a>
                      <span
                        className={`text-sm font-medium ${getDifficultyColor(question.difficulty)}`}
                      >
                        {question.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`px-3 py-1 rounded border text-xs font-medium ${getSourceColor(question.source_type)}`}
                      >
                        {question.source_type.toUpperCase()}
                      </span>
                      {question.path_title && (
                        <span className="text-sm text-gray-500">
                          {question.path_title}
                        </span>
                      )}
                    </div>

                    {question.tags && question.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {question.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {isAuthenticated ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleComplete(question)}
                        disabled={processingId === question.id}
                        className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {processingId === question.id ? "..." : "Complete"}
                      </button>
                      <button
                        onClick={() => handleReview(question)}
                        disabled={processingId === question.id}
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                      >
                        {processingId === question.id ? "..." : "Review"}
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 bg-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-300 transition-colors inline-block"
                    >
                      Login to Track
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Path Questions Button */}
        {isAuthenticated && questions.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleLoadMorePath}
              disabled={loadingMore}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              {loadingMore ? "Loading..." : "Load More Path Questions"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
