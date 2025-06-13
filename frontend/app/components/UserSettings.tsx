"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface UserSettingsProps {
  currentUsername: string;
  onUsernameUpdate?: (newUsername: string) => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({
  currentUsername,
  onUsernameUpdate,
}) => {
  const { user } = useAuth();
  const [leetcodeUsername, setLeetcodeUsername] = useState(currentUsername);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSaveUsername = async () => {
    if (!leetcodeUsername.trim()) {
      setError("LeetCode username cannot be empty");
      return;
    }

    if (leetcodeUsername === currentUsername) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        "http://localhost:5000/api/v1/auth/user/settings",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leetcode_username: leetcodeUsername.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update username");
      }

      const result = await response.json();
      if (result.status === "success") {
        setSuccess("LeetCode username updated successfully!");
        setIsEditing(false);
        onUsernameUpdate?.(leetcodeUsername.trim());
      } else {
        throw new Error(result.message || "Failed to update username");
      }
    } catch (err) {
      console.error("Error updating username:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setLeetcodeUsername(currentUsername);
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeetcodeUsername(e.target.value);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="p-6"
        style={{
          backgroundColor: "#313244",
          border: "4px solid #cba6f7",
          boxShadow: "4px 4px 0px #11111b",
          fontFamily: "monospace",
        }}
      >
        <h2
          className="text-2xl font-bold mb-2 font-mono tracking-wider"
          style={{ color: "#cba6f7" }}
        >
          {">"} [USER_SETTINGS_TERMINAL]
        </h2>
        <p
          className="font-mono text-sm tracking-wide"
          style={{ color: "#cdd6f4" }}
        >
          {">"} Configure your account preferences and integrations
        </p>
      </div>

      {/* Account Information */}
      <div
        className="p-6"
        style={{
          backgroundColor: "#313244",
          border: "4px solid #45475a",
          boxShadow: "4px 4px 0px #11111b",
          fontFamily: "monospace",
        }}
      >
        <h3
          className="text-xl font-bold mb-6 font-mono tracking-wider"
          style={{ color: "#89b4fa" }}
        >
          {">"} [ACCOUNT_INFORMATION]
        </h3>

        <div className="space-y-4">
          {/* Email (Read-only) */}
          <div>
            <label
              className="block text-sm font-mono font-semibold mb-2 tracking-wide"
              style={{ color: "#6c7086" }}
            >
              {">"} account.email
            </label>
            <div
              className="p-3 font-mono tracking-wide"
              style={{
                backgroundColor: "#181825",
                border: "2px solid #45475a",
                boxShadow: "2px 2px 0px #11111b",
                color: "#cdd6f4",
              }}
            >
              {user?.email}
              <span className="ml-2 text-xs" style={{ color: "#6c7086" }}>
                [READ_ONLY]
              </span>
            </div>
          </div>

          {/* LeetCode Username */}
          <div>
            <label
              className="block text-sm font-mono font-semibold mb-2 tracking-wide"
              style={{ color: "#6c7086" }}
            >
              {">"} leetcode.username
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={leetcodeUsername}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
                className="flex-1 p-3 font-mono tracking-wide transition-all duration-200"
                style={{
                  backgroundColor: isEditing ? "#181825" : "#45475a",
                  border: `2px solid ${
                    error ? "#f38ba8" : isEditing ? "#a6e3a1" : "#45475a"
                  }`,
                  boxShadow: "2px 2px 0px #11111b",
                  color: isEditing ? "#cdd6f4" : "#6c7086",
                }}
                placeholder="Enter your LeetCode username"
              />
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 font-mono font-bold transition-all duration-300 tracking-wider"
                    style={{
                      backgroundColor: "#f9e2af",
                      color: "#1e1e2e",
                      border: "2px solid #f9e2af",
                      boxShadow: "2px 2px 0px #11111b",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translate(-1px, -1px)";
                      e.currentTarget.style.boxShadow = "3px 3px 0px #11111b";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translate(0px, 0px)";
                      e.currentTarget.style.boxShadow = "2px 2px 0px #11111b";
                    }}
                  >
                    [EDIT]
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSaveUsername}
                      disabled={loading}
                      className="px-4 py-2 font-mono font-bold transition-all duration-300 tracking-wider"
                      style={{
                        backgroundColor: loading ? "#45475a" : "#a6e3a1",
                        color: "#1e1e2e",
                        border: `2px solid ${loading ? "#45475a" : "#a6e3a1"}`,
                        boxShadow: "2px 2px 0px #11111b",
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.currentTarget.style.transform =
                            "translate(-1px, -1px)";
                          e.currentTarget.style.boxShadow =
                            "3px 3px 0px #11111b";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) {
                          e.currentTarget.style.transform =
                            "translate(0px, 0px)";
                          e.currentTarget.style.boxShadow =
                            "2px 2px 0px #11111b";
                        }
                      }}
                    >
                      {loading ? "[SAVING...]" : "[SAVE]"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className="px-4 py-2 font-mono font-bold transition-all duration-300 tracking-wider"
                      style={{
                        backgroundColor: loading ? "#45475a" : "#f38ba8",
                        color: "#1e1e2e",
                        border: `2px solid ${loading ? "#45475a" : "#f38ba8"}`,
                        boxShadow: "2px 2px 0px #11111b",
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.currentTarget.style.transform =
                            "translate(-1px, -1px)";
                          e.currentTarget.style.boxShadow =
                            "3px 3px 0px #11111b";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) {
                          e.currentTarget.style.transform =
                            "translate(0px, 0px)";
                          e.currentTarget.style.boxShadow =
                            "2px 2px 0px #11111b";
                        }
                      }}
                    >
                      [CANCEL]
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="mt-2 p-3 font-mono text-sm tracking-wide"
                style={{
                  backgroundColor: "#181825",
                  border: "2px solid #f38ba8",
                  boxShadow: "2px 2px 0px #11111b",
                  color: "#f38ba8",
                }}
              >
                {">"} ERROR: {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div
                className="mt-2 p-3 font-mono text-sm tracking-wide"
                style={{
                  backgroundColor: "#181825",
                  border: "2px solid #a6e3a1",
                  boxShadow: "2px 2px 0px #11111b",
                  color: "#a6e3a1",
                }}
              >
                {">"} SUCCESS: {success}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div
        className="p-6"
        style={{
          backgroundColor: "#313244",
          border: "4px solid #45475a",
          boxShadow: "4px 4px 0px #11111b",
          fontFamily: "monospace",
        }}
      >
        <h3
          className="text-xl font-bold mb-6 font-mono tracking-wider"
          style={{ color: "#89b4fa" }}
        >
          {">"} [INTEGRATION_STATUS]
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔗</span>
              <div>
                <div
                  className="font-mono font-semibold tracking-wide"
                  style={{ color: "#cdd6f4" }}
                >
                  LeetCode Integration
                </div>
                <div
                  className="text-sm font-mono tracking-wide"
                  style={{ color: "#6c7086" }}
                >
                  {">"} Syncs your problem-solving progress
                </div>
              </div>
            </div>
            <div
              className="px-3 py-1 font-mono font-bold text-sm tracking-wider"
              style={{
                backgroundColor: currentUsername ? "#a6e3a1" : "#f38ba8",
                color: "#1e1e2e",
                border: `2px solid ${currentUsername ? "#a6e3a1" : "#f38ba8"}`,
                boxShadow: "2px 2px 0px #11111b",
              }}
            >
              {currentUsername ? "[CONNECTED]" : "[DISCONNECTED]"}
            </div>
          </div>
        </div>
      </div>

      {/* Help Information */}
      <div
        className="p-6"
        style={{
          backgroundColor: "#313244",
          border: "4px solid #45475a",
          boxShadow: "4px 4px 0px #11111b",
          fontFamily: "monospace",
        }}
      >
        <h3
          className="text-xl font-bold mb-4 font-mono tracking-wider"
          style={{ color: "#89b4fa" }}
        >
          {">"} [HELP_INFORMATION]
        </h3>

        <div className="space-y-3">
          <div
            className="p-3 font-mono text-sm tracking-wide"
            style={{
              backgroundColor: "#181825",
              border: "2px solid #45475a",
              boxShadow: "2px 2px 0px #11111b",
              color: "#cdd6f4",
            }}
          >
            <div className="flex items-start gap-2">
              <span style={{ color: "#f9e2af" }}>{">"}</span>
              <div>
                <strong style={{ color: "#f9e2af" }}>LeetCode Username:</strong>{" "}
                Your public LeetCode username is used to sync your
                problem-solving statistics and progress.
              </div>
            </div>
          </div>

          <div
            className="p-3 font-mono text-sm tracking-wide"
            style={{
              backgroundColor: "#181825",
              border: "2px solid #45475a",
              boxShadow: "2px 2px 0px #11111b",
              color: "#cdd6f4",
            }}
          >
            <div className="flex items-start gap-2">
              <span style={{ color: "#89b4fa" }}>{">"}</span>
              <div>
                <strong style={{ color: "#89b4fa" }}>
                  Find Your Username:
                </strong>{" "}
                Visit your LeetCode profile (leetcode.com/u/yourusername/) to
                find your exact username.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
