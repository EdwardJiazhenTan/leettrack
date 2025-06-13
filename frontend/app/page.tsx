"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import ThreadsBackground from "./components/ThreadsBackground";
import Footer from "./components/Footer";
import DecryptedText from "./components/DecryptedText";
import ProgressBar from "./components/ProgressBar";
import { useAuth } from "./context/AuthContext";
import { authApi } from "./services/api";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [navigating, setNavigating] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // Show notice popup when component mounts
    const hasSeenNotice = localStorage.getItem("leettrack-notice-seen");
    if (!hasSeenNotice) {
      setShowNotice(true);
    }
  }, []);

  const handleCloseNotice = () => {
    setShowNotice(false);
    localStorage.setItem("leettrack-notice-seen", "true");
  };

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
    <ThreadsBackground className="min-h-screen flex flex-col">
      <Navbar />

      {/* Development Notice Popup */}
      {showNotice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#313244]/95 backdrop-blur-sm border-4 border-[#f9e2af] p-8 max-w-md mx-auto shadow-[8px_8px_0px_0px_#11111b]">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-mono font-bold text-[#f9e2af] tracking-wider mb-4">
                <DecryptedText text="[DEVELOPMENT_NOTICE]" interval={50} />
              </h2>
            </div>

            <div className="space-y-4 text-sm font-mono text-[#a6adc8] leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="text-[#f38ba8] mt-1">•</span>
                <p>
                  <span className="text-[#cdd6f4] font-bold">LeetTrack</span> is
                  currently in
                  <span className="text-[#f9e2af] font-bold">
                    {" "}
                    early development phase
                  </span>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#89b4fa] mt-1">•</span>
                <p>
                  If you encounter any{" "}
                  <span className="text-[#f38ba8] font-bold">issues</span> or
                  need
                  <span className="text-[#a6e3a1] font-bold">
                    {" "}
                    new features
                  </span>
                  , please create an issue on our
                  <a
                    href="https://github.com/EdwardJiazhenTan/LeetTrack"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#89b4fa] hover:text-[#74c7ec] underline font-bold"
                  >
                    GitHub repository
                  </a>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#cba6f7] mt-1">•</span>
                <p>
                  We&apos;re currently working on
                  <span className="text-[#cba6f7] font-bold">
                    {" "}
                    AI implementation beta
                  </span>{" "}
                  features
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleCloseNotice}
                className="bg-[#a6e3a1] hover:bg-[#94e2d5] text-[#1e1e2e] px-6 py-2 font-mono font-bold border-2 border-[#a6e3a1] hover:border-[#94e2d5] transition-all duration-200 shadow-[2px_2px_0px_0px_#11111b] hover:shadow-[4px_4px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                [GOT_IT]
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <main className="flex-1 flex flex-col max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-[#313244]/80 backdrop-blur-sm border-4 border-[#45475a] p-8 shadow-[4px_4px_0px_0px_#11111b]">
                <ProgressBar
                  text="AUTHENTICATING"
                  duration={1500}
                  showPercentage={true}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center">
              {/* Welcome Section */}
              <div className="text-center mb-12 bg-[#313244]/80 backdrop-blur-sm border-4 border-[#89b4fa] p-8 shadow-[4px_4px_0px_0px_#11111b]">
                {user ? (
                  <div>
                    <h1 className="text-4xl font-mono font-bold text-[#cdd6f4] tracking-wider mb-4">
                      <DecryptedText text="[WELCOME_BACK]" interval={80} />
                    </h1>
                    <p className="text-xl font-mono text-[#a6e3a1] tracking-wider">
                      <DecryptedText
                        text={user.leetcode_username}
                        interval={60}
                      />
                    </p>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-4xl font-mono font-bold mb-6 text-[#cdd6f4] tracking-wider">
                      <DecryptedText text="[LEETTRACK]" interval={100} />
                    </h1>
                    <p className="text-lg font-mono text-[#a6adc8] leading-relaxed">
                      <DecryptedText
                        text="> Track your LeetCode progress and discover curated learning paths."
                        interval={30}
                      />
                    </p>
                  </div>
                )}
              </div>

              {/* About LeetTrack Section */}
              <div className="mb-8 bg-[#313244]/80 backdrop-blur-sm border-4 border-[#cba6f7] p-6 shadow-[4px_4px_0px_0px_#11111b]">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-mono font-bold text-[#cba6f7] tracking-wider mb-2">
                    <DecryptedText text="[WHAT_IS_LEETTRACK]" interval={60} />
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center text-center">
                    <span className="text-3xl mb-2">🧠</span>
                    <h3 className="text-sm font-mono font-bold text-[#f9e2af] tracking-wide mb-2">
                      [SPACED_REPETITION]
                    </h3>
                    <p className="text-xs font-mono text-[#a6adc8] leading-relaxed">
                      Master algorithms through scientifically-proven spaced
                      repetition at optimal intervals.
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <span className="text-3xl mb-2">🛤️</span>
                    <h3 className="text-sm font-mono font-bold text-[#a6e3a1] tracking-wide mb-2">
                      [CURATED_PATHS]
                    </h3>
                    <p className="text-xs font-mono text-[#a6adc8] leading-relaxed">
                      Follow structured learning paths based on real interview
                      patterns from top companies.
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <span className="text-3xl mb-2">📊</span>
                    <h3 className="text-sm font-mono font-bold text-[#89b4fa] tracking-wide mb-2">
                      [PROGRESS_TRACKING]
                    </h3>
                    <p className="text-xs font-mono text-[#a6adc8] leading-relaxed">
                      Visualize your coding journey with detailed analytics and
                      difficulty breakdowns.
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <span className="text-3xl mb-2">⚡</span>
                    <h3 className="text-sm font-mono font-bold text-[#f38ba8] tracking-wide mb-2">
                      [SMART_SCHEDULING]
                    </h3>
                    <p className="text-xs font-mono text-[#a6adc8] leading-relaxed">
                      AI-powered question recommendations based on your
                      confidence and review history.
                    </p>
                  </div>
                </div>

                {!user && (
                  <div className="text-center mt-4 pt-4 border-t-2 border-[#45475a]">
                    <p className="text-xs font-mono text-[#6c7086] mb-3">
                      &gt; Ready to level up your coding interview preparation?
                    </p>
                    <div className="flex justify-center gap-3">
                      <span className="px-2 py-1 text-xs font-mono bg-[#a6e3a1] text-[#1e1e2e] border border-[#a6e3a1]">
                        [FREE_FOREVER]
                      </span>
                      <span className="px-2 py-1 text-xs font-mono bg-[#89b4fa] text-[#1e1e2e] border border-[#89b4fa]">
                        [NO_ADS]
                      </span>
                      <span className="px-2 py-1 text-xs font-mono bg-[#f9e2af] text-[#1e1e2e] border border-[#f9e2af]">
                        [OPEN_SOURCE]
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {user ? (
                  <>
                    {/* Smart Study Button */}
                    <button
                      onClick={handleSmartStudy}
                      disabled={navigating}
                      className="group relative p-6 bg-[#313244]/80 backdrop-blur-sm border-4 border-[#89b4fa] shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                      {/* Pixel Grid Background */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{
                          backgroundImage: `
                            linear-gradient(90deg, #89b4fa 1px, transparent 1px),
                            linear-gradient(180deg, #89b4fa 1px, transparent 1px)
                          `,
                          backgroundSize: "4px 4px",
                        }}
                      />

                      {/* Glitch Effect */}
                      <div className="absolute inset-0 bg-[#89b4fa] opacity-0 group-hover:opacity-10 transition-all duration-200" />

                      {/* Pixel Particles */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-[#89b4fa] animate-ping"
                            style={{
                              left: `${15 + i * 15}%`,
                              top: `${20 + (i % 3) * 20}%`,
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: "1.5s",
                            }}
                          />
                        ))}
                      </div>

                      <div className="relative z-10 text-center">
                        <div className="text-3xl mb-3 group-hover:animate-bounce transition-all duration-200">
                          🚀
                        </div>
                        <h2 className="text-lg font-mono font-bold text-[#89b4fa] tracking-wider mb-2 group-hover:text-[#74c7ec] transition-colors duration-200">
                          {navigating ? (
                            <DecryptedText text="[FINDING...]" interval={60} />
                          ) : (
                            <DecryptedText
                              text="[START_STUDYING]"
                              interval={60}
                            />
                          )}
                        </h2>
                        <p className="text-xs font-mono text-[#a6adc8] tracking-wide group-hover:text-[#cdd6f4] transition-colors duration-200">
                          &gt; Jump to your next priority question
                        </p>
                      </div>
                    </button>

                    {/* Today's Tasks */}
                    <Link
                      href="/today"
                      className="group relative block p-6 bg-[#313244]/80 backdrop-blur-sm border-4 border-[#f9e2af] shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 overflow-hidden"
                    >
                      {/* Pixel Grid Background */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{
                          backgroundImage: `
                            linear-gradient(90deg, #f9e2af 1px, transparent 1px),
                            linear-gradient(180deg, #f9e2af 1px, transparent 1px)
                          `,
                          backgroundSize: "4px 4px",
                        }}
                      />

                      {/* Glitch Effect */}
                      <div className="absolute inset-0 bg-[#f9e2af] opacity-0 group-hover:opacity-10 transition-all duration-200" />

                      {/* Pixel Particles */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-[#f9e2af] animate-ping"
                            style={{
                              left: `${15 + i * 15}%`,
                              top: `${20 + (i % 3) * 20}%`,
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: "1.5s",
                            }}
                          />
                        ))}
                      </div>

                      <div className="relative z-10 text-center">
                        <div className="text-3xl mb-3 group-hover:animate-bounce transition-all duration-200">
                          📋
                        </div>
                        <h2 className="text-lg font-mono font-bold text-[#f9e2af] tracking-wider mb-2 group-hover:text-[#fab387] transition-colors duration-200">
                          <DecryptedText text="[TODAY'S_TASKS]" interval={60} />
                        </h2>
                        <p className="text-xs font-mono text-[#a6adc8] tracking-wide group-hover:text-[#cdd6f4] transition-colors duration-200">
                          &gt; View all questions for today
                        </p>
                      </div>
                    </Link>

                    {/* Learning Paths */}
                    <Link
                      href="/paths"
                      className="group relative block p-6 bg-[#313244]/80 backdrop-blur-sm border-4 border-[#f38ba8] shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 overflow-hidden"
                    >
                      {/* Pixel Grid Background */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{
                          backgroundImage: `
                            linear-gradient(90deg, #f38ba8 1px, transparent 1px),
                            linear-gradient(180deg, #f38ba8 1px, transparent 1px)
                          `,
                          backgroundSize: "4px 4px",
                        }}
                      />

                      {/* Glitch Effect */}
                      <div className="absolute inset-0 bg-[#f38ba8] opacity-0 group-hover:opacity-10 transition-all duration-200" />

                      {/* Pixel Particles */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-[#f38ba8] animate-ping"
                            style={{
                              left: `${15 + i * 15}%`,
                              top: `${20 + (i % 3) * 20}%`,
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: "1.5s",
                            }}
                          />
                        ))}
                      </div>

                      <div className="relative z-10 text-center">
                        <div className="text-3xl mb-3 group-hover:animate-bounce transition-all duration-200">
                          🛤️
                        </div>
                        <h2 className="text-lg font-mono font-bold text-[#f38ba8] tracking-wider mb-2 group-hover:text-[#eba0ac] transition-colors duration-200">
                          <DecryptedText
                            text="[LEARNING_PATHS]"
                            interval={60}
                          />
                        </h2>
                        <p className="text-xs font-mono text-[#a6adc8] tracking-wide group-hover:text-[#cdd6f4] transition-colors duration-200">
                          &gt; Explore structured learning
                        </p>
                      </div>
                    </Link>

                    {/* Profile */}
                    <Link
                      href="/profile"
                      className="group relative block p-6 bg-[#313244]/80 backdrop-blur-sm border-4 border-[#a6e3a1] shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 overflow-hidden"
                    >
                      {/* Pixel Grid Background */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{
                          backgroundImage: `
                            linear-gradient(90deg, #a6e3a1 1px, transparent 1px),
                            linear-gradient(180deg, #a6e3a1 1px, transparent 1px)
                          `,
                          backgroundSize: "4px 4px",
                        }}
                      />

                      {/* Glitch Effect */}
                      <div className="absolute inset-0 bg-[#a6e3a1] opacity-0 group-hover:opacity-10 transition-all duration-200" />

                      {/* Pixel Particles */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-[#a6e3a1] animate-ping"
                            style={{
                              left: `${15 + i * 15}%`,
                              top: `${20 + (i % 3) * 20}%`,
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: "1.5s",
                            }}
                          />
                        ))}
                      </div>

                      <div className="relative z-10 text-center">
                        <div className="text-3xl mb-3 group-hover:animate-bounce transition-all duration-200">
                          👤
                        </div>
                        <h2 className="text-lg font-mono font-bold text-[#a6e3a1] tracking-wider mb-2 group-hover:text-[#94e2d5] transition-colors duration-200">
                          <DecryptedText text="[YOUR_PROFILE]" interval={60} />
                        </h2>
                        <p className="text-xs font-mono text-[#a6adc8] tracking-wide group-hover:text-[#cdd6f4] transition-colors duration-200">
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
                      className="group relative block p-6 bg-[#313244]/80 backdrop-blur-sm border-4 border-[#a6e3a1] shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 overflow-hidden"
                    >
                      {/* Pixel Grid Background */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{
                          backgroundImage: `
                            linear-gradient(90deg, #a6e3a1 1px, transparent 1px),
                            linear-gradient(180deg, #a6e3a1 1px, transparent 1px)
                          `,
                          backgroundSize: "4px 4px",
                        }}
                      />

                      {/* Glitch Effect */}
                      <div className="absolute inset-0 bg-[#a6e3a1] opacity-0 group-hover:opacity-10 transition-all duration-200" />

                      {/* Pixel Particles */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-[#a6e3a1] animate-ping"
                            style={{
                              left: `${15 + i * 15}%`,
                              top: `${20 + (i % 3) * 20}%`,
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: "1.5s",
                            }}
                          />
                        ))}
                      </div>

                      <div className="relative z-10 text-center">
                        <div className="text-3xl mb-3 group-hover:animate-bounce transition-all duration-200">
                          ✨
                        </div>
                        <h2 className="text-lg font-mono font-bold text-[#a6e3a1] tracking-wider mb-2 group-hover:text-[#94e2d5] transition-colors duration-200">
                          <DecryptedText text="[GET_STARTED]" interval={60} />
                        </h2>
                        <p className="text-xs font-mono text-[#a6adc8] tracking-wide group-hover:text-[#cdd6f4] transition-colors duration-200">
                          &gt; Create your account
                        </p>
                      </div>
                    </Link>

                    {/* Login */}
                    <Link
                      href="/login"
                      className="group relative block p-6 bg-[#313244]/80 backdrop-blur-sm border-4 border-[#89b4fa] shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 overflow-hidden"
                    >
                      {/* Pixel Grid Background */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{
                          backgroundImage: `
                            linear-gradient(90deg, #89b4fa 1px, transparent 1px),
                            linear-gradient(180deg, #89b4fa 1px, transparent 1px)
                          `,
                          backgroundSize: "4px 4px",
                        }}
                      />

                      {/* Glitch Effect */}
                      <div className="absolute inset-0 bg-[#89b4fa] opacity-0 group-hover:opacity-10 transition-all duration-200" />

                      {/* Pixel Particles */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-[#89b4fa] animate-ping"
                            style={{
                              left: `${15 + i * 15}%`,
                              top: `${20 + (i % 3) * 20}%`,
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: "1.5s",
                            }}
                          />
                        ))}
                      </div>

                      <div className="relative z-10 text-center">
                        <div className="text-3xl mb-3 group-hover:animate-bounce transition-all duration-200">
                          🔑
                        </div>
                        <h2 className="text-lg font-mono font-bold text-[#89b4fa] tracking-wider mb-2 group-hover:text-[#74c7ec] transition-colors duration-200">
                          <DecryptedText text="[SIGN_IN]" interval={60} />
                        </h2>
                        <p className="text-xs font-mono text-[#a6adc8] tracking-wide group-hover:text-[#cdd6f4] transition-colors duration-200">
                          &gt; Access your account
                        </p>
                      </div>
                    </Link>

                    {/* Browse Paths */}
                    <Link
                      href="/paths"
                      className="group relative block p-6 bg-[#313244]/80 backdrop-blur-sm border-4 border-[#f38ba8] shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 overflow-hidden"
                    >
                      {/* Pixel Grid Background */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{
                          backgroundImage: `
                            linear-gradient(90deg, #f38ba8 1px, transparent 1px),
                            linear-gradient(180deg, #f38ba8 1px, transparent 1px)
                          `,
                          backgroundSize: "4px 4px",
                        }}
                      />

                      {/* Glitch Effect */}
                      <div className="absolute inset-0 bg-[#f38ba8] opacity-0 group-hover:opacity-10 transition-all duration-200" />

                      {/* Pixel Particles */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-[#f38ba8] animate-ping"
                            style={{
                              left: `${15 + i * 15}%`,
                              top: `${20 + (i % 3) * 20}%`,
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: "1.5s",
                            }}
                          />
                        ))}
                      </div>

                      <div className="relative z-10 text-center">
                        <div className="text-3xl mb-3 group-hover:animate-bounce transition-all duration-200">
                          🛤️
                        </div>
                        <h2 className="text-lg font-mono font-bold text-[#f38ba8] tracking-wider mb-2 group-hover:text-[#eba0ac] transition-colors duration-200">
                          <DecryptedText text="[EXPLORE_PATHS]" interval={60} />
                        </h2>
                        <p className="text-xs font-mono text-[#a6adc8] tracking-wide group-hover:text-[#cdd6f4] transition-colors duration-200">
                          &gt; Browse learning paths without registration
                        </p>
                      </div>
                    </Link>

                    {/* About/Info */}
                    <div className="group relative p-6 bg-[#313244]/80 backdrop-blur-sm border-4 border-[#cba6f7] shadow-[4px_4px_0px_0px_#11111b] transition-all duration-200 overflow-hidden">
                      {/* Pixel Grid Background */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{
                          backgroundImage: `
                            linear-gradient(90deg, #cba6f7 1px, transparent 1px),
                            linear-gradient(180deg, #cba6f7 1px, transparent 1px)
                          `,
                          backgroundSize: "4px 4px",
                        }}
                      />

                      {/* Glitch Effect */}
                      <div className="absolute inset-0 bg-[#cba6f7] opacity-0 group-hover:opacity-10 transition-all duration-200" />

                      {/* Pixel Particles */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-[#cba6f7] animate-ping"
                            style={{
                              left: `${15 + i * 15}%`,
                              top: `${20 + (i % 3) * 20}%`,
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: "1.5s",
                            }}
                          />
                        ))}
                      </div>

                      <div className="relative z-10 text-center">
                        <div className="text-3xl mb-3 group-hover:animate-bounce transition-all duration-200">
                          📊
                        </div>
                        <h2 className="text-lg font-mono font-bold text-[#cba6f7] tracking-wider mb-2 group-hover:text-[#b4befe] transition-colors duration-200">
                          <DecryptedText
                            text="[TRACK_PROGRESS]"
                            interval={60}
                          />
                        </h2>
                        <p className="text-xs font-mono text-[#a6adc8] tracking-wide group-hover:text-[#cdd6f4] transition-colors duration-200">
                          &gt; Spaced repetition learning system
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </ThreadsBackground>
  );
}
