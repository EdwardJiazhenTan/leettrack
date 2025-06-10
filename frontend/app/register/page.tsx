"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const { register, isLoading, error, user } = useAuth();
  const router = useRouter();

  // Navigate to home when user is successfully authenticated
  useEffect(() => {
    if (user && !isLoading) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(email, password, leetcodeUsername);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: "#1e1e2e",
        fontFamily: "monospace",
        backgroundImage: `
          radial-gradient(circle at 25% 25%, #313244 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, #45475a 0%, transparent 50%)
        `,
      }}
    >
      <div
        className="w-full max-w-md p-8 space-y-6"
        style={{
          backgroundColor: "#181825",
          border: "4px solid #45475a",
          boxShadow: "8px 8px 0px #11111b",
        }}
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div
            className="text-2xl font-bold tracking-wider"
            style={{ color: "#f9e2af" }}
          >
            {">"} [REGISTER_TERMINAL]
          </div>
          <div className="text-sm" style={{ color: "#6c7086" }}>
            create.new_user_account()
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div
            className="p-4 text-sm font-mono"
            style={{
              backgroundColor: "#f38ba8",
              color: "#1e1e2e",
              border: "2px solid #f38ba8",
              boxShadow: "4px 4px 0px #11111b",
            }}
          >
            <div className="font-bold">[ERROR]</div>
            <div>{error}</div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-mono font-bold tracking-wide"
              style={{ color: "#a6e3a1" }}
            >
              {">"} [EMAIL_ADDRESS]
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 font-mono text-sm tracking-wide focus:outline-none"
              style={{
                backgroundColor: "#313244",
                color: "#cdd6f4",
                border: "2px solid #45475a",
                boxShadow: "4px 4px 0px #11111b",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#89b4fa";
                e.target.style.boxShadow = "4px 4px 0px #89b4fa";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#45475a";
                e.target.style.boxShadow = "4px 4px 0px #11111b";
              }}
              placeholder="user@domain.com"
            />
          </div>

          {/* LeetCode Username Field */}
          <div className="space-y-2">
            <label
              htmlFor="leetcodeUsername"
              className="block text-sm font-mono font-bold tracking-wide"
              style={{ color: "#a6e3a1" }}
            >
              {">"} [LEETCODE_USERNAME]
            </label>
            <input
              id="leetcodeUsername"
              name="leetcodeUsername"
              type="text"
              required
              value={leetcodeUsername}
              onChange={(e) => setLeetcodeUsername(e.target.value)}
              className="w-full p-3 font-mono text-sm tracking-wide focus:outline-none"
              style={{
                backgroundColor: "#313244",
                color: "#cdd6f4",
                border: "2px solid #45475a",
                boxShadow: "4px 4px 0px #11111b",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#89b4fa";
                e.target.style.boxShadow = "4px 4px 0px #89b4fa";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#45475a";
                e.target.style.boxShadow = "4px 4px 0px #11111b";
              }}
              placeholder="your_leetcode_handle"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-mono font-bold tracking-wide"
              style={{ color: "#a6e3a1" }}
            >
              {">"} [PASSWORD_HASH]
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 font-mono text-sm tracking-wide focus:outline-none"
              style={{
                backgroundColor: "#313244",
                color: "#cdd6f4",
                border: "2px solid #45475a",
                boxShadow: "4px 4px 0px #11111b",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#89b4fa";
                e.target.style.boxShadow = "4px 4px 0px #89b4fa";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#45475a";
                e.target.style.boxShadow = "4px 4px 0px #11111b";
              }}
              placeholder="••••••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-4 font-mono font-bold text-sm tracking-wider transition-all duration-200 focus:outline-none"
            style={{
              backgroundColor: isLoading ? "#6c7086" : "#f9e2af",
              color: "#1e1e2e",
              border: "3px solid #f9e2af",
              boxShadow: "6px 6px 0px #11111b",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "translate(-2px, -2px)";
                e.currentTarget.style.boxShadow = "8px 8px 0px #11111b";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "translate(0px, 0px)";
                e.currentTarget.style.boxShadow = "6px 6px 0px #11111b";
              }
            }}
          >
            {isLoading ? (
              <>{">"}[CREATING_ACCOUNT...]</>
            ) : (
              <>{">"}[EXECUTE_REGISTER]</>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center pt-4">
          <div className="text-sm font-mono" style={{ color: "#6c7086" }}>
            {">"} user.account != null ?
          </div>
          <Link
            href="/login"
            className="inline-block mt-2 px-4 py-2 font-mono font-bold text-sm tracking-wide transition-all duration-200"
            style={{
              color: "#89b4fa",
              border: "2px solid #89b4fa",
              boxShadow: "4px 4px 0px #11111b",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#89b4fa";
              e.currentTarget.style.color = "#1e1e2e";
              e.currentTarget.style.transform = "translate(-1px, -1px)";
              e.currentTarget.style.boxShadow = "5px 5px 0px #11111b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#89b4fa";
              e.currentTarget.style.transform = "translate(0px, 0px)";
              e.currentTarget.style.boxShadow = "4px 4px 0px #11111b";
            }}
          >
            [LOGIN_EXISTING]
          </Link>
        </div>

        {/* Terminal Footer */}
        <div
          className="text-center text-xs font-mono pt-4 border-t-2"
          style={{
            color: "#6c7086",
            borderColor: "#45475a",
          }}
        >
          LeetTrack v1.0 | registration.system.ready()
        </div>
      </div>
    </div>
  );
}
