'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import { useInvoiceViewModel } from '@/viewmodels/InvoiceViewModel';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

export default function EditInvoicePage() {
  const params = useParams();
  const id = params.id as string;
  const { selectInvoice, selectedInvoice, loading, error } = useInvoiceViewModel();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (id && !initialized) {
      selectInvoice(id).then(() => setInitialized(true));
    }
  }, [id, selectInvoice, initialized]);

  if (loading && !initialized) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!selectedInvoice) {
    return <ErrorMessage message="Invoice not found" />;
  }

  if (!selectedInvoice.canEdit) {
    return <ErrorMessage message="This invoice cannot be edited. Only draft invoices can be edited." />;
  }

  return <InvoiceForm invoice={selectedInvoice} mode="edit" />;
}

