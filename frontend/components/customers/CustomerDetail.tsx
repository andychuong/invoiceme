'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
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
import { ArrowLeft, Edit, Plus } from 'lucide-react';
import { useCustomerViewModel } from '@/viewmodels/CustomerViewModel';
import { useInvoiceViewModel } from '@/viewmodels/InvoiceViewModel';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { InvoiceStatus } from '@/types';
import { BalanceSummaryCard } from './BalanceSummaryCard';
import { CustomerInvoicesTable } from './CustomerInvoicesTable';

interface CustomerDetailProps {
  customerId: string;
}

export function CustomerDetail({ customerId }: CustomerDetailProps) {
  const { selectCustomer, selectedCustomer, loading: customerLoading } = useCustomerViewModel();
  const { 
    invoices, 
    loading: invoicesLoading, 
    loadInvoicesByCustomer 
  } = useInvoiceViewModel();

  useEffect(() => {
    selectCustomer(customerId);
    loadInvoicesByCustomer(customerId, 0, 100); // Load all invoices for this customer
  }, [customerId, selectCustomer, loadInvoicesByCustomer]);

  // Calculate totals
  const totals = useMemo(() => {
    const totalBalance = invoices.reduce((sum, invoice) => sum + (invoice.balance || 0), 0);
    const totalInvoiced = invoices.reduce((sum, invoice) => sum + (invoice.total || 0), 0);
    const unpaidInvoices = invoices.filter(
      invoice => invoice.balance > 0 && invoice.status !== InvoiceStatus.PAID
    );
    const overdueInvoices = unpaidInvoices.filter(
      invoice => new Date(invoice.dueDate) < new Date()
    );

    return {
      totalBalance,
      totalInvoiced,
      unpaidCount: unpaidInvoices.length,
      overdueCount: overdueInvoices.length,
      hasOutstandingBalance: totalBalance > 0,
    };
  }, [invoices]);

  if (customerLoading && !selectedCustomer) {
    return <LoadingSpinner />;
  }

  if (!selectedCustomer) {
    return <ErrorMessage message="Customer not found" />;
  }

  return (
    <VStack gap={6} align="stretch">
      <HStack justify="space-between">
        <Link href="/customers">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} style={{ marginRight: '8px' }} />
            Back to Customers
          </Button>
        </Link>
        <HStack gap={2}>
          <Link href={`/invoices/new?customerId=${customerId}`}>
            <Button
              bg="primary.500"
              color="white"
              _hover={{ bg: 'primary.600' }}
              size="md"
            >
              <Plus size={16} style={{ marginRight: '8px' }} />
              Create Invoice
            </Button>
          </Link>
          <Link href={`/customers/${customerId}/edit`}>
            <Button variant="outline" size="md">
              <Edit size={16} style={{ marginRight: '8px' }} />
              Edit
            </Button>
          </Link>
        </HStack>
      </HStack>

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
        <Card.Root>
          <Card.Header>
            <Heading size="lg" color="gray.900">Customer Information</Heading>
          </Card.Header>
          <Card.Body>
            <VStack gap={4} align="stretch">
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Name</Text>
                <Text fontSize="xl" fontWeight="bold" color="gray.900">{selectedCustomer.name}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Email</Text>
                <Text fontWeight="medium">{selectedCustomer.email}</Text>
              </Box>
              {selectedCustomer.phone && (
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>Phone</Text>
                  <Text fontWeight="medium">{selectedCustomer.phone}</Text>
                </Box>
              )}
              {selectedCustomer.address && (
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>Address</Text>
                  <Text fontWeight="medium">{selectedCustomer.address}</Text>
                </Box>
              )}
            </VStack>
          </Card.Body>
        </Card.Root>

        <BalanceSummaryCard
          totalInvoiced={totals.totalInvoiced}
          totalBalance={totals.totalBalance}
          unpaidCount={totals.unpaidCount}
          overdueCount={totals.overdueCount}
          hasOutstandingBalance={totals.hasOutstandingBalance}
        />
      </Grid>

      <CustomerInvoicesTable
        invoices={invoices}
        customerId={customerId}
        loading={invoicesLoading}
      />
    </VStack>
  );
}
