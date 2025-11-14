"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking for token
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={isLoggedIn ? "/today" : "/"} className="text-2xl font-light text-gray-900">
            LeetTrack
          </Link>
          <div className="flex gap-6 items-center">
            {isLoggedIn ? (
              // Logged-in navigation
              <>
                <Link
                  href="/today"
                  className={
                    isActive("/today")
                      ? "text-gray-900 font-medium"
                      : "text-gray-600 hover:text-gray-900 transition-colors"
                  }
                >
                  Today
                </Link>
                <Link
                  href="/paths"
                  className={
                    isActive("/paths")
                      ? "text-gray-900 font-medium"
                      : "text-gray-600 hover:text-gray-900 transition-colors"
                  }
                >
                  Paths
                </Link>
                <Link
                  href="/test"
                  className={
                    isActive("/test")
                      ? "text-gray-900 font-medium"
                      : "text-gray-600 hover:text-gray-900 transition-colors"
                  }
                >
                  Test
                </Link>
                <Link
                  href="/stats"
                  className={
                    isActive("/stats")
                      ? "text-gray-900 font-medium"
                      : "text-gray-600 hover:text-gray-900 transition-colors"
                  }
                >
                  Stats
                </Link>
                <Link
                  href="/settings"
                  className={
                    isActive("/settings")
                      ? "text-gray-900 font-medium"
                      : "text-gray-600 hover:text-gray-900 transition-colors"
                  }
                >
                  Settings
                </Link>
              </>
            ) : (
              // Unlogged-in navigation
              <>
                <Link
                  href="/today"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Today
                </Link>
                <Link
                  href="/paths"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Paths
                </Link>
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
