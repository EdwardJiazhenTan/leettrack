"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { getApiUrl } from "../config/api";

interface LearningPath {
  path_id: number;
  name: string;
  description: string;
  difficulty_level: string;
  estimated_hours: number;
  tags: string[];
  question_count: number;
  enrollment_count: number;
  created_at: string;
  updated_at: string;
  source: string;
  is_public: boolean;
  is_active: boolean;
  creator_id: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bulkCreating, setBulkCreating] = useState<string | null>(null);
  const [selectedPaths, setSelectedPaths] = useState<Set<number>>(new Set());

  // Redirect non-admin users
  useEffect(() => {
    if (user && !user.is_admin) {
      router.replace("/");
    }
  }, [user, router]);

  const colors = {
    base: "#1e1e2e",
    surface: "#181825",
    overlay: "#313244",
    text: "#cdd6f4",
    primary: "#89b4fa",
    accent: "#a6e3a1",
    warning: "#f9e2af",
    error: "#f38ba8",
    border: "#45475a",
    highlight: "#f9e2af",
  };

  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(getApiUrl("/api/v1/admin/learning-paths"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch paths");

      const data = await res.json();
      setPaths(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCreate = async (pathType: string) => {
    setBulkCreating(pathType);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        getApiUrl("/api/v1/admin/learning-paths/bulk-create"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ path_type: pathType }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        await fetchPaths(); // Refresh the list
        setError(null);
      } else {
        setError(data.message || "Failed to create paths");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setBulkCreating(null);
    }
  };

  const handleToggleStatus = async (pathId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        getApiUrl(`/api/v1/admin/learning-paths/${pathId}`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_active: !currentStatus }),
        }
      );

      if (res.ok) {
        await fetchPaths();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update path");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleDeletePath = async (pathId: number) => {
    if (!confirm("Are you sure you want to delete this path?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        getApiUrl(`/api/v1/admin/learning-paths/${pathId}`),
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        await fetchPaths();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to delete path");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleSelectPath = (pathId: number) => {
    const newSelected = new Set(selectedPaths);
    if (newSelected.has(pathId)) {
      newSelected.delete(pathId);
    } else {
      newSelected.add(pathId);
    }
    setSelectedPaths(newSelected);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.base, color: colors.text }}
      >
        <div className="font-mono text-xl">[LOADING_ADMIN_DASHBOARD...]</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: colors.base, fontFamily: "monospace" }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: colors.primary }}
        >
          {">"} [ADMIN_LEARNING_PATHS_DASHBOARD]
        </h1>
        <div style={{ color: colors.text }} className="font-mono">
          Total Paths: {paths.length} | Active:{" "}
          {paths.filter((p) => p.is_active).length} | Public:{" "}
          {paths.filter((p) => p.is_public).length}
        </div>
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

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <ActionButton
          onClick={() => router.push("/admin/new-path")}
          text="[CREATE_CUSTOM_PATH]"
          color={colors.accent}
          disabled={false}
        />

        <ActionButton
          onClick={() => handleBulkCreate("company")}
          text={
            bulkCreating === "company"
              ? "[CREATING...]"
              : "[CREATE_COMPANY_PATHS]"
          }
          color={colors.primary}
          disabled={bulkCreating !== null}
        />

        <ActionButton
          onClick={() => handleBulkCreate("topic")}
          text={
            bulkCreating === "topic" ? "[CREATING...]" : "[CREATE_TOPIC_PATHS]"
          }
          color={colors.warning}
          disabled={bulkCreating !== null}
        />

        <ActionButton
          onClick={() => handleBulkCreate("pattern")}
          text={
            bulkCreating === "pattern"
              ? "[CREATING...]"
              : "[CREATE_PATTERN_PATHS]"
          }
          color={colors.highlight}
          disabled={bulkCreating !== null}
        />
      </div>

      {/* Learning Paths Table */}
      <div
        className="border-2 p-4"
        style={{
          backgroundColor: colors.surface,
          border: `2px solid ${colors.border}`,
          boxShadow: "6px 6px 0px #11111b",
        }}
      >
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: colors.primary }}
        >
          [LEARNING_PATHS_MANAGEMENT]
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full font-mono text-sm">
            <thead>
              <tr style={{ color: colors.accent }}>
                <th
                  className="text-left p-2 border-b"
                  style={{ borderColor: colors.border }}
                >
                  [SELECT]
                </th>
                <th
                  className="text-left p-2 border-b"
                  style={{ borderColor: colors.border }}
                >
                  [PATH_NAME]
                </th>
                <th
                  className="text-left p-2 border-b"
                  style={{ borderColor: colors.border }}
                >
                  [DIFFICULTY]
                </th>
                <th
                  className="text-left p-2 border-b"
                  style={{ borderColor: colors.border }}
                >
                  [QUESTIONS]
                </th>
                <th
                  className="text-left p-2 border-b"
                  style={{ borderColor: colors.border }}
                >
                  [ENROLLMENTS]
                </th>
                <th
                  className="text-left p-2 border-b"
                  style={{ borderColor: colors.border }}
                >
                  [STATUS]
                </th>
                <th
                  className="text-left p-2 border-b"
                  style={{ borderColor: colors.border }}
                >
                  [SOURCE]
                </th>
                <th
                  className="text-left p-2 border-b"
                  style={{ borderColor: colors.border }}
                >
                  [ACTIONS]
                </th>
              </tr>
            </thead>
            <tbody style={{ color: colors.text }}>
              {paths.map((path) => (
                <tr
                  key={path.path_id}
                  className="border-b hover:bg-opacity-50"
                  style={{ borderColor: colors.border }}
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedPaths.has(path.path_id)}
                      onChange={() => handleSelectPath(path.path_id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="p-2">
                    <div
                      className="font-bold"
                      style={{ color: colors.primary }}
                    >
                      {path.name}
                    </div>
                    <div className="text-xs" style={{ color: colors.text }}>
                      ID: {path.path_id}
                    </div>
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        path.difficulty_level === "Beginner"
                          ? "bg-green-600"
                          : path.difficulty_level === "Intermediate"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                      style={{ color: colors.base }}
                    >
                      {path.difficulty_level}
                    </span>
                  </td>
                  <td className="p-2">{path.question_count}</td>
                  <td className="p-2">{path.enrollment_count}</td>
                  <td className="p-2">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-2 py-1 text-xs ${
                          path.is_active ? "bg-green-600" : "bg-red-600"
                        }`}
                        style={{ color: colors.base }}
                      >
                        {path.is_active ? "ACTIVE" : "INACTIVE"}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs ${
                          path.is_public ? "bg-blue-600" : "bg-gray-600"
                        }`}
                        style={{ color: colors.base }}
                      >
                        {path.is_public ? "PUBLIC" : "PRIVATE"}
                      </span>
                    </div>
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs ${
                        path.source === "System"
                          ? "bg-purple-600"
                          : path.source === "User"
                          ? "bg-blue-600"
                          : "bg-gray-600"
                      }`}
                      style={{ color: colors.base }}
                    >
                      {path.source}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/paths/${path.path_id}`)
                        }
                        className="px-2 py-1 text-xs border hover:bg-opacity-80"
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.base,
                          border: `1px solid ${colors.primary}`,
                        }}
                      >
                        [EDIT]
                      </button>
                      <button
                        onClick={() =>
                          handleToggleStatus(path.path_id, path.is_active)
                        }
                        className="px-2 py-1 text-xs border hover:bg-opacity-80"
                        style={{
                          backgroundColor: path.is_active
                            ? colors.warning
                            : colors.accent,
                          color: colors.base,
                          border: `1px solid ${
                            path.is_active ? colors.warning : colors.accent
                          }`,
                        }}
                      >
                        {path.is_active ? "[DISABLE]" : "[ENABLE]"}
                      </button>
                      <button
                        onClick={() => handleDeletePath(path.path_id)}
                        className="px-2 py-1 text-xs border hover:bg-opacity-80"
                        style={{
                          backgroundColor: colors.error,
                          color: colors.base,
                          border: `1px solid ${colors.error}`,
                        }}
                      >
                        [DELETE]
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paths.length === 0 && (
          <div className="text-center py-8" style={{ color: colors.text }}>
            [NO_LEARNING_PATHS_FOUND]
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedPaths.size > 0 && (
        <div
          className="mt-6 p-4 border-2"
          style={{
            backgroundColor: colors.overlay,
            border: `2px solid ${colors.border}`,
            boxShadow: "4px 4px 0px #11111b",
          }}
        >
          <div style={{ color: colors.accent }} className="font-bold mb-2">
            [BULK_ACTIONS] - {selectedPaths.size} selected
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPaths(new Set())}
              className="px-4 py-2 border hover:bg-opacity-80"
              style={{
                backgroundColor: colors.text,
                color: colors.base,
                border: `1px solid ${colors.text}`,
              }}
            >
              [CLEAR_SELECTION]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  text: string;
  color: string;
  disabled: boolean;
}

function ActionButton({ onClick, text, color, disabled }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-4 font-mono font-bold text-sm tracking-wider transition-all duration-200 focus:outline-none"
      style={{
        backgroundColor: disabled ? "#45475a" : color,
        color: "#1e1e2e",
        border: `3px solid ${color}`,
        boxShadow: "6px 6px 0px #11111b",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {text}
    </button>
  );
}
