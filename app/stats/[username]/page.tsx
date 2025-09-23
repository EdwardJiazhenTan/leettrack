'use client'
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

interface LeetCodeUser {
  username: string;
  profile: {
    realName: string;
    ranking: number;
  };
  submitStats: {
    acSubmissionNum: Array<{
      difficulty: string;
      count: number;
      submissions: number;
    }>;
  }
}

interface QuestionCount {
  difficulty: string;
  count: number;
}

interface LeetCodeData {
  user: LeetCodeUser;
  allQuestionsCount: QuestionCount[];
}

export default function UserStats() {
  const { username } = useParams() as { username: string };
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLeetCodeStats = async () => {
      if (!username) return null;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/leetcode/user/${username}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchLeetCodeStats();
  }, [username]);

  if (loading) return (
    <div className={`${inter.className} min-h-screen bg-gray-50 flex items-center justify-center`}>
      <div className="animate-pulse text-gray-600">Loading...</div>
    </div>
  );

  if (error) return (
    <div className={`${inter.className} min-h-screen bg-gray-50 flex items-center justify-center`}>
      <div className="text-red-600 bg-white p-6 rounded-lg shadow-sm border">
        Error: {error}
      </div>
    </div>
  );

  if (!data) return (
    <div className={`${inter.className} min-h-screen bg-gray-50 flex items-center justify-center`}>
      <div className="text-gray-600 bg-white p-6 rounded-lg shadow-sm border">
        No data found
      </div>
    </div>
  );

  // Calculate stats
  const totalSolved = data.user.submitStats.acSubmissionNum.find(s => s.difficulty === 'All')?.count || 0;
  const easySolved = data.user.submitStats.acSubmissionNum.find(s => s.difficulty === 'Easy')?.count || 0;
  const mediumSolved = data.user.submitStats.acSubmissionNum.find(s => s.difficulty === 'Medium')?.count || 0;
  const hardSolved = data.user.submitStats.acSubmissionNum.find(s => s.difficulty === 'Hard')?.count || 0;

  const easyTotal = data.allQuestionsCount.find(q => q.difficulty === 'Easy')?.count || 0;
  const mediumTotal = data.allQuestionsCount.find(q => q.difficulty === 'Medium')?.count || 0;
  const hardTotal = data.allQuestionsCount.find(q => q.difficulty === 'Hard')?.count || 0;
  const totalQuestions = easyTotal + mediumTotal + hardTotal;

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50 py-8 px-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            {username}'s LeetCode Stats
          </h1>
          <div className="flex items-center gap-6 text-gray-600">
            <span>Real Name: {data.user.profile.realName}</span>
            <span>•</span>
            <span>Global Ranking: #{data.user.profile.ranking.toLocaleString()}</span>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <div className="text-2xl font-light text-gray-900 mb-1">{totalSolved}</div>
            <div className="text-sm text-gray-500">Problems Solved</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <div className="text-2xl font-light text-gray-900 mb-1">
              {((totalSolved / totalQuestions) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Completion Rate</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <div className="text-2xl font-light text-gray-900 mb-1">
              #{data.user.profile.ranking.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Global Rank</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <div className="text-2xl font-light text-gray-900 mb-1">{totalQuestions}</div>
            <div className="text-sm text-gray-500">Total Problems</div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-xl font-light text-gray-900 mb-6">Difficulty Breakdown</h2>

          <div className="space-y-6">
            {/* Easy */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Easy</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{easySolved} / {easyTotal}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(easySolved / easyTotal) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-12">
                  {((easySolved / easyTotal) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Medium */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Medium</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{mediumSolved} / {mediumTotal}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${(mediumSolved / mediumTotal) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-12">
                  {((mediumSolved / mediumTotal) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Hard */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Hard</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{hardSolved} / {hardTotal}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(hardSolved / hardTotal) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-12">
                  {((hardSolved / hardTotal) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mt-6">
          <h2 className="text-xl font-light text-gray-900 mb-6">Submission Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.user.submitStats.acSubmissionNum.map((stat) => (
              <div key={stat.difficulty} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-light text-gray-900">{stat.count}</div>
                <div className="text-sm text-gray-500 mb-1">{stat.difficulty} Solved</div>
                <div className="text-xs text-gray-400">{stat.submissions} submissions</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

}


