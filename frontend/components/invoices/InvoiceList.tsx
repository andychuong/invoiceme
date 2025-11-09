'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Heading,
  HStack,
  Table,
  VStack,
  IconButton,
  Badge,
  createListCollection,
} from '@chakra-ui/react';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@chakra-ui/react';
import { Plus, Eye } from 'lucide-react';
import { useInvoiceViewModel } from '@/viewmodels/InvoiceViewModel';
import { LoadingSkeleton } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { InvoiceStatus } from '@/types';
import { format } from 'date-fns';

export function InvoiceList() {
  const {
    invoices,
    loading,
    error,
    pagination,
    loadInvoices,
  } = useInvoiceViewModel();
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | undefined>(undefined);

  useEffect(() => {
    loadInvoices(statusFilter, 0, 10);
  }, [loadInvoices, statusFilter]);

  const handleStatusFilterChange = (details: { value: string[] }) => {
    const value = details.value[0];
    if (value === 'ALL') {
      setStatusFilter(undefined);
    } else {
      setStatusFilter(value as InvoiceStatus);
    }
    loadInvoices(value === 'ALL' ? undefined : (value as InvoiceStatus), 0, 10);
  };

  const handlePageChange = (page: number) => {
    loadInvoices(statusFilter, page, pagination.size);
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.DRAFT:
        return <Badge colorPalette="gray">Draft</Badge>;
      case InvoiceStatus.SENT:
        return <Badge colorPalette="blue">Sent</Badge>;
      case InvoiceStatus.PAID:
        return <Badge colorPalette="green">Paid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const statusCollection = createListCollection({
    items: [
      { value: 'ALL', label: 'All Statuses' },
      { value: InvoiceStatus.DRAFT, label: 'Draft' },
      { value: InvoiceStatus.SENT, label: 'Sent' },
      { value: InvoiceStatus.PAID, label: 'Paid' },
    ],
  });

  if (loading && invoices.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <VStack gap={4} align="stretch">
      <HStack justify="space-between">
        <Heading size="2xl" color="gray.900">
          Invoices
        </Heading>
        <Link href="/invoices/new">
          <Button
            bg="primary.500"
            color="white"
            _hover={{ bg: 'primary.600' }}
            shadow="sm"
          >
            <Plus size={16} style={{ marginRight: '8px' }} />
            Create Invoice
          </Button>
        </Link>
      </HStack>

      <Box width="180px">
        <SelectRoot
          collection={statusCollection}
          value={[statusFilter || 'ALL']}
          onValueChange={handleStatusFilterChange}
          size="sm"
          positioning={{ 
            placement: 'bottom-start',
            strategy: 'absolute',
            offset: { mainAxis: 4 }
          }}
        >
          <SelectTrigger>
            <SelectValueText placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent 
            position="absolute"
            zIndex={1000}
          >
            {statusCollection.items.map((item) => (
              <SelectItem key={item.value} item={item}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      </Box>

      {error && <ErrorMessage message={error} />}

      {invoices.length === 0 && !loading ? (
        <EmptyState
          title="No invoices found"
          description="Get started by creating your first invoice"
          action={
            <Link href="/invoices/new">
              <Button
                bg="primary.500"
                color="white"
                _hover={{ bg: 'primary.600' }}
              >
                <Plus size={16} style={{ marginRight: '8px' }} />
                Create Invoice
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <Box bg="white" borderRadius="lg" border="1px" borderColor="gray.200" overflow="hidden">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Invoice #</Table.ColumnHeader>
                  <Table.ColumnHeader>Customer</Table.ColumnHeader>
                  <Table.ColumnHeader>Issue Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Due Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Total</Table.ColumnHeader>
                  <Table.ColumnHeader>Balance</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {invoices.map((invoice) => (
                  <Table.Row key={invoice.id}>
                    <Table.Cell fontWeight="medium">{invoice.invoiceNumber}</Table.Cell>
                    <Table.Cell>
                      <Link 
                        href={`/customers/${invoice.customerId}`}
                        style={{ 
                          color: 'inherit', 
                          textDecoration: 'none',
                          cursor: 'pointer',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--chakra-colors-primary-500)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'inherit';
                        }}
                      >
                        {invoice.customerName || invoice.customer?.name || `Customer ${invoice.customerId}`}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{format(new Date(invoice.issueDate), 'MMM dd, yyyy')}</Table.Cell>
                    <Table.Cell>{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</Table.Cell>
                    <Table.Cell>{formatCurrency(invoice.total)}</Table.Cell>
                    <Table.Cell>{formatCurrency(invoice.balance)}</Table.Cell>
                    <Table.Cell>{getStatusBadge(invoice.status)}</Table.Cell>
                    <Table.Cell textAlign="right">
                      <Link href={`/invoices/${invoice.id}`}>
                        <IconButton
                          aria-label="View invoice"
                          variant="ghost"
                          size="sm"
                        >
                          <Eye size={16} />
                        </IconButton>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </VStack>
  );
}
