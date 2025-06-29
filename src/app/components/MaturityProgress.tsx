// components/Lab/MaturityProgress.tsx

"use client";

import React from "react";

interface Props {
  level: number;
  reachedAt?: string;
  totalConditions: number;
  fulfilledConditions: number;
}

export default function MaturityProgress({
  level,
  totalConditions,
  fulfilledConditions,
}: Props) {
  const percentage = totalConditions > 0 ? Math.round((fulfilledConditions / totalConditions) * 100) : 0;

  return (
    <section className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-white bg-blue-600 px-3 py-1 rounded-full">
            L{level}
          </span>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Current Maturity Level
          </h2>
        </div>
        <a
          href="https://naavre.net/docs/readiness_levels"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          Learn more →
        </a>
      </div>

      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Exit Condition Completion: {fulfilledConditions}/{totalConditions} ({percentage}%)
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
          <div
            className="bg-green-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </section>
  );
}