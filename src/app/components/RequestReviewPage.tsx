'use client';

import { useEffect, useState, useContext } from 'react';
import { API_BASE_URL } from '@app/constants/config';
import { AuthContext } from '@app/context/AuthContext';

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

export default function RequestReviewPage({ id }: { id: string }) {
  const [request, setRequest] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.Submitted);
  const { keycloak } = useContext(AuthContext);

  useEffect(() => {
    fetch(`${API_BASE_URL}/request/labs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRequest(data);
        setStatus(data.status);
        setComment(data.comments);
      });

    fetch(`${API_BASE_URL}/users`)
      .then((res) => res.json())
      .then(setUsers);
    fetch(`${API_BASE_URL}/roles`)
      .then((res) => res.json())
      .then(setRoles);
  }, [id]);

  const getUser = (uid: string) => users.find((u) => u.id === uid);
  const getRoleName = (code: string) =>
    roles.find((r) => r.code === code)?.name || code;

  const handleSubmit = async () => {
    const reviewer = localStorage.getItem('user_id') || users[0]?._id; // Replace with real user session
    await fetch(`${API_BASE_URL}/request/labs/${id}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(keycloak?.token && {
          Authorization: `Bearer ${keycloak.token}`,
        }),
      },
      body: JSON.stringify({
        status,
        reviewer_user_id: reviewer,
        comments: comment,
      }),
    });
    alert('Request status updated.');
  };

  if (!request) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Lab Proposal Review</h1>

      <section className="space-y-2">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <div className="p-2 border rounded bg-gray-50 dark:bg-gray-800">
            {request.title}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Alias</label>
          <div className="p-2 border rounded bg-gray-50 dark:bg-gray-800">
            {request.alias}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Scope</label>
          <div className="p-2 border rounded bg-gray-50 dark:bg-gray-800 whitespace-pre-wrap">
            {request.scope}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Time Plan</label>
          <div className="p-2 border rounded bg-gray-50 dark:bg-gray-800 whitespace-pre-wrap">
            {request.timeplan}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Associated Users</label>
          <ul className="list-disc list-inside space-y-1">
            {request.associated_users.map((u: any) => {
              const user = getUser(u.user_id);
              return (
                <li key={u._id}>
                  <span className="font-medium">{user?.name || u.user_id}</span>{' '}
                  ({user?.email})<br />
                  <span className="text-sm text-gray-600">
                    Roles: {u.role_codes.map(getRoleName).join(', ')}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <label className="block text-sm font-medium">
            Update Request Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(Number(e.target.value))}
            className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
          >
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Comments</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            rows={4}
            placeholder="Add comments for the requester..."
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Update
        </button>
      </section>
    </div>
  );
}
