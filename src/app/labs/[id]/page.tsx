import { VirtualLabViewModel } from '@app/types/lab/viewModels';
import LabView from '@app/components/LabView';
import { cookies } from 'next/headers';


interface LabPageProps {
  params: {
    id: string;
  };
}



// export default async function LabPage({ params }: LabPageProps) {
//   // If you want to fetch dynamically with the ID:
//   const res = await fetch(`http://localhost:4000/api/lab/mock`, {
//     cache: 'no-store', // disables caching
//   });
//   const lab: VirtualLabViewModel = await res.json();

//   return <LabView lab={lab} />;
// }



export default async function LabPage({ params }: LabPageProps) {
  const id = params.id;
  const token = (await cookies()).get('kc-token')?.value;


  const res = await fetch(`http://localhost:3000/lab/${id}`, {
     headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });


  //  const res = await fetch(`http://localhost:4000/api/lab/mock`, {
  //   cache: 'no-store',
  // });

  if (!res.ok) {
    throw new Error(`Failed to fetch lab ${id}, ${res.text} ${res.status}`);
  }

  const backendData = await res.json();

  const lab: VirtualLabViewModel = {
    name: backendData.name,
    alias: backendData.alias,
    maturityLevel: backendData.current_level,
    maturityReachedAt: '', // backend doesn't provide a timestamp — fill if needed
    exitConditions: backendData.exit_conditions.map((c: any) => ({
      fulfilled: c.status == 300,
      category: c.category,
      type: c.type,
      status: c.status,
      discussion_url: c.discussion_url,
      tooltip_url: c.tooltip_url,
    })),
    assignedUsers: backendData.assigned_users.map((u: any) => ({
      userId: u.user_id,
      roleCode: u.role_code,
      assignedAt: '', // backend doesn't provide assigned_at — optional
    })),
  };

  return <LabView lab={lab} />;
}