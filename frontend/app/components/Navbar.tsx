"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#1e1e2e] border-b-4 border-[#89b4fa] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                className="text-2xl font-mono font-bold text-[#cdd6f4] hover:text-[#89b4fa] transition-colors duration-200 tracking-wider"
                href="/"
              >
                [LEETTRACK]
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-[#a6e3a1] font-mono text-sm">
                  &gt; {user.leetcode_username}
                </span>
                <Link
                  href="/profile"
                  className="bg-[#a6e3a1] hover:bg-[#94e2d5] text-[#1e1e2e] px-4 py-2 font-mono font-bold border-2 border-[#a6e3a1] hover:border-[#94e2d5] transition-all duration-200 shadow-[2px_2px_0px_0px_#11111b]"
                >
                  [PROFILE]
                </Link>
                {user.is_admin && (
                  <Link
                    href="/admin"
                    className="bg-[#f9e2af] hover:bg-[#f2d5a6] text-[#1e1e2e] px-4 py-2 font-mono font-bold border-2 border-[#f9e2af] hover:border-[#f2d5a6] transition-all duration-200 shadow-[2px_2px_0px_0px_#11111b]"
                  >
                    [ADMIN]
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="bg-[#f38ba8] hover:bg-[#eba0ac] text-[#1e1e2e] px-4 py-2 font-mono font-bold border-2 border-[#f38ba8] hover:border-[#eba0ac] transition-all duration-200 shadow-[2px_2px_0px_0px_#11111b]"
                >
                  [LOGOUT]
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  className="bg-[#1e1e2e] border-2 border-[#89b4fa] px-4 py-2 text-[#89b4fa] hover:bg-[#89b4fa] hover:text-[#1e1e2e] font-mono font-bold transition-all duration-200 shadow-[2px_2px_0px_0px_#11111b]"
                  href="/login"
                >
                  [SIGN IN]
                </Link>
                <Link
                  className="bg-[#89b4fa] px-4 py-2 text-[#1e1e2e] hover:bg-[#74c7ec] font-mono font-bold border-2 border-[#89b4fa] hover:border-[#74c7ec] transition-all duration-200 shadow-[2px_2px_0px_0px_#11111b]"
                  href="/register"
                >
                  [SIGN UP]
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
