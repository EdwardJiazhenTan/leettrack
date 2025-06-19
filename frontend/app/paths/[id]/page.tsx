"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getApiUrl } from "../../config/api";
import ThreadsBackground from "../../components/ThreadsBackground";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProgressBar from "../../components/ProgressBar";

interface Question {
  question_id: number;
  title: string;
  difficulty: string;
  leetcode_id: number;
  url: string;
  tags: string[];
}

interface LearningPath {
  path_id: number;
  name: string;
  description: string;
  difficulty_level: string;
  estimated_hours: number;
  tags: string[];
  questions: Question[];
}

export default function PathDetailPage() {
  const params = useParams();
  const pathId = params.id;

  const [path, setPath] = useState<LearningPath | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completedQuestions] = useState<Set<number>>(new Set());

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-[#a6e3a1] border-[#a6e3a1]";
      case "medium":
        return "text-[#f9e2af] border-[#f9e2af]";
      case "hard":
        return "text-[#f38ba8] border-[#f38ba8]";
      default:
        return "text-[#cdd6f4] border-[#cdd6f4]";
    }
  };

  const completedCount = completedQuestions.size;

  useEffect(() => {
    const fetchPath = async () => {
      try {
        const response = await fetch(getApiUrl(`/learning-paths/${pathId}`));
        if (response.ok) {
          const data = await response.json();
          setPath(data.data);
        }
      } catch (error) {
        console.error("Error fetching path:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (pathId) {
      fetchPath();
    }
  }, [pathId]);

  if (isLoading) {
    return (
      <ThreadsBackground className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-[#313244]/80 backdrop-blur-sm border-4 border-[#45475a] p-8 shadow-[4px_4px_0px_0px_#11111b]">
            <ProgressBar
              text="LOADING PATH"
              duration={1600}
              showPercentage={true}
            />
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
        <main className="flex-1 flex flex-col max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {path ? (
            <div className="flex-1 flex flex-col">
              {/* Path Header */}
              <div className="bg-[#313244]/80 backdrop-blur-sm border-4 border-[#89b4fa] p-6 shadow-[4px_4px_0px_0px_#11111b] mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 text-xs font-mono font-bold border-2 ${getDifficultyColor(
                      path.difficulty_level
                    )}`}
                  >
                    [{path.difficulty_level.toUpperCase()}]
                  </span>
                  <span className="text-sm font-mono text-[#a6adc8]">
                    {path.questions.length} questions
                  </span>
                </div>

                <h1 className="text-3xl font-mono font-bold text-[#89b4fa] tracking-wider mb-4">
                  {path.name}
                </h1>

                <p className="text-lg font-mono text-[#a6adc8] leading-relaxed mb-4">
                  {path.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {path.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-mono bg-[#45475a] text-[#cdd6f4] border border-[#585b70]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-[#a6adc8]">
                    Estimated: {path.estimated_hours}h
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-mono text-[#a6e3a1]">
                      Progress: {completedCount}/{path.questions.length}
                    </span>
                    <div className="w-32 h-2 bg-[#45475a] border border-[#585b70]">
                      <div
                        className="h-full bg-[#a6e3a1] transition-all duration-300"
                        style={{
                          width: `${
                            path.questions.length > 0
                              ? (completedCount / path.questions.length) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="flex-1">
                <div className="space-y-4">
                  {path.questions.map((question, index) => (
                    <div
                      key={question.question_id}
                      className="bg-[#313244]/80 backdrop-blur-sm border-4 border-[#45475a] p-6 shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-mono font-bold text-[#89b4fa]">
                            #{index + 1}
                          </span>
                          <span
                            className={`px-3 py-1 text-xs font-mono font-bold border-2 ${getDifficultyColor(
                              question.difficulty
                            )}`}
                          >
                            [{question.difficulty.toUpperCase()}]
                          </span>
                          <span className="text-sm font-mono text-[#a6adc8]">
                            #{question.leetcode_id}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {completedQuestions.has(question.question_id) && (
                            <span className="text-[#a6e3a1] text-xl">✓</span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-mono font-bold text-[#cdd6f4] tracking-wider mb-3">
                        {question.title}
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {question.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs font-mono bg-[#45475a] text-[#cdd6f4] border border-[#585b70]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {completedQuestions.has(question.question_id) && (
                            <span className="text-sm font-mono text-[#a6e3a1]">
                              Completed
                            </span>
                          )}
                        </div>
                        <a
                          href={question.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#89b4fa] hover:bg-[#74c7ec] text-[#1e1e2e] px-4 py-2 font-mono font-bold border-2 border-[#89b4fa] hover:border-[#74c7ec] transition-all duration-200 shadow-[2px_2px_0px_0px_#11111b] hover:shadow-[4px_4px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                        >
                          [SOLVE]
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center bg-[#313244]/80 backdrop-blur-sm border-4 border-[#f38ba8] p-8 shadow-[4px_4px_0px_0px_#11111b]">
                <h2 className="text-2xl font-mono font-bold text-[#f38ba8] tracking-wider mb-4">
                  [PATH_NOT_FOUND]
                </h2>
                <p className="text-lg font-mono text-[#a6adc8] tracking-wide">
                  &gt; The requested learning path could not be found.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </ThreadsBackground>
  );
}
