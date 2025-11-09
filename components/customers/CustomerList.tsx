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
} from '@chakra-ui/react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useCustomerViewModel } from '@/viewmodels/CustomerViewModel';
import { LoadingSkeleton } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  DialogActionTrigger,
} from '@chakra-ui/react';
import { toast } from 'sonner';

export function CustomerList() {
  const {
    customers,
    loading,
    error,
    pagination,
    loadCustomers,
    deleteCustomer,
  } = useCustomerViewModel();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCustomers(0, 10);
  }, [loadCustomers]);

  const handleDelete = async (id: string) => {
    setCustomerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    setDeleting(true);
    try {
      await deleteCustomer(customerToDelete);
      toast.success('Customer deleted successfully');
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete customer');
    } finally {
      setDeleting(false);
    }
  };

  const handlePageChange = (page: number) => {
    loadCustomers(page, pagination.size);
  };

  if (loading && customers.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <VStack gap={4} align="stretch">
      <HStack justify="space-between">
        <Heading size="2xl" color="gray.900">
          Customers
          <Box as="span" display="inline-block" w={2} h={2} borderRadius="full" bg="success.500" ml={3} mb={2} />
        </Heading>
        <Link href="/customers/new">
          <Button
            bg="primary.500"
            color="white"
            _hover={{ bg: 'primary.600' }}
            shadow="sm"
          >
            <Plus size={16} style={{ marginRight: '8px' }} />
            Create Customer
          </Button>
        </Link>
      </HStack>

      {error && <ErrorMessage message={error} />}

      {customers.length === 0 && !loading ? (
        <EmptyState
          title="No customers found"
          description="Get started by creating your first customer"
          action={
            <Link href="/customers/new">
              <Button
                bg="primary.500"
                color="white"
                _hover={{ bg: 'primary.600' }}
              >
                <Plus size={16} style={{ marginRight: '8px' }} />
                Create Customer
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
                  <Table.ColumnHeader>Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Email</Table.ColumnHeader>
                  <Table.ColumnHeader>Phone</Table.ColumnHeader>
                  <Table.ColumnHeader>Address</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {customers.map((customer) => (
                  <Table.Row key={customer.id}>
                    <Table.Cell fontWeight="medium">
                      <Link 
                        href={`/customers/${customer.id}`}
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
                        {customer.name}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{customer.email}</Table.Cell>
                    <Table.Cell>{customer.phone}</Table.Cell>
                    <Table.Cell>{customer.address}</Table.Cell>
                    <Table.Cell textAlign="right">
                      <HStack gap={2} justify="flex-end">
                        <Link href={`/customers/${customer.id}/edit`}>
                          <IconButton
                            aria-label="Edit customer"
                            variant="outline"
                            size="sm"
                          >
                            <Edit size={16} />
                          </IconButton>
                        </Link>
                        <IconButton
                          aria-label="Delete customer"
                          variant="solid"
                          colorPalette="red"
                          size="sm"
                          onClick={() => handleDelete(customer.id)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </HStack>
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

      <DialogRoot open={deleteDialogOpen} onOpenChange={(e) => setDeleteDialogOpen(e.open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <DialogBody>
            Are you sure you want to delete this customer? This action cannot be undone.
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogActionTrigger>
            <Button
              colorPalette="red"
              onClick={confirmDelete}
              loading={deleting}
              loadingText="Deleting..."
            >
              Delete
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </VStack>
  );
}
