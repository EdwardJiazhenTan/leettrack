"use client";

import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import DailyQuestion from "./components/DailyQuestion";
import LearningPathsList from "./components/LearningPathsList";

export default function Home() {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-[#1e1e2e]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="bg-[#313244] border-4 border-[#45475a] p-8 shadow-[4px_4px_0px_0px_#11111b] inline-block">
              <p className="text-xl font-mono text-[#cdd6f4] tracking-wider">
                [LOADING...]
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="mb-8 bg-[#313244] border-4 border-[#89b4fa] p-6 shadow-[4px_4px_0px_0px_#11111b]">
              {user ? (
                <h1 className="text-3xl font-mono font-bold text-[#cdd6f4] tracking-wider">
                  [WELCOME_BACK]{" "}
                  <span className="text-[#a6e3a1]">
                    {user.leetcode_username}
                  </span>
                </h1>
              ) : (
                <div className="text-center">
                  <h1 className="text-3xl font-mono font-bold mb-4 text-[#cdd6f4] tracking-wider">
                    [WELCOME_TO_LEETTRACK]
                  </h1>
                  <p className="text-lg font-mono text-[#a6adc8] leading-relaxed">
                    &gt; Track your LeetCode progress and discover curated
                    learning paths.
                  </p>
                </div>
              )}
            </div>

            {/* Main Content - Always Visible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#313244] border-4 border-[#f9e2af] p-6 shadow-[4px_4px_0px_0px_#11111b]">
                <h2 className="text-xl font-mono font-bold mb-4 text-[#f9e2af] tracking-wider">
                  [DAILY_QUESTION]
                </h2>
                <DailyQuestion />
              </div>
              <div className="bg-[#313244] border-4 border-[#cba6f7] p-6 shadow-[4px_4px_0px_0px_#11111b]">
                <h2 className="text-xl font-mono font-bold mb-4 text-[#cba6f7] tracking-wider">
                  [RECOMMENDED_PATHS]
                </h2>
                <LearningPathsList />
              </div>
            </div>

            {/* User-specific content */}
            {user && (
              <div className="mt-8 bg-[#313244] border-4 border-[#a6e3a1] p-6 shadow-[4px_4px_0px_0px_#11111b]">
                <h2 className="text-xl font-mono font-bold mb-4 text-[#a6e3a1] tracking-wider">
                  [YOUR_PROGRESS]
                </h2>
                <div className="text-center">
                  <a
                    href="/profile"
                    className="inline-block bg-[#a6e3a1] text-[#1e1e2e] px-6 py-3 font-mono font-bold border-4 border-[#a6e3a1] hover:bg-[#94e2d5] hover:border-[#94e2d5] transition-all duration-200 shadow-[3px_3px_0px_0px_#11111b] tracking-wider"
                  >
                    [VIEW_PROFILE]
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
