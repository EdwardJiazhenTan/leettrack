"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto border-t-4 border-[#45475a] bg-[#313244]/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-mono font-bold text-[#cdd6f4] tracking-wider mb-3">
              [LEETTRACK]
            </h3>
            <p className="text-sm font-mono text-[#a6adc8] leading-relaxed">
              &gt; Track your LeetCode progress and discover curated learning
              paths.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-mono font-bold text-[#89b4fa] tracking-wider mb-3">
              [QUICK_LINKS]
            </h4>
            <div className="space-y-2">
              <Link
                href="/paths"
                className="block text-sm font-mono text-[#a6adc8] hover:text-[#f38ba8] transition-colors duration-200"
              >
                &gt; Learning Paths
              </Link>
              <Link
                href="/today"
                className="block text-sm font-mono text-[#a6adc8] hover:text-[#f9e2af] transition-colors duration-200"
              >
                &gt; Today&apos;s Tasks
              </Link>
              <Link
                href="/profile"
                className="block text-sm font-mono text-[#a6adc8] hover:text-[#a6e3a1] transition-colors duration-200"
              >
                &gt; Your Profile
              </Link>
            </div>
          </div>

          {/* Info Section */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-mono font-bold text-[#cba6f7] tracking-wider mb-3">
              [SYSTEM_INFO]
            </h4>
            <div className="space-y-2 text-sm font-mono text-[#a6adc8]">
              <p>&gt; Version: 1.0.0</p>
              <p>&gt; Status: ONLINE</p>
              <p>&gt; Build: {currentYear}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t-2 border-[#45475a]">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm font-mono text-[#6c7086]">
              © {currentYear} LeetTrack. All systems operational.
            </div>
            <div className="flex space-x-6">
              <span className="text-sm font-mono text-[#6c7086]">
                [POWERED_BY_NEXT.JS]
              </span>
              <span className="text-sm font-mono text-[#6c7086]">
                [STYLED_WITH_CATPPUCCIN]
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
