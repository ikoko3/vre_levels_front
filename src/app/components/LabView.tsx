import { VirtualLabViewModel } from '@app/types/lab/viewModels';

type Props = {
  lab: VirtualLabViewModel;
};

export default function LabView({ lab }: Props) {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-10 row-start-2 items-center sm:items-start max-w-3xl w-full">
        <section className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">{lab.name}</h1>
          <p className="text-sm text-gray-600">Alias: <span className="bg-black/[.05] px-2 py-1 rounded">{lab.alias}</span></p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Current Maturity Level</h2>
          <p className="text-sm text-gray-700">
            Level <strong>{lab.maturityLevel}</strong> reached at:{" "}
            {new Date(lab.maturityReachedAt).toLocaleString()}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Exit Conditions</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {lab.exitConditions.map((cond, index) => (
              <li key={index}>
                Type <code>{cond.type}</code> in category <code>{cond.category}</code> —{" "}
                <span className={cond.fulfilled ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {cond.fulfilled ? "Fulfilled" : "Unfulfilled"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Assigned Users</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {lab.assignedUsers.map((user, index) => (
              <li key={index}>
                User ID: <code>{user.userId}</code> — Role: <strong>{user.roleCode}</strong>
                <br />
                Assigned at: {new Date(user.assignedAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="row-start-3 text-xs text-gray-400 text-center">
        Data rendered for: {lab.alias}
      </footer>
    </div>
  );
}
