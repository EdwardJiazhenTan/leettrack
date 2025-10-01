"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function StatsRedirect() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [needsUsername, setNeedsUsername] = useState(false);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const response = await fetch("/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const username = data.user.leetcode_username;

            if (!username) {
              // User hasn't set their LeetCode username yet
              setNeedsUsername(true);
              return;
            }

            router.push(`/stats/${username}`);
          } else {
            setError("Failed to fetch user information");
          }
        } else if (response.status === 401) {
          router.push("/auth/login");
        } else {
          setError("Failed to fetch user information");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setError("An error occurred while loading stats");
      }
    };

    fetchAndRedirect();
  }, [router]);

  if (needsUsername) {
    return (
      <div className={`${inter.className} min-h-screen bg-gray-50`}>
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/home" className="text-2xl font-light text-gray-900">
                LeetTrack
              </Link>
              <div className="flex gap-6">
                <Link
                  href="/home"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Today
                </Link>
                <Link
                  href="/paths"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Paths
                </Link>
                <Link href="/stats" className="text-gray-900 font-medium">
                  Stats
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-light text-gray-900 mb-4">
              LeetCode Username Required
            </h1>
            <p className="text-gray-600 mb-6">
              Please update your profile with your actual LeetCode username to
              view your stats.
            </p>
            <div className="text-sm text-gray-500">
              You can update your LeetCode username in your profile settings.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${inter.className} min-h-screen bg-gray-50 flex items-center justify-center`}
      >
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/home"
            className="inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${inter.className} min-h-screen bg-gray-50 flex items-center justify-center`}
    >
      <div className="animate-pulse text-gray-600">Loading...</div>
    </div>
  );
}
