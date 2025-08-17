'use client';

import { useState, useContext } from 'react';
import { API_BASE_URL } from '@app/constants/config';
import { ExitConditionCardProps } from '@app/components/ExitConditions/types';
import {
  exitConditionLabels,
  exitConditionStatuses,
} from '@app/constants/exitCondition';
import { AuthContext } from '@app/context/AuthContext';

export default function ExitConditionCard({
  cond,
  labId,
  userRoles,
}: ExitConditionCardProps) {
  const isCoordinator = userRoles.includes('CRD');
  const { keycloak } = useContext(AuthContext);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

  // 🔁 Make local display state
  const [status, setStatus] = useState(cond.status);
  const [discussionUrl, setDiscussionUrl] = useState(cond.discussion_url || '');
  const fulfilled = status === 300;

  const [selectedStatus, setSelectedStatus] = useState(cond.status);
  const [comment, setComment] = useState('');

  const label = exitConditionLabels[cond.type] ?? `Type ${cond.type}`;
  const statusLabel = exitConditionStatuses[status] ?? status;

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/lab/${labId}/exit_condition/${cond.id}/update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(keycloak?.token && {
              Authorization: `Bearer ${keycloak.token}`,
            }),
          },
          body: JSON.stringify({
            status: selectedStatus,
            comments: comment,
            discussion_url: discussionUrl,
          }),
        },
      );

      if (!res.ok) throw new Error('Failed to update exit condition');

      setStatus(selectedStatus);
      setShowEditModal(false);
    } catch (error) {
      console.error('Update failed', error);
      alert('An error occurred while updating.');
    }
  };

  return (
    <div
      className={`border rounded-lg p-3 text-sm flex flex-col gap-2 ${
        fulfilled
          ? 'border-green-300 bg-green-50 dark:bg-green-900/30'
          : 'border-orange-300 bg-orange-50 dark:bg-orange-900/20'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-sm font-medium">
          <span className="text-blue-700 dark:text-blue-300">
            EC{cond.type}
          </span>
          <span className="text-gray-800 dark:text-gray-100">{label}</span>
        </div>
        <span
          className={`text-xs font-semibold ${
            fulfilled
              ? 'text-green-700 dark:text-green-400'
              : 'text-orange-700 dark:text-orange-400'
          }`}
        >
          {statusLabel}
        </span>
      </div>
      <div className="flex justify-between items-center text-xs">
        <div className="flex gap-4">
          {cond.tooltip_url && (
            <a
              href={cond.tooltip_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-1 hover:text-blue-600"
              title="Learn more"
              aria-label="Learn more about this condition"
            >
              ⓘ <span className="hidden sm:inline">Details</span>
            </a>
          )}
          {cond.comments && (
            <button
              onClick={() => setShowCommentModal(true)}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:underline"
              title="View comment"
            >
              📝 <span className="hidden sm:inline">Comment</span>
            </button>
          )}

          {discussionUrl && (
            <a
              href={discussionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-indigo-600 hover:underline"
              title="View discussion"
            >
              💬 <span className="hidden sm:inline">Discussion</span>
            </a>
          )}
        </div>

        {isCoordinator && (
          <button
            onClick={() => setShowEditModal(true)}
            className="text-xs text-purple-700 border border-purple-500 px-2 py-0.5 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            Edit
          </button>
        )}
      </div>

      {showCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl max-w-sm w-full">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-sm">Exit Condition Comment</h4>
              <button
                onClick={() => setShowCommentModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {cond.comments}
            </p>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Exit Condition</h3>
              <button
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Update Status
                </label>
                <select
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(Number(e.target.value))}
                >
                  {Object.entries(exitConditionStatuses).map(
                    ([code, label]) => (
                      <option key={code} value={code}>
                        {label}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Comment
                </label>
                <textarea
                  rows={3}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Discussion URL
                </label>
                <input
                  type="url"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
                  value={discussionUrl}
                  onChange={(e) => setDiscussionUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-sm px-3 py-1 border border-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
