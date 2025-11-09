'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  Heading,
  HStack,
  Text,
  VStack,
  Badge,
  Table,
  Grid,
} from '@chakra-ui/react';
import { ArrowLeft, Edit, Eye, Plus, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useCustomerViewModel } from '@/viewmodels/CustomerViewModel';
import { useInvoiceViewModel } from '@/viewmodels/InvoiceViewModel';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { InvoiceStatus } from '@/types';
import { format } from 'date-fns';

interface CustomerDetailProps {
  customerId: string;
}

export function CustomerDetail({ customerId }: CustomerDetailProps) {
  const { selectCustomer, selectedCustomer, loading: customerLoading } = useCustomerViewModel();
  const { 
    invoices, 
    loading: invoicesLoading, 
    pagination,
    loadInvoicesByCustomer 
  } = useInvoiceViewModel();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    selectCustomer(customerId);
    loadInvoicesByCustomer(customerId, 0, 100); // Load all invoices for this customer
  }, [customerId, selectCustomer, loadInvoicesByCustomer]);

  const formatCurrency = (amount: number) => {
    const safeAmount = isNaN(amount) || amount === null || amount === undefined ? 0 : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(safeAmount);
  };

  // Sort invoices
  const sortedInvoices = useMemo(() => {
    if (!sortColumn) return invoices;

    return [...invoices].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case 'invoiceNumber':
          aValue = a.invoiceNumber;
          bValue = b.invoiceNumber;
          break;
        case 'issueDate':
          aValue = new Date(a.issueDate).getTime();
          bValue = new Date(b.issueDate).getTime();
          break;
        case 'dueDate':
          aValue = new Date(a.dueDate).getTime();
          bValue = new Date(b.dueDate).getTime();
          break;
        case 'total':
          aValue = a.total || 0;
          bValue = b.total || 0;
          break;
        case 'balance':
          aValue = a.balance || 0;
          bValue = b.balance || 0;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [invoices, sortColumn, sortDirection]);

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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown size={14} style={{ marginLeft: '4px', opacity: 0.5 }} />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} style={{ marginLeft: '4px' }} />
      : <ArrowDown size={14} style={{ marginLeft: '4px' }} />;
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

        <Card.Root>
          <Card.Header>
            <Heading size="lg" color="gray.900">Balance Summary</Heading>
          </Card.Header>
          <Card.Body>
            <VStack gap={4} align="stretch">
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Total Invoiced</Text>
                <Text fontSize="xl" fontWeight="bold">{formatCurrency(totals.totalInvoiced)}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Outstanding Balance</Text>
                <Text 
                  fontSize="2xl" 
                  fontWeight="bold"
                  color={totals.hasOutstandingBalance ? 'red.600' : 'green.600'}
                >
                  {formatCurrency(totals.totalBalance)}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Unpaid Invoices</Text>
                <Text fontWeight="medium">{totals.unpaidCount}</Text>
              </Box>
              {totals.overdueCount > 0 && (
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>Overdue Invoices</Text>
                  <Text fontWeight="medium" color="red.600">{totals.overdueCount}</Text>
                </Box>
              )}
              {totals.hasOutstandingBalance && (
                <Box>
                  <Badge colorPalette="red" size="lg">
                    Outstanding Balance
                  </Badge>
                </Box>
              )}
              {!totals.hasOutstandingBalance && totals.totalInvoiced > 0 && (
                <Box>
                  <Badge colorPalette="green" size="lg">
                    All Paid
                  </Badge>
                </Box>
              )}
            </VStack>
          </Card.Body>
        </Card.Root>
      </Grid>

      <Card.Root>
        <Card.Header>
          <Heading size="lg" color="gray.900">Invoices</Heading>
          <Text color="gray.600" fontSize="sm" mt={1}>
            {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'} total
          </Text>
        </Card.Header>
        <Card.Body>
          {invoicesLoading && invoices.length === 0 ? (
            <LoadingSpinner />
          ) : invoices.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Text color="gray.500">No invoices found for this customer</Text>
              <Link href={`/invoices/new?customerId=${customerId}`}>
                <Button
                  mt={4}
                  bg="primary.500"
                  color="white"
                  _hover={{ bg: 'primary.600' }}
                >
                  <Plus size={16} style={{ marginRight: '8px' }} />
                  Create Invoice
                </Button>
              </Link>
            </Box>
          ) : (
            <Box bg="white" borderRadius="lg" border="1px" borderColor="gray.200" overflow="hidden">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>
                      <HStack 
                        gap={1} 
                        cursor="pointer" 
                        onClick={() => handleSort('invoiceNumber')}
                        _hover={{ color: 'primary.500' }}
                      >
                        <Text>Invoice #</Text>
                        {getSortIcon('invoiceNumber')}
                      </HStack>
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>
                      <HStack 
                        gap={1} 
                        cursor="pointer" 
                        onClick={() => handleSort('issueDate')}
                        _hover={{ color: 'primary.500' }}
                      >
                        <Text>Issue Date</Text>
                        {getSortIcon('issueDate')}
                      </HStack>
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>
                      <HStack 
                        gap={1} 
                        cursor="pointer" 
                        onClick={() => handleSort('dueDate')}
                        _hover={{ color: 'primary.500' }}
                      >
                        <Text>Due Date</Text>
                        {getSortIcon('dueDate')}
                      </HStack>
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">
                      <HStack 
                        gap={1} 
                        cursor="pointer" 
                        onClick={() => handleSort('total')}
                        _hover={{ color: 'primary.500' }}
                        justify="flex-end"
                      >
                        <Text>Total</Text>
                        {getSortIcon('total')}
                      </HStack>
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">
                      <HStack 
                        gap={1} 
                        cursor="pointer" 
                        onClick={() => handleSort('balance')}
                        _hover={{ color: 'primary.500' }}
                        justify="flex-end"
                      >
                        <Text>Balance</Text>
                        {getSortIcon('balance')}
                      </HStack>
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>
                      <HStack 
                        gap={1} 
                        cursor="pointer" 
                        onClick={() => handleSort('status')}
                        _hover={{ color: 'primary.500' }}
                      >
                        <Text>Status</Text>
                        {getSortIcon('status')}
                      </HStack>
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sortedInvoices.map((invoice) => {
                    const isOverdue = invoice.balance > 0 && 
                                     invoice.status !== InvoiceStatus.PAID &&
                                     new Date(invoice.dueDate) < new Date();
                    
                    return (
                      <Table.Row key={invoice.id}>
                        <Table.Cell fontWeight="medium">{invoice.invoiceNumber}</Table.Cell>
                        <Table.Cell>{format(new Date(invoice.issueDate), 'MMM dd, yyyy')}</Table.Cell>
                        <Table.Cell>
                          <Text color={isOverdue ? 'red.600' : 'inherit'}>
                            {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                            {isOverdue && ' (Overdue)'}
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="right">{formatCurrency(invoice.total)}</Table.Cell>
                        <Table.Cell textAlign="right">
                          <Text 
                            fontWeight={invoice.balance > 0 ? 'bold' : 'normal'}
                            color={invoice.balance > 0 ? 'red.600' : 'green.600'}
                          >
                            {formatCurrency(invoice.balance)}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>{getStatusBadge(invoice.status)}</Table.Cell>
                        <Table.Cell textAlign="right">
                          <Link href={`/invoices/${invoice.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye size={16} style={{ marginRight: '4px' }} />
                              View
                            </Button>
                          </Link>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            </Box>
          )}
        </Card.Body>
      </Card.Root>
    </VStack>
  );
}

