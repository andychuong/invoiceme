'use client';

import { useParams } from 'next/navigation';
import { InvoiceDetail } from '@/components/invoices/InvoiceDetail';

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return <InvoiceDetail invoiceId={id} />;
}

