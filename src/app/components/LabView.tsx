"use client";

import { useContext } from "react";
import { VirtualLabViewModel } from "@app/types/lab/viewModels";
import ExitConditionCard from "@app/components/ExitConditions/Card";
import { ExitCondition } from "@app/components/ExitConditions/types";
import { AuthContext } from "@app/context/AuthContext";
import AssignedUsers from "@app/components/AssignedUsers"


type Props = {
  lab: VirtualLabViewModel;
};

export default function LabView({ lab }: Props) {
  const { user } = useContext(AuthContext);
  const roles = user?.roles ?? [];

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[color:var(--background)] text-[color:var(--foreground)]">
      <main className="flex flex-col gap-10 row-start-2 items-center sm:items-start max-w-3xl w-full">

        {/* Title */}
        <section className="space-y-2">
          <h1 className="text-2xl font-bold">{lab.name}</h1>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Alias: <span className="bg-black/[.05] dark:bg-white/[.1] px-2 py-1 rounded">{lab.alias}</span>
          </p>
        </section>

        {/* Maturity Info */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Current Maturity Level</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Level <strong>{lab.maturityLevel}</strong> reached at:{" "}
            {lab.maturityReachedAt ? new Date(lab.maturityReachedAt).toLocaleString() : "Unknown"}
          </p>
        </section>

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

       <AssignedUsers users={lab.assignedUsers} />

      </main>

      <footer className="row-start-3 text-xs text-gray-400 dark:text-gray-500 text-center">
        Data rendered for: {lab.alias}
      </footer>
    </div>
  );
}
