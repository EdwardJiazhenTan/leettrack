"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function LandingPage() {
  const [inputText, setInputText] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      router.push(`/stats/${encodeURIComponent(inputText)}`);
    }
  };

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      {/* a public navbar*/}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">LeetTrack</div>
          <div className="flex gap-6 items-center">
            <Link href="/today" className="text-gray-700 hover:text-gray-900">Today</Link>
            <Link href="/paths" className="text-gray-700 hover:text-gray-900">Paths</Link>
            <Link href="/auth/login" className="text-gray-700 hover:text-gray-900">Login</Link>
            <Link href="/auth/register" className="text-gray-700 hover:text-gray-900">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-32">
        <div className="text-center">
          <h2 className="text-5xl font-light text-gray-900 mb-6">
            Track Your LeetCode Journey
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Track and review your LeetCode questions all in one place.
          </p>

          {/* login and signup Section */}

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-500">
            <p>
              Built for developers who want to track their coding progress
              effectively.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
