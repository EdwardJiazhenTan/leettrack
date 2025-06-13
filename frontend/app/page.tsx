"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import { authApi } from "./services/api";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [navigating, setNavigating] = useState(false);

  const handleSmartStudy = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setNavigating(true);
    try {
      const nextQuestion = await authApi.getNextQuestion();

      if (nextQuestion) {
        if (nextQuestion.type === "study") {
          // Internal navigation for study paths
          window.location.href = nextQuestion.url;
        } else {
          // External navigation for LeetCode questions
          window.open(nextQuestion.url, "_blank");
          // Also navigate to the appropriate internal page
          if (nextQuestion.type === "review") {
            window.location.href = "/today#reviews";
          } else if (nextQuestion.type === "rating") {
            window.location.href = "/today#rating";
          } else {
            window.location.href = "/today";
          }
        }
      } else {
        // No questions available, go to today page
        window.location.href = "/today";
      }
    } catch (error) {
      console.error("Error finding next question:", error);
      // Fallback to today page
      window.location.href = "/today";
    } finally {
      setNavigating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e2e]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
            <div className="text-center mb-12 bg-[#313244] border-4 border-[#89b4fa] p-8 shadow-[4px_4px_0px_0px_#11111b]">
              {user ? (
                <div>
                  <h1 className="text-4xl font-mono font-bold text-[#cdd6f4] tracking-wider mb-4">
                    [WELCOME_BACK]
                  </h1>
                  <p className="text-xl font-mono text-[#a6e3a1] tracking-wider">
                    {user.leetcode_username}
                  </p>
                </div>
              ) : (
                <div>
                  <h1 className="text-4xl font-mono font-bold mb-6 text-[#cdd6f4] tracking-wider">
                    [LEETTRACK]
                  </h1>
                  <p className="text-lg font-mono text-[#a6adc8] leading-relaxed">
                    &gt; Track your LeetCode progress and discover curated
                    learning paths.
                  </p>
                </div>
              )}
            </div>

            {/* Main Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {user ? (
                <>
                  {/* Smart Study Button */}
                  <button
                    onClick={handleSmartStudy}
                    disabled={navigating}
                    className="group p-8 bg-[#313244] border-4 border-[#89b4fa] shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">🚀</div>
                      <h2 className="text-xl font-mono font-bold text-[#89b4fa] tracking-wider mb-3">
                        {navigating ? "[FINDING...]" : "[START_STUDYING]"}
                      </h2>
                      <p className="text-sm font-mono text-[#a6adc8] tracking-wide">
                        &gt; Jump to your next priority question
                      </p>
                    </div>
                  </button>

                  {/* Today's Tasks */}
                  <Link
                    href="/today"
                    className="group block p-8 bg-[#313244] border-4 border-[#f9e2af] shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">📋</div>
                      <h2 className="text-xl font-mono font-bold text-[#f9e2af] tracking-wider mb-3">
                        [TODAY&apos;S_TASKS]
                      </h2>
                      <p className="text-sm font-mono text-[#a6adc8] tracking-wide">
                        &gt; View all questions for today
                      </p>
                    </div>
                  </Link>

                  {/* Learning Paths */}
                  <Link
                    href="/paths"
                    className="group block p-8 bg-[#313244] border-4 border-[#f38ba8] shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">🛤️</div>
                      <h2 className="text-xl font-mono font-bold text-[#f38ba8] tracking-wider mb-3">
                        [LEARNING_PATHS]
                      </h2>
                      <p className="text-sm font-mono text-[#a6adc8] tracking-wide">
                        &gt; Explore structured learning
                      </p>
                    </div>
                  </Link>

                  {/* Profile */}
                  <Link
                    href="/profile"
                    className="group block p-8 bg-[#313244] border-4 border-[#a6e3a1] shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">👤</div>
                      <h2 className="text-xl font-mono font-bold text-[#a6e3a1] tracking-wider mb-3">
                        [YOUR_PROFILE]
                      </h2>
                      <p className="text-sm font-mono text-[#a6adc8] tracking-wide">
                        &gt; View progress and stats
                      </p>
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  {/* Sign Up */}
                  <Link
                    href="/register"
                    className="group block p-8 bg-[#313244] border-4 border-[#a6e3a1] shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">✨</div>
                      <h2 className="text-xl font-mono font-bold text-[#a6e3a1] tracking-wider mb-3">
                        [GET_STARTED]
                      </h2>
                      <p className="text-sm font-mono text-[#a6adc8] tracking-wide">
                        &gt; Create your account
                      </p>
                    </div>
                  </Link>

                  {/* Login */}
                  <Link
                    href="/login"
                    className="group block p-8 bg-[#313244] border-4 border-[#89b4fa] shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">🔑</div>
                      <h2 className="text-xl font-mono font-bold text-[#89b4fa] tracking-wider mb-3">
                        [SIGN_IN]
                      </h2>
                      <p className="text-sm font-mono text-[#a6adc8] tracking-wide">
                        &gt; Access your account
                      </p>
                    </div>
                  </Link>

                  {/* Browse Paths */}
                  <Link
                    href="/paths"
                    className="group block p-8 bg-[#313244] border-4 border-[#f38ba8] shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 md:col-span-2"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">🛤️</div>
                      <h2 className="text-xl font-mono font-bold text-[#f38ba8] tracking-wider mb-3">
                        [EXPLORE_PATHS]
                      </h2>
                      <p className="text-sm font-mono text-[#a6adc8] tracking-wide">
                        &gt; Browse learning paths without registration
                      </p>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
