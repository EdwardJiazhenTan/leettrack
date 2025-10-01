"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";

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
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    fetchUserInfo();
    fetchTodaysQuestions();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsername(data.user.leetcode_username || data.user.username);
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchTodaysQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch("/api/daily/today", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    } catch (error) {
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

  if (loading) {
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
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/home" className="text-2xl font-light text-gray-900">
              LeetTrack
            </Link>
            <div className="flex gap-6">
              <Link href="/home" className="text-gray-900 font-medium">
                Today
              </Link>
              <Link
                href="/paths"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Paths
              </Link>
              <Link
                href="/stats"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Stats
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            Today's Questions
          </h1>
          <p className="text-gray-500">
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Stats */}
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
