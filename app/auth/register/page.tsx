"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  leetcode_username: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    leetcode_username: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const validateForm = (): string | null => {
    if (!formData.email.trim()) {
      return "Email is required";
    }
    if (!formData.username.trim()) {
      return "Username is required";
    }
    if (!formData.password) {
      return "Password is required";
    }
    if (!formData.confirmPassword) {
      return "Please confirm your password";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    if (formData.username.includes(" ")) {
      return "Username cannot contain spaces";
    }

    if (formData.username.length < 3) {
      return "Username must be at least 3 characters long";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          leetcode_username: formData.leetcode_username || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (success) {
    return (
      <div
        className={`${inter.className} min-h-screen bg-gray-50 flex items-center justify-center`}
      >
        <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-light text-gray-900 mb-2">
              Registration Successful!
            </h1>
            <p className="text-gray-600">
              Your account has been created successfully. Redirecting to
              dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-light text-gray-900">
              LeetTrack
            </Link>
            <div className="flex gap-4">
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Registration Form */}
      <div className="flex items-center justify-center py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-light text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">
              Join LeetTrack to start tracking your progress
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
                required
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
                required
              />
            </div>

            <div>
              <label
                htmlFor="leetcode_username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                LeetCode Username{" "}
                <span className="text-gray-500">(optional)</span>
              </label>
              <input
                type="text"
                id="leetcode_username"
                name="leetcode_username"
                value={formData.leetcode_username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
                placeholder="Your LeetCode username"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-black hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
