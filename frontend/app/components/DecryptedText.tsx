"use client";

import React, { useState, useEffect } from "react";

interface DecryptedTextProps {
  text: string;
  interval?: number;
  className?: string;
}

const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  interval = 50,
  className = "",
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDecrypting, setIsDecrypting] = useState(true);

  // Characters used for the scrambling effect - cyberpunk themed
  const scrambleChars =
    "!@#$%^&*()_+-=[]{}|;:,.<>?~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  useEffect(() => {
    if (!isDecrypting) return;

    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        // Generate scrambled text for remaining characters
        const scrambledPart = text
          .slice(currentIndex + 1)
          .split("")
          .map(
            () =>
              scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
          )
          .join("");

        // Combine revealed part + current character + scrambled part
        const revealedPart = text.slice(0, currentIndex);
        const currentChar = text[currentIndex];

        setDisplayText(revealedPart + currentChar + scrambledPart);
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Animation complete
        setDisplayText(text);
        setIsDecrypting(false);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, text, interval, isDecrypting]);

  // Reset animation when text changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsDecrypting(true);
    setDisplayText("");
  }, [text]);

  return <span className={`font-mono ${className}`}>{displayText}</span>;
};

export default DecryptedText;
