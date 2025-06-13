"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

interface LearningPath {
  path_id: number;
  name: string;
  description: string;
  difficulty_level: string;
  estimated_hours: number;
  tags: string[];
  question_count: number;
  created_at: string;
  source: string;
}

export default function PathsPage() {
  const router = useRouter();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedSource, setSelectedSource] = useState("");

  const colors = {
    base: "#1e1e2e",
    surface: "#313244",
    overlay: "#45475a",
    text: "#cdd6f4",
    primary: "#89b4fa",
    accent: "#a6e3a1",
    warning: "#f9e2af",
    error: "#f38ba8",
    pink: "#f38ba8",
    purple: "#cba6f7",
  };

  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/learning-paths");
      if (!res.ok) throw new Error("Failed to fetch paths");

      const data = await res.json();
      setPaths(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const filteredPaths = paths.filter((path) => {
    const matchesSearch =
      path.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      !selectedDifficulty || path.difficulty_level === selectedDifficulty;
    const matchesSource = !selectedSource || path.source === selectedSource;

    return matchesSearch && matchesDifficulty && matchesSource;
  });

  const getSourceColor = (source: string) => {
    switch (source) {
      case "System":
        return colors.primary;
      case "User":
        return colors.accent;
      default:
        return colors.overlay;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "#a6e3a1";
      case "Intermediate":
        return "#f9e2af";
      case "Advanced":
        return "#f38ba8";
      default:
        return colors.overlay;
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.base, color: colors.text }}
      >
        <div className="font-mono text-2xl">[LOADING_LEARNING_PATHS...]</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.base, fontFamily: "monospace" }}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: colors.primary }}
            >
              {">"} [LEARNING_PATHS]
            </h1>
            <div style={{ color: colors.text }} className="font-mono">
              Discover curated coding paths • {filteredPaths.length} paths
              available
            </div>
          </div>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 border-2 hover:bg-opacity-80 transition-all"
            style={{
              backgroundColor: colors.surface,
              color: colors.text,
              border: `2px solid ${colors.overlay}`,
              boxShadow: "3px 3px 0px #11111b",
            }}
          >
            [BACK_TO_HOME]
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div
            className="p-4 mb-6 border-2"
            style={{
              backgroundColor: colors.error,
              color: colors.base,
              border: `2px solid ${colors.error}`,
              boxShadow: "4px 4px 0px #11111b",
            }}
          >
            [ERROR] {error}
          </div>
        )}

        {/* Filters */}
        <div
          className="p-6 mb-8 border-2"
          style={{
            backgroundColor: colors.surface,
            border: `2px solid ${colors.overlay}`,
            boxShadow: "4px 4px 0px #11111b",
          }}
        >
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: colors.accent }}
          >
            [FILTERS]
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className="block text-sm font-bold mb-2"
                style={{ color: colors.text }}
              >
                [SEARCH]
              </label>
              <input
                type="text"
                placeholder="Search paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 font-mono"
                style={{
                  backgroundColor: colors.overlay,
                  color: colors.text,
                  border: `1px solid ${colors.overlay}`,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-bold mb-2"
                style={{ color: colors.text }}
              >
                [DIFFICULTY]
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-3 font-mono"
                style={{
                  backgroundColor: colors.overlay,
                  color: colors.text,
                  border: `1px solid ${colors.overlay}`,
                }}
              >
                <option value="">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-bold mb-2"
                style={{ color: colors.text }}
              >
                [SOURCE]
              </label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full p-3 font-mono"
                style={{
                  backgroundColor: colors.overlay,
                  color: colors.text,
                  border: `1px solid ${colors.overlay}`,
                }}
              >
                <option value="">All Sources</option>
                <option value="System">System Curated</option>
                <option value="User">User Created</option>
              </select>
            </div>
          </div>
        </div>

        {/* Paths Grid - Changed to 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPaths.map((path) => (
            <div
              key={path.path_id}
              className="border-2 p-6 cursor-pointer hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: colors.surface,
                border: `2px solid ${colors.overlay}`,
                boxShadow: "6px 6px 0px #11111b",
              }}
              onClick={() => router.push(`/paths/${path.path_id}`)}
            >
              {/* Path Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3
                    className="text-2xl font-bold mb-3 line-clamp-2"
                    style={{ color: colors.primary }}
                  >
                    {path.name}
                  </h3>
                  <div className="flex gap-2 mb-2">
                    <span
                      className="px-2 py-1 text-xs font-bold rounded"
                      style={{
                        backgroundColor: getDifficultyColor(
                          path.difficulty_level
                        ),
                        color: colors.base,
                      }}
                    >
                      {path.difficulty_level}
                    </span>
                    <span
                      className="px-2 py-1 text-xs font-bold rounded"
                      style={{
                        backgroundColor: getSourceColor(path.source),
                        color: colors.base,
                      }}
                    >
                      {path.source}
                    </span>
                  </div>
                </div>
              </div>

              {/* Path Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div
                  className="text-center p-2"
                  style={{ backgroundColor: colors.overlay }}
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ color: colors.warning }}
                  >
                    {path.question_count}
                  </div>
                  <div className="text-xs" style={{ color: colors.text }}>
                    QUESTIONS
                  </div>
                </div>
                <div
                  className="text-center p-2"
                  style={{ backgroundColor: colors.overlay }}
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ color: colors.accent }}
                  >
                    {path.estimated_hours || "N/A"}
                  </div>
                  <div className="text-xs" style={{ color: colors.text }}>
                    HOURS
                  </div>
                </div>
              </div>

              {/* Description */}
              <p
                className="text-sm line-clamp-3 mb-4"
                style={{ color: colors.text }}
              >
                {path.description}
              </p>

              {/* Tags */}
              {path.tags && path.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {path.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        backgroundColor: colors.purple,
                        color: colors.base,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {path.tags.length > 3 && (
                    <span
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        backgroundColor: colors.overlay,
                        color: colors.text,
                      }}
                    >
                      +{path.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                className="w-full py-3 font-bold text-sm transition-all hover:bg-opacity-80"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.base,
                  border: `2px solid ${colors.accent}`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/paths/${path.path_id}`);
                }}
              >
                [START_PATH]
              </button>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPaths.length === 0 && !loading && (
          <div className="text-center py-12" style={{ color: colors.text }}>
            <div
              className="p-8 border-2"
              style={{
                backgroundColor: colors.surface,
                border: `2px solid ${colors.overlay}`,
                boxShadow: "4px 4px 0px #11111b",
              }}
            >
              <div className="text-2xl font-bold mb-2">[NO_PATHS_FOUND]</div>
              <div>Try adjusting your search filters</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
