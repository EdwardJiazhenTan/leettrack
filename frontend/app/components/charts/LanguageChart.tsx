"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface LanguageStats {
  languages: Array<{ language: string; count: number }>;
  totalSubmissions: number;
  uniqueLanguages: number;
}

interface LanguageChartProps {
  stats: LanguageStats;
}

export default function LanguageChart({ stats }: LanguageChartProps) {
  // Get top 8 languages for better visualization
  const topLanguages = stats.languages.slice(0, 8);

  // Language color mapping
  const languageColors: { [key: string]: string } = {
    Python: "#a6e3a1",
    JavaScript: "#f9e2af",
    Java: "#fab387",
    "C++": "#89b4fa",
    C: "#74c7ec",
    TypeScript: "#cba6f7",
    Go: "#94e2d5",
    Rust: "#f38ba8",
    Swift: "#eba0ac",
    Kotlin: "#b4befe",
    Ruby: "#f38ba8",
    PHP: "#cba6f7",
    Scala: "#f38ba8",
    Dart: "#89b4fa",
    default: "#6c7086",
  };

  const data = {
    labels: topLanguages.map((lang) => lang.language),
    datasets: [
      {
        data: topLanguages.map((lang) => lang.count),
        backgroundColor: topLanguages.map(
          (lang) => languageColors[lang.language] || languageColors.default
        ),
        borderColor: topLanguages.map(
          (lang) => languageColors[lang.language] || languageColors.default
        ),
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
        display: false,
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
          label: function (context: TooltipItem<"bar">) {
            const value = context.parsed.y;
            const percentage =
              stats.totalSubmissions > 0
                ? Math.round((value / stats.totalSubmissions) * 100)
                : 0;
            return `Submissions: ${value} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "#45475a",
          lineWidth: 1,
        },
        ticks: {
          color: "#cdd6f4",
          font: {
            family: "monospace",
            size: 11,
            weight: "bold" as const,
          },
          maxRotation: 45,
        },
        border: {
          color: "#6c7086",
          width: 2,
        },
      },
      y: {
        grid: {
          color: "#45475a",
          lineWidth: 1,
        },
        ticks: {
          color: "#cdd6f4",
          font: {
            family: "monospace",
            size: 11,
            weight: "bold" as const,
          },
        },
        border: {
          color: "#6c7086",
          width: 2,
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 3,
      },
    },
  };

  return (
    <div
      className="p-6"
      style={{
        backgroundColor: "#313244",
        border: "4px solid #a6e3a1",
        boxShadow: "4px 4px 0px #11111b",
        fontFamily: "monospace",
      }}
    >
      <h3
        className="text-xl font-bold mb-6 font-mono tracking-wider"
        style={{ color: "#a6e3a1" }}
      >
        {">"} [LANGUAGE_STATISTICS]
      </h3>

      <div className="h-64 mb-6">
        <Bar data={data} options={options} />
      </div>

      {/* Stats Summary */}
      <div
        className="grid grid-cols-3 gap-4 pt-4 border-t-2"
        style={{ borderColor: "#45475a" }}
      >
        <div className="text-center">
          <div
            className="text-2xl font-bold font-mono"
            style={{ color: "#a6e3a1" }}
          >
            {stats.totalSubmissions}
          </div>
          <div
            className="text-xs font-mono tracking-wide"
            style={{ color: "#6c7086" }}
          >
            {">"} total_submissions
          </div>
        </div>
        <div className="text-center">
          <div
            className="text-2xl font-bold font-mono"
            style={{ color: "#f9e2af" }}
          >
            {stats.uniqueLanguages}
          </div>
          <div
            className="text-xs font-mono tracking-wide"
            style={{ color: "#6c7086" }}
          >
            {">"} unique_languages
          </div>
        </div>
        <div className="text-center">
          <div
            className="text-2xl font-bold font-mono"
            style={{ color: "#89b4fa" }}
          >
            {topLanguages.length > 0 ? topLanguages[0].language : "N/A"}
          </div>
          <div
            className="text-xs font-mono tracking-wide"
            style={{ color: "#6c7086" }}
          >
            {">"} most_used_lang
          </div>
        </div>
      </div>

      {/* Top Languages List */}
      {topLanguages.length > 0 && (
        <div className="mt-6">
          <h4
            className="text-sm font-mono font-bold mb-3 tracking-wider"
            style={{ color: "#cdd6f4" }}
          >
            {">"} language_breakdown.list()
          </h4>
          <div className="space-y-2">
            {topLanguages.slice(0, 5).map((lang) => {
              const percentage =
                stats.totalSubmissions > 0
                  ? Math.round((lang.count / stats.totalSubmissions) * 100)
                  : 0;
              const color =
                languageColors[lang.language] || languageColors.default;

              return (
                <div key={lang.language} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 border"
                    style={{
                      backgroundColor: color,
                      borderColor: color,
                    }}
                  />
                  <div className="flex-1 flex justify-between items-center">
                    <span
                      className="font-mono text-sm font-semibold tracking-wide"
                      style={{ color: "#cdd6f4" }}
                    >
                      {lang.language}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-sm"
                        style={{ color: "#6c7086" }}
                      >
                        {lang.count}
                      </span>
                      <span
                        className="font-mono text-xs"
                        style={{ color: color }}
                      >
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
