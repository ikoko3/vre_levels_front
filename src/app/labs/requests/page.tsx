'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@app/context/AuthContext';
import { API_BASE_URL } from '@app/constants/config';
import Link from 'next/link';

export enum RequestStatus {
  Undefined = 0,
  Submitted = 1,
  UnderReview = 2,
  Approved = 10,
  Rejected = 20,
}

const statusLabels: Record<RequestStatus, string> = {
  [RequestStatus.Undefined]: 'Undefined',
  [RequestStatus.Submitted]: 'Submitted',
  [RequestStatus.UnderReview]: 'Under Review',
  [RequestStatus.Approved]: 'Approved',
  [RequestStatus.Rejected]: 'Rejected',
};

export default function RequestListPage() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const url = `${API_BASE_URL}/request/labs${showAll ? '?show_all=true' : ''}`;
    fetch(url)
      .then((res) => res.json())
      .then(setRequests);
    fetch(`${API_BASE_URL}/users`)
      .then((res) => res.json())
      .then(setUsers);
  }, [showAll]);

  const isReviewer = user?.roles.includes('vre_lab_reviewer');
  const getUserName = (uid: string) =>
    users.find((u) => u._id === uid)?.name || uid;

  if (!isReviewer)
    return (
      <div className="p-6 text-red-600">
        You do not have permission to view this page.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lab Requests</h1>
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showAll ? 'Show Pending Only' : 'Show All Requests'}
        </button>
      </div>

      {requests.length === 0 ? (
        <p className="text-gray-500">No requests available.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((req) => (
            <li
              key={req._id}
              className="border rounded p-4 hover:shadow transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{req.title}</h2>
                  <p className="text-sm text-gray-600">Alias: {req.alias}</p>
                  <p className="text-sm text-gray-600">
                    Status: {statusLabels[req.status as RequestStatus]}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    GLU:{' '}
                    {getUserName(
                      req.associated_users.find((u: any) =>
                        u.role_codes.includes('GLU'),
                      )?.user_id,
                    )}
                  </p>
                </div>
                <Link
                  href={`/labs/requests/${req._id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
