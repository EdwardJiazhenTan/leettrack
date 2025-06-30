"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from "../config/api";
import ThreadsBackground from "../components/ThreadsBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProgressBar from "../components/ProgressBar";
import Link from "next/link";

interface LearningPath {
  path_id: number;
  name: string;
  description: string;
  difficulty_level: string;
  estimated_hours: number;
  question_count: number;
  tags: string[];
  source: string;
}

export default function PathsPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-[#a6e3a1] border-[#a6e3a1]";
      case "intermediate":
        return "text-[#f9e2af] border-[#f9e2af]";
      case "advanced":
        return "text-[#f38ba8] border-[#f38ba8]";
      default:
        return "text-[#cdd6f4] border-[#cdd6f4]";
    }
  };

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const response = await fetch(getApiUrl("/api/v1/learning-paths"));
        if (response.ok) {
          const result = await response.json();
          if (result.status === "success") {
            setPaths(result.data.learning_paths || []);
          } else {
            console.error("Failed to fetch paths:", result.message);
          }
        } else {
          console.error("Failed to fetch paths: HTTP", response.status);
        }
      } catch (error) {
        console.error("Error fetching paths:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaths();
  }, []);

  if (isLoading) {
    return (
      <ThreadsBackground className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-[#313244]/80 backdrop-blur-sm border-4 border-[#45475a] p-8 shadow-[4px_4px_0px_0px_#11111b]">
            <ProgressBar
              text="LOADING LEARNING PATHS"
              duration={1800}
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
          {/* Header */}
          <div className="text-center mb-8 bg-[#313244]/80 backdrop-blur-sm border-4 border-[#f38ba8] p-6 shadow-[4px_4px_0px_0px_#11111b]">
            <h1 className="text-3xl font-mono font-bold text-[#f38ba8] tracking-wider mb-2">
              [LEARNING_PATHS]
            </h1>
            <p className="text-lg font-mono text-[#a6adc8] tracking-wide">
              &gt; Structured learning paths to master algorithms and data
              structures
            </p>
          </div>

          {/* Paths Grid */}
          <div className="flex-1">
            {paths.length === 0 ? (
              <div className="text-center py-16 bg-[#313244]/80 backdrop-blur-sm border-4 border-[#45475a] shadow-[4px_4px_0px_0px_#11111b]">
                <div className="text-6xl mb-4">🛤️</div>
                <h2 className="text-2xl font-mono font-bold text-[#a6adc8] tracking-wider mb-4">
                  [NO_PATHS_AVAILABLE]
                </h2>
                <p className="text-lg font-mono text-[#6c7086] tracking-wide mb-8">
                  &gt; Learning paths are being prepared. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paths.map((path) => (
                  <Link
                    key={path.path_id}
                    href={`/paths/${path.path_id}`}
                    className="group block bg-[#313244]/80 backdrop-blur-sm border-4 border-[#45475a] p-6 shadow-[4px_4px_0px_0px_#11111b] hover:shadow-[6px_6px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 hover:border-[#89b4fa]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 text-xs font-mono font-bold border-2 ${getDifficultyColor(
                          path.difficulty_level
                        )}`}
                      >
                        [{path.difficulty_level.toUpperCase()}]
                      </span>
                      <span className="text-sm font-mono text-[#a6adc8]">
                        {path.question_count} questions
                      </span>
                    </div>

                    <h3 className="text-xl font-mono font-bold text-[#cdd6f4] tracking-wider mb-3 group-hover:text-[#89b4fa] transition-colors">
                      {path.name}
                    </h3>

                    <p className="text-sm font-mono text-[#a6adc8] leading-relaxed mb-4">
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
                      <span className="text-xs font-mono text-[#a6adc8]">
                        Est. {path.estimated_hours || "N/A"}h
                      </span>
                      <div className="text-sm font-mono text-[#89b4fa] group-hover:text-[#74c7ec] transition-colors">
                        [EXPLORE] →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </ThreadsBackground>
  );
}
