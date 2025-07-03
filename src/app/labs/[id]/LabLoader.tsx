'use client';

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@app/context/AuthContext';
import { API_BASE_URL } from '@app/constants/config';
import LabView from '@app/components/LabView';
import { VirtualLabViewModel } from '@app/types/lab/viewModels';


export default function LabLoader({ id }: { id: string }) {
  const { keycloak } = useContext(AuthContext);
  const [lab, setLab] = useState<VirtualLabViewModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLab = async () => {
      if (!keycloak?.token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/lab/${id}`, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${await res.text()}`);
        }

        const backendData = await res.json();

        const lab: VirtualLabViewModel = {
          id: id,
          name: backendData.name,
          alias: backendData.alias,
          levelState: backendData.level_state,
          maturityLevel: backendData.current_level,
          maturityReachedAt: '',
          exitConditions: backendData.exit_conditions.map((c: any) => ({
            id: c.id,
            fulfilled: c.status == 300,
            category: c.category,
            type: c.type,
            status: c.status,
            comments: c.comments,
            discussion_url: c.discussion_url,
            tooltip_url: c.tooltip_url,
          })),
          assignedUsers: backendData.assigned_users.map((u: any) => ({
            userId: u.user_id,
            role_codes: u.role_codes,
            assignedAt: u.assigned_at,
            reference_id: u.reference_id,
            name: u.name,
            email: u.email
          })),
        };

        setLab(lab);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchLab();
  }, [id, keycloak]);

  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!lab) return <p>Loading...</p>;

  return <LabView lab={lab} />;
}
