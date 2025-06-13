"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

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
  const [completingReview, setCompletingReview] = useState<number | null>(null);

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
        "http://localhost:5000/api/v1/auth/user/reviews/today",
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

  const completeReview = async (userQuestionId: number) => {
    try {
      setCompletingReview(userQuestionId);

      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch(
        `http://localhost:5000/api/v1/auth/user/questions/${userQuestionId}/complete-review`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to complete review");
      }

      const result = await response.json();
      if (result.status === "success") {
        // Remove the completed review from the list
        setReviewsData((prev) =>
          prev
            ? {
                ...prev,
                reviews: prev.reviews.filter(
                  (r) => r.user_question_id !== userQuestionId
                ),
                count: prev.count - 1,
              }
            : null
        );
      }
    } catch (err) {
      console.error("Error completing review:", err);
    } finally {
      setCompletingReview(null);
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

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "mastered":
        return "#10b981";
      case "confident":
        return "#3b82f6";
      case "understood":
        return "#f59e0b";
      case "struggled":
        return "#ef4444";
      case "confused":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const getConfidenceLabel = (confidence: string) => {
    switch (confidence) {
      case "mastered":
        return "Mastered";
      case "confident":
        return "Confident";
      case "understood":
        return "Understood";
      case "struggled":
        return "Struggled";
      case "confused":
        return "Confused";
      default:
        return "Unknown";
    }
  };

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
      <div className="min-h-screen bg-[#1e1e2e]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="bg-[#313244] border-4 border-[#45475a] p-8 shadow-[4px_4px_0px_0px_#11111b] inline-block">
              <p className="text-xl font-mono text-[#cdd6f4] tracking-wider">
                [LOADING_REVIEWS...]
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1e1e2e]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="bg-[#313244] border-4 border-[#f38ba8] p-8 shadow-[4px_4px_0px_0px_#11111b] max-w-md mx-auto">
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e1e2e]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-[#313244] border-4 border-[#89b4fa] p-6 shadow-[4px_4px_0px_0px_#11111b]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-mono font-bold text-[#cdd6f4] mb-2 tracking-wider">
                  [TODAY&apos;S_REVIEWS]
                </h1>
                <p className="text-[#a6adc8] font-mono tracking-wide">
                  &gt; Complete your scheduled question reviews to maintain your
                  learning progress
                </p>
              </div>
              {reviewsData && (
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-[#89b4fa] tracking-wider">
                    {reviewsData.count}
                  </div>
                  <div className="text-sm font-mono text-[#6c7086] tracking-wide">
                    questions due
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {reviewsData && reviewsData.reviews.length > 0 ? (
          <div className="space-y-4">
            {reviewsData.reviews.map((review) => (
              <div
                key={review.user_question_id}
                className="bg-[#313244] border-4 border-[#45475a] p-6 shadow-[4px_4px_0px_0px_#11111b]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Question Header */}
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-mono text-[#cdd6f4] tracking-wide">
                        <a
                          href={review.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#89b4fa] transition-colors"
                        >
                          {review.title}
                        </a>
                      </h3>
                      <span
                        className={`font-mono text-sm px-2 py-1 border-2 ${getDifficultyColor(
                          review.difficulty
                        )} tracking-wider`}
                        style={{
                          backgroundColor:
                            review.difficulty?.toLowerCase() === "easy"
                              ? "#a6e3a1"
                              : review.difficulty?.toLowerCase() === "medium"
                              ? "#f9e2af"
                              : "#f38ba8",
                          color: "#1e1e2e",
                          borderColor:
                            review.difficulty?.toLowerCase() === "easy"
                              ? "#a6e3a1"
                              : review.difficulty?.toLowerCase() === "medium"
                              ? "#f9e2af"
                              : "#f38ba8",
                          boxShadow: "2px 2px 0px #11111b",
                        }}
                      >
                        {review.difficulty.toUpperCase()}
                      </span>
                    </div>

                    {/* Review Info */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 border-2"
                          style={{
                            backgroundColor: getConfidenceColor(
                              review.confidence
                            ),
                            borderColor: getConfidenceColor(review.confidence),
                            boxShadow: "1px 1px 0px #11111b",
                          }}
                        />
                        <span className="text-[#a6adc8] font-mono tracking-wide">
                          confidence: {getConfidenceLabel(review.confidence)}
                        </span>
                      </div>

                      <span className="text-[#6c7086] font-mono tracking-wide">
                        reviews: {review.times_reviewed}
                      </span>

                      {review.last_reviewed && (
                        <span className="text-[#6c7086] font-mono tracking-wide">
                          last:{" "}
                          {new Date(review.last_reviewed).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <a
                      href={review.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#89b4fa] text-[#1e1e2e] font-mono font-bold border-4 border-[#89b4fa] hover:bg-[#74c7ec] hover:border-[#74c7ec] transition-all duration-200 shadow-[3px_3px_0px_0px_#11111b] tracking-wider"
                    >
                      [SOLVE]
                    </a>
                    <button
                      onClick={() => completeReview(review.user_question_id)}
                      disabled={completingReview === review.user_question_id}
                      className={`px-4 py-2 font-mono font-bold border-4 transition-all duration-200 shadow-[3px_3px_0px_0px_#11111b] tracking-wider ${
                        completingReview === review.user_question_id
                          ? "bg-[#45475a] text-[#6c7086] border-[#45475a] cursor-not-allowed"
                          : "bg-[#a6e3a1] text-[#1e1e2e] border-[#a6e3a1] hover:bg-[#94e2d5] hover:border-[#94e2d5]"
                      }`}
                    >
                      {completingReview === review.user_question_id
                        ? "[COMPLETING...]"
                        : "[MARK_COMPLETE]"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-[#313244] border-4 border-[#a6e3a1] p-8 shadow-[4px_4px_0px_0px_#11111b] max-w-md mx-auto">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-xl font-mono font-bold text-[#a6e3a1] mb-2 tracking-wider">
                [ALL_CAUGHT_UP]
              </h2>
              <p className="font-mono text-[#a6adc8] tracking-wide">
                &gt; No reviews scheduled for today. Great job staying on top of
                your learning!
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push("/paths")}
                  className="px-6 py-3 bg-[#89b4fa] text-[#1e1e2e] font-mono font-bold border-4 border-[#89b4fa] hover:bg-[#74c7ec] hover:border-[#74c7ec] transition-all duration-200 shadow-[3px_3px_0px_0px_#11111b] tracking-wider"
                >
                  [EXPLORE_LEARNING_PATHS]
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Study Tips */}
        {reviewsData && reviewsData.reviews.length > 0 && (
          <div className="mt-8">
            <div className="bg-[#313244] border-4 border-[#f9e2af] p-6 shadow-[4px_4px_0px_0px_#11111b]">
              <h3 className="text-lg font-mono font-bold text-[#f9e2af] mb-3 tracking-wider">
                💡 [REVIEW_TIPS]
              </h3>
              <div className="space-y-2 text-sm font-mono text-[#a6adc8] tracking-wide">
                <p>
                  &gt; Try to solve each problem before looking at your previous
                  solution
                </p>
                <p>
                  &gt; Focus on understanding the core concepts and patterns
                </p>
                <p>
                  &gt; If you struggle, review the solution and mark for more
                  frequent reviews
                </p>
                <p>
                  &gt; Consider implementing the solution in a different
                  programming language
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
