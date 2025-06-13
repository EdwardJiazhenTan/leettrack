"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

interface Question {
  sequence_number: number;
  question_id: number;
  leetcode_id: number;
  title: string;
  url: string;
  difficulty: string;
  tags: string[];
  notes: string;
  estimated_minutes: number;
  importance: number;
}

interface LearningPath {
  path_id: number;
  name: string;
  description: string;
  difficulty_level: string;
  estimated_hours: number;
  tags: string[];
  created_at: string;
  source: string;
  questions: Question[];
}

export default function PathDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const pathId = params.id as string;

  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(
    new Set()
  );
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const colors = {
    base: "#1e1e2e",
    surface: "#313244",
    overlay: "#45475a",
    text: "#cdd6f4",
    primary: "#89b4fa",
    accent: "#a6e3a1",
    warning: "#f9e2af",
    error: "#f38ba8",
    pink: "#f38ba8",
    purple: "#cba6f7",
    success: "#a6e3a1",
  };

  useEffect(() => {
    if (pathId) {
      fetchPath();
    }
  }, [pathId]);

  const fetchPath = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/learning-paths/${pathId}`
      );
      if (!res.ok) throw new Error("Failed to fetch path");

      const data = await res.json();
      setPath(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const enrollInPath = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setEnrolling(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:5000/api/v1/user/learning-paths/${pathId}/enroll`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setError(null);
        // Show success message or update UI
      } else {
        const data = await res.json();
        setError(data.message || "Failed to enroll in path");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setEnrolling(false);
    }
  };

  const toggleQuestionComplete = (questionId: number) => {
    const newCompleted = new Set(completedQuestions);
    if (newCompleted.has(questionId)) {
      newCompleted.delete(questionId);
    } else {
      newCompleted.add(questionId);
    }
    setCompletedQuestions(newCompleted);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "#a6e3a1";
      case "Medium":
        return "#f9e2af";
      case "Hard":
        return "#f38ba8";
      default:
        return colors.overlay;
    }
  };

  const getImportanceStars = (importance: number) => {
    return "★".repeat(importance) + "☆".repeat(5 - importance);
  };

  const progressPercentage = path?.questions.length
    ? Math.round((completedQuestions.size / path.questions.length) * 100)
    : 0;

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.base, color: colors.text }}
      >
        <div className="font-mono text-2xl">[LOADING_PATH...]</div>
      </div>
    );
  }

  if (!path) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.base, color: colors.text }}
      >
        <div className="font-mono text-2xl">[PATH_NOT_FOUND]</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.base, fontFamily: "monospace" }}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => router.push("/paths")}
                className="px-3 py-1 border-2 hover:bg-opacity-80 transition-all text-sm"
                style={{
                  backgroundColor: colors.overlay,
                  color: colors.text,
                  border: `2px solid ${colors.overlay}`,
                }}
              >
                [← BACK_TO_PATHS]
              </button>
              <div className="flex gap-2">
                <span
                  className="px-3 py-1 text-sm font-bold rounded"
                  style={{
                    backgroundColor:
                      path.difficulty_level === "Beginner"
                        ? "#a6e3a1"
                        : path.difficulty_level === "Intermediate"
                        ? "#f9e2af"
                        : "#f38ba8",
                    color: colors.base,
                  }}
                >
                  {path.difficulty_level}
                </span>
                <span
                  className="px-3 py-1 text-sm font-bold rounded"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.base,
                  }}
                >
                  {path.source}
                </span>
              </div>
            </div>

            <h1
              className="text-4xl font-bold mb-4"
              style={{ color: colors.primary }}
            >
              {path.name}
            </h1>

            <p
              className="text-lg mb-6 leading-relaxed"
              style={{ color: colors.text }}
            >
              {path.description}
            </p>

            {/* Path Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div
                className="text-center p-4 border-2"
                style={{
                  backgroundColor: colors.surface,
                  border: `2px solid ${colors.overlay}`,
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: colors.warning }}
                >
                  {path.questions.length}
                </div>
                <div className="text-sm" style={{ color: colors.text }}>
                  QUESTIONS
                </div>
              </div>
              <div
                className="text-center p-4 border-2"
                style={{
                  backgroundColor: colors.surface,
                  border: `2px solid ${colors.overlay}`,
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: colors.accent }}
                >
                  {path.estimated_hours || "N/A"}
                </div>
                <div className="text-sm" style={{ color: colors.text }}>
                  HOURS
                </div>
              </div>
              <div
                className="text-center p-4 border-2"
                style={{
                  backgroundColor: colors.surface,
                  border: `2px solid ${colors.overlay}`,
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: colors.success }}
                >
                  {completedQuestions.size}
                </div>
                <div className="text-sm" style={{ color: colors.text }}>
                  COMPLETED
                </div>
              </div>
              <div
                className="text-center p-4 border-2"
                style={{
                  backgroundColor: colors.surface,
                  border: `2px solid ${colors.overlay}`,
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: colors.purple }}
                >
                  {progressPercentage}%
                </div>
                <div className="text-sm" style={{ color: colors.text }}>
                  PROGRESS
                </div>
              </div>
            </div>
          </div>

          {/* Enroll Button */}
          <div className="ml-8">
            <button
              onClick={enrollInPath}
              disabled={enrolling}
              className="px-6 py-3 font-bold border-2 hover:bg-opacity-80 transition-all"
              style={{
                backgroundColor: colors.accent,
                color: colors.base,
                border: `2px solid ${colors.accent}`,
                boxShadow: "4px 4px 0px #11111b",
                cursor: enrolling ? "not-allowed" : "pointer",
              }}
            >
              {enrolling ? "[ENROLLING...]" : "[ENROLL_IN_PATH]"}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div
            className="p-4 mb-6 border-2"
            style={{
              backgroundColor: colors.error,
              color: colors.base,
              border: `2px solid ${colors.error}`,
              boxShadow: "4px 4px 0px #11111b",
            }}
          >
            [ERROR] {error}
          </div>
        )}

        {/* Progress Bar */}
        <div
          className="mb-8 p-4 border-2"
          style={{
            backgroundColor: colors.surface,
            border: `2px solid ${colors.overlay}`,
            boxShadow: "4px 4px 0px #11111b",
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold" style={{ color: colors.accent }}>
              [PROGRESS_TRACKER]
            </span>
            <span style={{ color: colors.text }}>
              {completedQuestions.size}/{path.questions.length} questions
              completed
            </span>
          </div>
          <div
            className="w-full h-4 border-2"
            style={{
              backgroundColor: colors.overlay,
              border: `2px solid ${colors.overlay}`,
            }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                backgroundColor: colors.accent,
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* Tags */}
        {path.tags && path.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold mb-3" style={{ color: colors.purple }}>
              [TAGS]
            </h3>
            <div className="flex flex-wrap gap-2">
              {path.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded border"
                  style={{
                    backgroundColor: colors.purple,
                    color: colors.base,
                    border: `1px solid ${colors.purple}`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Questions List */}
        <div
          className="border-2 p-6"
          style={{
            backgroundColor: colors.surface,
            border: `2px solid ${colors.overlay}`,
            boxShadow: "6px 6px 0px #11111b",
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: colors.primary }}
          >
            [QUESTIONS] ({path.questions.length})
          </h2>

          <div className="space-y-4">
            {path.questions.map((question) => (
              <div
                key={question.question_id}
                className="border-2 p-4 transition-all"
                style={{
                  backgroundColor: completedQuestions.has(question.question_id)
                    ? colors.overlay
                    : colors.base,
                  border: `2px solid ${colors.overlay}`,
                  opacity: completedQuestions.has(question.question_id)
                    ? 0.7
                    : 1,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Completion Checkbox */}
                    <button
                      onClick={() =>
                        toggleQuestionComplete(question.question_id)
                      }
                      className="w-6 h-6 border-2 flex items-center justify-center hover:bg-opacity-80"
                      style={{
                        backgroundColor: completedQuestions.has(
                          question.question_id
                        )
                          ? colors.success
                          : colors.overlay,
                        border: `2px solid ${colors.success}`,
                        color: colors.base,
                      }}
                    >
                      {completedQuestions.has(question.question_id) && "✓"}
                    </button>

                    {/* Question Number */}
                    <span
                      className="px-3 py-1 text-sm font-bold rounded min-w-[3rem] text-center"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.base,
                      }}
                    >
                      #{question.sequence_number}
                    </span>

                    {/* Question Title */}
                    <div className="flex-1">
                      <h3
                        className="text-lg font-bold mb-1"
                        style={{
                          color: colors.text,
                          textDecoration: completedQuestions.has(
                            question.question_id
                          )
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {question.title}
                      </h3>
                      <div className="flex gap-2">
                        <span
                          className="px-2 py-1 text-xs font-bold rounded"
                          style={{
                            backgroundColor: getDifficultyColor(
                              question.difficulty
                            ),
                            color: colors.base,
                          }}
                        >
                          {question.difficulty}
                        </span>
                        <span
                          className="px-2 py-1 text-xs rounded"
                          style={{
                            backgroundColor: colors.warning,
                            color: colors.base,
                          }}
                        >
                          {question.estimated_minutes} min
                        </span>
                        <span
                          className="px-2 py-1 text-xs rounded"
                          style={{
                            backgroundColor: colors.accent,
                            color: colors.base,
                          }}
                        >
                          {getImportanceStars(question.importance)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setExpandedQuestion(
                          expandedQuestion === question.question_id
                            ? null
                            : question.question_id
                        )
                      }
                      className="px-3 py-1 text-sm border hover:bg-opacity-80"
                      style={{
                        backgroundColor: colors.purple,
                        color: colors.base,
                        border: `1px solid ${colors.purple}`,
                      }}
                    >
                      {expandedQuestion === question.question_id
                        ? "[COLLAPSE]"
                        : "[DETAILS]"}
                    </button>
                    <a
                      href={question.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-sm border hover:bg-opacity-80"
                      style={{
                        backgroundColor: colors.pink,
                        color: colors.base,
                        border: `1px solid ${colors.pink}`,
                      }}
                    >
                      [SOLVE_ON_LEETCODE]
                    </a>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedQuestion === question.question_id && (
                  <div
                    className="mt-4 p-4 border-2"
                    style={{
                      backgroundColor: colors.overlay,
                      border: `2px solid ${colors.overlay}`,
                    }}
                  >
                    {question.notes && (
                      <div className="mb-4">
                        <h4
                          className="font-bold mb-2"
                          style={{ color: colors.accent }}
                        >
                          [NOTES]
                        </h4>
                        <p style={{ color: colors.text }}>{question.notes}</p>
                      </div>
                    )}

                    {question.tags && question.tags.length > 0 && (
                      <div className="mb-4">
                        <h4
                          className="font-bold mb-2"
                          style={{ color: colors.accent }}
                        >
                          [TAGS]
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {question.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs rounded"
                              style={{
                                backgroundColor: colors.purple,
                                color: colors.base,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h4
                          className="font-bold text-sm"
                          style={{ color: colors.accent }}
                        >
                          [LEETCODE_ID]
                        </h4>
                        <span style={{ color: colors.text }}>
                          #{question.leetcode_id}
                        </span>
                      </div>
                      <div>
                        <h4
                          className="font-bold text-sm"
                          style={{ color: colors.accent }}
                        >
                          [ESTIMATED_TIME]
                        </h4>
                        <span style={{ color: colors.text }}>
                          {question.estimated_minutes} minutes
                        </span>
                      </div>
                      <div>
                        <h4
                          className="font-bold text-sm"
                          style={{ color: colors.accent }}
                        >
                          [IMPORTANCE]
                        </h4>
                        <span style={{ color: colors.text }}>
                          {getImportanceStars(question.importance)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {path.questions.length === 0 && (
            <div className="text-center py-12" style={{ color: colors.text }}>
              <div className="text-xl font-bold mb-2">
                [NO_QUESTIONS_AVAILABLE]
              </div>
              <div>This path doesn&apos;t have any questions yet.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
