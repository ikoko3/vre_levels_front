// pages/labs/[id].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { VirtualLabViewModel } from '@app/types/lab/viewModels';
import LabView from '@app/components/LabView';
import Layout from '@app/components/Layout';

export default function LabPage() {
  const router = useRouter();
  const { id } = router.query;
  const [lab, setLab] = useState<VirtualLabViewModel | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/labs/mock`)
        .then((res) => res.json())
        .then((data: VirtualLabViewModel) => setLab(data));
    }
  }, [id]);

  return (
    <Layout>
      {lab ? <LabView lab={lab} /> : <p className="p-6">Loading...</p>}
    </Layout>
  );
}
