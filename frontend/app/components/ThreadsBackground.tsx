"use client";

import React from "react";

interface ThreadsBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function ThreadsBackground({
  children,
  className = "",
}: ThreadsBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Threads Background Container */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1e2e] via-[#181825] to-[#11111b]" />

        {/* Thread Layer 1 - Primary threads */}
        <div className="absolute inset-0 opacity-20">
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="thread1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#89b4fa" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#cba6f7" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#f38ba8" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="thread2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a6e3a1" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#94e2d5" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#89b4fa" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="thread3" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#f9e2af" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#fab387" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f38ba8" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Animated thread paths */}
            <path
              className="thread-path thread-1"
              d="M-100,200 Q200,100 500,300 T900,200 Q1200,100 1500,400"
              stroke="url(#thread1)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="10,5"
            />
            <path
              className="thread-path thread-2"
              d="M-50,400 Q300,200 600,500 T1000,300 Q1300,200 1600,600"
              stroke="url(#thread2)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="8,4"
            />
            <path
              className="thread-path thread-3"
              d="M-200,100 Q100,300 400,150 T800,400 Q1100,250 1400,500"
              stroke="url(#thread3)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="6,3"
            />
          </svg>
        </div>

        {/* Thread Layer 2 - Secondary threads */}
        <div className="absolute inset-0 opacity-15">
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="thread4" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#cba6f7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#74c7ec" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="thread5" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#94e2d5" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f9e2af" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            <path
              className="thread-path thread-4"
              d="M0,300 Q400,150 800,350 Q1200,200 1600,400"
              stroke="url(#thread4)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="12,6"
            />
            <path
              className="thread-path thread-5"
              d="M-100,500 Q200,350 500,550 Q800,400 1100,600 Q1400,450 1700,650"
              stroke="url(#thread5)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="4,8"
            />
          </svg>
        </div>

        {/* Thread Layer 3 - Accent threads */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="thread6" x1="25%" y1="0%" x2="75%" y2="100%">
                <stop offset="0%" stopColor="#f38ba8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#eba0ac" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="thread7" x1="75%" y1="0%" x2="25%" y2="100%">
                <stop offset="0%" stopColor="#89b4fa" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#b4befe" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            <path
              className="thread-path thread-6"
              d="M-50,50 Q250,200 550,100 Q850,250 1150,150 Q1450,300 1750,200"
              stroke="url(#thread6)"
              strokeWidth="0.8"
              fill="none"
              strokeDasharray="15,10"
            />
            <path
              className="thread-path thread-7"
              d="M0,600 Q300,450 600,650 Q900,500 1200,700 Q1500,550 1800,750"
              stroke="url(#thread7)"
              strokeWidth="0.6"
              fill="none"
              strokeDasharray="5,15"
            />
          </svg>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 opacity-30">
          <div className="particle particle-1 absolute w-1 h-1 bg-[#89b4fa] rounded-full animate-float-1" />
          <div className="particle particle-2 absolute w-1.5 h-1.5 bg-[#cba6f7] rounded-full animate-float-2" />
          <div className="particle particle-3 absolute w-0.5 h-0.5 bg-[#a6e3a1] rounded-full animate-float-3" />
          <div className="particle particle-4 absolute w-1 h-1 bg-[#f9e2af] rounded-full animate-float-4" />
          <div className="particle particle-5 absolute w-0.5 h-0.5 bg-[#f38ba8] rounded-full animate-float-5" />
          <div className="particle particle-6 absolute w-1.5 h-1.5 bg-[#94e2d5] rounded-full animate-float-6" />
        </div>

        {/* Subtle noise overlay */}
        <div className="absolute inset-0 opacity-3 bg-noise mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes thread-flow-1 {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 100;
          }
        }

        @keyframes thread-flow-2 {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -80;
          }
        }

        @keyframes thread-flow-3 {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 60;
          }
        }

        @keyframes float-1 {
          0%,
          100% {
            transform: translateX(10vw) translateY(20vh) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateX(90vw) translateY(80vh) scale(1.2);
            opacity: 0.3;
          }
        }

        @keyframes float-2 {
          0%,
          100% {
            transform: translateX(80vw) translateY(10vh) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translateX(20vw) translateY(90vh) scale(0.8);
            opacity: 0.8;
          }
        }

        @keyframes float-3 {
          0%,
          100% {
            transform: translateX(30vw) translateY(70vh) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateX(70vw) translateY(30vh) scale(1.5);
            opacity: 0.2;
          }
        }

        @keyframes float-4 {
          0%,
          100% {
            transform: translateX(60vw) translateY(40vh) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translateX(40vw) translateY(60vh) scale(0.9);
            opacity: 0.7;
          }
        }

        @keyframes float-5 {
          0%,
          100% {
            transform: translateX(90vw) translateY(80vh) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateX(10vw) translateY(20vh) scale(1.1);
            opacity: 0.4;
          }
        }

        @keyframes float-6 {
          0%,
          100% {
            transform: translateX(20vw) translateY(60vh) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translateX(80vw) translateY(40vh) scale(0.7);
            opacity: 0.9;
          }
        }

        .thread-1 {
          animation: thread-flow-1 25s linear infinite;
        }

        .thread-2 {
          animation: thread-flow-2 30s linear infinite reverse;
        }

        .thread-3 {
          animation: thread-flow-3 20s linear infinite;
        }

        .thread-4 {
          animation: thread-flow-1 35s linear infinite reverse;
        }

        .thread-5 {
          animation: thread-flow-2 28s linear infinite;
        }

        .thread-6 {
          animation: thread-flow-3 32s linear infinite reverse;
        }

        .thread-7 {
          animation: thread-flow-1 22s linear infinite;
        }

        .animate-float-1 {
          animation: float-1 40s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 35s ease-in-out infinite reverse;
        }

        .animate-float-3 {
          animation: float-3 45s ease-in-out infinite;
        }

        .animate-float-4 {
          animation: float-4 38s ease-in-out infinite reverse;
        }

        .animate-float-5 {
          animation: float-5 42s ease-in-out infinite;
        }

        .animate-float-6 {
          animation: float-6 33s ease-in-out infinite reverse;
        }

        .bg-noise {
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(205, 214, 244, 0.1) 1px,
            transparent 0
          );
          background-size: 25px 25px;
        }

        .thread-path {
          will-change: stroke-dashoffset;
        }

        .particle {
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}
