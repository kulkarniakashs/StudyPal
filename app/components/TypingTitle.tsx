"use client";
import { useState, useEffect } from "react";

interface TypingTitleProps {
  title: string;       // New chat title
  speed?: number;      // Typing speed (ms per character)
}

export default function TypingTitle({ title, speed = 50 }: TypingTitleProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  // Reset typing when title changes
  useEffect(() => {
    setDisplayedText("");
    setIndex(0);
  }, [title]);

  // Typing effect
  useEffect(() => {
    if (title && index < title.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + title.charAt(index));
        setIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [index, title, speed]);

  return (
    <h1 className="text-2xl font-bold">
      {displayedText}
      {(displayedText !== title) && <span className="blink">|</span>}
      <style jsx>{`
        .blink {
          display: inline-block;
          margin-left: 2px;
          width: 1ch;
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </h1>
  );
}
