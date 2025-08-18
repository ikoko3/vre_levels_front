'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@app/context/AuthContext';
import { API_BASE_URL } from '@app/constants/config';
import Link from 'next/link';

const LabLevelStatuses: Record<number, string> = {
  0: 'Undefined',
  100: 'In Development',
  101: 'Blocked',
  200: 'Requested Evaluation',
  201: 'Under Evaluation',
  202: 'Needs Improvements',
  203: 'Requested re-Evaluation',
  300: 'Completed',
};

const roleActions: Record<string, Record<number, string>> = {
  CRD: {
    200: 'Review evaluation request',
    201: 'Evaluate lab',
    203: 'Review re-evaluation request',
  },
  VLD: {
    100: 'Request evaluation',
    202: 'Request re-evaluation',
  },
  GLU: {
    100: 'Request evaluation',
    202: 'Request re-evaluation',
  },
};

interface LabSummary {
  id: string;
  name: string;
  alias: string;
  current_level: number;
  level_state: number;
  role_codes: string[];
}

interface ApiLab {
  id: string;
  name: string;
  alias: string;
  current_level: number;
  level_state: number;
  assigned_users?: {
    user_id: string;
    role_codes: string[];
  }[];
}

export default function LabsByRolePage() {
  const { user } = useContext(AuthContext);
  const [labs, setLabs] = useState<LabSummary[] | null>(null);
  const [roleCode, setRoleCode] = useState('CRD');

  useEffect(() => {
    if (!user?.app_id) return;
    fetch(`${API_BASE_URL}/lab/by-user/${user.app_id}`)
      .then(async (res) => {
        if (!res.ok) {
          console.error('Failed to fetch labs', res.status);
          return [];
        }
        return res.json();
      })
      .then((data) => {
        const labsData: ApiLab[] = Array.isArray(data) ? data : [];
        const mappedLabs: LabSummary[] = labsData.map((lab) => ({
          id: lab.id,
          name: lab.name,
          alias: lab.alias,
          current_level: lab.current_level,
          level_state: lab.level_state,
          role_codes:
            lab.assigned_users?.find((u) => u.user_id === user.app_id)?.role_codes || [],
        }));
        setLabs(mappedLabs);
      })
      .catch((err) => {
        console.error(err);
        setLabs([]);
      });
  }, [user?.app_id]);

  if (!user) return <div className="p-4">Loading...</div>;

  const filteredLabs =
    labs?.filter((lab) => lab.role_codes.includes(roleCode)) ?? [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Labs by Role</h1>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Select Role</label>
        <select
          className="w-full sm:w-fit p-2 border rounded dark:bg-gray-800 dark:text-white"
          value={roleCode}
          onChange={(e) => setRoleCode(e.target.value)}
        >
          <option value="CRD">Coordinator (CRD)</option>
          <option value="VLD">Developer (VLD)</option>
          <option value="GLU">Golden User (GLU)</option>
        </select>
      </div>

      {labs === null ? (
        <p className="text-gray-600">Loading labs...</p>
      ) : labs.length === 0 ? (
        <p className="text-gray-600">You are not associated with any labs.</p>
      ) : filteredLabs.length === 0 ? (
        <p className="text-gray-600">No labs found for this role.</p>
      ) : (
        <div className="grid gap-4">
          {filteredLabs.map((lab) => {
            const statusLabel = LabLevelStatuses[lab.level_state] || 'Unknown';
            const actionHint = roleActions[roleCode]?.[lab.level_state];
            return (
              <Link
                key={lab.id}
                href={`/labs/${lab.id}`}
                className="block border rounded p-4 hover:shadow transition cursor-pointer bg-white dark:bg-gray-800"
              >
                <h2 className="text-lg font-semibold">{lab.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Alias: {lab.alias}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Status: <strong>{statusLabel}</strong>
                </p>
                {actionHint && (
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-2 italic">
                    Action required: {actionHint}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
