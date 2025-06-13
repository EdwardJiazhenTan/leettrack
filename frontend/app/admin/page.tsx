"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

interface AdminStats {
  total_users: number;
  total_questions: number;
  total_learning_paths: number;
  total_user_questions: number;
  total_user_learning_paths: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect non-admin users away
  useEffect(() => {
    if (user && !user.is_admin) {
      router.replace("/");
    }
  }, [user, router]);

  // Fetch admin statistics
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No access token found");
        setLoading(false);
        return;
      }

      try {
        console.log(
          "Fetching admin stats with token:",
          token.substring(0, 20) + "..."
        );
        const response = await fetch(
          "http://localhost:5000/api/v1/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (response.ok) {
          const data = await response.json();
          console.log("Response data:", data);
          setStats(data.summary);
        } else {
          const errorData = await response.text();
          console.error("Error response:", errorData);
          setError(`Failed to fetch statistics (${response.status})`);
        }
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    if (user?.is_admin) {
      fetchStats();
    }
  }, [user]);

  // Styling variables (Catppuccin)
  const colors = {
    base: "#1e1e2e",
    surface: "#181825",
    overlay: "#313244",
    text: "#cdd6f4",
    primary: "#89b4fa",
    accent: "#a6e3a1",
    border: "#45475a",
    highlight: "#f9e2af",
    red: "#f38ba8",
  };

  if (!user?.is_admin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundColor: colors.base,
        fontFamily: "monospace",
      }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div
            className="text-3xl font-bold tracking-wider"
            style={{ color: colors.primary }}
          >
            {">"} [ADMIN_DASHBOARD]
          </div>
          <div className="text-sm" style={{ color: colors.text }}>
            system.admin.control_panel()
          </div>
        </div>

        {/* Navigation Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Learning Path */}
          <Link
            href="/admin/new-path"
            className="block p-6 transition-all duration-200 hover:transform hover:translate-x-[-2px] hover:translate-y-[-2px]"
            style={{
              backgroundColor: colors.surface,
              border: `4px solid ${colors.accent}`,
              boxShadow: "6px 6px 0px #11111b",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "8px 8px 0px #11111b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "6px 6px 0px #11111b";
            }}
          >
            <div className="space-y-3">
              <div
                className="text-xl font-bold tracking-wide"
                style={{ color: colors.accent }}
              >
                [CREATE_LEARNING_PATH]
              </div>
              <div className="text-sm" style={{ color: colors.text }}>
                {">"} Create new recommended learning paths
              </div>
              <div className="text-sm" style={{ color: colors.text }}>
                {">"} Configure difficulty and tags
              </div>
              <div className="text-sm" style={{ color: colors.text }}>
                {">"} Set public/private visibility
              </div>
            </div>
          </Link>

          {/* Website Monitoring */}
          <div
            className="p-6"
            style={{
              backgroundColor: colors.surface,
              border: `4px solid ${colors.highlight}`,
              boxShadow: "6px 6px 0px #11111b",
            }}
          >
            <div className="space-y-3">
              <div
                className="text-xl font-bold tracking-wide"
                style={{ color: colors.highlight }}
              >
                [WEBSITE_MONITORING]
              </div>
              {loading ? (
                <div className="text-sm" style={{ color: colors.text }}>
                  {">"} Loading statistics...
                </div>
              ) : error ? (
                <div className="text-sm" style={{ color: colors.red }}>
                  {">"} Error: {error}
                </div>
              ) : stats ? (
                <div className="space-y-2">
                  <div className="text-sm" style={{ color: colors.text }}>
                    {">"} Total Users: {stats.total_users}
                  </div>
                  <div className="text-sm" style={{ color: colors.text }}>
                    {">"} Learning Paths: {stats.total_learning_paths}
                  </div>
                  <div className="text-sm" style={{ color: colors.text }}>
                    {">"} Questions: {stats.total_questions}
                  </div>
                  <div className="text-sm" style={{ color: colors.text }}>
                    {">"} User Progress: {stats.total_user_questions}
                  </div>
                  <div className="text-sm" style={{ color: colors.text }}>
                    {">"} Active Enrollments: {stats.total_user_learning_paths}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div
          className="p-6"
          style={{
            backgroundColor: colors.surface,
            border: `4px solid ${colors.primary}`,
            boxShadow: "6px 6px 0px #11111b",
          }}
        >
          <div className="space-y-3">
            <div
              className="text-xl font-bold tracking-wide"
              style={{ color: colors.primary }}
            >
              [SYSTEM_STATUS]
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-sm" style={{ color: colors.text }}>
                {">"} Database:{" "}
                <span style={{ color: colors.accent }}>ONLINE</span>
              </div>
              <div className="text-sm" style={{ color: colors.text }}>
                {">"} API: <span style={{ color: colors.accent }}>ACTIVE</span>
              </div>
              <div className="text-sm" style={{ color: colors.text }}>
                {">"} LeetCode Sync:{" "}
                <span style={{ color: colors.accent }}>READY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 font-mono font-bold text-sm tracking-wide transition-all duration-200"
            style={{
              color: colors.text,
              border: `2px solid ${colors.border}`,
              boxShadow: "4px 4px 0px #11111b",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.overlay;
              e.currentTarget.style.transform = "translate(-1px, -1px)";
              e.currentTarget.style.boxShadow = "5px 5px 0px #11111b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "translate(0px, 0px)";
              e.currentTarget.style.boxShadow = "4px 4px 0px #11111b";
            }}
          >
            [BACK_TO_HOME]
          </Link>
        </div>
      </div>
    </div>
  );
}
