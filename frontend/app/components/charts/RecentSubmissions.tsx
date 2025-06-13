"use client";

import React from "react";

interface Submission {
  title: string;
  titleSlug: string;
  status: string;
  language: string;
  date: string;
  timestamp: number;
  url: string;
}

interface RecentSubmissionsProps {
  submissions: Submission[];
}

export default function RecentSubmissions({
  submissions,
}: RecentSubmissionsProps) {
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

      {submissions.length === 0 ? (
        <div className="text-center py-8" style={{ color: "#6c7086" }}>
          <div className="text-4xl mb-4">📝</div>
          <p className="font-mono tracking-wide">
            {">"} no_recent_submissions_found
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.slice(0, 10).map((submission, index) => (
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
                      e.currentTarget.style.transform = "translate(-1px, -1px)";
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
