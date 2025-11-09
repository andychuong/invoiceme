'use client';

import { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Heading,
  HStack,
  Text,
  VStack,
  Grid,
} from '@chakra-ui/react';
import { useInvoiceViewModel } from '@/viewmodels/InvoiceViewModel';
import { LoadingSkeleton } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';

export default function PaymentsPage() {
  const { invoices, loadInvoices, loading, error } = useInvoiceViewModel();

  useEffect(() => {
    loadInvoices(undefined, 0, 50);
  }, [loadInvoices]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading && invoices.length === 0) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Get all invoices with payments
  const invoicesWithPayments = invoices.filter((invoice) => invoice.balance < invoice.total);

  if (invoicesWithPayments.length === 0) {
    return (
      <VStack gap={4} align="stretch">
        <Heading size="3xl" color="gray.900" fontWeight="bold">Payments</Heading>
        <EmptyState
          title="No payments found"
          description="Payments will appear here when invoices are paid"
        />
      </VStack>
    );
  }

  return (
    <VStack gap={4} align="stretch">
      <Heading size="3xl" color="gray.900" fontWeight="bold">Payments</Heading>
      <VStack gap={4} align="stretch">
        {invoicesWithPayments.map((invoice) => {
          const totalPaid = invoice.total - invoice.balance;
          return (
            <Card.Root key={invoice.id}>
              <Card.Header>
                <HStack justify="space-between">
                  <Box>
                    <Heading size="lg" color="gray.900">Invoice {invoice.invoiceNumber}</Heading>
                    <Text color="gray.600" fontSize="sm" mt={1}>
                      {invoice.customer?.name || `Customer ${invoice.customerId}`} •{' '}
                      {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                    </Text>
                  </Box>
                  <Link href={`/invoices/${invoice.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye size={16} style={{ marginRight: '8px' }} />
                      View Invoice
                    </Button>
                  </Link>
                </HStack>
              </Card.Header>
              <Card.Body>
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>Total</Text>
                    <Text fontSize="lg" fontWeight="semibold">{formatCurrency(invoice.total)}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>Paid</Text>
                    <Text fontSize="lg" fontWeight="semibold" color="green.600">
                      {formatCurrency(totalPaid)}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>Balance</Text>
                    <Text fontSize="lg" fontWeight="semibold" color="red.600">
                      {formatCurrency(invoice.balance)}
                    </Text>
                  </Box>
                </Grid>
              </Card.Body>
            </Card.Root>
          );
        })}
      </VStack>
    </VStack>
  );
}

