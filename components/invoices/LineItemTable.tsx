'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Input,
  Table,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Trash2 } from 'lucide-react';
import { LineItem } from '@/types';

interface LineItemTableProps {
  lineItems: LineItem[];
  onLineItemsChange: (items: LineItem[]) => void;
  errors?: Record<number, Record<string, string>>;
}

export function LineItemTable({ lineItems, onLineItemsChange, errors }: LineItemTableProps) {
  const addLineItem = () => {
    const newItem: LineItem = {
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };
    onLineItemsChange([...lineItems, newItem]);
  };

  const removeLineItem = (index: number) => {
    onLineItemsChange(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };

    // Recalculate amount
    if (field === 'quantity' || field === 'unitPrice') {
      updated[index].amount = updated[index].quantity * updated[index].unitPrice;
    }

    onLineItemsChange(updated);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  return (
    <VStack gap={4} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg" color="gray.900">Line Items</Heading>
        <Button
          type="button"
          variant="outline"
          onClick={addLineItem}
          size="md"
        >
          Add Line Item
        </Button>
      </HStack>

      <Box border="1px" borderColor="gray.200" borderRadius="lg" overflow="hidden">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="40%">Description</Table.ColumnHeader>
              <Table.ColumnHeader w="15%">Quantity</Table.ColumnHeader>
              <Table.ColumnHeader w="15%">Unit Price</Table.ColumnHeader>
              <Table.ColumnHeader w="15%">Amount</Table.ColumnHeader>
              <Table.ColumnHeader w="15%" textAlign="right">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {lineItems.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={5} textAlign="center" color="gray.500" py={8}>
                  No line items. Click "Add Line Item" to add one.
                </Table.Cell>
              </Table.Row>
            ) : (
              lineItems.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <VStack gap={1} align="stretch">
                      <Input
                        value={item.description}
                        onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                        placeholder="Item description"
                        size="sm"
                        borderColor={errors?.[index]?.description ? 'red.500' : undefined}
                      />
                      {errors?.[index]?.description && (
                        <Text fontSize="xs" color="red.500">{errors[index].description}</Text>
                      )}
                    </VStack>
                  </Table.Cell>
                  <Table.Cell>
                    <VStack gap={1} align="stretch">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) =>
                          updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)
                        }
                        size="sm"
                        borderColor={errors?.[index]?.quantity ? 'red.500' : undefined}
                      />
                      {errors?.[index]?.quantity && (
                        <Text fontSize="xs" color="red.500">{errors[index].quantity}</Text>
                      )}
                    </VStack>
                  </Table.Cell>
                  <Table.Cell>
                    <VStack gap={1} align="stretch">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)
                        }
                        size="sm"
                        borderColor={errors?.[index]?.unitPrice ? 'red.500' : undefined}
                      />
                      {errors?.[index]?.unitPrice && (
                        <Text fontSize="xs" color="red.500">{errors[index].unitPrice}</Text>
                      )}
                    </VStack>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontWeight="medium">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(item.amount)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <IconButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label="Remove line item"
                      onClick={() => removeLineItem(index)}
                      colorPalette="red"
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      <Box display="flex" justifyContent="flex-end">
        <Text fontSize="sm" color="gray.600">
          Subtotal: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(calculateSubtotal())}
        </Text>
      </Box>
    </VStack>
  );
}

