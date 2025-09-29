"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateForm = (): string | null => {
    if (!formData.email.trim()) {
      return "Email is required";
    }
    if (!formData.password) {
      return "Password is required";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address";
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setError(data.message || "Login failed");
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
                href="/auth/register"
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-light text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to your LeetTrack account</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
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
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-black hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
