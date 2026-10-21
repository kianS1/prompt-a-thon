"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Understanding your problem…",
  "Checking what type of issue this is…",
  "Finding the right local resource…",
  "Preparing your next step…",
];

export default function LoadingStates() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMessageIndex((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 300);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      {/* Animated dots */}
      <div className="flex gap-2.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full bg-blue-500"
            style={{
              animation: `pulseDot 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}
      </div>

      {/* Status message */}
      <div
        className="text-lg font-medium text-slate-600 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {MESSAGES[messageIndex]}
      </div>

      <p className="text-sm text-slate-400">This usually takes a few seconds</p>
    </div>
  );
}
