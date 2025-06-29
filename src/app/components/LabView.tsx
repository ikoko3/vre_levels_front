"use client";

import { useContext } from "react";
import { VirtualLabViewModel } from "@app/types/lab/viewModels";
import { ExitCondition } from "@app/components/ExitConditions/types";
import { AuthContext } from "@app/context/AuthContext";

//Components
import ExitConditionCard from "@app/components/ExitConditions/Card";
import AssignedUsers from "@app/components/AssignedUsers"
import MaturityProgress from "@app/components/MaturityProgress";


type Props = {
  lab: VirtualLabViewModel;
};

export default function LabView({ lab }: Props) {
  const { user } = useContext(AuthContext);
  const roles = user?.roles ?? [];

  const vl_user = lab.assignedUsers.find(u => u.reference_id == user?.id);
  if (vl_user)
    roles.push(...vl_user?.role_codes);

  console.log(roles);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[color:var(--background)] text-[color:var(--foreground)]">
      <main className="flex flex-col gap-10 row-start-2 items-center sm:items-start max-w-3xl w-full">

        <section className="w-full space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{lab.name}</h1>
            <a
              href="https://naavre.net/docs/virtual-labs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Learn more →
            </a>
          </div>
          <div>
            <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-3 py-1 rounded-full">
              Alias: {lab.alias}
            </span>
          </div>
      </section>

        <MaturityProgress
            level={lab.maturityLevel}
            reachedAt={lab.maturityReachedAt}
            totalConditions={lab.exitConditions.length}
            fulfilledConditions={lab.exitConditions.filter((c) => c.fulfilled).length}
          />

        {/* Exit Conditions */}
        <section className="space-y-4 w-full">
          <h2 className="text-lg font-semibold">Exit Conditions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lab.exitConditions.map((cond: ExitCondition) => (
              <ExitConditionCard
                key={cond.id}
                cond={cond}
                userRoles={roles}
                labId={lab.id}
                onUpdateClick={(c) => console.log("Update requested for", c)}
              />
            ))}
          </div>
        </section>

       <AssignedUsers users={lab.assignedUsers} labId={lab.id} />

      </main>

      <footer className="row-start-3 text-xs text-gray-400 dark:text-gray-500 text-center">
        Data rendered for: {lab.alias}
      </footer>
    </div>
  );
}
