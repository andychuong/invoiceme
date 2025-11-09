'use client';

import { useEffect } from 'react';
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
import { Edit, Send, ArrowLeft } from 'lucide-react';
import { useInvoiceViewModel } from '@/viewmodels/InvoiceViewModel';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { PaymentList } from '@/components/payments/PaymentList';
import { usePaymentViewModel } from '@/viewmodels/PaymentViewModel';
import { InvoiceStatus } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface InvoiceDetailProps {
  invoiceId: string;
}

export function InvoiceDetail({ invoiceId }: InvoiceDetailProps) {
  const { selectInvoice, selectedInvoice, markAsSent, loading } = useInvoiceViewModel();
  const { loadPaymentsForInvoice, payments } = usePaymentViewModel();

  useEffect(() => {
    selectInvoice(invoiceId);
    loadPaymentsForInvoice(invoiceId);
  }, [invoiceId, selectInvoice, loadPaymentsForInvoice]);

  const handleMarkAsSent = async () => {
    try {
      await markAsSent(invoiceId);
      toast.success('Invoice marked as sent');
      await selectInvoice(invoiceId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark invoice as sent';
      toast.error(errorMessage);
    }
  };

  const handlePaymentRecorded = () => {
    selectInvoice(invoiceId);
    loadPaymentsForInvoice(invoiceId);
  };

  if (loading && !selectedInvoice) {
    return <LoadingSpinner />;
  }

  if (!selectedInvoice) {
    return <ErrorMessage message="Invoice not found" />;
  }

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
    // Handle NaN, null, or undefined values
    const safeAmount = isNaN(amount) || amount === null || amount === undefined ? 0 : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(safeAmount);
  };

  return (
    <VStack gap={6} align="stretch">
      <HStack justify="space-between">
        <HStack gap={4}>
          <Link href="/invoices">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} style={{ marginRight: '8px' }} />
              Back to Invoices
            </Button>
          </Link>
          <Heading size="3xl" color="gray.900" fontWeight="bold">
            Invoice {selectedInvoice.invoiceNumber}
          </Heading>
        </HStack>
        <HStack gap={2}>
          {selectedInvoice.canEdit && (
            <Link href={`/invoices/${invoiceId}/edit`}>
              <Button variant="outline" size="md">
                <Edit size={16} style={{ marginRight: '8px' }} />
                Edit
              </Button>
            </Link>
          )}
          {selectedInvoice.canMarkAsSent && (
            <Button
              onClick={handleMarkAsSent}
              bg="primary.500"
              color="white"
              _hover={{ bg: 'primary.600' }}
              size="md"
            >
              <Send size={16} style={{ marginRight: '8px' }} />
              Mark as Sent
            </Button>
          )}
        </HStack>
      </HStack>

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
        <Card.Root>
          <Card.Header>
            <Heading size="lg" color="gray.900">Invoice Details</Heading>
          </Card.Header>
          <Card.Body>
            <VStack gap={4} align="stretch">
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Status</Text>
                <Box>{getStatusBadge(selectedInvoice.status)}</Box>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Customer</Text>
                <Text fontWeight="medium">
                  <Link 
                    href={`/customers/${selectedInvoice.customerId}`}
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
                    {selectedInvoice.customerName || selectedInvoice.customer?.name || `Customer ${selectedInvoice.customerId}`}
                  </Link>
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Issue Date</Text>
                <Text fontWeight="medium">
                  {format(new Date(selectedInvoice.issueDate), 'MMMM dd, yyyy')}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Due Date</Text>
                <Text fontWeight="medium">
                  {format(new Date(selectedInvoice.dueDate), 'MMMM dd, yyyy')}
                </Text>
              </Box>
            </VStack>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Heading size="lg" color="gray.900">Totals</Heading>
          </Card.Header>
          <Card.Body>
            <VStack gap={4} align="stretch">
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Subtotal</Text>
                <Text fontWeight="medium">{formatCurrency(selectedInvoice.subtotal)}</Text>
              </Box>
              {selectedInvoice.tax && selectedInvoice.tax > 0 && (
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>Tax</Text>
                  <Text fontWeight="medium">{formatCurrency(selectedInvoice.tax)}</Text>
                </Box>
              )}
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Total</Text>
                <Text fontSize="2xl" fontWeight="bold">{formatCurrency(selectedInvoice.total)}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Balance</Text>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={selectedInvoice.balance > 0 ? 'red.600' : 'green.600'}
                >
                  {formatCurrency(selectedInvoice.balance)}
                </Text>
              </Box>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Grid>

      <Card.Root>
        <Card.Header>
          <Heading size="lg" color="gray.900">Line Items</Heading>
        </Card.Header>
        <Card.Body>
          <Box bg="white" borderRadius="lg" border="1px" borderColor="gray.200" overflow="hidden">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Description</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Quantity</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Unit Price</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Amount</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {selectedInvoice.lineItems.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{item.description}</Table.Cell>
                    <Table.Cell textAlign="right">{item.quantity}</Table.Cell>
                    <Table.Cell textAlign="right">{formatCurrency(item.unitPrice)}</Table.Cell>
                    <Table.Cell textAlign="right">{formatCurrency(item.amount)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Card.Body>
      </Card.Root>

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
        <Card.Root>
          <Card.Header>
            <Heading size="lg" color="gray.900">Record Payment</Heading>
            <Text color="gray.600" fontSize="sm" mt={1}>
              Record a payment for this invoice. Balance: {formatCurrency(selectedInvoice.balance)}
            </Text>
          </Card.Header>
          <Card.Body>
            <PaymentForm
              invoiceId={invoiceId}
              invoiceBalance={selectedInvoice.balance}
              onPaymentRecorded={handlePaymentRecorded}
            />
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Heading size="lg" color="gray.900">Payment History</Heading>
            <Text color="gray.600" fontSize="sm" mt={1}>
              All payments recorded for this invoice
            </Text>
          </Card.Header>
          <Card.Body>
            <PaymentList payments={payments} />
          </Card.Body>
        </Card.Root>
      </Grid>
    </VStack>
  );
}

