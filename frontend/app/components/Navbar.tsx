"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const navItems = user
    ? [
        { id: "today", label: "[TODAY]", href: "/today", color: "#89b4fa" },
        { id: "paths", label: "[PATHS]", href: "/paths", color: "#f38ba8" },
        {
          id: "profile",
          label: "[PROFILE]",
          href: "/profile",
          color: "#a6e3a1",
        },
        ...(user.is_admin
          ? [
              {
                id: "admin",
                label: "[ADMIN]",
                href: "/admin",
                color: "#f9e2af",
              },
            ]
          : []),
      ]
    : [
        { id: "login", label: "[SIGN IN]", href: "/login", color: "#89b4fa" },
        {
          id: "register",
          label: "[SIGN UP]",
          href: "/register",
          color: "#a6e3a1",
        },
      ];

  return (
    <>
      <nav className="relative bg-[#1e1e2e] border-b-4 border-[#89b4fa] shadow-lg overflow-hidden">
        {/* Gooey Background Effect */}
        <div className="absolute inset-0 opacity-20">
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="gooey-navbar">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="3"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                  result="gooey"
                />
                <feBlend in="SourceGraphic" in2="gooey" />
              </filter>

              <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#89b4fa" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#89b4fa" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f38ba8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#f38ba8" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Animated Gooey Blobs */}
            <g filter="url(#gooey-navbar)">
              <circle
                cx="20%"
                cy="50%"
                r="30"
                fill="url(#glow1)"
                className="animate-pulse"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; 10,5; 0,0; -5,8; 0,0"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </circle>

              <circle
                cx="80%"
                cy="50%"
                r="25"
                fill="url(#glow2)"
                className="animate-pulse"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; -8,3; 0,0; 6,-5; 0,0"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Dynamic blob that follows mouse */}
              {activeItem && (
                <circle cx="50%" cy="50%" r="20" fill="#cba6f7" opacity="0.4">
                  <animateTransform
                    attributeName="transform"
                    type="scale"
                    values="0.8; 1.2; 0.8"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          </svg>
        </div>

        {/* Pixel Grid Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(90deg, #89b4fa 1px, transparent 1px),
              linear-gradient(180deg, #89b4fa 1px, transparent 1px)
            `,
            backgroundSize: "8px 8px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  className="text-2xl font-mono font-bold text-[#cdd6f4] hover:text-[#89b4fa] transition-all duration-300 tracking-wider relative group"
                  href="/"
                  onMouseEnter={() => setActiveItem("logo")}
                  onMouseLeave={() => setActiveItem(null)}
                >
                  <span className="relative z-10">[LEETTRACK]</span>
                  <div className="absolute inset-0 bg-[#89b4fa] opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm" />
                </Link>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center">
              {user && (
                <span className="text-[#a6e3a1] font-mono text-sm mr-6 relative">
                  <span className="animate-pulse">&gt;</span>{" "}
                  {user.leetcode_username}
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#a6e3a1] opacity-50" />
                </span>
              )}

              <div className="flex items-center space-x-2">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="relative group px-4 py-2 font-mono font-bold text-sm transition-all duration-300 overflow-hidden"
                    onMouseEnter={() => setActiveItem(item.id)}
                    onMouseLeave={() => setActiveItem(null)}
                    style={{
                      color: activeItem === item.id ? "#1e1e2e" : item.color,
                      transform:
                        activeItem === item.id
                          ? "translateY(-1px)"
                          : "translateY(0)",
                    }}
                  >
                    {/* Gooey Background */}
                    <div
                      className="absolute inset-0 transition-all duration-500 ease-out"
                      style={{
                        backgroundColor: item.color,
                        opacity: activeItem === item.id ? 1 : 0,
                        transform:
                          activeItem === item.id ? "scale(1)" : "scale(0.8)",
                        borderRadius: activeItem === item.id ? "4px" : "12px",
                        filter: "blur(0.5px)",
                      }}
                    />

                    {/* Pixel Border Effect */}
                    <div
                      className="absolute inset-0 border-2 transition-all duration-300"
                      style={{
                        borderColor: item.color,
                        opacity: activeItem === item.id ? 0 : 0.6,
                        boxShadow:
                          activeItem === item.id
                            ? `0 0 20px ${item.color}40`
                            : `2px 2px 0px #11111b`,
                      }}
                    />

                    {/* Glitch Effect */}
                    <div
                      className="absolute inset-0 transition-all duration-200"
                      style={{
                        background:
                          activeItem === item.id
                            ? `linear-gradient(45deg, ${item.color}20, transparent, ${item.color}20)`
                            : "transparent",
                        animation:
                          activeItem === item.id
                            ? "glitch-navbar 0.3s ease-in-out"
                            : "none",
                      }}
                    />

                    <span className="relative z-10 tracking-wider">
                      {item.label}
                    </span>

                    {/* Hover particles */}
                    {activeItem === item.id && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 rounded-full animate-ping"
                            style={{
                              backgroundColor: item.color,
                              left: `${20 + i * 30}%`,
                              top: `${30 + i * 20}%`,
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: "1s",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </Link>
                ))}

                {/* Logout Button for authenticated users */}
                {user && (
                  <button
                    onClick={logout}
                    className="relative group ml-2 px-4 py-2 font-mono font-bold text-sm transition-all duration-300 overflow-hidden"
                    onMouseEnter={() => setActiveItem("logout")}
                    onMouseLeave={() => setActiveItem(null)}
                    style={{
                      color: activeItem === "logout" ? "#1e1e2e" : "#f38ba8",
                      transform:
                        activeItem === "logout"
                          ? "translateY(-1px)"
                          : "translateY(0)",
                    }}
                  >
                    <div
                      className="absolute inset-0 transition-all duration-500 ease-out"
                      style={{
                        backgroundColor: "#f38ba8",
                        opacity: activeItem === "logout" ? 1 : 0,
                        transform:
                          activeItem === "logout" ? "scale(1)" : "scale(0.8)",
                        borderRadius: activeItem === "logout" ? "4px" : "12px",
                        filter: "blur(0.5px)",
                      }}
                    />

                    <div
                      className="absolute inset-0 border-2 transition-all duration-300"
                      style={{
                        borderColor: "#f38ba8",
                        opacity: activeItem === "logout" ? 0 : 0.6,
                        boxShadow:
                          activeItem === "logout"
                            ? "0 0 20px #f38ba840"
                            : "2px 2px 0px #11111b",
                      }}
                    />

                    <span className="relative z-10 tracking-wider">
                      [LOGOUT]
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes glitch-navbar {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-1px) translateY(1px);
          }
          40% {
            transform: translateX(1px) translateY(-1px);
          }
          60% {
            transform: translateX(-1px) translateY(-1px);
          }
          80% {
            transform: translateX(1px) translateY(1px);
          }
        }

        @keyframes pixel-float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-2px) rotate(1deg);
          }
          50% {
            transform: translateY(-1px) rotate(-1deg);
          }
          75% {
            transform: translateY(-3px) rotate(0.5deg);
          }
        }

        .animate-pixel-float {
          animation: pixel-float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
