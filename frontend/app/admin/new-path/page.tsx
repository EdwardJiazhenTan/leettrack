"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { getApiUrl } from "../../config/api";

export default function NewPathPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Redirect non-admin users away
  useEffect(() => {
    if (user && !user.is_admin) {
      router.replace("/");
    }
  }, [user, router]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    difficulty_level: "Intermediate",
    estimated_hours: 0,
    tags: "",
    is_public: true,
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string | boolean | number) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(getApiUrl("/admin/learning-paths"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/"); // or admin dashboard path list
      } else {
        setError(data.message || "Failed to create path");
      }
    } catch (error) {
      console.error(error);
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  // Styling variables (Catppuccin)
  const colors: Record<string, string> = {
    base: "#1e1e2e",
    surface: "#181825",
    overlay: "#313244",
    text: "#cdd6f4",
    primary: "#89b4fa",
    accent: "#a6e3a1",
    border: "#45475a",
    highlight: "#f9e2af",
  } as const;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: colors.base,
        fontFamily: "monospace",
      }}
    >
      <div
        className="w-full max-w-2xl p-8 space-y-6"
        style={{
          backgroundColor: colors.surface,
          border: `4px solid ${colors.border}`,
          boxShadow: "8px 8px 0px #11111b",
        }}
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div
            className="text-2xl font-bold tracking-wider"
            style={{ color: colors.primary }}
          >
            {">"} [ADMIN_CREATE_PATH]
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="p-4 text-sm font-mono"
            style={{
              backgroundColor: "#f38ba8",
              color: colors.base,
              border: "2px solid #f38ba8",
              boxShadow: "4px 4px 0px #11111b",
            }}
          >
            <div className="font-bold">[ERROR]</div>
            <div>{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <Field
            label="[PATH_NAME]"
            value={form.name}
            onChange={(v) => handleChange("name", v)}
            colors={colors}
          />
          {/* Description */}
          <Field
            label="[DESCRIPTION]"
            type="textarea"
            value={form.description}
            onChange={(v) => handleChange("description", v)}
            colors={colors}
          />
          {/* Difficulty */}
          <Field
            label="[DIFFICULTY_LEVEL]"
            value={form.difficulty_level}
            onChange={(v) => handleChange("difficulty_level", v)}
            colors={colors}
          />
          {/* Estimated Hours */}
          <Field
            label="[ESTIMATED_HOURS]"
            type="number"
            value={String(form.estimated_hours)}
            onChange={(v) => handleChange("estimated_hours", Number(v))}
            colors={colors}
          />
          {/* Tags */}
          <Field
            label="[TAGS_COMMA]"
            value={form.tags}
            onChange={(v) => handleChange("tags", v)}
            colors={colors}
          />
          {/* Is Public */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.is_public}
              onChange={(e) => handleChange("is_public", e.target.checked)}
              className="h-4 w-4"
              style={{
                backgroundColor: colors.overlay,
                border: `2px solid ${colors.border}`,
              }}
            />
            <span style={{ color: colors.text }} className="font-mono text-sm">
              [PUBLIC]
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-4 font-mono font-bold text-sm tracking-wider transition-all duration-200 focus:outline-none"
            style={{
              backgroundColor: isSubmitting ? colors.border : colors.accent,
              color: colors.base,
              border: `3px solid ${colors.accent}`,
              boxShadow: "6px 6px 0px #11111b",
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? ">[CREATING...]" : ">[CREATE_PATH]"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Reusable Field component
function Field({
  label,
  value,
  onChange,
  colors,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string | number) => void;
  colors: Record<string, string>;
  type?: "text" | "textarea" | "number";
}) {
  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-mono font-bold tracking-wide"
        style={{ color: colors.accent }}
      >
        {">"} {label}
      </label>
      {type === "textarea" ? (
        <textarea
          required
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 font-mono text-sm tracking-wide focus:outline-none"
          rows={4}
          style={{
            backgroundColor: colors.overlay,
            color: colors.text,
            border: `2px solid ${colors.border}`,
            boxShadow: "4px 4px 0px #11111b",
          }}
        />
      ) : (
        <input
          type={type}
          required={label !== "[ESTIMATED_HOURS]"}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 font-mono text-sm tracking-wide focus:outline-none"
          style={{
            backgroundColor: colors.overlay,
            color: colors.text,
            border: `2px solid ${colors.border}`,
            boxShadow: "4px 4px 0px #11111b",
          }}
        />
      )}
    </div>
  );
}
