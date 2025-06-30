"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { getApiUrl } from "../../../config/api";

interface Question {
  sequence_number: number;
  question_id: number;
  leetcode_id: number;
  title: string;
  url: string;
  difficulty: string;
  tags: string[];
  notes: string;
  estimated_minutes: number;
  importance: number;
}

interface LearningPath {
  path_id: number;
  name: string;
  description: string;
  difficulty_level: string;
  estimated_hours: number;
  tags: string[];
  created_at: string;
  source: string;
  questions: Question[];
}

export default function PathEditor() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const pathId = params.id as string;

  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingPath, setEditingPath] = useState(false);
  const [newQuestionSlug, setNewQuestionSlug] = useState("");
  const [addingQuestion, setAddingQuestion] = useState(false);

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
  };

  const fetchPath = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(getApiUrl(`/learning-paths/${pathId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch path");
      const data = await res.json();
      setPath(data.data || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [pathId]);

  useEffect(() => {
    if (user && !user.is_admin) {
      router.replace("/");
      return;
    }
    if (pathId) {
      fetchPath();
    }
  }, [user, pathId, router, fetchPath]);

  const updatePath = async (updates: Partial<LearningPath>) => {
    if (!path) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(getApiUrl(`/api/v1/admin/learning-paths/${pathId}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        setPath({ ...path, ...updates });
        setError(null);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update path");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = async () => {
    if (!newQuestionSlug.trim() || !path) return;

    setAddingQuestion(true);
    try {
      const token = localStorage.getItem("accessToken");
      const nextSequence =
        Math.max(0, ...path.questions.map((q) => q.sequence_number)) + 1;

      const res = await fetch(
        getApiUrl(`/api/v1/admin/learning-paths/${pathId}/questions`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question_title_slug: newQuestionSlug,
            sequence_number: nextSequence,
            estimated_minutes: 30,
            importance: 3,
          }),
        }
      );

      if (res.ok) {
        await fetchPath(); // Refresh to get the new question
        setNewQuestionSlug("");
        setError(null);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to add question");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setAddingQuestion(false);
    }
  };

  const removeQuestion = async (questionId: number) => {
    if (!confirm("Are you sure you want to remove this question?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const pathQuestion = path?.questions.find(
        (q) => q.question_id === questionId
      );
      if (!pathQuestion) return;

      const res = await fetch(
        getApiUrl(
          `/api/v1/admin/learning-paths/${pathId}/questions/${pathQuestion.sequence_number}`
        ), // Using sequence_number as path_question_id for now
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        await fetchPath();
        setError(null);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to remove question");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const reorderQuestions = async (newOrder: Question[]) => {
    try {
      const token = localStorage.getItem("accessToken");
      const questionOrders = newOrder.map((q, index) => ({
        path_question_id: q.sequence_number, // Using sequence_number as identifier for now
        sequence_number: index + 1,
      }));

      const res = await fetch(
        getApiUrl(`/api/v1/admin/learning-paths/${pathId}/questions/reorder`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ question_orders: questionOrders }),
        }
      );

      if (res.ok) {
        await fetchPath();
        setError(null);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to reorder questions");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || !path) return;

    const newQuestions = [...path.questions];
    const draggedQuestion = newQuestions[draggedIndex];
    newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(dropIndex, 0, draggedQuestion);

    setPath({ ...path, questions: newQuestions });
    setDraggedIndex(null);

    // Update the order on the server
    reorderQuestions(newQuestions);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.base, color: colors.text }}
      >
        <div className="font-mono text-xl">[LOADING_PATH_EDITOR...]</div>
      </div>
    );
  }

  if (!path) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.base, color: colors.text }}
      >
        <div className="font-mono text-xl">[PATH_NOT_FOUND]</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: colors.base, fontFamily: "monospace" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: colors.primary }}
          >
            {">"} [PATH_EDITOR]
          </h1>
          <div style={{ color: colors.text }} className="font-mono">
            Editing: {path.name} (ID: {path.path_id})
          </div>
        </div>
        <button
          onClick={() => router.push("/admin")}
          className="px-4 py-2 border hover:bg-opacity-80"
          style={{
            backgroundColor: colors.text,
            color: colors.base,
            border: `1px solid ${colors.text}`,
          }}
        >
          [BACK_TO_DASHBOARD]
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Path Details Panel */}
        <div
          className="lg:col-span-1 border-2 p-4"
          style={{
            backgroundColor: colors.surface,
            border: `2px solid ${colors.border}`,
            boxShadow: "4px 4px 0px #11111b",
          }}
        >
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: colors.primary }}
          >
            [PATH_DETAILS]
          </h2>

          <div className="space-y-4">
            <div>
              <label
                style={{ color: colors.accent }}
                className="block text-sm font-bold mb-1"
              >
                [NAME]
              </label>
              {editingPath ? (
                <input
                  type="text"
                  value={path.name}
                  onChange={(e) => setPath({ ...path, name: e.target.value })}
                  className="w-full p-2 font-mono"
                  style={{
                    backgroundColor: colors.overlay,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                  }}
                />
              ) : (
                <div style={{ color: colors.text }}>{path.name}</div>
              )}
            </div>

            <div>
              <label
                style={{ color: colors.accent }}
                className="block text-sm font-bold mb-1"
              >
                [DESCRIPTION]
              </label>
              {editingPath ? (
                <textarea
                  value={path.description}
                  onChange={(e) =>
                    setPath({ ...path, description: e.target.value })
                  }
                  rows={3}
                  className="w-full p-2 font-mono"
                  style={{
                    backgroundColor: colors.overlay,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                  }}
                />
              ) : (
                <div style={{ color: colors.text }}>{path.description}</div>
              )}
            </div>

            <div>
              <label
                style={{ color: colors.accent }}
                className="block text-sm font-bold mb-1"
              >
                [DIFFICULTY]
              </label>
              <div style={{ color: colors.text }}>{path.difficulty_level}</div>
            </div>

            <div>
              <label
                style={{ color: colors.accent }}
                className="block text-sm font-bold mb-1"
              >
                [ESTIMATED_HOURS]
              </label>
              <div style={{ color: colors.text }}>{path.estimated_hours}h</div>
            </div>

            <div>
              <label
                style={{ color: colors.accent }}
                className="block text-sm font-bold mb-1"
              >
                [QUESTIONS_COUNT]
              </label>
              <div style={{ color: colors.text }}>{path.questions.length}</div>
            </div>

            <div className="flex gap-2">
              {editingPath ? (
                <>
                  <button
                    onClick={() => {
                      updatePath({
                        name: path.name,
                        description: path.description,
                      });
                      setEditingPath(false);
                    }}
                    disabled={saving}
                    className="px-3 py-1 text-sm border hover:bg-opacity-80"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.base,
                      border: `1px solid ${colors.accent}`,
                    }}
                  >
                    {saving ? "[SAVING...]" : "[SAVE]"}
                  </button>
                  <button
                    onClick={() => setEditingPath(false)}
                    className="px-3 py-1 text-sm border hover:bg-opacity-80"
                    style={{
                      backgroundColor: colors.error,
                      color: colors.base,
                      border: `1px solid ${colors.error}`,
                    }}
                  >
                    [CANCEL]
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditingPath(true)}
                  className="px-3 py-1 text-sm border hover:bg-opacity-80"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.base,
                    border: `1px solid ${colors.primary}`,
                  }}
                >
                  [EDIT_PATH]
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Questions Panel */}
        <div
          className="lg:col-span-2 border-2 p-4"
          style={{
            backgroundColor: colors.surface,
            border: `2px solid ${colors.border}`,
            boxShadow: "4px 4px 0px #11111b",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold" style={{ color: colors.primary }}>
              [QUESTIONS_MANAGEMENT]
            </h2>
          </div>

          {/* Add Question Form */}
          <div
            className="p-4 mb-4 border"
            style={{
              backgroundColor: colors.overlay,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter LeetCode question slug (e.g., two-sum)"
                value={newQuestionSlug}
                onChange={(e) => setNewQuestionSlug(e.target.value)}
                className="flex-1 p-2 font-mono"
                style={{
                  backgroundColor: colors.surface,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                }}
              />
              <button
                onClick={addQuestion}
                disabled={addingQuestion || !newQuestionSlug.trim()}
                className="px-4 py-2 border hover:bg-opacity-80"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.base,
                  border: `1px solid ${colors.accent}`,
                  cursor:
                    !newQuestionSlug.trim() || addingQuestion
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {addingQuestion ? "[ADDING...]" : "[ADD_QUESTION]"}
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-2">
            {path.questions.map((question, index) => (
              <div
                key={question.question_id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="p-4 border cursor-move hover:bg-opacity-50 transition-all"
                style={{
                  backgroundColor: colors.overlay,
                  border: `1px solid ${colors.border}`,
                  opacity: draggedIndex === index ? 0.5 : 1,
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-1 text-xs font-bold rounded"
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.base,
                        }}
                      >
                        #{question.sequence_number}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          question.difficulty === "Easy"
                            ? "bg-green-600"
                            : question.difficulty === "Medium"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                        style={{ color: colors.base }}
                      >
                        {question.difficulty}
                      </span>
                      <span
                        className="px-2 py-1 text-xs rounded"
                        style={{
                          backgroundColor: colors.warning,
                          color: colors.base,
                        }}
                      >
                        {question.estimated_minutes}min
                      </span>
                      <span
                        className="px-2 py-1 text-xs rounded"
                        style={{
                          backgroundColor: colors.accent,
                          color: colors.base,
                        }}
                      >
                        ★{question.importance}
                      </span>
                    </div>
                    <div
                      className="font-bold mb-1"
                      style={{ color: colors.text }}
                    >
                      {question.title}
                    </div>
                    {question.notes && (
                      <div
                        className="text-sm mb-2"
                        style={{ color: colors.text }}
                      >
                        {question.notes}
                      </div>
                    )}
                    <a
                      href={question.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                      style={{ color: colors.primary }}
                    >
                      {question.url}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeQuestion(question.question_id)}
                      className="px-2 py-1 text-xs border hover:bg-opacity-80"
                      style={{
                        backgroundColor: colors.error,
                        color: colors.base,
                        border: `1px solid ${colors.error}`,
                      }}
                    >
                      [REMOVE]
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {path.questions.length === 0 && (
              <div className="text-center py-8" style={{ color: colors.text }}>
                [NO_QUESTIONS_FOUND] - Add questions using the form above
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
