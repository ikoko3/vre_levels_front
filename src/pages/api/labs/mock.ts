// src/mocks/labs/dolphinLab.ts
// src/pages/api/labs/mock.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import type { VirtualLabViewModel } from '@app/types/lab/viewModels';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<VirtualLabViewModel>
) {
  res.status(200).json(dolphinLabMock);
}


export const dolphinLabMock: VirtualLabViewModel = {
  name: 'Dolphin watching Lab',
  alias: 'DLPH-01',
  maturityLevel: 0,
  maturityReachedAt: '2025-06-06T11:41:28.233Z',
  exitConditions: [
    { fulfilled: false, category: 10, type: 1000 },
    { fulfilled: false, category: 10, type: 1001 },
    { fulfilled: false, category: 10, type: 1002 },
    { fulfilled: false, category: 10, type: 1003 },
    { fulfilled: false, category: 10, type: 1004 },
    { fulfilled: false, category: 10, type: 1005 },
  ],
  assignedUsers: [
    {
      userId: '68417f10dbbf0245911c648c',
      roleCode: 'VLD',
      assignedAt: '2025-06-06T12:10:31.172Z',
    },
  ],
};
