"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface Path {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_hours: number;
  is_public: boolean;
  total_questions?: number;
}

interface EnrolledPath extends Path {
  enrollment_id: string;
  completion_percentage: number;
  completed_questions: number;
  enrolled_at: string;
}

export default function PathsPage() {
  const router = useRouter();
  const [availablePaths, setAvailablePaths] = useState<Path[]>([]);
  const [enrolledPaths, setEnrolledPaths] = useState<EnrolledPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    fetchUserInfo();
    fetchPaths();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsername(data.user.leetcode_username || data.user.username);
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchPaths = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const enrolledRes = await fetch("/api/paths/enrolled", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const enrolledData = await enrolledRes.json();

      if (enrolledData.success) {
        setEnrolledPaths(enrolledData.paths);
      }

      const allRes = await fetch("/api/paths", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allData = await allRes.json();

      if (allData.success) {
        const enrolledIds = new Set(
          enrolledData.paths?.map((p: EnrolledPath) => p.path_id) || [],
        );
        const available = allData.paths.filter(
          (p: Path) => !enrolledIds.has(p.id),
        );
        setAvailablePaths(available);
      }
    } catch (error) {
      console.error("Error fetching paths:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (pathId: string) => {
    setEnrolling(pathId);
    try {
      const response = await fetch("/api/paths/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ path_id: pathId }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchPaths();
      } else {
        alert(data.message || "Failed to enroll in path");
      }
    } catch (error) {
      console.error("Error enrolling in path:", error);
      alert("Failed to enroll in path");
    } finally {
      setEnrolling(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "text-green-700 bg-green-50 border-green-200";
      case "intermediate":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "advanced":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div
        className={`${inter.className} min-h-screen bg-gray-50 flex items-center justify-center`}
      >
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/home" className="text-2xl font-light text-gray-900">
              LeetTrack
            </Link>
            <div className="flex gap-6">
              <Link
                href="/home"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Today
              </Link>
              <Link href="/paths" className="text-gray-900 font-medium">
                Paths
              </Link>
              <Link
                href="/stats"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Stats
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-light text-gray-900 mb-12">
          Learning Paths
        </h1>

        {enrolledPaths.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-light text-gray-900 mb-6">My Paths</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {enrolledPaths.map((path) => (
                <div
                  key={path.enrollment_id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-normal text-gray-900">
                      {path.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded border text-xs font-medium ${getDifficultyColor(path.difficulty)}`}
                    >
                      {path.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">{path.description}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span className="font-medium">
                        {path.completion_percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-black h-2 rounded-full transition-all"
                        style={{ width: `${path.completion_percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>
                      {path.completed_questions}/{path.total_questions}{" "}
                      questions
                    </span>
                    <span>{path.estimated_hours}h estimated</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-light text-gray-900 mb-6">
            Available Paths
          </h2>
          {availablePaths.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-600">
                No more paths available to enroll in
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {availablePaths.map((path) => (
                <div
                  key={path.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-normal text-gray-900">
                      {path.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded border text-xs font-medium ${getDifficultyColor(path.difficulty)}`}
                    >
                      {path.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">{path.description}</p>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {path.estimated_hours}h estimated
                    </span>
                    <button
                      onClick={() => handleEnroll(path.id)}
                      disabled={enrolling === path.id}
                      className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {enrolling === path.id ? "Enrolling..." : "Enroll"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
