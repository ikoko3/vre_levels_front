// components/Lab/MaturityProgress.tsx

"use client";

import React, { useState } from "react";
import { getRoleByCode } from "@app/lib/roles";

interface Props {
  roles: string[];
  labId: string;
  level: number;
  levelState: number;
  totalConditions: number;
  fulfilledConditions: number;
}

const LabLevelStatuses: Record<number, string> = {
  0: 'Undefined',
  100: 'In Development',
  101: 'Blocked',
  200: 'Requested Evaluation',
  201: 'Under Evalutation',
  202: 'Needs Improvements',
  203: 'Requested re-Evaluation',
  300: 'Completed',
};

export default function MaturityProgress({
  roles,
  labId,
  level,
  levelState,
  totalConditions,
  fulfilledConditions,
}: Props) {
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [showReevalModal, setShowReevalModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(levelState);

  const percentage = totalConditions > 0 ? Math.round((fulfilledConditions / totalConditions) * 100) : 0;

  const canRequestEvaluation =
    levelState === 100 && (roles.includes("GLU") || roles.includes("VLD"));
  const canRequestReevaluation =
    levelState === 202 && (roles.includes("GLU") || roles.includes("VLD"));
  const canUpdateStatus =
    [100, 101, 200, 201, 203].includes(levelState) && roles.includes("CRD");

  const updateLevel = async (newLevel: number, state: number) => {
    const res = await fetch(`http://localhost:3000/lab/${labId}/update_level`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level: newLevel, state }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        alert(`Update failed: ${errorData.error || 'Unknown error'}`);
    }else{

        location.reload();
    }
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-6">
      {/* LEFT: Lab Level Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-white bg-blue-600 px-3 py-1 rounded-full">L{level}</span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Maturity Level</h2>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Status: <strong>{LabLevelStatuses[levelState] || "Unknown"}</strong>
        </p>

        <div>
          <div className="text-sm mb-1 text-gray-600 dark:text-gray-400">
            Exit Condition Completion: {fulfilledConditions}/{totalConditions} ({percentage}%)
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {canRequestEvaluation && (
            <button
              onClick={() => setShowEvalModal(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Request Evaluation
            </button>
          )}

          {canRequestReevaluation && (
            <button
              onClick={() => setShowReevalModal(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Request Re-evaluation
            </button>
          )}

          {canUpdateStatus && (
            <button
              onClick={() => setShowStatusModal(true)}
              className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-sm"
            >
              Update Lab Status
            </button>
          )}
        </div>
      </div>

      {/* RIGHT: User Roles Overview */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Your Roles</h3>
        <div className="flex flex-wrap gap-2">
          {roles.map((role, idx) => (
            <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-1 rounded-full text-xs font-medium">
              {getRoleByCode(role)?.name || role}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Based on your role{roles.length > 1 ? 's' : ''}, you may perform status transitions or submit evaluations.
        </p>
      </div>

      {/* Evaluation Confirmation Modal */}
      {showEvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Evaluation Request</h3>
            <p className="text-sm mb-4">Are you sure you want to request an evaluation for Level {level}?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEvalModal(false)} className="text-sm px-3 py-1 border border-gray-400 rounded">Cancel</button>
              <button onClick={() => updateLevel(level, 200)} className="text-sm px-3 py-1 bg-blue-600 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Re-evaluation Confirmation Modal */}
      {showReevalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Re-evaluation Request</h3>
            <p className="text-sm mb-4">Are you sure you want to request a re-evaluation for Level {level}?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowReevalModal(false)} className="text-sm px-3 py-1 border border-gray-400 rounded">Cancel</button>
              <button onClick={() => updateLevel(level, 203)} className="text-sm px-3 py-1 bg-blue-600 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Update Lab Status</h3>
            <select
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white mb-4"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(Number(e.target.value))}
            >
              {Object.entries(LabLevelStatuses).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowStatusModal(false)} className="text-sm px-3 py-1 border border-gray-400 rounded">Cancel</button>
              <button onClick={() => updateLevel(level, selectedStatus)} className="text-sm px-3 py-1 bg-purple-600 text-white rounded">Update</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
