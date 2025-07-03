'use client';

import { useParams } from 'next/navigation';
import RequestReviewPage from '@app/components/RequestReviewPage';

export default function RequestPageWrapper() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) return <div>Invalid request ID</div>;

  return <RequestReviewPage id={id} />;
}
