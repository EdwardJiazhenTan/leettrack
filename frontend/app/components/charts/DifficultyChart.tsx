"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DifficultyProgress {
  easy: { solved: number; total: number; percentage: number };
  medium: { solved: number; total: number; percentage: number };
  hard: { solved: number; total: number; percentage: number };
  overall: { solved: number; total: number; percentage: number };
}

interface DifficultyChartProps {
  stats: DifficultyProgress;
}

export default function DifficultyChart({ stats }: DifficultyChartProps) {
  const data = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        data: [stats.easy.solved, stats.medium.solved, stats.hard.solved],
        backgroundColor: ["#a6e3a1", "#f9e2af", "#f38ba8"],
        borderColor: ["#a6e3a1", "#f9e2af", "#f38ba8"],
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverBorderColor: "#cdd6f4",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#cdd6f4",
          font: {
            family: "monospace",
            size: 12,
            weight: "bold" as const,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "rect",
        },
      },
      tooltip: {
        backgroundColor: "#181825",
        titleColor: "#cdd6f4",
        bodyColor: "#cdd6f4",
        borderColor: "#45475a",
        borderWidth: 2,
        titleFont: {
          family: "monospace",
          size: 14,
          weight: "bold" as const,
        },
        bodyFont: {
          family: "monospace",
          size: 12,
        },
        callbacks: {
          label: function (context: TooltipItem<"doughnut">) {
            const label = context.label || "";
            const value = context.parsed;
            const total =
              label === "Easy"
                ? stats.easy.total
                : label === "Medium"
                ? stats.medium.total
                : stats.hard.total;
            const percentage =
              total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value}/${total} (${percentage}%)`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 3,
      },
    },
  };

  return (
    <div
      className="p-6"
      style={{
        backgroundColor: "#313244",
        border: "4px solid #f9e2af",
        boxShadow: "4px 4px 0px #11111b",
        fontFamily: "monospace",
      }}
    >
      <h3
        className="text-xl font-bold mb-6 font-mono tracking-wider"
        style={{ color: "#f9e2af" }}
      >
        {">"} [DIFFICULTY_BREAKDOWN]
      </h3>

      <div className="h-64 mb-6">
        <Doughnut data={data} options={options} />
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span
              className="font-mono font-semibold text-sm tracking-wide"
              style={{ color: "#a6e3a1" }}
            >
              {">"} easy_problems.progress()
            </span>
            <span className="font-mono text-sm" style={{ color: "#6c7086" }}>
              {stats.easy.solved}/{stats.easy.total}
            </span>
          </div>
          <div
            className="w-full h-3 border-2"
            style={{
              backgroundColor: "#45475a",
              borderColor: "#6c7086",
            }}
          >
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${stats.easy.percentage}%`,
                backgroundColor: "#a6e3a1",
              }}
            />
          </div>
          <div
            className="text-right text-xs font-mono mt-1 tracking-wide"
            style={{ color: "#6c7086" }}
          >
            {stats.easy.percentage}%
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span
              className="font-mono font-semibold text-sm tracking-wide"
              style={{ color: "#f9e2af" }}
            >
              {">"} medium_problems.progress()
            </span>
            <span className="font-mono text-sm" style={{ color: "#6c7086" }}>
              {stats.medium.solved}/{stats.medium.total}
            </span>
          </div>
          <div
            className="w-full h-3 border-2"
            style={{
              backgroundColor: "#45475a",
              borderColor: "#6c7086",
            }}
          >
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${stats.medium.percentage}%`,
                backgroundColor: "#f9e2af",
              }}
            />
          </div>
          <div
            className="text-right text-xs font-mono mt-1 tracking-wide"
            style={{ color: "#6c7086" }}
          >
            {stats.medium.percentage}%
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span
              className="font-mono font-semibold text-sm tracking-wide"
              style={{ color: "#f38ba8" }}
            >
              {">"} hard_problems.progress()
            </span>
            <span className="font-mono text-sm" style={{ color: "#6c7086" }}>
              {stats.hard.solved}/{stats.hard.total}
            </span>
          </div>
          <div
            className="w-full h-3 border-2"
            style={{
              backgroundColor: "#45475a",
              borderColor: "#6c7086",
            }}
          >
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${stats.hard.percentage}%`,
                backgroundColor: "#f38ba8",
              }}
            />
          </div>
          <div
            className="text-right text-xs font-mono mt-1 tracking-wide"
            style={{ color: "#6c7086" }}
          >
            {stats.hard.percentage}%
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t-2" style={{ borderColor: "#45475a" }}>
        <div className="text-center">
          <div
            className="text-2xl font-bold font-mono"
            style={{ color: "#cdd6f4" }}
          >
            {stats.overall.solved}
          </div>
          <div
            className="text-xs font-mono tracking-wide"
            style={{ color: "#6c7086" }}
          >
            {">"} total_problems_solved
          </div>
        </div>
      </div>
    </div>
  );
}
