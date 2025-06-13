"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import ThreadsBackground from "../components/ThreadsBackground";
import Footer from "../components/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, user } = useAuth();
  const router = useRouter();

  // Navigate to home when user is successfully authenticated
  useEffect(() => {
    if (user && !isLoading) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <ThreadsBackground className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-[#181825]/90 backdrop-blur-sm border-4 border-[#45475a] shadow-[8px_8px_0px_0px_#11111b]">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="text-2xl font-mono font-bold tracking-wider text-[#89b4fa]">
              {">"} [LOGIN_TERMINAL]
            </div>
            <div className="text-sm font-mono text-[#6c7086]">
              authenticate.user_session()
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 text-sm font-mono bg-[#f38ba8] text-[#1e1e2e] border-2 border-[#f38ba8] shadow-[4px_4px_0px_0px_#11111b]">
              <div className="font-bold">[ERROR]</div>
              <div>{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-mono font-bold tracking-wide text-[#a6e3a1]"
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
                className="w-full p-3 font-mono text-sm tracking-wide bg-[#313244] text-[#cdd6f4] border-2 border-[#45475a] shadow-[4px_4px_0px_0px_#11111b] focus:outline-none focus:border-[#89b4fa] focus:shadow-[4px_4px_0px_0px_#89b4fa] transition-all duration-200"
                placeholder="user@domain.com"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-mono font-bold tracking-wide text-[#a6e3a1]"
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
                className="w-full p-3 font-mono text-sm tracking-wide bg-[#313244] text-[#cdd6f4] border-2 border-[#45475a] shadow-[4px_4px_0px_0px_#11111b] focus:outline-none focus:border-[#89b4fa] focus:shadow-[4px_4px_0px_0px_#89b4fa] transition-all duration-200"
                placeholder="••••••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-4 font-mono font-bold text-sm tracking-wider transition-all duration-200 focus:outline-none border-3 shadow-[6px_6px_0px_0px_#11111b] hover:shadow-[8px_8px_0px_0px_#11111b] hover:translate-x-[-2px] hover:translate-y-[-2px] ${
                isLoading
                  ? "bg-[#6c7086] text-[#1e1e2e] border-[#6c7086] cursor-not-allowed"
                  : "bg-[#a6e3a1] text-[#1e1e2e] border-[#a6e3a1] cursor-pointer"
              }`}
            >
              {isLoading ? (
                <>{">"}[AUTHENTICATING...]</>
              ) : (
                <>{">"}[EXECUTE_LOGIN]</>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center pt-4">
            <div className="text-sm font-mono text-[#6c7086]">
              {">"} user.account == null ?
            </div>
            <Link
              href="/register"
              className="inline-block mt-2 px-4 py-2 font-mono font-bold text-sm tracking-wide text-[#f9e2af] border-2 border-[#f9e2af] shadow-[4px_4px_0px_0px_#11111b] hover:bg-[#f9e2af] hover:text-[#1e1e2e] hover:shadow-[5px_5px_0px_0px_#11111b] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200"
            >
              {">"}[CREATE_ACCOUNT]
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </ThreadsBackground>
  );
}
