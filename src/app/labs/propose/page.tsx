"use client";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@app/context/AuthContext";
import { API_BASE_URL } from "@app/constants/config";

interface Lab {
  id: string;
  name: string;
  alias: string;
  levels: { level: number }[];
}

interface User {
  id: string;
  name: string;
  email: string;
  _id?: string; // for backend compatibility
}

export default function ProposeLabPage() {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [alias, setAlias] = useState("");
  const [scope, setScope] = useState("");
  const [timePlan, setTimePlan] = useState("");
  const [developers, setDevelopers] = useState<string[]>([]);
  const [goldenUser, setGoldenUser] = useState<string>("");
  const [sourceLab, setSourceLab] = useState<string>("");
  const [sourceLevel, setSourceLevel] = useState<number | "">("");

  const [users, setUsers] = useState<User[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/users`).then(res => res.json()).then(setUsers);
    fetch(`${API_BASE_URL}/lab/list`).then(res => res.json()).then(setLabs);
  }, []);

  const handleDeveloperToggle = (id: string) => {
    setDevelopers(prev => {
      const exists = prev.includes(id);
      return exists ? prev.filter(uid => uid !== id) : [...prev, id];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const associated_users = [
      { user_id: goldenUser, role_codes: ["GLU"] },
      ...developers.map(devId => ({ user_id: devId, role_codes: ["VLD"] }))
    ];

    const payload: any = {
      title,
      alias,
      scope,
      timeplan: timePlan,
      associated_users,
    };

    if (sourceLab && sourceLevel !== "") {
      payload.lab_reference = { lab_id: sourceLab, lab_level: Number(sourceLevel) };
    }

    await fetch(`${API_BASE_URL}/request/labs/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert("Lab proposal submitted successfully!");
  };

  const selectedLab = labs.find(l => l.id === sourceLab);

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Propose a New Lab</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Alias</label>
          <input
            value={alias}
            onChange={e => setAlias(e.target.value)}
            className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Scope</label>
        <p className="text-xs text-gray-500 mb-1">Describe why this lab is needed, its goals, or motivation.</p>
        <textarea
          value={scope}
          onChange={e => setScope(e.target.value)}
          className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Time Plan</label>
        <p className="text-xs text-gray-500 mb-1">Describe when and how the lab is expected to be completed.</p>
        <textarea
          value={timePlan}
          onChange={e => setTimePlan(e.target.value)}
          className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Golden User</label>
        <select
          value={goldenUser}
          onChange={e => setGoldenUser(e.target.value)}
          className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="">-- Select Golden User --</option>
          {users.map(u => (
            <option key={u._id || u.id} value={u._id || u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Developers</label>
        <div className="mt-2 space-y-1 max-h-40 overflow-y-auto border p-2 rounded">
          {users.map(user => (
            <label key={user._id || user.id} className="flex items-center gap-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              <input
                type="checkbox"
                checked={developers.includes(user._id || user.id)}
                onChange={() => handleDeveloperToggle(user._id || user.id)}
              />
              <span className="text-sm">{user.name} ({user.email})</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Based on Existing Lab</label>
        <p className="text-xs text-gray-500 mb-2">This is optional. If selected, the new lab will be a clone of the chosen one at the selected level.</p>
        <select
          value={sourceLab}
          onChange={e => {
            setSourceLab(e.target.value);
            setSourceLevel("");
          }}
          className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
        >
          <option value="">-- Select a Lab --</option>
          {labs.map(lab => (
            <option key={lab.id} value={lab.id}>
              {lab.name} ({lab.alias})
            </option>
          ))}
        </select>

        {selectedLab && (
          <div className="mt-2">
            <label className="block text-sm font-medium">Lab Level</label>
            <select
              value={sourceLevel}
              onChange={(e) => setSourceLevel(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="">-- Select Level --</option>
              {[...Array(5)].map((_, i) => (
                <option key={i} value={i}>
                  Level {i}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Proposal
      </button>
    </form>
  );
}
