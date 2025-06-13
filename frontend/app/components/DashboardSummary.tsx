"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface DashboardSummaryData {
  questions_needing_rating: number;
  reviews_due_today: number;
  new_questions_available: number;
  active_learning_paths: number;
}

interface DashboardSummaryProps {
  onDataLoaded?: (data: DashboardSummaryData) => void;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  onDataLoaded,
}) => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!user || authLoading) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        "http://localhost:5000/api/v1/auth/user/dashboard/summary",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const result = await response.json();
      if (result.status === "success") {
        setData(result.data);
        onDataLoaded?.(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, authLoading]);

  if (loading) {
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
        <div className="animate-pulse">
          <div
            className="h-6 w-1/3 mb-6"
            style={{
              backgroundColor: "#45475a",
              border: "2px solid #6c7086",
            }}
          ></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32"
                style={{
                  backgroundColor: "#181825",
                  border: "4px solid #45475a",
                  boxShadow: "4px 4px 0px #11111b",
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-6"
        style={{
          backgroundColor: "#313244",
          border: "4px solid #f38ba8",
          boxShadow: "4px 4px 0px #11111b",
          fontFamily: "monospace",
        }}
      >
        <h3
          className="text-xl font-bold mb-6 font-mono tracking-wider"
          style={{ color: "#f38ba8" }}
        >
          {">"} [ERROR_LOADING_DASHBOARD]
        </h3>
        <p className="text-sm font-mono text-[#cdd6f4] tracking-wide mb-4">
          {error}
        </p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 font-mono font-bold transition-all duration-300 tracking-wider"
          style={{
            backgroundColor: "#f38ba8",
            color: "#1e1e2e",
            border: "4px solid #f38ba8",
            boxShadow: "4px 4px 0px #11111b",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(-2px, -2px)";
            e.currentTarget.style.boxShadow = "6px 6px 0px #11111b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translate(0px, 0px)";
            e.currentTarget.style.boxShadow = "4px 4px 0px #11111b";
          }}
        >
          [RETRY]
        </button>
      </div>
    );
  }

  if (!data) return null;

  const totalTasks = data.questions_needing_rating + data.reviews_due_today;
  const totalProgress =
    totalTasks > 0
      ? Math.round(
          (data.new_questions_available /
            (totalTasks + data.new_questions_available)) *
            100
        )
      : 100;

  const studyPlanSections = [
    {
      title: "[NEED_RATING]",
      count: data.questions_needing_rating,
      color: "#f9e2af",
      borderColor: "#f9e2af",
      icon: "📝",
      link: "/today#rating",
      description: "Rate solved questions",
      priority: data.questions_needing_rating > 0 ? "HIGH" : "NONE",
    },
    {
      title: "[REVIEW_TODAY]",
      count: data.reviews_due_today,
      color: "#89b4fa",
      borderColor: "#89b4fa",
      icon: "🔄",
      link: "/today#reviews",
      description: "Practice scheduled reviews",
      priority: data.reviews_due_today > 0 ? "HIGH" : "NONE",
    },
    {
      title: "[NEW_QUESTIONS]",
      count: data.new_questions_available,
      color: "#a6e3a1",
      borderColor: "#a6e3a1",
      icon: "🆕",
      link: "/today",
      description: "Start new problems",
      priority: data.new_questions_available > 0 ? "MEDIUM" : "NONE",
    },
  ];

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
      <h3
        className="text-xl font-bold mb-6 font-mono tracking-wider"
        style={{ color: "#89b4fa" }}
      >
        {">"} [TODAY&apos;S_STUDY_PLAN]
      </h3>

      {/* Overall Progress */}
      <div
        className="mb-6 p-4"
        style={{
          backgroundColor: "#181825",
          border: "2px solid #45475a",
          boxShadow: "2px 2px 0px #11111b",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className="font-mono font-semibold text-sm tracking-wide"
            style={{ color: "#6c7086" }}
          >
            {">"} system.tasks.priority_queue()
          </span>
          <span
            className="font-mono font-bold text-2xl"
            style={{
              color: totalTasks > 0 ? "#f38ba8" : "#a6e3a1",
            }}
          >
            {totalTasks} urgent
          </span>
        </div>
        <div
          className="w-full h-4 border-2"
          style={{
            backgroundColor: "#45475a",
            borderColor: "#6c7086",
          }}
        >
          <div
            className="h-full transition-all duration-1000 ease-out"
            style={{
              width: totalTasks > 0 ? "100%" : `${totalProgress}%`,
              backgroundColor: totalTasks > 0 ? "#f38ba8" : "#a6e3a1",
              boxShadow:
                totalTasks > 0
                  ? "inset 0 0 0 1px #eba0ac"
                  : "inset 0 0 0 1px #94e2d5",
            }}
          />
        </div>
        <div
          className="flex justify-between text-xs font-mono mt-2 tracking-wide"
          style={{ color: "#6c7086" }}
        >
          <span>{totalTasks} priority tasks</span>
          <span>{data.new_questions_available} new available</span>
        </div>
      </div>

      {/* Study Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {studyPlanSections.map((section) => (
          <button
            key={section.title}
            onClick={() => router.push(section.link)}
            className="p-4 transition-all duration-300 hover:scale-105 text-left"
            style={{
              backgroundColor: "#181825",
              border: `4px solid ${section.borderColor}`,
              boxShadow: "4px 4px 0px #11111b",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translate(-2px, -2px) scale(1.05)";
              e.currentTarget.style.boxShadow = "6px 6px 0px #11111b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0px, 0px) scale(1)";
              e.currentTarget.style.boxShadow = "4px 4px 0px #11111b";
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{section.icon}</span>
              <div className="text-right">
                <div
                  className="text-2xl font-bold font-mono"
                  style={{ color: section.color }}
                >
                  {section.count}
                </div>
                {section.priority !== "NONE" && (
                  <div
                    className="text-xs font-mono"
                    style={{
                      color:
                        section.priority === "HIGH" ? "#f38ba8" : "#f9e2af",
                    }}
                  >
                    {section.priority}
                  </div>
                )}
              </div>
            </div>

            <div
              className="text-xs font-mono font-semibold tracking-wide mb-2"
              style={{ color: "#cdd6f4" }}
            >
              {section.title}
            </div>

            <div
              className="text-xs font-mono tracking-wide"
              style={{ color: "#6c7086" }}
            >
              {">"} {section.description}
            </div>

            {section.count > 0 && (
              <div className="mt-3">
                <div
                  className="w-full h-2 border"
                  style={{
                    backgroundColor: "#45475a",
                    borderColor: "#6c7086",
                  }}
                >
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: "100%",
                      backgroundColor: section.color,
                    }}
                  />
                </div>
                <div
                  className="text-xs font-mono mt-1 tracking-wide"
                  style={{ color: "#cdd6f4" }}
                >
                  [CLICK_TO_START]
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Status Messages */}
      {totalTasks === 0 && data.new_questions_available > 0 && (
        <div
          className="mt-6 p-4"
          style={{
            backgroundColor: "#181825",
            border: "2px solid #a6e3a1",
            boxShadow: "2px 2px 0px #11111b",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <span
              className="font-mono text-sm tracking-wide"
              style={{ color: "#a6e3a1" }}
            >
              {">"} All caught up! Ready for new challenges.
            </span>
          </div>
        </div>
      )}

      {data.active_learning_paths === 0 && (
        <div
          className="mt-6 p-4"
          style={{
            backgroundColor: "#181825",
            border: "2px solid #cba6f7",
            boxShadow: "2px 2px 0px #11111b",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚀</span>
              <span
                className="font-mono text-sm tracking-wide"
                style={{ color: "#cba6f7" }}
              >
                {">"} Ready to start your coding journey?
              </span>
            </div>
            <button
              onClick={() => router.push("/paths")}
              className="px-4 py-2 font-mono font-semibold transition-all duration-300 tracking-wider text-sm"
              style={{
                backgroundColor: "#cba6f7",
                color: "#1e1e2e",
                border: "2px solid #cba6f7",
                boxShadow: "2px 2px 0px #11111b",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-1px, -1px)";
                e.currentTarget.style.boxShadow = "3px 3px 0px #11111b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0px, 0px)";
                e.currentTarget.style.boxShadow = "2px 2px 0px #11111b";
              }}
            >
              [BROWSE_PATHS]
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSummary;
