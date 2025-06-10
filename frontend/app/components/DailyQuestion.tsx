"use client";

import React, { useState, useEffect } from "react";
import { leetcodeApi } from "../services/api";

interface DailyQuestionType {
  titleSlug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  likes?: number;
  dislikes?: number;
  content?: string;
  topicTags?: Array<{ name: string }>;
  questionId?: string | number;
  questionFrontendId?: string | number;
  isPaidOnly?: boolean;
}

interface DailyQuestionResponse {
  date: string;
  link: string;
  question: DailyQuestionType;
}

interface ApiError {
  status: string;
  message: string;
  details?: string | object;
}

export default function DailyQuestion() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyData, setDailyData] = useState<DailyQuestionResponse | null>(
    null
  );

  async function fetchDailyQuestion() {
    setLoading(true);
    setError(null);

    const response = await leetcodeApi.getDailyQuestion();

    if (response.error) {
      const errorData = response.data as ApiError;
      setError(errorData.message || response.error);
    } else {
      setDailyData(response.data as DailyQuestionResponse);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchDailyQuestion();
  }, []);

  const handleRetry = () => {
    fetchDailyQuestion();
  };

  if (loading) {
    return (
      <div className="p-4 bg-[#1e1e2e] border-4 border-[#45475a] shadow-[3px_3px_0px_0px_#11111b]">
        <p className="text-[#a6adc8] font-mono">[LOADING_DAILY_QUESTION...]</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-[#1e1e2e] border-4 border-[#f38ba8] shadow-[3px_3px_0px_0px_#11111b]">
        <div className="mb-3">
          <p className="text-[#f38ba8] font-mono font-bold">[ERROR]</p>
          <p className="text-[#f38ba8] font-mono text-sm mt-1">{error}</p>
        </div>

        <button
          onClick={handleRetry}
          className="px-3 py-2 font-mono font-bold text-xs border-2 shadow-[2px_2px_0px_0px_#11111b] transition-all duration-200 bg-[#f9e2af] text-[#1e1e2e] border-[#f9e2af] hover:bg-[#fab387] hover:border-[#fab387] cursor-pointer"
        >
          [RETRY_NOW]
        </button>
      </div>
    );
  }

  if (!dailyData || !dailyData.question) {
    return (
      <div className="p-4 bg-[#1e1e2e] border-4 border-[#45475a] shadow-[3px_3px_0px_0px_#11111b]">
        <p className="text-[#a6adc8] font-mono">
          [NO_DAILY_QUESTION_AVAILABLE]
        </p>
        <button
          onClick={handleRetry}
          className="mt-3 px-3 py-2 bg-[#89b4fa] text-[#1e1e2e] font-mono font-bold text-xs border-2 border-[#89b4fa] hover:bg-[#74c7ec] hover:border-[#74c7ec] transition-all duration-200 shadow-[2px_2px_0px_0px_#11111b] cursor-pointer"
        >
          [RETRY]
        </button>
      </div>
    );
  }

  const { question, date } = dailyData;

  return (
    <div className="p-4 bg-[#1e1e2e] border-4 border-[#45475a] shadow-[3px_3px_0px_0px_#11111b]">
      <h2 className="text-lg font-mono font-bold mb-4 text-[#cdd6f4] tracking-wider">
        [DAILY_LEETCODE_CHALLENGE]
      </h2>

      {/* Date display */}
      <div className="mb-3">
        <span className="text-[#a6adc8] font-mono text-sm">
          <span className="text-[#fab387]">&gt;</span> Date:{" "}
          <span className="text-[#f9e2af]">{date}</span>
        </span>
      </div>

      {/* Difficulty badge */}
      <div className="mb-3">
        <span
          className={`inline-block px-3 py-1 font-mono font-bold border-2 shadow-[2px_2px_0px_0px_#11111b] ${
            question.difficulty === "Easy"
              ? "bg-[#a6e3a1] text-[#1e1e2e] border-[#a6e3a1]"
              : question.difficulty === "Medium"
              ? "bg-[#f9e2af] text-[#1e1e2e] border-[#f9e2af]"
              : "bg-[#f38ba8] text-[#1e1e2e] border-[#f38ba8]"
          }`}
        >
          [{question.difficulty?.toUpperCase() || "UNKNOWN"}]
        </span>
        {question.isPaidOnly && (
          <span className="ml-2 inline-block px-2 py-1 font-mono font-bold text-xs border-2 bg-[#fab387] text-[#1e1e2e] border-[#fab387] shadow-[2px_2px_0px_0px_#11111b]">
            [PREMIUM]
          </span>
        )}
      </div>

      {/* Question title */}
      <h3 className="text-lg font-mono font-bold mb-3 text-[#89b4fa] leading-tight">
        {question.title}
      </h3>

      {/* Question stats */}
      <div className="mb-4 space-y-1">
        {question.likes !== undefined && (
          <p className="font-mono text-sm text-[#a6adc8]">
            <span className="text-[#fab387]">&gt;</span> Likes:{" "}
            <span className="text-[#a6e3a1]">
              {question.likes.toLocaleString()}
            </span>
            {question.dislikes !== undefined && (
              <>
                {" | "}Dislikes:{" "}
                <span className="text-[#f38ba8]">
                  {question.dislikes.toLocaleString()}
                </span>
              </>
            )}
          </p>
        )}
        {question.questionFrontendId && (
          <p className="font-mono text-sm text-[#a6adc8]">
            <span className="text-[#fab387]">&gt;</span> Problem #{" "}
            <span className="text-[#f9e2af]">
              {question.questionFrontendId}
            </span>
          </p>
        )}
      </div>

      {/* Topic tags */}
      {question.topicTags && question.topicTags.length > 0 && (
        <div className="mb-4">
          <p className="font-mono text-sm text-[#a6adc8] mb-2">
            <span className="text-[#fab387]">&gt;</span> Tags:
          </p>
          <div className="flex flex-wrap gap-2">
            {question.topicTags.slice(0, 5).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[#313244] text-[#cdd6f4] font-mono text-xs border border-[#45475a] shadow-[1px_1px_0px_0px_#11111b]"
              >
                {tag.name}
              </span>
            ))}
            {question.topicTags.length > 5 && (
              <span className="px-2 py-1 bg-[#313244] text-[#6c7086] font-mono text-xs border border-[#45475a]">
                +{question.topicTags.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex space-x-3">
        <a
          href={`https://leetcode.com/problems/${question.titleSlug}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-[#89b4fa] text-[#1e1e2e] font-mono font-bold border-4 border-[#89b4fa] hover:bg-[#74c7ec] hover:border-[#74c7ec] transition-all duration-200 shadow-[3px_3px_0px_0px_#11111b] tracking-wider"
        >
          [SOLVE_CHALLENGE]
        </a>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-[#a6e3a1] text-[#1e1e2e] font-mono font-bold border-4 border-[#a6e3a1] hover:bg-[#94e2d5] hover:border-[#94e2d5] transition-all duration-200 shadow-[3px_3px_0px_0px_#11111b] tracking-wider"
        >
          [REFRESH]
        </button>
      </div>
    </div>
  );
}
