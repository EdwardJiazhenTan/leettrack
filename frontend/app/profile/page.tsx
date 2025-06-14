"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { buildApiUrl, API_ENDPOINTS } from "../config/api";
import Navbar from "../components/Navbar";
import ThreadsBackground from "../components/ThreadsBackground";
import Footer from "../components/Footer";
import StatsOverview from "../components/charts/StatsOverview";
import DifficultyChart from "../components/charts/DifficultyChart";
import LanguageChart from "../components/charts/LanguageChart";
import RecentSubmissions from "../components/charts/RecentSubmissions";
import ReviewRating from "../components/ReviewRating";
import DashboardSummary from "../components/DashboardSummary";
import UserSettings from "../components/UserSettings";
import ProgressBar from "../components/ProgressBar";

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

interface Question {
  user_question_id: number;
  question_id: number;
  title: string;
  url: string;
  difficulty: string;
  solved_at: string;
  times_reviewed: number;
}

interface ConfidenceLevel {
  value: string;
  label: string;
  description: string;
  color: string;
  intervals: number[];
}

interface RatingData {
  questions: Question[];
  confidence_levels: ConfidenceLevel[];
}

function ProfilePageContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("stats");

  // Toggle states for expandable sections
  const [showTodaysStudyPlan, setShowTodaysStudyPlan] = useState(true); // Open by default
  const [showStatsOverview, setShowStatsOverview] = useState(false);
  const [showDifficultyChart, setShowDifficultyChart] = useState(false);
  const [showLanguageStats, setShowLanguageStats] = useState(false);
  const [showRecentSubmissions, setShowRecentSubmissions] = useState(false);

  // Get active tab from URL params
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    // Don't redirect if auth is still loading
    if (authLoading) {
      return;
    }

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
          buildApiUrl(API_ENDPOINTS.LEETCODE_PROFILE_STATS),
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
  }, [user, authLoading, router]);

  const fetchRatingData = async () => {
    if (ratingData) return; // Already loaded

    try {
      setRatingLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch(
        buildApiUrl(API_ENDPOINTS.USER_QUESTIONS_NEED_RATING),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch rating data");
      }

      const result = await response.json();
      if (result.status === "success") {
        setRatingData(result.data);
      }
    } catch (err) {
      console.error("Error fetching rating data:", err);
    } finally {
      setRatingLoading(false);
    }
  };

  const handleRateQuestion = async (
    userQuestionId: number,
    confidence: string,
    notes?: string
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch(
        buildApiUrl(`/api/v1/auth/user/questions/${userQuestionId}/rate`),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ confidence, notes }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to rate question");
      }

      const result = await response.json();
      if (result.status === "success") {
        // Remove the rated question from the list
        setRatingData((prev) =>
          prev
            ? {
                ...prev,
                questions: prev.questions.filter(
                  (q) => q.user_question_id !== userQuestionId
                ),
              }
            : null
        );
      }
    } catch (err) {
      console.error("Error rating question:", err);
      throw err;
    }
  };

  const handleUsernameUpdate = (newUsername: string) => {
    // Update the stats state to reflect the new username
    if (stats) {
      setStats({
        ...stats,
        username: newUsername,
      });
    }
  };

  // Tab configuration
  const tabs = [
    { id: "stats", label: "Statistics", icon: "📊" },
    {
      id: "rating",
      label: "Rate Questions",
      icon: "📝",
      badge: ratingData?.questions.length || 0,
    },
    { id: "settings", label: "Settings", icon: "⚙️" },
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
    return null;
  }

  if (loading) {
    return (
      <ThreadsBackground className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-[#313244]/80 backdrop-blur-sm border-4 border-[#45475a] p-8 shadow-[4px_4px_0px_0px_#11111b]">
            <ProgressBar
              text="LOADING_PROFILE_DATA"
              duration={1800}
              showPercentage={true}
            />
          </div>
        </div>
        <Footer />
      </ThreadsBackground>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1e1e2e]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="bg-[#313244] border-4 border-[#f38ba8] p-8 shadow-[4px_4px_0px_0px_#11111b] inline-block">
              <div className="text-6xl mb-4 text-[#f38ba8]">[ERROR]</div>
              <h2 className="text-2xl font-mono font-bold text-[#f38ba8] tracking-wider mb-4">
                SYSTEM_FAILURE_DETECTED
              </h2>
              <p className="font-mono text-sm text-[#cdd6f4] mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#a6e3a1] text-[#1e1e2e] font-mono font-bold border-4 border-[#a6e3a1] hover:bg-[#94e2d5] hover:border-[#94e2d5] transition-all duration-200 shadow-[3px_3px_0px_0px_#11111b] tracking-wider"
              >
                [RETRY_CONNECTION]
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#1e1e2e]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="bg-[#313244] border-4 border-[#6c7086] p-8 shadow-[4px_4px_0px_0px_#11111b] inline-block">
              <p className="font-mono text-[#6c7086] tracking-wider">
                [NO_DATA_AVAILABLE]
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThreadsBackground className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6 bg-[#313244] border-4 border-[#89b4fa] p-6 shadow-[4px_4px_0px_0px_#11111b]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center bg-[#181825] border-4 border-[#45475a] shadow-[4px_4px_0px_0px_#11111b]">
                <span className="text-2xl">👨‍💻</span>
              </div>
              <div>
                <h1 className="text-3xl font-mono font-bold text-[#cdd6f4] tracking-wider">
                  [USER_PROFILE_TERMINAL]
                </h1>
                <p className="font-mono text-sm text-[#6c7086] tracking-wide">
                  user.email:{" "}
                  <span className="text-[#89b4fa]">{user.email}</span>
                </p>
                <p className="font-mono text-sm text-[#6c7086] tracking-wide">
                  leetcode.username:{" "}
                  <span className="text-[#a6e3a1]">{stats.username}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="bg-[#313244] border-4 border-[#45475a] p-2 shadow-[4px_4px_0px_0px_#11111b]">
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id === "rating") {
                        fetchRatingData();
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 font-mono font-bold tracking-wide transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-[#a6e3a1] text-[#1e1e2e] border-2 border-[#a6e3a1]"
                        : "text-[#cdd6f4] hover:text-[#a6e3a1] border-2 border-transparent"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    {tab.badge && tab.badge > 0 && (
                      <span className="bg-[#f38ba8] text-[#1e1e2e] text-xs px-2 py-1 font-mono font-bold tracking-wider shadow-[2px_2px_0px_0px_#11111b]">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "stats" && (
          <div className="space-y-4">
            {/* Today's Study Plan - Open by default */}
            <div className="bg-[#313244] border-4 border-[#89b4fa] shadow-[4px_4px_0px_0px_#11111b] overflow-hidden">
              <button
                onClick={() => setShowTodaysStudyPlan(!showTodaysStudyPlan)}
                className="w-full p-6 text-left hover:bg-[#45475a] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📋</span>
                    <h3 className="text-xl font-mono font-bold text-[#89b4fa] tracking-wider">
                      [TODAY&apos;S_STUDY_PLAN]
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-[#a6adc8]">
                      Daily tasks
                    </span>
                    <span
                      className={`text-2xl transition-transform duration-300 ease-in-out ${
                        showTodaysStudyPlan ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>
                  </div>
                </div>
              </button>
              <div
                className={`border-t-2 border-[#45475a] transition-all duration-500 ease-in-out ${
                  showTodaysStudyPlan
                    ? "max-h-[800px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
                style={{
                  overflow: "hidden",
                }}
              >
                <div
                  className={`p-6 transition-all duration-300 ease-in-out ${
                    showTodaysStudyPlan
                      ? "transform translate-y-0"
                      : "transform -translate-y-4"
                  }`}
                >
                  <DashboardSummary />
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="bg-[#313244] border-4 border-[#a6e3a1] shadow-[4px_4px_0px_0px_#11111b] overflow-hidden">
              <button
                onClick={() => setShowStatsOverview(!showStatsOverview)}
                className="w-full p-6 text-left hover:bg-[#45475a] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <h3 className="text-xl font-mono font-bold text-[#a6e3a1] tracking-wider">
                      [STATS_OVERVIEW]
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-[#a6adc8]">
                      {stats.leetcodeStats.solvingStats.totalSolved} solved
                    </span>
                    <span
                      className={`text-2xl transition-transform duration-300 ease-in-out ${
                        showStatsOverview ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>
                  </div>
                </div>
              </button>
              <div
                className={`border-t-2 border-[#45475a] transition-all duration-500 ease-in-out ${
                  showStatsOverview
                    ? "max-h-[800px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
                style={{
                  overflow: "hidden",
                }}
              >
                <div
                  className={`p-6 transition-all duration-300 ease-in-out ${
                    showStatsOverview
                      ? "transform translate-y-0"
                      : "transform -translate-y-4"
                  }`}
                >
                  <StatsOverview stats={stats.leetcodeStats.solvingStats} />
                </div>
              </div>
            </div>

            {/* Difficulty Chart */}
            <div className="bg-[#313244] border-4 border-[#f38ba8] shadow-[4px_4px_0px_0px_#11111b] overflow-hidden">
              <button
                onClick={() => setShowDifficultyChart(!showDifficultyChart)}
                className="w-full p-6 text-left hover:bg-[#45475a] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📈</span>
                    <h3 className="text-xl font-mono font-bold text-[#f38ba8] tracking-wider">
                      [DIFFICULTY_BREAKDOWN]
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-[#a6adc8]">
                      {Math.round(
                        stats.leetcodeStats.difficultyProgress.overall
                          .percentage
                      )}
                      % overall
                    </span>
                    <span
                      className={`text-2xl transition-transform duration-300 ease-in-out ${
                        showDifficultyChart ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>
                  </div>
                </div>
              </button>
              <div
                className={`border-t-2 border-[#45475a] transition-all duration-500 ease-in-out ${
                  showDifficultyChart
                    ? "max-h-[800px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
                style={{
                  overflow: "hidden",
                }}
              >
                <div
                  className={`p-6 transition-all duration-300 ease-in-out ${
                    showDifficultyChart
                      ? "transform translate-y-0"
                      : "transform -translate-y-4"
                  }`}
                >
                  <DifficultyChart
                    stats={stats.leetcodeStats.difficultyProgress}
                  />
                </div>
              </div>
            </div>

            {/* Language Statistics Toggle */}
            <div className="bg-[#313244] border-4 border-[#cba6f7] shadow-[4px_4px_0px_0px_#11111b] overflow-hidden">
              <button
                onClick={() => setShowLanguageStats(!showLanguageStats)}
                className="w-full p-6 text-left hover:bg-[#45475a] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💻</span>
                    <h3 className="text-xl font-mono font-bold text-[#cba6f7] tracking-wider">
                      [LANGUAGE_STATISTICS]
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-[#a6adc8]">
                      {stats.leetcodeStats.languageStats.uniqueLanguages}{" "}
                      languages
                    </span>
                    <span
                      className={`text-2xl transition-transform duration-300 ease-in-out ${
                        showLanguageStats ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>
                  </div>
                </div>
              </button>
              <div
                className={`border-t-2 border-[#45475a] transition-all duration-500 ease-in-out ${
                  showLanguageStats
                    ? "max-h-[800px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
                style={{
                  overflow: "hidden",
                }}
              >
                <div
                  className={`p-6 transition-all duration-300 ease-in-out ${
                    showLanguageStats
                      ? "transform translate-y-0"
                      : "transform -translate-y-4"
                  }`}
                >
                  <LanguageChart stats={stats.leetcodeStats.languageStats} />
                </div>
              </div>
            </div>

            {/* Recent Submissions Toggle */}
            <div className="bg-[#313244] border-4 border-[#fab387] shadow-[4px_4px_0px_0px_#11111b] overflow-hidden">
              <button
                onClick={() => setShowRecentSubmissions(!showRecentSubmissions)}
                className="w-full p-6 text-left hover:bg-[#45475a] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📝</span>
                    <h3 className="text-xl font-mono font-bold text-[#fab387] tracking-wider">
                      [RECENT_SUBMISSIONS]
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-[#a6adc8]">
                      {stats.leetcodeStats.recentSubmissions.length} submissions
                    </span>
                    <span
                      className={`text-2xl transition-transform duration-300 ease-in-out ${
                        showRecentSubmissions ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>
                  </div>
                </div>
              </button>
              <div
                className={`border-t-2 border-[#45475a] transition-all duration-500 ease-in-out ${
                  showRecentSubmissions
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
                style={{
                  overflow: "hidden",
                }}
              >
                <div
                  className={`p-6 transition-all duration-300 ease-in-out ${
                    showRecentSubmissions
                      ? "transform translate-y-0"
                      : "transform -translate-y-4"
                  }`}
                >
                  <RecentSubmissions
                    submissions={stats.leetcodeStats.recentSubmissions}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "rating" && (
          <div>
            <div className="mb-6 bg-[#313244] border-4 border-[#f9e2af] p-6 shadow-[4px_4px_0px_0px_#11111b]">
              <h2 className="text-2xl font-mono font-bold text-[#f9e2af] tracking-wider mb-2">
                [RATE_COMPLETED_QUESTIONS]
              </h2>
              <p className="font-mono text-sm text-[#cdd6f4]">
                Rate your confidence level on recently completed questions to
                optimize your review schedule.
              </p>
            </div>

            {ratingLoading ? (
              <div className="text-center py-8">
                <div className="bg-[#313244] border-4 border-[#45475a] p-6 shadow-[4px_4px_0px_0px_#11111b] inline-block">
                  <div className="animate-pulse">
                    <div className="h-6 bg-[#45475a] w-48 mb-4 mx-auto"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-[#45475a] w-64 mx-auto"></div>
                      <div className="h-4 bg-[#45475a] w-32 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : ratingData && ratingData.questions.length > 0 ? (
              <div className="space-y-6">
                {ratingData.questions.map((question) => (
                  <ReviewRating
                    key={question.user_question_id}
                    question={question}
                    confidenceLevels={ratingData.confidence_levels}
                    onRate={handleRateQuestion}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-[#313244] border-4 border-[#a6e3a1] p-8 shadow-[4px_4px_0px_0px_#11111b] inline-block max-w-md mx-auto">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-mono font-bold text-[#a6e3a1] mb-2 tracking-wider">
                    [ALL_CAUGHT_UP!]
                  </h3>
                  <p className="font-mono text-sm text-[#cdd6f4]">
                    No questions need rating at the moment.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <UserSettings
              currentUsername={stats.username}
              onUsernameUpdate={handleUsernameUpdate}
            />
          </div>
        )}
      </main>

      <Footer />
    </ThreadsBackground>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1e1e2e] flex items-center justify-center">
          <div className="bg-[#313244] border-4 border-[#cba6f7] p-8 shadow-[4px_4px_0px_0px_#11111b]">
            <div className="animate-pulse">
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-mono font-bold text-[#cba6f7] mb-2 tracking-wider">
                  [LOADING_PROFILE...]
                </h3>
                <div className="space-y-2">
                  <div className="h-3 bg-[#45475a] w-32 mx-auto"></div>
                  <div className="h-3 bg-[#45475a] w-24 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}
