import LabLoader from './LabLoader';

interface LabPageProps {
  params: { id: string };
}

export default function LabPage({ params }: LabPageProps) {
  return <LabLoader id={params.id} />;
}
