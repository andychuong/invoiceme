'use client';

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
  Textarea,
  VStack,
  Field,
} from '@chakra-ui/react';
import { useCustomerViewModel } from '@/viewmodels/CustomerViewModel';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Customer } from '@/types';

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  customer?: Customer;
  mode: 'create' | 'edit';
}

export function CustomerForm({ customer, mode }: CustomerFormProps) {
  const router = useRouter();
  const { createCustomer, updateCustomer, loading } = useCustomerViewModel();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        address: customer.address || '',
      });
    }
  }, [customer, reset]);

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      if (mode === 'create') {
        await createCustomer(values);
        toast.success('Customer created successfully');
        router.push('/customers');
      } else if (customer) {
        await updateCustomer(customer.id, values);
        toast.success('Customer updated successfully');
        router.push('/customers');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save customer';
      toast.error(errorMessage);
    }
  };

  return (
    <Box display="flex" justifyContent="center" w="full">
      <Card.Root maxW="2xl" w="full">
        <Card.Header pb={2} borderBottom="1px" borderColor="gray.100">
          <HStack>
            <Box w={1} h={8} bg="primary.500" borderRadius="sm" />
            <Box>
              <Heading size="xl" color="gray.900">
                {mode === 'create' ? 'Create Customer' : 'Edit Customer'}
              </Heading>
              <Text color="gray.600" fontSize="sm" mt={1}>
                {mode === 'create'
                  ? 'Add a new customer to your system'
                  : 'Update customer information'}
              </Text>
            </Box>
          </HStack>
        </Card.Header>
        <Card.Body pt={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={5} align="stretch">
              <Field.Root invalid={!!errors.name} required>
                <Field.Label fontWeight="medium" fontSize="sm">Name</Field.Label>
                <Input 
                  placeholder="Enter customer name" 
                  size="md"
                  {...register('name')} 
                />
                <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.email} required>
                <Field.Label fontWeight="medium" fontSize="sm">Email</Field.Label>
                <Input
                  type="email"
                  placeholder="customer@example.com"
                  size="md"
                  {...register('email')}
                />
                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.phone}>
                <Field.Label fontWeight="medium" fontSize="sm">Phone</Field.Label>
                <Input 
                  placeholder="(555) 123-4567" 
                  size="md"
                  {...register('phone')} 
                />
                <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.address}>
                <Field.Label fontWeight="medium" fontSize="sm">Address</Field.Label>
                <Textarea
                  placeholder="123 Main St, City, State 12345"
                  rows={3}
                  {...register('address')}
                />
                <Field.ErrorText>{errors.address?.message}</Field.ErrorText>
              </Field.Root>

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
                  {mode === 'create' ? 'Create Customer' : 'Update Customer'}
                </Button>
              </Box>
            </VStack>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
