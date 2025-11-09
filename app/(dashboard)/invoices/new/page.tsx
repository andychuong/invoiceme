'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

function NewInvoicePageContent() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get('customerId') || undefined;
  
  return <InvoiceForm mode="create" defaultCustomerId={customerId} />;
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NewInvoicePageContent />
    </Suspense>
  );
}

