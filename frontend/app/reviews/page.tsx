"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { getApiUrl } from "../config/api";
import Navbar from "../components/Navbar";
import ThreadsBackground from "../components/ThreadsBackground";
import Footer from "../components/Footer";
import ProgressBar from "../components/ProgressBar";
import Link from "next/link";

interface ReviewQuestion {
  user_question_id: number;
  question_id: number;
  title: string;
  url: string;
  difficulty: string;
  confidence: string;
  times_reviewed: number;
  last_reviewed: string | null;
  next_review: string | null;
}

interface ReviewsData {
  reviews: ReviewQuestion[];
  count: number;
}

const ReviewsPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't redirect if auth is still loading
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    fetchReviews();
  }, [user, authLoading, router]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        getApiUrl("/api/v1/auth/user/reviews/today"),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const result = await response.json();
      if (result.status === "success") {
        setReviewsData(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch reviews");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  // Handle auth loading state
  if (authLoading) {
    return (
      <ThreadsBackground className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-[#313244]/80 backdrop-blur-sm border-4 border-[#45475a] p-8 shadow-[4px_4px_0px_0px_#11111b]">
            <ProgressBar
              text="AUTHENTICATING"
              duration={1500}
              showPercentage={true}
            />
          </div>
        </div>
        <Footer />
      </ThreadsBackground>
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
              text="LOADING_REVIEWS"
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
      <ThreadsBackground className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-[#313244]/80 backdrop-blur-sm border-4 border-[#f38ba8] p-8 shadow-[4px_4px_0px_0px_#11111b] max-w-md mx-auto">
            <h2 className="text-xl font-mono text-[#f38ba8] mb-4 tracking-wider">
              [ERROR_LOADING_REVIEWS]
            </h2>
            <p className="text-sm text-[#cdd6f4] mb-4 font-mono">{error}</p>
            <button
              onClick={fetchReviews}
              className="px-4 py-2 bg-[#f38ba8] text-[#1e1e2e] font-mono font-bold border-4 border-[#f38ba8] hover:bg-[#eba0ac] hover:border-[#eba0ac] transition-all duration-200 shadow-[3px_3px_0px_0px_#11111b] tracking-wider"
            >
              [RETRY]
            </button>
          </div>
        </div>
        <Footer />
      </ThreadsBackground>
    );
  }

  return (
    <ThreadsBackground className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 flex flex-col max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8 bg-[#313244]/80 backdrop-blur-sm border-4 border-[#cba6f7] p-6 shadow-[4px_4px_0px_0px_#11111b]">
            <h1 className="text-3xl font-mono font-bold text-[#cba6f7] tracking-wider mb-2">
              [SPACED_REPETITION_REVIEWS]
            </h1>
            <p className="text-lg font-mono text-[#a6adc8] tracking-wide">
              &gt; Review questions based on your performance and memory
              retention
            </p>
          </div>

          {/* Reviews Content */}
          <div className="flex-1">
            {reviewsData && reviewsData.reviews.length === 0 ? (
              <div className="text-center py-16 bg-[#313244]/80 backdrop-blur-sm border-4 border-[#45475a] shadow-[4px_4px_0px_0px_#11111b]">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-2xl font-mono font-bold text-[#a6e3a1] tracking-wider mb-4">
                  [NO_REVIEWS_DUE]
                </h2>
                <p className="text-lg font-mono text-[#a6adc8] tracking-wide mb-8">
                  &gt; All caught up! Check back later for more reviews.
                </p>
                <Link
                  href="/today"
                  className="inline-block bg-[#89b4fa] hover:bg-[#74c7ec] text-[#1e1e2e] px-6 py-3 font-mono font-bold border-2 border-[#89b4fa] hover:border-[#74c7ec] transition-all duration-200 shadow-[2px_2px_0px_0px_#11111b] hover:shadow-[4px_4px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                >
                  [VIEW_TODAY&apos;S_TASKS]
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {reviewsData?.reviews.map((review) => (
                  <div
                    key={review.user_question_id}
                    className="bg-[#313244]/80 backdrop-blur-sm border-4 border-[#45475a] p-6 shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 text-xs font-mono font-bold border-2 ${getDifficultyColor(
                            review.difficulty
                          )}`}
                        >
                          [{review.difficulty.toUpperCase()}]
                        </span>
                        <span className="text-sm font-mono text-[#a6adc8]">
                          #{review.question_id}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-[#a6adc8]">
                          Due:{" "}
                          {new Date(
                            review.next_review || ""
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-mono font-bold text-[#cdd6f4] tracking-wider mb-3">
                      {review.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {/* Assuming tags are not available in the review object */}
                      {/* {review.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-mono bg-[#45475a] text-[#cdd6f4] border border-[#585b70]"
                        >
                          {tag}
                        </span>
                      ))} */}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-mono text-[#a6adc8]">
                          Reviews: {review.times_reviewed}
                        </span>
                        <span className="text-sm font-mono text-[#a6adc8]">
                          Success Rate:{" "}
                          {review.times_reviewed > 0
                            ? Math.round(
                                (review.times_reviewed /
                                  review.times_reviewed) *
                                  100
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      <a
                        href={review.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#cba6f7] hover:bg-[#b4befe] text-[#1e1e2e] px-4 py-2 font-mono font-bold border-2 border-[#cba6f7] hover:border-[#b4befe] transition-all duration-200 shadow-[2px_2px_0px_0px_#11111b] hover:shadow-[4px_4px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                      >
                        [REVIEW]
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </ThreadsBackground>
  );
};

export default ReviewsPage;
