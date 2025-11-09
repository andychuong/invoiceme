'use client';

import { Box, Badge, Card, Heading, Text, VStack } from '@chakra-ui/react';

interface BalanceSummaryCardProps {
  totalInvoiced: number;
  totalBalance: number;
  unpaidCount: number;
  overdueCount: number;
  hasOutstandingBalance: boolean;
}

export function BalanceSummaryCard({
  totalInvoiced,
  totalBalance,
  unpaidCount,
  overdueCount,
  hasOutstandingBalance,
}: BalanceSummaryCardProps) {
  const formatCurrency = (amount: number) => {
    const safeAmount = isNaN(amount) || amount === null || amount === undefined ? 0 : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(safeAmount);
  };

  return (
    <Card.Root>
      <Card.Header>
        <Heading size="lg" color="gray.900">Balance Summary</Heading>
      </Card.Header>
      <Card.Body>
        <VStack gap={4} align="stretch">
          <Box>
            <Text fontSize="sm" color="gray.600" mb={1}>Total Invoiced</Text>
            <Text fontSize="xl" fontWeight="bold">{formatCurrency(totalInvoiced)}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600" mb={1}>Outstanding Balance</Text>
            <Text 
              fontSize="2xl" 
              fontWeight="bold"
              color={hasOutstandingBalance ? 'red.600' : 'green.600'}
            >
              {formatCurrency(totalBalance)}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600" mb={1}>Unpaid Invoices</Text>
            <Text fontWeight="medium">{unpaidCount}</Text>
          </Box>
          {overdueCount > 0 && (
            <Box>
              <Text fontSize="sm" color="gray.600" mb={1}>Overdue Invoices</Text>
              <Text fontWeight="medium" color="red.600">{overdueCount}</Text>
            </Box>
          )}
          {hasOutstandingBalance && (
            <Box>
              <Badge colorPalette="red" size="lg">
                Outstanding Balance
              </Badge>
            </Box>
          )}
          {!hasOutstandingBalance && totalInvoiced > 0 && (
            <Box>
              <Badge colorPalette="green" size="lg">
                All Paid
              </Badge>
            </Box>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

