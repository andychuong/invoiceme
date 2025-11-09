'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { useCustomerViewModel } from '@/viewmodels/CustomerViewModel';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

export default function EditCustomerPage() {
  const params = useParams();
  const id = params.id as string;
  const { selectCustomer, selectedCustomer, loading, error } = useCustomerViewModel();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (id && !initialized) {
      selectCustomer(id).then(() => setInitialized(true));
    }
  }, [id, selectCustomer, initialized]);

  if (loading && !initialized) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!selectedCustomer) {
    return <ErrorMessage message="Customer not found" />;
  }

  return <CustomerForm customer={selectedCustomer} mode="edit" />;
}

