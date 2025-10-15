"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface Question {
  id: string;
  title: string;
  titleSlug: string;
  difficulty: string;
  url: string;
  topicTags: { name: string; slug: string }[];
}

type TestState = "topic-selection" | "in-progress" | "completed";
type Topic = "binary-search" | "dynamic-programming" | "graph";

const TOPICS: { value: Topic; label: string }[] = [
  { value: "binary-search", label: "Binary Search" },
  { value: "dynamic-programming", label: "Dynamic Programming" },
  { value: "graph", label: "Graph" },
];

const DIFFICULTIES = ["Easy", "Easy", "Medium", "Medium", "Hard"] as const;
const TIME_LIMIT_MINUTES = 25;

export default function TestPage() {
  const router = useRouter();
  const [testState, setTestState] = useState<TestState>("topic-selection");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [scores, setScores] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT_MINUTES * 60);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [checkingSubmission, setCheckingSubmission] = useState(false);
  const [leetcodeUsername, setLeetcodeUsername] = useState<string>("");

  // Fetch user's LeetCode username
  useEffect(() => {
    const fetchUserInfo = async () => {
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
          if (data.success && data.user.leetcode_username) {
            setLeetcodeUsername(data.user.leetcode_username);
          } else {
            setError(
              "Please set your LeetCode username in settings before taking a test."
            );
          }
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    fetchUserInfo();
  }, [router]);

  // Timer countdown
  useEffect(() => {
    if (testState !== "in-progress") return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testState, currentQuestionIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startTest = async (topic: Topic) => {
    if (!leetcodeUsername) {
      setError(
        "Please set your LeetCode username in settings before taking a test."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedTopic(topic);

    try {
      // Fetch 5 questions (Easy, Easy, Medium, Medium, Hard)
      const fetchedQuestions: Question[] = [];

      for (let i = 0; i < 5; i++) {
        const difficulty = DIFFICULTIES[i];
        const response = await fetch(
          `/api/test/random-question?topic=${topic}&difficulty=${difficulty}`
        );

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || `Failed to fetch ${difficulty} question`
          );
        }

        fetchedQuestions.push(data.question);
      }

      setQuestions(fetchedQuestions);
      setScores(new Array(5).fill(false));
      setCurrentQuestionIndex(0);
      setTestState("in-progress");
      setQuestionStartTime(Date.now());
      setTimeRemaining(TIME_LIMIT_MINUTES * 60);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start test"
      );
    } finally {
      setLoading(false);
    }
  };

  const checkSubmission = async () => {
    if (!leetcodeUsername || !questions[currentQuestionIndex]) return;

    setCheckingSubmission(true);

    try {
      const response = await fetch(
        `/api/test/check-submission?username=${leetcodeUsername}&questionSlug=${questions[currentQuestionIndex].titleSlug}&limit=20`
      );

      const data = await response.json();

      if (data.success && data.findings?.method1_recentSubmissions?.data?.data) {
        const submissions =
          data.findings.method1_recentSubmissions.data.data
            .recentAcSubmissionList || [];
        const questionSlug = questions[currentQuestionIndex].titleSlug;
        const startTimestamp = Math.floor(questionStartTime / 1000);

        // Check if user submitted this question after test started
        const found = submissions.find(
          (sub: any) =>
            sub.titleSlug === questionSlug &&
            parseInt(sub.timestamp) >= startTimestamp &&
            sub.statusDisplay === "Accepted"
        );

        if (found) {
          // User solved it!
          const newScores = [...scores];
          newScores[currentQuestionIndex] = true;
          setScores(newScores);
          moveToNextQuestion();
        } else {
          alert("No submission found yet. Keep working on the problem!");
        }
      }
    } catch (err) {
      console.error("Error checking submission:", err);
      alert("Failed to check submission. Please try again.");
    } finally {
      setCheckingSubmission(false);
    }
  };

  const handleTimeUp = () => {
    // Time's up, move to next question without awarding point
    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < 4) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now());
      setTimeRemaining(TIME_LIMIT_MINUTES * 60);
    } else {
      // Test completed
      setTestState("completed");
    }
  };

  const skipQuestion = () => {
    if (
      confirm(
        "Are you sure you want to skip this question? You will not earn a point."
      )
    ) {
      moveToNextQuestion();
    }
  };

  const resetTest = () => {
    setTestState("topic-selection");
    setSelectedTopic(null);
    setQuestions([]);
    setScores([]);
    setCurrentQuestionIndex(0);
    setError(null);
  };

  const totalScore = scores.filter((s) => s).length;

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
              <Link href="/test" className="text-gray-900 font-medium">
                Test
              </Link>
              <Link
                href="/stats"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Stats
              </Link>
              <Link
                href="/settings"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Topic Selection */}
        {testState === "topic-selection" && (
          <div>
            <h1 className="text-4xl font-light text-gray-900 mb-4">
              Topic Test
            </h1>
            <p className="text-gray-600 mb-8">
              Test your skills on a specific topic. Complete 5 questions (2
              Easy, 2 Medium, 1 Hard) in 25 minutes each.
            </p>

            {!leetcodeUsername && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  ⚠️ Please set your LeetCode username in{" "}
                  <Link
                    href="/settings"
                    className="underline font-medium hover:text-yellow-900"
                  >
                    settings
                  </Link>{" "}
                  before taking a test.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TOPICS.map((topic) => (
                <button
                  key={topic.value}
                  onClick={() => startTest(topic.value)}
                  disabled={loading || !leetcodeUsername}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {topic.label}
                  </h3>
                  <p className="text-sm text-gray-500">
                    5 questions • 25 min each
                  </p>
                </button>
              ))}
            </div>

            {loading && (
              <div className="mt-8 text-center">
                <div className="animate-pulse text-gray-600">
                  Preparing your test...
                </div>
              </div>
            )}
          </div>
        )}

        {/* Test in Progress */}
        {testState === "in-progress" && questions[currentQuestionIndex] && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-light text-gray-900">
                  {selectedTopic &&
                    TOPICS.find((t) => t.value === selectedTopic)?.label}
                </h1>
                <p className="text-gray-500">
                  Question {currentQuestionIndex + 1} of 5
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`text-3xl font-light ${timeRemaining < 300 ? "text-red-600" : "text-gray-900"}`}
                >
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-sm text-gray-500">Time remaining</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex gap-2">
                {scores.map((score, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded ${
                      idx < currentQuestionIndex
                        ? score
                          ? "bg-green-500"
                          : "bg-red-500"
                        : idx === currentQuestionIndex
                          ? "bg-blue-500"
                          : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    questions[currentQuestionIndex].difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : questions[currentQuestionIndex].difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {questions[currentQuestionIndex].difficulty}
                </span>
                <span className="text-sm text-gray-500">
                  ID: {questions[currentQuestionIndex].id}
                </span>
              </div>

              <h2 className="text-2xl font-normal text-gray-900 mb-4">
                {questions[currentQuestionIndex].title}
              </h2>

              <div className="flex flex-wrap gap-2 mb-6">
                {questions[currentQuestionIndex].topicTags.map((tag) => (
                  <span
                    key={tag.slug}
                    className="px-2 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded text-xs"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              <a
                href={questions[currentQuestionIndex].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Solve on LeetCode
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={checkSubmission}
                disabled={checkingSubmission}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {checkingSubmission ? "Checking..." : "Check Submission"}
              </button>
              <button
                onClick={skipQuestion}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Skip Question
              </button>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 Solve the problem on LeetCode, then click "Check Submission"
                to verify and move to the next question.
              </p>
            </div>
          </div>
        )}

        {/* Test Completed */}
        {testState === "completed" && (
          <div className="text-center">
            <div className="bg-white border border-gray-200 rounded-lg p-12 mb-6">
              <div className="text-6xl font-light text-gray-900 mb-4">
                {totalScore}/5
              </div>
              <h2 className="text-2xl font-light text-gray-900 mb-2">
                Test Completed!
              </h2>
              <p className="text-gray-600 mb-8">
                {selectedTopic &&
                  TOPICS.find((t) => t.value === selectedTopic)?.label}
              </p>

              <div className="grid grid-cols-5 gap-3 max-w-md mx-auto mb-8">
                {scores.map((score, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-lg flex items-center justify-center text-white font-medium ${
                      score ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {score ? "✓" : "✗"}
                  </div>
                ))}
              </div>

              <button
                onClick={resetTest}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Take Another Test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
