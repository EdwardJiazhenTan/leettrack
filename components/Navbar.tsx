"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/home" className="text-2xl font-light text-gray-900">
            LeetTrack
          </Link>
          <div className="flex gap-6">
            <Link
              href="/home"
              className={
                isActive("/home")
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
          </div>
        </div>
      </div>
    </nav>
  );
}
