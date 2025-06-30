"use client";

import React, { useState, useEffect } from "react";
import { learningPathsApi } from "../services/api";

interface LearningPath {
  path_id: number;
  name: string;
  description: string;
  difficulty_level: string;
  tags: string[];
  question_count: number;
  estimated_hours: number;
}

interface LearningPathsResponse {
  status: string;
  data: {
    learning_paths: LearningPath[];
  };
}

export default function LearningPathsList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pathsData, setPathsData] = useState<LearningPathsResponse | null>(
    null
  );

  useEffect(() => {
    async function fetchLearningPaths() {
      setLoading(true);
      const response = await learningPathsApi.getPaths({ limit: 5 });

      if (response.error) {
        setError(response.error);
      } else {
        setPathsData(response.data as LearningPathsResponse);
      }

      setLoading(false);
    }

    fetchLearningPaths();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-[#1e1e2e] border-4 border-[#45475a] shadow-[3px_3px_0px_0px_#11111b]">
        <p className="text-[#a6adc8] font-mono">[LOADING_LEARNING_PATHS...]</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-[#1e1e2e] border-4 border-[#f38ba8] shadow-[3px_3px_0px_0px_#11111b]">
        <p className="text-[#f38ba8] font-mono">[ERROR] {error}</p>
      </div>
    );
  }

  if (!pathsData || !pathsData.data || !pathsData.data.learning_paths || pathsData.data.learning_paths.length === 0) {
    return (
      <div className="p-4 bg-[#1e1e2e] border-4 border-[#45475a] shadow-[3px_3px_0px_0px_#11111b]">
        <p className="text-[#a6adc8] font-mono">
          [NO_LEARNING_PATHS_AVAILABLE]
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#1e1e2e] border-4 border-[#45475a] shadow-[3px_3px_0px_0px_#11111b]">
      <h2 className="text-lg font-mono font-bold mb-4 text-[#cdd6f4] tracking-wider">
        [LEARNING_PATHS]
      </h2>
      <div className="space-y-4">
        {pathsData.data.learning_paths.map((path) => (
          <div
            key={path.path_id}
            className="p-3 bg-[#313244] border-2 border-[#45475a] hover:border-[#89b4fa] transition-all duration-200 shadow-[2px_2px_0px_0px_#11111b]"
          >
            <h3 className="text-base font-mono font-bold text-[#89b4fa] mb-2">
              {path.name}
            </h3>
            <p className="font-mono text-sm text-[#a6adc8] mb-3 leading-relaxed">
              {path.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {path.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[#89b4fa] text-[#1e1e2e] font-mono font-bold text-xs border-2 border-[#89b4fa] shadow-[1px_1px_0px_0px_#11111b]"
                >
                  [{tag.toUpperCase()}]
                </span>
              ))}
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span className="text-[#a6adc8]">
                <span className="text-[#fab387]">&gt;</span>{" "}
                <span className="text-[#f9e2af]">{path.question_count}</span>{" "}
                questions •{" "}
                <span className="text-[#f9e2af]">{path.estimated_hours}</span>{" "}
                hours
              </span>
              <span
                className={`font-bold ${
                  path.difficulty_level === "Easy"
                    ? "text-[#a6e3a1]"
                    : path.difficulty_level === "Medium"
                    ? "text-[#f9e2af]"
                    : "text-[#f38ba8]"
                }`}
              >
                [{path.difficulty_level.toUpperCase()}]
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
