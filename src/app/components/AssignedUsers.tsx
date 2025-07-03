// components/Lab/AssignedUsers.tsx

'use client';

import { use, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@app/context/AuthContext';
import {
  getAllRoles,
  getRoleByCode,
  initializeRoleCache,
} from '@app/lib/roles';
import { API_BASE_URL } from '@app/constants/config';

type AssignedUser = {
  userId: string;
  role_codes: string[];
  assignedAt: string;
  name?: string;
  email?: string;
};

type Props = {
  users: AssignedUser[];
  labId: string;
};

export default function AssignedUsers({ users, labId }: Props) {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.roles.includes('vre_admin');

  const [showModal, setShowModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    if (showModal) {
      fetch(`${API_BASE_URL}/users`)
        .then((res) => res.json())
        .then(setAvailableUsers);

      (async () => {
        await initializeRoleCache();
        setAvailableRoles(getAllRoles());
      })();
    }
  }, [showModal]);

  const handleAssign = async () => {
    try {
      const userData = users.find((u) => u.userId === selectedUserId);
      const existingRoles = userData?.role_codes || [];
      const updatedRoles = Array.from(
        new Set([...existingRoles, selectedRole]),
      );

      const dto = [
        {
          user_id: selectedUserId,
          role_codes: updatedRoles,
        },
      ];

      const res = await fetch(`${API_BASE_URL}/lab/${labId}/assign-users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });

      if (!res.ok) throw new Error('Assignment failed');
      alert('User assigned successfully.');
      setShowModal(false);
      location.reload();
    } catch (error) {
      alert('Error assigning user.');
      console.error(error);
    }
  };

  return (
    <section className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Assigned Users</h2>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Manage Users
          </button>
        )}
      </div>

      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {users.map((user, index) => (
          <li key={index} className="py-2">
            <div className="text-sm text-gray-800 dark:text-gray-100 font-medium">
              {user.name || 'Unknown User'} — {user.email || 'No Email'}
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {(user.role_codes || []).map((code, idx) => {
                const role = getRoleByCode(code.replace(/\[|\]/g, ''));
                return (
                  <span
                    key={idx}
                    title={role?.description || code}
                    className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-2 py-0.5 rounded-full text-xs font-medium"
                  >
                    {role ? role.name : code}
                  </span>
                );
              })}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Assigned at:{' '}
              {user.assignedAt
                ? new Date(user.assignedAt).toLocaleString()
                : 'Unknown'}
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Assign User to Virtual Lab
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select User
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a user</option>
                  {availableUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.reference_id} — {u.email || 'No Email'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Role
                </label>
                <select
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">-- Choose a role --</option>
                  {availableRoles.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name} ({r.code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-sm px-3 py-1 border border-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={!selectedUserId || !selectedRole}
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
