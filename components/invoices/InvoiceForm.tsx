'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Box,
  Button,
  Card,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
  Field,
  NativeSelectRoot,
  NativeSelectField,
} from '@chakra-ui/react';
import { useInvoiceViewModel } from '@/viewmodels/InvoiceViewModel';
import { useCustomerViewModel } from '@/viewmodels/CustomerViewModel';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LineItemTable } from './LineItemTable';
import { CreateInvoiceRequest, UpdateInvoiceRequest, Invoice, LineItem } from '@/types';
import { format } from 'date-fns';

const invoiceSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  tax: z.number().min(0).optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  invoice?: Invoice;
  mode: 'create' | 'edit';
  defaultCustomerId?: string;
}

export function InvoiceForm({ invoice, mode, defaultCustomerId }: InvoiceFormProps) {
  const router = useRouter();
  const { createInvoice, updateInvoice, loading } = useInvoiceViewModel();
  const { customers, loadCustomers } = useCustomerViewModel();
  const [lineItems, setLineItems] = useState<LineItem[]>(
    invoice?.lineItems || [
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ]
  );
  const [lineItemErrors, setLineItemErrors] = useState<Record<number, Record<string, string>>>(
    {}
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerId: invoice?.customerId || defaultCustomerId || '',
      issueDate: invoice
        ? format(new Date(invoice.issueDate), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      dueDate: invoice
        ? format(new Date(invoice.dueDate), 'yyyy-MM-dd')
        : format(new Date(new Date().setDate(new Date().getDate() + 30)), 'yyyy-MM-dd'),
      tax: invoice?.tax || 0,
    },
  });

  useEffect(() => {
    loadCustomers(0, 100);
  }, [loadCustomers]);

  useEffect(() => {
    if (invoice) {
      setValue('customerId', invoice.customerId);
      setValue('issueDate', format(new Date(invoice.issueDate), 'yyyy-MM-dd'));
      setValue('dueDate', format(new Date(invoice.dueDate), 'yyyy-MM-dd'));
      setValue('tax', invoice.tax || 0);
      setLineItems(invoice.lineItems);
    } else if (defaultCustomerId && mode === 'create') {
      setValue('customerId', defaultCustomerId);
    }
  }, [invoice, defaultCustomerId, mode, setValue]);

  const validateLineItems = (): boolean => {
    const errors: Record<number, Record<string, string>> = {};
    let isValid = true;

    if (lineItems.length === 0) {
      toast.error('At least one line item is required');
      return false;
    }

    lineItems.forEach((item, index) => {
      const itemErrors: Record<string, string> = {};
      if (!item.description || item.description.trim() === '') {
        itemErrors.description = 'Description is required';
        isValid = false;
      }
      if (item.quantity <= 0) {
        itemErrors.quantity = 'Quantity must be greater than 0';
        isValid = false;
      }
      if (item.unitPrice < 0) {
        itemErrors.unitPrice = 'Unit price must be greater than or equal to 0';
        isValid = false;
      }
      if (Object.keys(itemErrors).length > 0) {
        errors[index] = itemErrors;
      }
    });

    setLineItemErrors(errors);
    return isValid;
  };

  const onSubmit = async (values: InvoiceFormValues) => {
    if (!validateLineItems()) {
      return;
    }

    try {
      // Prepare line items without id and amount (will be calculated on backend)
      const lineItemsData = lineItems.map(({ id, amount, ...rest }) => ({
        description: rest.description,
        quantity: rest.quantity,
        unitPrice: rest.unitPrice,
      }));
      const requestData = {
        ...values,
        lineItems: lineItemsData,
        tax: values.tax || 0,
      };

      if (mode === 'create') {
        await createInvoice(requestData as CreateInvoiceRequest);
        toast.success('Invoice created successfully');
        router.push('/invoices');
      } else if (invoice) {
        await updateInvoice(invoice.id, requestData as UpdateInvoiceRequest);
        toast.success('Invoice updated successfully');
        router.push(`/invoices/${invoice.id}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save invoice');
    }
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = watch('tax') || 0;
    return subtotal + tax;
  };


  return (
    <Box display="flex" justifyContent="center" w="full">
      <Card.Root maxW="4xl" w="full">
        <Card.Header pb={2} borderBottom="1px" borderColor="gray.100">
          <HStack>
            <Box w={1} h={8} bg="primary.500" borderRadius="sm" />
            <Box>
              <Heading size="xl" color="gray.900">
                {mode === 'create' ? 'Create Invoice' : 'Edit Invoice'}
              </Heading>
              <Text color="gray.600" fontSize="sm" mt={1}>
                {mode === 'create'
                  ? 'Create a new invoice with line items'
                  : 'Update invoice information'}
              </Text>
            </Box>
          </HStack>
        </Card.Header>
        <Card.Body pt={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={6} align="stretch">
              <Box display="grid" gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                <Field.Root invalid={!!errors.customerId} required>
                  <Field.Label fontWeight="medium" fontSize="sm">Customer</Field.Label>
                  <NativeSelectRoot size="md">
                    <NativeSelectField
                      {...register('customerId')}
                      placeholder="Select a customer"
                    >
                      <option value="" disabled>Select a customer</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                  <Field.ErrorText>{errors.customerId?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.issueDate} required>
                  <Field.Label fontWeight="medium" fontSize="sm">Issue Date</Field.Label>
                  <Input
                    type="date"
                    size="md"
                    {...register('issueDate')}
                  />
                  <Field.ErrorText>{errors.issueDate?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.dueDate} required>
                  <Field.Label fontWeight="medium" fontSize="sm">Due Date</Field.Label>
                  <Input
                    type="date"
                    size="md"
                    {...register('dueDate')}
                  />
                  <Field.ErrorText>{errors.dueDate?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.tax}>
                  <Field.Label fontWeight="medium" fontSize="sm">Tax Amount</Field.Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    size="md"
                    {...register('tax', { valueAsNumber: true })}
                  />
                  <Field.ErrorText>{errors.tax?.message}</Field.ErrorText>
                </Field.Root>
              </Box>

              <LineItemTable
                lineItems={lineItems}
                onLineItemsChange={setLineItems}
                errors={lineItemErrors}
              />

              <Box borderTop="1px" borderColor="gray.200" pt={4}>
                <Box display="flex" justifyContent="flex-end">
                  <Box w="full" maxW="md">
                    <VStack gap={2} align="stretch">
                      <HStack justify="space-between" fontSize="sm">
                        <Text color="gray.600">Subtotal:</Text>
                        <Text fontWeight="medium">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(calculateSubtotal())}
                        </Text>
                      </HStack>
                      <HStack justify="space-between" fontSize="sm">
                        <Text color="gray.600">Tax:</Text>
                        <Text fontWeight="medium">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(watch('tax') || 0)}
                        </Text>
                      </HStack>
                      <Box borderTop="1px" borderColor="gray.200" pt={2}>
                        <HStack justify="space-between" fontSize="lg" fontWeight="bold">
                          <Text>Total:</Text>
                          <Text>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            }).format(calculateTotal())}
                          </Text>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>
                </Box>
              </Box>

              <Box display="flex" gap={3} justifyContent="flex-end" pt={4} borderTop="1px" borderColor="gray.200">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                  size="md"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  bg="primary.500"
                  color="white"
                  _hover={{ bg: 'primary.600' }}
                  loading={loading}
                  loadingText={mode === 'create' ? 'Creating...' : 'Updating...'}
                  size="md"
                >
                  {mode === 'create' ? 'Create Invoice' : 'Update Invoice'}
                </Button>
              </Box>
            </VStack>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

