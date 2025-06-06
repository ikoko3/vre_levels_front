import { VirtualLabViewModel } from '@app/types/lab/viewModels';
import LabView from '@app/components/LabView';

interface LabPageProps {
  params: {
    id: string;
  };
}

export default async function LabPage({ params }: LabPageProps) {
  // If you want to fetch dynamically with the ID:
  const res = await fetch(`http://localhost:4000/api/lab/mock`, {
    cache: 'no-store', // disables caching
  });
  const lab: VirtualLabViewModel = await res.json();

  return <LabView lab={lab} />;
}
