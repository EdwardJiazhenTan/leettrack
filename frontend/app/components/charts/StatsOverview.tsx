"use client";

import React from "react";

interface SolvingStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalQuestions: number;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
  ranking: number;
  contributionPoint: number;
}

interface StatsOverviewProps {
  stats: SolvingStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const overallProgress =
    stats.totalQuestions > 0
      ? Math.round((stats.totalSolved / stats.totalQuestions) * 100)
      : 0;

  const statCards = [
    {
      title: "[TOTAL_SOLVED]",
      value: stats.totalSolved,
      total: stats.totalQuestions,
      icon: "🎯",
      color: "#89b4fa",
      borderColor: "#89b4fa",
    },
    {
      title: "[EASY_PROBLEMS]",
      value: stats.easySolved,
      total: stats.totalEasy,
      icon: "🟢",
      color: "#a6e3a1",
      borderColor: "#a6e3a1",
    },
    {
      title: "[MEDIUM_PROBLEMS]",
      value: stats.mediumSolved,
      total: stats.totalMedium,
      icon: "🟡",
      color: "#f9e2af",
      borderColor: "#f9e2af",
    },
    {
      title: "[HARD_PROBLEMS]",
      value: stats.hardSolved,
      total: stats.totalHard,
      icon: "🔴",
      color: "#f38ba8",
      borderColor: "#f38ba8",
    },
    {
      title: "[GLOBAL_RANKING]",
      value: stats.ranking,
      icon: "🏆",
      color: "#cba6f7",
      borderColor: "#cba6f7",
      isRanking: true,
    },
    {
      title: "[CONTRIBUTION_PTS]",
      value: stats.contributionPoint,
      icon: "⭐",
      color: "#fab387",
      borderColor: "#fab387",
    },
  ];

  return (
    <div
      className="p-6"
      style={{
        backgroundColor: "#313244",
        border: "4px solid #cba6f7",
        boxShadow: "4px 4px 0px #11111b",
        fontFamily: "monospace",
      }}
    >
      <h3
        className="text-xl font-bold mb-6 font-mono tracking-wider"
        style={{ color: "#cba6f7" }}
      >
        {">"} [STATISTICS_OVERVIEW]
      </h3>

      {/* Overall Progress */}
      <div
        className="mb-6 p-4"
        style={{
          backgroundColor: "#181825",
          border: "2px solid #45475a",
          boxShadow: "2px 2px 0px #11111b",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className="font-mono font-semibold text-sm tracking-wide"
            style={{ color: "#6c7086" }}
          >
            {">"} system.progress.overall()
          </span>
          <span
            className="font-mono font-bold text-2xl"
            style={{ color: "#89b4fa" }}
          >
            {overallProgress}%
          </span>
        </div>
        <div
          className="w-full h-4 border-2"
          style={{
            backgroundColor: "#45475a",
            borderColor: "#6c7086",
          }}
        >
          <div
            className="h-full transition-all duration-1000 ease-out"
            style={{
              width: `${overallProgress}%`,
              backgroundColor: "#89b4fa",
              boxShadow: "inset 0 0 0 1px #74c7ec",
            }}
          />
        </div>
        <div
          className="flex justify-between text-xs font-mono mt-2 tracking-wide"
          style={{ color: "#6c7086" }}
        >
          <span>{stats.totalSolved} solved</span>
          <span>{stats.totalQuestions} total</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="p-4 transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: "#181825",
              border: `4px solid ${card.borderColor}`,
              boxShadow: "4px 4px 0px #11111b",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translate(-2px, -2px) scale(1.05)";
              e.currentTarget.style.boxShadow = "6px 6px 0px #11111b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0px, 0px) scale(1)";
              e.currentTarget.style.boxShadow = "4px 4px 0px #11111b";
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{card.icon}</span>
              <div className="text-right">
                <div
                  className="text-2xl font-bold font-mono"
                  style={{ color: card.color }}
                >
                  {card.isRanking ? formatNumber(card.value) : card.value}
                </div>
                {card.total && (
                  <div
                    className="text-xs font-mono"
                    style={{ color: "#6c7086" }}
                  >
                    / {card.total}
                  </div>
                )}
              </div>
            </div>

            <div
              className="text-xs font-mono font-semibold tracking-wide"
              style={{ color: "#cdd6f4" }}
            >
              {card.title}
            </div>

            {card.total && (
              <div className="mt-2">
                <div
                  className="w-full h-2 border"
                  style={{
                    backgroundColor: "#45475a",
                    borderColor: "#6c7086",
                  }}
                >
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (card.value / card.total) * 100,
                        100
                      )}%`,
                      backgroundColor: card.color,
                    }}
                  />
                </div>
                <div
                  className="text-xs font-mono mt-1 tracking-wide"
                  style={{ color: "#6c7086" }}
                >
                  {card.total > 0
                    ? Math.round((card.value / card.total) * 100)
                    : 0}
                  % complete
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t-2" style={{ borderColor: "#45475a" }}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div
              className="text-xl font-bold font-mono"
              style={{ color: "#a6e3a1" }}
            >
              {stats.easySolved > 0
                ? Math.round((stats.easySolved / stats.totalEasy) * 100)
                : 0}
              %
            </div>
            <div
              className="text-xs font-mono tracking-wide"
              style={{ color: "#6c7086" }}
            >
              {">"} easy_rate
            </div>
          </div>
          <div>
            <div
              className="text-xl font-bold font-mono"
              style={{ color: "#f9e2af" }}
            >
              {stats.mediumSolved > 0
                ? Math.round((stats.mediumSolved / stats.totalMedium) * 100)
                : 0}
              %
            </div>
            <div
              className="text-xs font-mono tracking-wide"
              style={{ color: "#6c7086" }}
            >
              {">"} medium_rate
            </div>
          </div>
          <div>
            <div
              className="text-xl font-bold font-mono"
              style={{ color: "#f38ba8" }}
            >
              {stats.hardSolved > 0
                ? Math.round((stats.hardSolved / stats.totalHard) * 100)
                : 0}
              %
            </div>
            <div
              className="text-xs font-mono tracking-wide"
              style={{ color: "#6c7086" }}
            >
              {">"} hard_rate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
