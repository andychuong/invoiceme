'use client';

import {
  Box,
  Table,
} from '@chakra-ui/react';
import { Payment as PaymentModel } from '@/models/Payment';
import { format } from 'date-fns';
import { EmptyState } from '@/components/common/EmptyState';

interface PaymentListProps {
  payments: PaymentModel[];
}

export function PaymentList({ payments }: PaymentListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPaymentMethod = (method: string) => {
    return method.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (payments.length === 0) {
    return <EmptyState title="No payments recorded" description="Payments will appear here" />;
  }

  return (
    <Box border="1px" borderColor="gray.200" borderRadius="lg" overflow="hidden">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Date</Table.ColumnHeader>
            <Table.ColumnHeader>Amount</Table.ColumnHeader>
            <Table.ColumnHeader>Method</Table.ColumnHeader>
            <Table.ColumnHeader>Reference</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {payments.map((payment) => (
            <Table.Row key={payment.id}>
              <Table.Cell>{format(new Date(payment.paymentDate), 'MMM dd, yyyy')}</Table.Cell>
              <Table.Cell fontWeight="medium">{formatCurrency(payment.amount)}</Table.Cell>
              <Table.Cell>{formatPaymentMethod(payment.paymentMethod)}</Table.Cell>
              <Table.Cell>{payment.referenceNumber || '-'}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}

