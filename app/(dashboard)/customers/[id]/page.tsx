'use client';

import { useParams } from 'next/navigation';
import { CustomerDetail } from '@/components/customers/CustomerDetail';

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return <CustomerDetail customerId={id} />;
}

