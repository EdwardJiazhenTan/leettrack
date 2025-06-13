"use client";

import React from "react";

interface AuroraBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function AuroraBackground({
  children,
  className = "",
}: AuroraBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Aurora Background Container */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1e2e] via-[#181825] to-[#11111b]" />

        {/* Aurora Layer 1 - Main flowing aurora */}
        <div className="absolute inset-0 opacity-30">
          <div className="aurora-blob aurora-blob-1 absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-[#89b4fa] via-[#cba6f7] to-[#f38ba8] rounded-full mix-blend-multiply filter blur-xl animate-aurora-1" />
          <div className="aurora-blob aurora-blob-2 absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-[#a6e3a1] via-[#94e2d5] to-[#89b4fa] rounded-full mix-blend-multiply filter blur-xl animate-aurora-2" />
          <div className="aurora-blob aurora-blob-3 absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-[#f9e2af] via-[#fab387] to-[#f38ba8] rounded-full mix-blend-multiply filter blur-xl animate-aurora-3" />
        </div>

        {/* Aurora Layer 2 - Secondary flowing effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="aurora-blob aurora-blob-4 absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-[#cba6f7] via-[#89b4fa] to-[#74c7ec] rounded-full mix-blend-multiply filter blur-2xl animate-aurora-4" />
          <div className="aurora-blob aurora-blob-5 absolute bottom-0 right-1/3 w-56 h-56 bg-gradient-to-r from-[#94e2d5] via-[#a6e3a1] to-[#f9e2af] rounded-full mix-blend-multiply filter blur-2xl animate-aurora-5" />
        </div>

        {/* Aurora Layer 3 - Subtle accent lights */}
        <div className="absolute inset-0 opacity-15">
          <div className="aurora-blob aurora-blob-6 absolute top-1/4 right-0 w-48 h-48 bg-gradient-to-r from-[#f38ba8] via-[#eba0ac] to-[#fab387] rounded-full mix-blend-multiply filter blur-3xl animate-aurora-6" />
          <div className="aurora-blob aurora-blob-7 absolute bottom-1/3 left-1/2 w-40 h-40 bg-gradient-to-r from-[#89b4fa] via-[#b4befe] to-[#cba6f7] rounded-full mix-blend-multiply filter blur-3xl animate-aurora-7" />
        </div>

        {/* Noise overlay for texture */}
        <div className="absolute inset-0 opacity-5 bg-noise mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes aurora-1 {
          0%,
          100% {
            transform: translateX(0px) translateY(0px) rotate(0deg) scale(1);
          }
          33% {
            transform: translateX(30px) translateY(-30px) rotate(120deg)
              scale(1.1);
          }
          66% {
            transform: translateX(-20px) translateY(20px) rotate(240deg)
              scale(0.9);
          }
        }

        @keyframes aurora-2 {
          0%,
          100% {
            transform: translateX(0px) translateY(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateX(-25px) translateY(25px) rotate(90deg)
              scale(1.05);
          }
          50% {
            transform: translateX(25px) translateY(-15px) rotate(180deg)
              scale(0.95);
          }
          75% {
            transform: translateX(-15px) translateY(-25px) rotate(270deg)
              scale(1.1);
          }
        }

        @keyframes aurora-3 {
          0%,
          100% {
            transform: translateX(0px) translateY(0px) rotate(0deg) scale(1);
          }
          40% {
            transform: translateX(20px) translateY(30px) rotate(160deg)
              scale(1.15);
          }
          80% {
            transform: translateX(-30px) translateY(-10px) rotate(320deg)
              scale(0.85);
          }
        }

        @keyframes aurora-4 {
          0%,
          100% {
            transform: translateX(0px) translateY(0px) rotate(0deg) scale(1);
          }
          50% {
            transform: translateX(40px) translateY(-20px) rotate(180deg)
              scale(1.2);
          }
        }

        @keyframes aurora-5 {
          0%,
          100% {
            transform: translateX(0px) translateY(0px) rotate(0deg) scale(1);
          }
          30% {
            transform: translateX(-35px) translateY(15px) rotate(108deg)
              scale(0.9);
          }
          70% {
            transform: translateX(15px) translateY(-35px) rotate(252deg)
              scale(1.1);
          }
        }

        @keyframes aurora-6 {
          0%,
          100% {
            transform: translateX(0px) translateY(0px) rotate(0deg) scale(1);
          }
          60% {
            transform: translateX(-20px) translateY(40px) rotate(216deg)
              scale(1.3);
          }
        }

        @keyframes aurora-7 {
          0%,
          100% {
            transform: translateX(0px) translateY(0px) rotate(0deg) scale(1);
          }
          45% {
            transform: translateX(25px) translateY(25px) rotate(162deg)
              scale(0.8);
          }
          90% {
            transform: translateX(-10px) translateY(-30px) rotate(324deg)
              scale(1.2);
          }
        }

        .animate-aurora-1 {
          animation: aurora-1 20s ease-in-out infinite;
        }

        .animate-aurora-2 {
          animation: aurora-2 25s ease-in-out infinite reverse;
        }

        .animate-aurora-3 {
          animation: aurora-3 30s ease-in-out infinite;
        }

        .animate-aurora-4 {
          animation: aurora-4 35s ease-in-out infinite reverse;
        }

        .animate-aurora-5 {
          animation: aurora-5 28s ease-in-out infinite;
        }

        .animate-aurora-6 {
          animation: aurora-6 32s ease-in-out infinite reverse;
        }

        .animate-aurora-7 {
          animation: aurora-7 24s ease-in-out infinite;
        }

        .bg-noise {
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(205, 214, 244, 0.15) 1px,
            transparent 0
          );
          background-size: 20px 20px;
        }

        .aurora-blob {
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
