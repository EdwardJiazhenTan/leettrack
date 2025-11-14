"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";
import Navbar from "@/app/Navbar";
import { useAuth } from "@/lib/useAuth";

const inter = Inter({ subsets: ["latin"] });

export default function StatsRedirect() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth({ redirectIfNotAuth: true });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    const username = user?.leetcode_username;

    if (username) {
      router.push(`/stats/${username}`);
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className={`${inter.className} min-h-screen bg-gray-50`}>
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user?.leetcode_username) {
    return (
      <div className={`${inter.className} min-h-screen bg-gray-50`}>
        <Navbar />

        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-light text-gray-900 mb-4">
              LeetCode Username Required
            </h1>
            <p className="text-gray-600 mb-6">
              Please update your profile with your actual LeetCode username to
              view your stats.
            </p>
            <Link
              href="/settings"
              className="inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go to Settings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${inter.className} min-h-screen bg-gray-50`}>
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center max-w-md">
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              href="/today"
              className="inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      <Navbar />
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    </div>
  );
}
