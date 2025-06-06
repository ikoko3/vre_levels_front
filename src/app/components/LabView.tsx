import { VirtualLabViewModel } from '@app/types/lab/viewModels';

type Props = {
  lab: VirtualLabViewModel;
};

export default function LabView({ lab }: Props) {
  return (
    
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{lab.name}</h1>
        <p className="text-gray-600">Alias: {lab.alias}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800">Current Maturity Level</h2>
        <p>
          Level <span className="font-bold">{lab.maturityLevel}</span> reached at:{' '}
          <span className="text-sm text-gray-700">
            {new Date(lab.maturityReachedAt).toLocaleString()}
          </span>
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800">Exit Conditions</h2>
        <ul className="list-disc list-inside space-y-1">
          {lab.exitConditions.map((cond, index) => (
            <li key={index}>
              Type <code>{cond.type}</code> in category <code>{cond.category}</code> —{' '}
              <span className={cond.fulfilled ? 'text-green-600' : 'text-red-600'}>
                {cond.fulfilled ? 'Fulfilled' : 'Unfulfilled'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800">Assigned Users</h2>
        <ul className="list-disc list-inside space-y-1">
          {lab.assignedUsers.map((user, index) => (
            <li key={index}>
              User ID: <code>{user.userId}</code> — Role: <strong>{user.roleCode}</strong>
              <br />
              Assigned at:{' '}
              <span className="text-sm text-gray-700">
                {new Date(user.assignedAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
