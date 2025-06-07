import { VirtualLabViewModel } from '@app/types/lab/viewModels';
import { exitConditionLabels } from '@app/../constants/exitConditionLabels';


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

       <table className="w-full text-sm border-collapse">
  <thead>
    <tr>
      <th className="text-left p-2">Condition</th>
      <th className="text-left p-2">Status</th>
    </tr>
  </thead>
  <tbody>
    {lab.exitConditions.map((cond, index) => (
      <tr key={index} className="border-t">
        <td className="p-2">{exitConditionLabels[cond.type]}</td>
        <td className="p-2 font-medium text-sm">
          <span className={cond.fulfilled ? 'text-green-600' : 'text-red-600'}>
            {cond.fulfilled ? 'Fulfilled' : 'Unfulfilled'}
          </span>
        </td>
      </tr>
    ))}
  </tbody>
</table>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {lab.exitConditions.map((cond, index) => (
    <div
      key={index}
      className={`border rounded-lg p-3 text-sm flex items-center justify-between ${
        cond.fulfilled ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
      }`}
    >
      <span>{exitConditionLabels[cond.type] ?? `Type ${cond.type}`}</span>
      <span
        className={`text-xs font-medium ${
          cond.fulfilled ? 'text-green-700' : 'text-red-700'
        }`}
      >
        {cond.fulfilled ? '✓ Fulfilled' : '✗ Unfulfilled'}
      </span>
    </div>
  ))}
</div>


<ul className="space-y-3">
  {lab.exitConditions.map((cond, index) => (
    <li
      key={index}
      className="flex items-start gap-3 p-3 border border-gray-200 rounded-md bg-white shadow-sm"
    >
      <div className="text-lg">
        {cond.fulfilled ? '✅' : '🕒'}
      </div>
      <div>
        <p className="font-semibold">{exitConditionLabels[cond.type]}</p>
        <p className="text-sm text-gray-500">
          {cond.fulfilled ? 'Complete' : 'Pending'}
        </p>
      </div>
    </li>
  ))}
</ul>


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
