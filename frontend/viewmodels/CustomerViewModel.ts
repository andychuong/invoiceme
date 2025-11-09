'use client';

import { useState, useCallback } from 'react';
import { customerService } from '@/services/api/customerService';
import { Customer as CustomerModel } from '@/models/Customer';
import {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  PaginatedResponse,
} from '@/types';

export function useCustomerViewModel() {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
  }>({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    size: 10,
  });

  const loadCustomers = useCallback(async (page: number = 0, size: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Customer> = await customerService.listCustomers(page, size);
      const customerModels = response.content.map((c) => new CustomerModel(c));
      setCustomers(customerModels);
      setPagination({
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        currentPage: response.number,
        size: response.size,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load customers';
      setError(errorMessage);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCustomer = useCallback(async (data: CreateCustomerRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerService.createCustomer(data);
      const customerModel = new CustomerModel(response);
      setCustomers((prev) => [customerModel, ...prev]);
      return customerModel;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create customer';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCustomer = useCallback(async (id: string, data: UpdateCustomerRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerService.updateCustomer(id, data);
      const customerModel = new CustomerModel(response);
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? customerModel : c))
      );
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(customerModel);
      }
      return customerModel;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update customer';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedCustomer]);

  const deleteCustomer = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await customerService.deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete customer';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedCustomer]);

  const selectCustomer = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerService.getCustomerById(id);
      const customerModel = new CustomerModel(response);
      setSelectedCustomer(customerModel);
      return customerModel;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load customer';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    customers,
    selectedCustomer,
    loading,
    error,
    pagination,
    loadCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    selectCustomer,
    clearError,
  };
}

