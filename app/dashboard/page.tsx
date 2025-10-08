"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface User {
  user_id: string;
  email: string;
  username: string;
  leetcode_username?: string;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const response = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            router.push("/auth/login");
            return;
          }
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          throw new Error(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      router.push("/");
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

  if (!user) {
    return (
      <div
        className={`${inter.className} min-h-screen bg-gray-50 flex items-center justify-center`}
      >
        <div className="text-gray-600 bg-white p-6 rounded-lg shadow-sm border">
          User not found
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
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {user.username}!</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Track your LeetCode progress and manage your account
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-light text-gray-900 mb-4">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <p className="text-gray-900">{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LeetCode Username
              </label>
              <p className="text-gray-900">
                {user.leetcode_username || "Not set"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Since
              </label>
              <p className="text-gray-900">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-light text-gray-900 mb-2">
              View Stats
            </h3>
            <p className="text-gray-600 mb-4">
              Check your LeetCode progress and statistics
            </p>
            {user.leetcode_username ? (
              <Link
                href={`/stats/${user.leetcode_username}`}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors inline-block"
              >
                View My Stats
              </Link>
            ) : (
              <p className="text-gray-500 text-sm">
                Set your LeetCode username to view stats
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-light text-gray-900 mb-2">
              Search User
            </h3>
            <p className="text-gray-600 mb-4">
              Look up other users&apos; LeetCode statistics
            </p>
            <Link
              href="/"
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-block"
            >
              Search Users
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-light text-gray-900 mb-2">
              Browse Questions
            </h3>
            <p className="text-gray-600 mb-4">
              Explore coding problems and practice
            </p>
            <Link
              href="/questions"
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-block"
            >
              View Questions
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-light text-gray-900 mb-2">
              Edit Profile
            </h3>
            <p className="text-gray-600 mb-4">
              Update your profile information
            </p>
            <button
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
          <h2 className="text-xl font-light text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="text-gray-500 text-center py-8">
            <p>No recent activity to display</p>
            <p className="text-sm mt-2">
              Start solving problems to see your progress here!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
