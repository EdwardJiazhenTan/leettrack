"use client";

import React, { useState, useEffect } from "react";

interface Submission {
  title: string;
  titleSlug: string;
  status: string;
  language: string;
  date: string;
  timestamp: number;
  url: string;
}

interface SubmissionNeedingRating {
  user_question_id: number;
  question_id: number;
  title: string;
  title_slug: string;
  url: string;
  difficulty: string;
  solved_at: string;
  language: string;
  leetcode_submission: {
    status: string;
    timestamp: number;
    date: string;
  };
}

interface ConfidenceLevel {
  value: string;
  label: string;
  description: string;
  intervals: number[];
  color: string;
}

interface RecentSubmissionsProps {
  submissions: Submission[];
}

export default function RecentSubmissions({
  submissions,
}: RecentSubmissionsProps) {
  const [submissionsNeedingRating, setSubmissionsNeedingRating] = useState<
    SubmissionNeedingRating[]
  >([]);
  const [confidenceLevels, setConfidenceLevels] = useState<ConfidenceLevel[]>(
    []
  );
  const [ratingLoading, setRatingLoading] = useState(false);
  const [showRatingSection, setShowRatingSection] = useState(true);

  useEffect(() => {
    fetchSubmissionsNeedingRating();
  }, []);

  const fetchSubmissionsNeedingRating = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch(
        "http://localhost:5000/api/v1/auth/user/recent-submissions/need-rating",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.status === "success") {
          setSubmissionsNeedingRating(result.data.submissions);
          setConfidenceLevels(result.data.confidence_levels);
        }
      }
    } catch (error) {
      console.error("Error fetching submissions needing rating:", error);
    }
  };

  const handleRateQuestion = async (
    userQuestionId: number,
    confidence: string,
    notes?: string
  ) => {
    try {
      setRatingLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch(
        `http://localhost:5000/api/v1/auth/user/questions/${userQuestionId}/rate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ confidence, notes }),
        }
      );

      if (response.ok) {
        // Remove the rated question from the list
        setSubmissionsNeedingRating((prev) =>
          prev.filter((sub) => sub.user_question_id !== userQuestionId)
        );
      }
    } catch (error) {
      console.error("Error rating question:", error);
    } finally {
      setRatingLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "ac":
        return "#a6e3a1";
      case "wrong answer":
      case "wa":
        return "#f38ba8";
      case "time limit exceeded":
      case "tle":
        return "#f9e2af";
      case "runtime error":
      case "re":
        return "#fab387";
      case "memory limit exceeded":
      case "mle":
        return "#cba6f7";
      default:
        return "#6c7086";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "ac":
        return "✅";
      case "wrong answer":
      case "wa":
        return "❌";
      case "time limit exceeded":
      case "tle":
        return "⏰";
      case "runtime error":
      case "re":
        return "💥";
      case "memory limit exceeded":
      case "mle":
        return "🧠";
      default:
        return "❓";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "#a6e3a1";
      case "medium":
        return "#f9e2af";
      case "hard":
        return "#f38ba8";
      default:
        return "#6c7086";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const acceptedCount = submissions.filter(
    (sub) =>
      sub.status.toLowerCase() === "accepted" ||
      sub.status.toLowerCase() === "ac"
  ).length;
  const successRate =
    submissions.length > 0
      ? Math.round((acceptedCount / submissions.length) * 100)
      : 0;

  return (
    <div
      className="p-6"
      style={{
        backgroundColor: "#313244",
        border: "4px solid #89b4fa",
        boxShadow: "4px 4px 0px #11111b",
        fontFamily: "monospace",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className="text-xl font-bold font-mono tracking-wider"
          style={{ color: "#89b4fa" }}
        >
          {">"} [RECENT_SUBMISSIONS]
        </h3>
        <div className="flex items-center gap-4">
          <div
            className="text-sm font-mono tracking-wide"
            style={{ color: "#6c7086" }}
          >
            {">"} success_rate:{" "}
            <span style={{ color: "#a6e3a1" }}>{successRate}%</span>
          </div>
          <div
            className="text-sm font-mono tracking-wide"
            style={{ color: "#6c7086" }}
          >
            {">"} total:{" "}
            <span style={{ color: "#cdd6f4" }}>{submissions.length}</span>
          </div>
        </div>
      </div>

      {/* Questions Needing Rating Section */}
      {submissionsNeedingRating.length > 0 && showRatingSection && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4
              className="text-lg font-bold font-mono tracking-wider"
              style={{ color: "#f9e2af" }}
            >
              {">"} [RATE_YOUR_SOLUTIONS] ({submissionsNeedingRating.length})
            </h4>
            <button
              onClick={() => setShowRatingSection(false)}
              className="text-xs font-mono px-2 py-1 border"
              style={{
                color: "#6c7086",
                borderColor: "#6c7086",
                backgroundColor: "transparent",
              }}
            >
              [HIDE]
            </button>
          </div>

          <div
            className="p-4 mb-4"
            style={{
              backgroundColor: "#181825",
              border: "2px solid #f9e2af",
              boxShadow: "2px 2px 0px #11111b",
            }}
          >
            <p
              className="text-sm font-mono tracking-wide"
              style={{ color: "#cdd6f4" }}
            >
              {">"} Rate your confidence on these recent accepted solutions to
              start spaced repetition reviews.
            </p>
          </div>

          <div className="space-y-4">
            {submissionsNeedingRating.map((submission) => (
              <SubmissionRatingCard
                key={submission.user_question_id}
                submission={submission}
                confidenceLevels={confidenceLevels}
                onRate={handleRateQuestion}
                isLoading={ratingLoading}
                getDifficultyColor={getDifficultyColor}
                formatDate={formatDate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Show rating section toggle if hidden */}
      {!showRatingSection && submissionsNeedingRating.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setShowRatingSection(true)}
            className="px-4 py-2 text-sm font-mono font-bold tracking-wide transition-all duration-200"
            style={{
              color: "#1e1e2e",
              backgroundColor: "#f9e2af",
              border: "2px solid #f9e2af",
              boxShadow: "2px 2px 0px #11111b",
            }}
          >
            [SHOW_RATING_SECTION] ({submissionsNeedingRating.length})
          </button>
        </div>
      )}

      {/* Regular Recent Submissions */}
      {submissions.length === 0 ? (
        <div className="text-center py-8" style={{ color: "#6c7086" }}>
          <div className="text-4xl mb-4">📝</div>
          <p className="font-mono tracking-wide">
            {">"} no_recent_submissions_found
          </p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-[#313244] scrollbar-thumb-[#45475a] hover:scrollbar-thumb-[#585b70]">
          <div className="space-y-3 pr-2">
            {submissions.map((submission, index) => (
              <div
                key={`${submission.titleSlug}-${submission.timestamp}-${index}`}
                className="p-4 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: "#181825",
                  border: `2px solid ${getStatusColor(submission.status)}`,
                  boxShadow: "2px 2px 0px #11111b",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translate(-1px, -1px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "3px 3px 0px #11111b";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translate(0px, 0px) scale(1)";
                  e.currentTarget.style.boxShadow = "2px 2px 0px #11111b";
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {getStatusIcon(submission.status)}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          className="font-mono font-semibold text-sm tracking-wide"
                          style={{ color: "#cdd6f4" }}
                        >
                          {submission.title}
                        </h4>
                        <span
                          className="text-xs font-mono px-2 py-1 border"
                          style={{
                            color: getStatusColor(submission.status),
                            borderColor: getStatusColor(submission.status),
                            backgroundColor: `${getStatusColor(
                              submission.status
                            )}20`,
                          }}
                        >
                          {submission.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span
                          className="text-xs font-mono tracking-wide"
                          style={{ color: "#6c7086" }}
                        >
                          {">"} lang:{" "}
                          <span style={{ color: "#f9e2af" }}>
                            {submission.language}
                          </span>
                        </span>
                        <span
                          className="text-xs font-mono tracking-wide"
                          style={{ color: "#6c7086" }}
                        >
                          {">"} date:{" "}
                          <span style={{ color: "#89b4fa" }}>
                            {formatDate(submission.date)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {submission.url && (
                    <a
                      href={submission.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-xs font-mono font-bold tracking-wide transition-all duration-200"
                      style={{
                        color: "#1e1e2e",
                        backgroundColor: "#89b4fa",
                        border: "2px solid #89b4fa",
                        boxShadow: "2px 2px 0px #11111b",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#74c7ec";
                        e.currentTarget.style.borderColor = "#74c7ec";
                        e.currentTarget.style.transform =
                          "translate(-1px, -1px)";
                        e.currentTarget.style.boxShadow = "3px 3px 0px #11111b";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#89b4fa";
                        e.currentTarget.style.borderColor = "#89b4fa";
                        e.currentTarget.style.transform = "translate(0px, 0px)";
                        e.currentTarget.style.boxShadow = "2px 2px 0px #11111b";
                      }}
                    >
                      [VIEW]
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t-2" style={{ borderColor: "#45475a" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div
              className="text-xl font-bold font-mono"
              style={{ color: "#a6e3a1" }}
            >
              {acceptedCount}
            </div>
            <div
              className="text-xs font-mono tracking-wide"
              style={{ color: "#6c7086" }}
            >
              {">"} accepted
            </div>
          </div>
          <div className="text-center">
            <div
              className="text-xl font-bold font-mono"
              style={{ color: "#f38ba8" }}
            >
              {submissions.length - acceptedCount}
            </div>
            <div
              className="text-xs font-mono tracking-wide"
              style={{ color: "#6c7086" }}
            >
              {">"} failed
            </div>
          </div>
          <div className="text-center">
            <div
              className="text-xl font-bold font-mono"
              style={{ color: "#f9e2af" }}
            >
              {new Set(submissions.map((s) => s.language)).size}
            </div>
            <div
              className="text-xs font-mono tracking-wide"
              style={{ color: "#6c7086" }}
            >
              {">"} languages
            </div>
          </div>
          <div className="text-center">
            <div
              className="text-xl font-bold font-mono"
              style={{ color: "#cba6f7" }}
            >
              {new Set(submissions.map((s) => s.titleSlug)).size}
            </div>
            <div
              className="text-xs font-mono tracking-wide"
              style={{ color: "#6c7086" }}
            >
              {">"} problems
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Separate component for rating cards
interface SubmissionRatingCardProps {
  submission: SubmissionNeedingRating;
  confidenceLevels: ConfidenceLevel[];
  onRate: (userQuestionId: number, confidence: string, notes?: string) => void;
  isLoading: boolean;
  getDifficultyColor: (difficulty: string) => string;
  formatDate: (dateString: string) => string;
}

function SubmissionRatingCard({
  submission,
  confidenceLevels,
  onRate,
  isLoading,
  getDifficultyColor,
  formatDate,
}: SubmissionRatingCardProps) {
  const [selectedConfidence, setSelectedConfidence] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [showRating, setShowRating] = useState(false);

  const handleSubmitRating = () => {
    if (selectedConfidence) {
      onRate(submission.user_question_id, selectedConfidence, notes);
    }
  };

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: "#181825",
        border: "2px solid #f9e2af",
        boxShadow: "2px 2px 0px #11111b",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">✅</span>
          <div>
            <div className="flex items-center gap-2">
              <h4
                className="font-mono font-semibold text-sm tracking-wide"
                style={{ color: "#cdd6f4" }}
              >
                {submission.title}
              </h4>
              <span
                className="text-xs font-mono px-2 py-1 border"
                style={{
                  color: getDifficultyColor(submission.difficulty),
                  borderColor: getDifficultyColor(submission.difficulty),
                  backgroundColor: `${getDifficultyColor(
                    submission.difficulty
                  )}20`,
                }}
              >
                {submission.difficulty.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <span
                className="text-xs font-mono tracking-wide"
                style={{ color: "#6c7086" }}
              >
                {">"} lang:{" "}
                <span style={{ color: "#f9e2af" }}>{submission.language}</span>
              </span>
              <span
                className="text-xs font-mono tracking-wide"
                style={{ color: "#6c7086" }}
              >
                {">"} solved:{" "}
                <span style={{ color: "#89b4fa" }}>
                  {formatDate(submission.leetcode_submission.date)}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={submission.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 text-xs font-mono font-bold tracking-wide"
            style={{
              color: "#1e1e2e",
              backgroundColor: "#89b4fa",
              border: "2px solid #89b4fa",
              boxShadow: "2px 2px 0px #11111b",
            }}
          >
            [VIEW]
          </a>
          <button
            onClick={() => setShowRating(!showRating)}
            className="px-2 py-1 text-xs font-mono font-bold tracking-wide"
            style={{
              color: "#1e1e2e",
              backgroundColor: "#f9e2af",
              border: "2px solid #f9e2af",
              boxShadow: "2px 2px 0px #11111b",
            }}
          >
            {showRating ? "[HIDE]" : "[RATE]"}
          </button>
        </div>
      </div>

      {showRating && (
        <div
          className="mt-4 p-4"
          style={{
            backgroundColor: "#313244",
            border: "2px solid #45475a",
          }}
        >
          <p
            className="text-sm font-mono tracking-wide mb-4"
            style={{ color: "#cdd6f4" }}
          >
            {">"} How confident are you with this solution?
          </p>

          <div className="space-y-2 mb-4">
            {confidenceLevels.map((level) => (
              <label
                key={level.value}
                className="flex items-center gap-3 p-2 cursor-pointer font-mono text-sm"
                style={{
                  backgroundColor:
                    selectedConfidence === level.value
                      ? `${level.color}20`
                      : "transparent",
                  border: `1px solid ${
                    selectedConfidence === level.value ? level.color : "#45475a"
                  }`,
                }}
              >
                <input
                  type="radio"
                  name={`confidence-${submission.user_question_id}`}
                  value={level.value}
                  checked={selectedConfidence === level.value}
                  onChange={(e) => setSelectedConfidence(e.target.value)}
                  className="sr-only"
                />
                <span
                  className="w-4 h-4 border-2 rounded-full flex items-center justify-center"
                  style={{
                    borderColor: level.color,
                    backgroundColor:
                      selectedConfidence === level.value
                        ? level.color
                        : "transparent",
                  }}
                >
                  {selectedConfidence === level.value && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "#1e1e2e" }}
                    />
                  )}
                </span>
                <div>
                  <span style={{ color: level.color }}>{level.label}</span>
                  <span style={{ color: "#6c7086" }}>
                    {" "}
                    - {level.description}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes about your solution..."
            className="w-full p-2 text-sm font-mono"
            style={{
              backgroundColor: "#181825",
              border: "2px solid #45475a",
              color: "#cdd6f4",
              minHeight: "60px",
            }}
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowRating(false)}
              className="px-3 py-1 text-xs font-mono font-bold tracking-wide"
              style={{
                color: "#6c7086",
                backgroundColor: "transparent",
                border: "2px solid #6c7086",
              }}
            >
              [CANCEL]
            </button>
            <button
              onClick={handleSubmitRating}
              disabled={!selectedConfidence || isLoading}
              className="px-3 py-1 text-xs font-mono font-bold tracking-wide transition-all duration-200"
              style={{
                color: "#1e1e2e",
                backgroundColor: selectedConfidence ? "#a6e3a1" : "#6c7086",
                border: `2px solid ${
                  selectedConfidence ? "#a6e3a1" : "#6c7086"
                }`,
                boxShadow: "2px 2px 0px #11111b",
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              {isLoading ? "[RATING...]" : "[SUBMIT_RATING]"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
