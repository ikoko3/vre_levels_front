'use client';

import { useContext, useMemo } from 'react';
import { VirtualLabViewModel } from '@app/types/lab/viewModels';
import { ExitCondition } from '@app/components/ExitConditions/types';
import { AuthContext } from '@app/context/AuthContext';

//Components
import ExitConditionCard from '@app/components/ExitConditions/Card';
import AssignedUsers from '@app/components/AssignedUsers';
import MaturityProgress from '@app/components/MaturityProgress';

type Props = {
  lab: VirtualLabViewModel;
};

export default function LabView({ lab }: Props) {
  const { user } = useContext(AuthContext);

  const roles = useMemo(() => {
    const keycloakRoles = user?.roles ?? [];
    const labUser = lab.assignedUsers.find((u) => u.reference_id === user?.id);
    console.log('User', { user, lab, labUser });
    const labRoles = labUser?.role_codes ?? [];
    return Array.from(new Set([...keycloakRoles, ...labRoles]));
  }, [user?.id, user?.roles, lab.assignedUsers]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[color:var(--background)] text-[color:var(--foreground)]">
      <main className="flex flex-col gap-10 row-start-2 items-center sm:items-start max-w-3xl w-full">
        <section className="w-full space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {lab.name}
              </h1>
              <div className="mt-1">
                <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-3 py-1 rounded-full">
                  Alias: {lab.alias}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={`https://staging.demo.naavre.net/vreapp/vlabs/${lab.alias}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Open in NaaVRE
              </a>
            </div>
          </div>
        </section>

        <MaturityProgress
          roles={roles}
          labId={lab.id}
          level={lab.maturityLevel}
          levelState={lab.levelState}
          totalConditions={lab.exitConditions.length}
          fulfilledConditions={
            lab.exitConditions.filter((c) => c.fulfilled).length
          }
        />

        {/* Exit Conditions */}
        <section className="space-y-4 w-full">
          <h2 className="text-lg font-semibold">
            Exit Conditions{' '}
            <a
              href="https://naavre.net/docs/readiness_levels/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline self-center"
            >
              ⓘ
            </a>
          </h2>
          <p>
            These Conditions have to be satisfied to progress the VL to the next
            maturity level.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lab.exitConditions.map((cond: ExitCondition) => (
              <ExitConditionCard
                key={cond.id}
                cond={cond}
                userRoles={roles}
                labId={lab.id}
                onUpdateClick={(c) => console.log('Update requested for', c)}
              />
            ))}
          </div>

          <details className="bg-gray-50 dark:bg-gray-800 rounded p-4 mt-4 text-sm">
            <summary className="cursor-pointer font-medium text-blue-700 dark:text-blue-300 mb-2">
              What do the statuses mean for the Exit Conditions?
            </summary>
            <p className="mb-2">
              Each lab level status reflects a stage in the evaluation
              lifecycle:
            </p>
            <img
              src="/images/exitCondition_kpi.svg"
              alt="Maturity level flow"
              className="mt-4 rounded border"
            />
          </details>
        </section>

        <AssignedUsers users={lab.assignedUsers} labId={lab.id} />
      </main>

      <footer className="row-start-3 text-xs text-gray-400 dark:text-gray-500 text-center">
        Data rendered for: {lab.alias}
      </footer>
    </div>
  );
}
