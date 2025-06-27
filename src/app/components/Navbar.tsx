"use client";

import { useContext } from "react";
import { AuthContext } from "@app/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="w-full px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <span className="text-lg font-semibold">VL Maturity Management</span>

        {user ? (
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 text-sm text-right">
            <div className="sm:text-left space-y-0.5">
              <div>{user.name}</div>
              <div className="text-gray-500 dark:text-gray-400">{user.email}</div>
              <div className="text-xs text-indigo-500 dark:text-indigo-400">
                {user.roles.slice(0, 3).join(", ")}
              </div>
            </div>
            <button
              onClick={logout}
              className="text-xs sm:text-sm text-red-600 border border-red-600 px-2 py-1 rounded hover:bg-red-600 hover:text-white transition"
            >
              Log out
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Log in
          </a>
        )}
      </div>
    </nav>
  );
}
