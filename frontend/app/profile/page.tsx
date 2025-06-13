"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import StatsOverview from "../components/charts/StatsOverview";
import DifficultyChart from "../components/charts/DifficultyChart";
import LanguageChart from "../components/charts/LanguageChart";
import RecentSubmissions from "../components/charts/RecentSubmissions";

interface ProfileStats {
  status: string;
  username: string;
  leetcodeStats: {
    solvingStats: {
      totalSolved: number;
      easySolved: number;
      mediumSolved: number;
      hardSolved: number;
      totalQuestions: number;
      totalEasy: number;
      totalMedium: number;
      totalHard: number;
      ranking: number;
      contributionPoint: number;
    };
    recentSubmissions: Array<{
      title: string;
      titleSlug: string;
      status: string;
      language: string;
      date: string;
      timestamp: number;
      url: string;
    }>;
    languageStats: {
      languages: Array<{ language: string; count: number }>;
      totalSubmissions: number;
      uniqueLanguages: number;
    };
    difficultyProgress: {
      easy: { solved: number; total: number; percentage: number };
      medium: { solved: number; total: number; percentage: number };
      hard: { solved: number; total: number; percentage: number };
      overall: { solved: number; total: number; percentage: number };
    };
  };
  localStats: {
    tracked_questions: number;
    enrolled_paths: number;
    completed_paths: number;
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/v1/leetcode/profile/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "error") {
          throw new Error(data.message || "Failed to fetch profile stats");
        }

        setStats(data);
      } catch (err) {
        console.error("Error fetching profile stats:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, router]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "#1e1e2e",
          fontFamily: "monospace",
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #313244 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, #45475a 0%, transparent 50%)
          `,
        }}
      >
        <div
          className="p-8"
          style={{
            backgroundColor: "#313244",
            border: "4px solid #45475a",
            boxShadow: "8px 8px 0px #11111b",
          }}
        >
          <p
            className="text-xl font-mono font-bold tracking-wider"
            style={{ color: "#cdd6f4" }}
          >
            {">"} [LOADING_PROFILE_DATA...]
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundColor: "#1e1e2e",
          fontFamily: "monospace",
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #313244 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, #45475a 0%, transparent 50%)
          `,
        }}
      >
        <div
          className="max-w-md mx-auto p-8 space-y-6"
          style={{
            backgroundColor: "#181825",
            border: "4px solid #f38ba8",
            boxShadow: "8px 8px 0px #11111b",
          }}
        >
          <div className="text-center space-y-4">
            <div className="text-6xl font-mono" style={{ color: "#f38ba8" }}>
              [ERROR]
            </div>
            <h2
              className="text-2xl font-mono font-bold tracking-wider"
              style={{ color: "#f38ba8" }}
            >
              {">"} SYSTEM_FAILURE_DETECTED
            </h2>
            <p className="font-mono text-sm" style={{ color: "#cdd6f4" }}>
              {error}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full p-4 font-mono font-bold text-sm tracking-wider transition-all duration-200 focus:outline-none"
            style={{
              backgroundColor: "#a6e3a1",
              color: "#1e1e2e",
              border: "3px solid #a6e3a1",
              boxShadow: "6px 6px 0px #11111b",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-2px, -2px)";
              e.currentTarget.style.boxShadow = "8px 8px 0px #11111b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0px, 0px)";
              e.currentTarget.style.boxShadow = "6px 6px 0px #11111b";
            }}
          >
            {">"} [RETRY_CONNECTION]
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "#1e1e2e",
          fontFamily: "monospace",
        }}
      >
        <div
          className="p-8"
          style={{
            backgroundColor: "#313244",
            border: "4px solid #6c7086",
            boxShadow: "8px 8px 0px #11111b",
          }}
        >
          <p className="font-mono tracking-wider" style={{ color: "#6c7086" }}>
            {">"} [NO_DATA_AVAILABLE]
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#1e1e2e",
        fontFamily: "monospace",
      }}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div
            className="mb-6 p-6"
            style={{
              backgroundColor: "#313244",
              border: "4px solid #89b4fa",
              boxShadow: "4px 4px 0px #11111b",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 flex items-center justify-center border-4"
                style={{
                  backgroundColor: "#181825",
                  borderColor: "#45475a",
                  boxShadow: "4px 4px 0px #11111b",
                }}
              >
                <span className="text-2xl">👨‍💻</span>
              </div>
              <div>
                <h1
                  className="text-3xl font-mono font-bold tracking-wider"
                  style={{ color: "#cdd6f4" }}
                >
                  {">"} [USER_PROFILE_TERMINAL]
                </h1>
                <p
                  className="font-mono text-sm tracking-wide"
                  style={{ color: "#6c7086" }}
                >
                  user.email:{" "}
                  <span style={{ color: "#89b4fa" }}>{user.email}</span>
                </p>
                <p
                  className="font-mono text-sm tracking-wide"
                  style={{ color: "#6c7086" }}
                >
                  leetcode.username:{" "}
                  <span style={{ color: "#a6e3a1" }}>{stats.username}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Local Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="p-4"
              style={{
                backgroundColor: "#313244",
                border: "4px solid #a6e3a1",
                boxShadow: "4px 4px 0px #11111b",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">📝</span>
                <div>
                  <div
                    className="text-2xl font-mono font-bold"
                    style={{ color: "#a6e3a1" }}
                  >
                    {stats.localStats.tracked_questions}
                  </div>
                  <div
                    className="text-xs font-mono tracking-wide"
                    style={{ color: "#6c7086" }}
                  >
                    {">"} [TRACKED_QUESTIONS]
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-4"
              style={{
                backgroundColor: "#313244",
                border: "4px solid #89b4fa",
                boxShadow: "4px 4px 0px #11111b",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛤️</span>
                <div>
                  <div
                    className="text-2xl font-mono font-bold"
                    style={{ color: "#89b4fa" }}
                  >
                    {stats.localStats.enrolled_paths}
                  </div>
                  <div
                    className="text-xs font-mono tracking-wide"
                    style={{ color: "#6c7086" }}
                  >
                    {">"} [ENROLLED_PATHS]
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-4"
              style={{
                backgroundColor: "#313244",
                border: "4px solid #f9e2af",
                boxShadow: "4px 4px 0px #11111b",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <div>
                  <div
                    className="text-2xl font-mono font-bold"
                    style={{ color: "#f9e2af" }}
                  >
                    {stats.localStats.completed_paths}
                  </div>
                  <div
                    className="text-xs font-mono tracking-wide"
                    style={{ color: "#6c7086" }}
                  >
                    {">"} [COMPLETED_PATHS]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Stats Overview */}
          <div className="xl:col-span-2">
            <StatsOverview stats={stats.leetcodeStats.solvingStats} />
          </div>

          {/* Difficulty Chart */}
          <div>
            <DifficultyChart stats={stats.leetcodeStats.difficultyProgress} />
          </div>

          {/* Language Chart */}
          <div>
            <LanguageChart stats={stats.leetcodeStats.languageStats} />
          </div>

          {/* Recent Submissions */}
          <div className="xl:col-span-2">
            <RecentSubmissions
              submissions={stats.leetcodeStats.recentSubmissions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
