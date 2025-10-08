"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface Question {
  id: string;
  leetcode_id?: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description?: string;
  tags: string[];
  url?: string;
  is_custom: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

interface QuestionListResponse {
  questions: Question[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

interface QuestionStats {
  total_questions: number;
  easy_count: number;
  medium_count: number;
  hard_count: number;
  custom_questions: number;
  leetcode_questions: number;
}

export default function QuestionsPage() {
  const [data, setData] = useState<QuestionListResponse | null>(null);
  const [stats, setStats] = useState<QuestionStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");
  const [showAddToPathModal, setShowAddToPathModal] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [userPaths, setUserPaths] = useState<any[]>([]);

  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, [filter, difficultyFilter]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filter) params.append("query", filter);
      if (difficultyFilter) params.append("difficulty", difficultyFilter);
      params.append("limit", "50");

      const response = await fetch(`/api/questions?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: QuestionListResponse = await response.json();

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/questions/stats");
      if (response.ok) {
        const result: QuestionStats = await response.json();
        setStats(result);
      }
    } catch (err) {
      console.error("Failed to fetch question statistics:", err);
    }
  };

  const fetchUserPaths = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/paths?created_by=me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setUserPaths(result.paths || []);
      }
    } catch (err) {
      console.error("Failed to fetch user paths:", err);
    }
  };

  const handleAddToPath = (question: Question) => {
    setSelectedQuestion(question);
    fetchUserPaths();
    setShowAddToPathModal(true);
  };

  const addQuestionToPath = async (pathId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !selectedQuestion) return;

      const response = await fetch(`/api/paths/${pathId}/questions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_id: selectedQuestion.id,
        }),
      });

      if (response.ok) {
        alert("Question added to path successfully!");
        setShowAddToPathModal(false);
        setSelectedQuestion(null);
      } else {
        const data = await response.json();
        alert(data.message || "Failed to add question to path");
      }
    } catch (err) {
      alert("Failed to add question to path");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "Hard":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div
        className={`${inter.className} min-h-screen bg-gray-50 flex items-center justify-center`}
      >
        <div className="animate-pulse text-gray-600">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${inter.className} min-h-screen bg-gray-50 flex items-center justify-center`}
      >
        <div className="text-red-600 bg-white p-6 rounded-lg shadow-sm border">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-light text-gray-900">
              LeetTrack
            </Link>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Questions</h1>
          <p className="text-gray-600">
            Browse and practice coding problems. Click on any question to solve
            it on LeetCode.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search Questions
              </label>
              <input
                type="text"
                id="search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search by title, description, or tags..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
              />
            </div>
            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filter by Difficulty
              </label>
              <select
                id="difficulty"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {data?.questions.map((question) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {question.leetcode_id && `${question.leetcode_id}. `}
                      {question.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}
                    >
                      {question.difficulty}
                    </span>
                    {question.is_custom && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-600">
                        Custom
                      </span>
                    )}
                  </div>

                  {question.description && (
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {question.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    {question.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {question.url && (
                    <a
                      href={question.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                    >
                      Solve on LeetCode
                    </a>
                  )}
                  <button
                    onClick={() => handleAddToPath(question)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Add to Path
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        {stats && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-light text-gray-900">
                  {stats.total_questions}
                </div>
                <div className="text-sm text-gray-500">Total Questions</div>
              </div>
              <div>
                <div className="text-2xl font-light text-green-600">
                  {stats.easy_count}
                </div>
                <div className="text-sm text-gray-500">Easy</div>
              </div>
              <div>
                <div className="text-2xl font-light text-yellow-600">
                  {stats.medium_count}
                </div>
                <div className="text-sm text-gray-500">Medium</div>
              </div>
              <div>
                <div className="text-2xl font-light text-red-600">
                  {stats.hard_count}
                </div>
                <div className="text-sm text-gray-500">Hard</div>
              </div>
            </div>
          </div>
        )}

        {data?.questions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No questions found matching your criteria.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      {/* Add to Path Modal */}
      {showAddToPathModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add to Path: {selectedQuestion?.title}
            </h3>

            {userPaths.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  You haven&apos;t created any paths yet.
                </p>
                <Link
                  href="/paths"
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Create Your First Path
                </Link>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {userPaths.map((path) => (
                  <div
                    key={path.id}
                    onClick={() => addQuestionToPath(path.id)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <h4 className="font-medium text-gray-900">{path.title}</h4>
                    <p className="text-sm text-gray-600">{path.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                        {path.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">
                        {path.question_ids?.length || 0} questions
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddToPathModal(false);
                  setSelectedQuestion(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
