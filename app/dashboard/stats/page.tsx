'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { fetchUserProfile, fetchQuestionStats } from '@/lib/api-client';

interface UserStats {
  totalQuestions: number;
  solvedQuestions: number;
  easy: { solved: number; total: number };
  medium: { solved: number; total: number };
  hard: { solved: number; total: number };
  currentStreak: number;
  longestStreak: number;
  enrolledPaths: number;
  completedPaths: number;
}

interface RecentActivity {
  date: string;
  questionsCompleted: number;
}

export default function StatsPage() {
  const [stats, setStats] = useState<UserStats>({
    totalQuestions: 0,
    solvedQuestions: 0,
    easy: { solved: 0, total: 0 },
    medium: { solved: 0, total: 0 },
    hard: { solved: 0, total: 0 },
    currentStreak: 0,
    longestStreak: 0,
    enrolledPaths: 0,
    completedPaths: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recentActivity: RecentActivity[] = [
    { date: '2025-01-15', questionsCompleted: 3 },
    { date: '2025-01-14', questionsCompleted: 2 },
    { date: '2025-01-13', questionsCompleted: 4 },
    { date: '2025-01-12', questionsCompleted: 1 },
    { date: '2025-01-11', questionsCompleted: 3 },
    { date: '2025-01-10', questionsCompleted: 2 },
    { date: '2025-01-09', questionsCompleted: 3 },
  ];

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);

        // Fetch user profile and question stats
        const [profileResponse, questionStatsResponse] = await Promise.all([
          fetchUserProfile(),
          fetchQuestionStats()
        ]);

        if (profileResponse.error) {
          throw new Error(profileResponse.error);
        }

        if (questionStatsResponse.error) {
          throw new Error(questionStatsResponse.error);
        }

        const userProfile = profileResponse.data;
        const questionStats = questionStatsResponse.data;

        // Combine data from both APIs
        const combinedStats: UserStats = {
          totalQuestions: questionStats.total_questions || 0,
          solvedQuestions: userProfile.stats.total_questions_solved || 0,
          easy: {
            solved: userProfile.stats.easy_solved || 0,
            total: questionStats.easy_count || 0
          },
          medium: {
            solved: userProfile.stats.medium_solved || 0,
            total: questionStats.medium_count || 0
          },
          hard: {
            solved: userProfile.stats.hard_solved || 0,
            total: questionStats.hard_count || 0
          },
          currentStreak: userProfile.stats.current_streak || 0,
          longestStreak: userProfile.stats.longest_streak || 0,
          enrolledPaths: userProfile.stats.enrolled_paths || 0,
          completedPaths: userProfile.stats.completed_paths || 0,
        };

        setStats(combinedStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats');
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const getProgressPercentage = (solved: number, total: number) => {
    return Math.round((solved / total) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar isAuthenticated={true} username="John Doe" />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-16">
            <div className="text-2xl font-bold">Loading your stats...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar isAuthenticated={true} username="John Doe" />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-16">
            <div className="text-2xl font-bold text-red-600 mb-4">Error Loading Stats</div>
            <p className="text-black">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar isAuthenticated={true} username="John Doe" />

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
          <p className="text-black">Track your coding journey and achievements</p>
        </div>

        {/* Overall Progress */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="border border-black p-6 text-center">
            <div className="text-3xl font-bold mb-2">{stats.solvedQuestions}</div>
            <div className="text-black">Questions Solved</div>
          </div>
          <div className="border border-black p-6 text-center">
            <div className="text-3xl font-bold mb-2">{stats.currentStreak}</div>
            <div className="text-black">Current Streak</div>
          </div>
          <div className="border border-black p-6 text-center">
            <div className="text-3xl font-bold mb-2">{stats.enrolledPaths}</div>
            <div className="text-black">Active Paths</div>
          </div>
          <div className="border border-black p-6 text-center">
            <div className="text-3xl font-bold mb-2">{getProgressPercentage(stats.solvedQuestions, stats.totalQuestions)}%</div>
            <div className="text-black">Overall Progress</div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Difficulty Breakdown</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-black p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Easy</h3>
                <span className="text-green-600 font-bold">
                  {stats.easy.solved} / {stats.easy.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-3">
                <div
                  className="bg-green-600 h-3 transition-all duration-300"
                  style={{ width: `${getProgressPercentage(stats.easy.solved, stats.easy.total)}%` }}
                ></div>
              </div>
              <div className="text-sm text-black mt-2">
                {getProgressPercentage(stats.easy.solved, stats.easy.total)}% complete
              </div>
            </div>

            <div className="border border-black p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Medium</h3>
                <span className="text-yellow-600 font-bold">
                  {stats.medium.solved} / {stats.medium.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-3">
                <div
                  className="bg-yellow-600 h-3 transition-all duration-300"
                  style={{ width: `${getProgressPercentage(stats.medium.solved, stats.medium.total)}%` }}
                ></div>
              </div>
              <div className="text-sm text-black mt-2">
                {getProgressPercentage(stats.medium.solved, stats.medium.total)}% complete
              </div>
            </div>

            <div className="border border-black p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Hard</h3>
                <span className="text-red-600 font-bold">
                  {stats.hard.solved} / {stats.hard.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-3">
                <div
                  className="bg-red-600 h-3 transition-all duration-300"
                  style={{ width: `${getProgressPercentage(stats.hard.solved, stats.hard.total)}%` }}
                ></div>
              </div>
              <div className="text-sm text-black mt-2">
                {getProgressPercentage(stats.hard.solved, stats.hard.total)}% complete
              </div>
            </div>
          </div>
        </div>

        {/* Activity Calendar */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <div className="border border-black p-6">
            <div className="grid grid-cols-7 gap-2">
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.date}
                  className="text-center p-3 border border-gray-300 hover:border-black transition-colors"
                >
                  <div className="text-sm text-black mb-1">
                    {formatDate(activity.date)}
                  </div>
                  <div className="text-lg font-bold">
                    {activity.questionsCompleted}
                  </div>
                  <div className="text-xs text-black">
                    problems
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Learning Paths Progress */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Learning Paths</h2>
          <div className="space-y-4">
            <div className="border border-black p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Array Fundamentals</h3>
                <span className="text-sm text-black">15/20 questions</span>
              </div>
              <div className="w-full bg-gray-200 h-3">
                <div className="bg-black h-3 transition-all duration-300" style={{ width: '75%' }}></div>
              </div>
              <div className="text-sm text-black mt-2">75% complete</div>
            </div>

            <div className="border border-black p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Dynamic Programming</h3>
                <span className="text-sm text-black">8/25 questions</span>
              </div>
              <div className="w-full bg-gray-200 h-3">
                <div className="bg-black h-3 transition-all duration-300" style={{ width: '32%' }}></div>
              </div>
              <div className="text-sm text-black mt-2">32% complete</div>
            </div>

            <div className="border border-black p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Graph Algorithms</h3>
                <span className="text-sm text-black">22/22 questions</span>
              </div>
              <div className="w-full bg-gray-200 h-3">
                <div className="bg-black h-3 transition-all duration-300" style={{ width: '100%' }}></div>
              </div>
              <div className="text-sm text-black mt-2">Completed!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}