"use client";

import React, { useState, useEffect } from "react";

interface ProgressBarProps {
  text?: string;
  duration?: number;
  className?: string;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  text = "LOADING",
  duration = 2000,
  className = "",
  showPercentage = true,
  color = "#89b4fa",
  backgroundColor = "#313244",
  borderColor = "#45475a",
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = 50; // Update every 50ms
    const increment = (100 * interval) / duration;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          setIsComplete(true);
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  // Reset when component remounts or text changes
  useEffect(() => {
    setProgress(0);
    setIsComplete(false);
  }, [text]);

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Progress Bar Container */}
      <div
        className="relative h-8 border-4 shadow-[4px_4px_0px_0px_#11111b] overflow-hidden"
        style={{
          backgroundColor,
          borderColor,
        }}
      >
        {/* Progress Fill */}
        <div
          className="h-full transition-all duration-100 ease-out relative"
          style={{
            width: `${progress}%`,
            backgroundColor: color,
            boxShadow: `inset 0 0 10px rgba(137, 180, 250, 0.3)`,
          }}
        >
          {/* Animated Glitch Effect */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(255, 255, 255, 0.1) 2px,
                rgba(255, 255, 255, 0.1) 4px
              )`,
              animation: "glitch 0.5s infinite",
            }}
          />
        </div>

        {/* Progress Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-sm font-bold text-[#cdd6f4] tracking-wider mix-blend-difference">
            [{text}
            {showPercentage && `_${Math.floor(progress)}%`}]
          </span>
        </div>

        {/* Scanning Line Effect */}
        {!isComplete && (
          <div
            className="absolute top-0 bottom-0 w-1 opacity-80"
            style={{
              left: `${progress}%`,
              backgroundColor: "#cdd6f4",
              boxShadow: "0 0 10px #cdd6f4",
              animation: "pulse 1s infinite",
            }}
          />
        )}
      </div>

      {/* Status Text */}
      <div className="mt-2 text-center">
        <span className="font-mono text-xs text-[#a6adc8] tracking-wide">
          {isComplete ? "> COMPLETE" : "> PROCESSING..."}
        </span>
      </div>

      <style jsx>{`
        @keyframes glitch {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-2px);
          }
          40% {
            transform: translateX(2px);
          }
          60% {
            transform: translateX(-1px);
          }
          80% {
            transform: translateX(1px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;
