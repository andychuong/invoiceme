'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  Heading,
  HStack,
  Text,
  Badge,
  Table,
} from '@chakra-ui/react';
import { Plus, Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Invoice, InvoiceStatus } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';

interface CustomerInvoicesTableProps {
  invoices: Invoice[];
  customerId: string;
  loading: boolean;
}

export function CustomerInvoicesTable({ invoices, customerId, loading }: CustomerInvoicesTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const formatCurrency = (amount: number) => {
    const safeAmount = isNaN(amount) || amount === null || amount === undefined ? 0 : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(safeAmount);
  };

  const sortedInvoices = useMemo(() => {
    if (!sortColumn) return invoices;

    return [...invoices].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

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

  return (
    <Card.Root>
      <Card.Header>
        <Heading size="lg" color="gray.900">Invoices</Heading>
        <Text color="gray.600" fontSize="sm" mt={1}>
          {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'} total
        </Text>
      </Card.Header>
      <Card.Body>
        {loading && invoices.length === 0 ? (
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
  );
}

