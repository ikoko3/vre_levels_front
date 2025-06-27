"use client";

import { useState } from "react";
import { VirtualLabViewModel } from "@app/types/lab/viewModels";
import { exitConditionLabels, exitConditionStatuses } from "../../constants/exitCondition";

type Props = {
  lab: VirtualLabViewModel;
};

export default function LabView({ lab }: Props) {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[color:var(--background)] text-[color:var(--foreground)]">
      <main className="flex flex-col gap-10 row-start-2 items-center sm:items-start max-w-3xl w-full">

        {/* Title */}
        <section className="space-y-2">
          <h1 className="text-2xl font-bold">{lab.name}</h1>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Alias: <span className="bg-black/[.05] dark:bg-white/[.1] px-2 py-1 rounded">{lab.alias}</span>
          </p>
        </section>

        {/* Maturity Info */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Current Maturity Level</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Level <strong>{lab.maturityLevel}</strong> reached at:{" "}
            {lab.maturityReachedAt ? new Date(lab.maturityReachedAt).toLocaleString() : "Unknown"}
          </p>
        </section>

        {/* View Toggle */}
        <section className="w-full flex items-center justify-between">
          <h2 className="text-lg font-semibold">Exit Conditions</h2>
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded border text-sm ${
                viewMode === "table"
                  ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-black"
                  : "bg-transparent border-gray-300 dark:border-gray-600"
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1 rounded border text-sm ${
                viewMode === "cards"
                  ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-black"
                  : "bg-transparent border-gray-300 dark:border-gray-600"
              }`}
            >
              Cards
            </button>
          </div>
        </section>

        {/* Exit Conditions View */}
        {viewMode === "table" ? (
          <section className="w-full">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 text-gray-600 dark:text-gray-400">Condition</th>
                  <th className="text-left p-2 text-gray-600 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {lab.exitConditions.map((cond, index) => (
                  <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-2">
                      <span className="flex items-center gap-2">
                        {exitConditionLabels[cond.type] ?? `Type ${cond.type}`}
                        {cond.tooltip_url && (
                          <a href={cond.tooltip_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-xs">ⓘ</a>
                        )}
                        {cond.discussion_url && (
                          <a href={cond.discussion_url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-700 text-xs">💬</a>
                        )}
                      </span>
                    </td>
                    <td className="p-2 font-medium">
                      <span className={cond.fulfilled ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}>
                        {exitConditionStatuses[cond.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : (
          <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lab.exitConditions.map((cond, index) => (
              <div
                key={index}
                className={`border rounded-lg p-3 text-sm flex items-center justify-between ${
                  cond.fulfilled
                    ? "border-green-300 bg-green-50 dark:bg-green-900/30"
                    : "border-orange-300 bg-orange-50 dark:bg-orange-900/20"
                }`}
              >
                <span className="flex items-center gap-2">
                  {exitConditionLabels[cond.type] ?? `Type ${cond.type}`}
                  {cond.tooltip_url && (
                    <a href={cond.tooltip_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-xs">ⓘ</a>
                  )}
                  {cond.discussion_url && (
                    <a href={cond.discussion_url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-700 text-xs">💬</a>
                  )}
                </span>
                <span className={`text-xs font-medium ${
                  cond.fulfilled ? "text-green-700 dark:text-green-400" : "text-orange-700 dark:text-orange-400"
                }`}>
                  {exitConditionStatuses[cond.status]}
                </span>
              </div>
            ))}
          </section>
        )}

        {/* Assigned Users */}
        <section className="space-y-2 w-full">
          <h2 className="text-lg font-semibold">Assigned Users</h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
            {lab.assignedUsers.map((user, index) => (
              <li key={index}>
                User ID: <code>{user.userId}</code> — Role: <strong>{user.roleCode}</strong>
                <br />
                Assigned at: {user.assignedAt ? new Date(user.assignedAt).toLocaleString() : "Unknown"}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="row-start-3 text-xs text-gray-400 dark:text-gray-500 text-center">
        Data rendered for: {lab.alias}
      </footer>
    </div>
  );
}
