// components/Lab/AssignedUsers.tsx

"use client";

import { useContext } from "react";
import { AuthContext } from "@app/context/AuthContext";

type AssignedUser = {
  userId: string;
  roleCode: string;
  assignedAt?: string;
  role?: string;
};

type Props = {
  users: AssignedUser[];
};

export default function AssignedUsers({ users }: Props) {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.roles.includes("vre_admin");

  return (
    <section className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Assigned Users</h2>
        {isAdmin && (
          <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            Manage Users
          </button>
        )}
      </div>

      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {users.map((user, index) => (
          <li key={index} className="py-2">
            <div className="text-sm text-gray-800 dark:text-gray-100 font-medium">
              ID: <code>{user.userId}</code>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Role Code: <strong>{user.roleCode}</strong>
            </div>
            {user.role && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Role: <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-2 py-0.5 rounded-full text-xs font-medium">
                  {user.role}
                </span>
              </div>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Assigned at: {user.assignedAt ? new Date(user.assignedAt).toLocaleString() : "Unknown"}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
