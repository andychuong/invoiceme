'use client';

import { useState, useCallback } from 'react';
import { invoiceService } from '@/services/api/invoiceService';
import { Invoice as InvoiceModel } from '@/models/Invoice';
import {
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceStatus,
  PaginatedResponse,
  LineItem,
} from '@/types';

export function useInvoiceViewModel() {
  const [invoices, setInvoices] = useState<InvoiceModel[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceModel | null>(null);
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

  const loadInvoices = useCallback(
    async (status?: InvoiceStatus, page: number = 0, size: number = 10) => {
      setLoading(true);
      setError(null);
      try {
        const response: PaginatedResponse<Invoice> = status
          ? await invoiceService.listInvoicesByStatus(status, page, size)
          : await invoiceService.listInvoices(page, size);
        const invoiceModels = response.content.map((i) => new InvoiceModel(i));
        setInvoices(invoiceModels);
        setPagination({
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          currentPage: response.number,
          size: response.size,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load invoices');
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadInvoicesByCustomer = useCallback(
    async (customerId: string, page: number = 0, size: number = 10) => {
      setLoading(true);
      setError(null);
      try {
        const response: PaginatedResponse<Invoice> =
          await invoiceService.listInvoicesByCustomer(customerId, page, size);
        const invoiceModels = response.content.map((i) => new InvoiceModel(i));
        setInvoices(invoiceModels);
        setPagination({
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          currentPage: response.number,
          size: response.size,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load invoices');
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createInvoice = useCallback(async (data: CreateInvoiceRequest) => {
    setLoading(true);
    setError(null);
    try {
      // Backend will calculate amounts for line items
      const response = await invoiceService.createInvoice(data);
      const invoiceModel = new InvoiceModel(response);
      setInvoices((prev) => [invoiceModel, ...prev]);
      return invoiceModel;
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInvoice = useCallback(async (id: string, data: UpdateInvoiceRequest) => {
    setLoading(true);
    setError(null);
    try {
      // Backend will calculate amounts for line items if provided
      const response = await invoiceService.updateInvoice(id, data);
      const invoiceModel = new InvoiceModel(response);
      setInvoices((prev) => prev.map((i) => (i.id === id ? invoiceModel : i)));
      if (selectedInvoice?.id === id) {
        setSelectedInvoice(invoiceModel);
      }
      return invoiceModel;
    } catch (err: any) {
      setError(err.message || 'Failed to update invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedInvoice]);

  const markAsSent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await invoiceService.markInvoiceAsSent(id);
      const invoiceModel = new InvoiceModel(response);
      setInvoices((prev) => prev.map((i) => (i.id === id ? invoiceModel : i)));
      if (selectedInvoice?.id === id) {
        setSelectedInvoice(invoiceModel);
      }
      return invoiceModel;
    } catch (err: any) {
      setError(err.message || 'Failed to mark invoice as sent');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedInvoice]);

  const selectInvoice = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await invoiceService.getInvoiceById(id);
      const invoiceModel = new InvoiceModel(response);
      setSelectedInvoice(invoiceModel);
      return invoiceModel;
    } catch (err: any) {
      setError(err.message || 'Failed to load invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateTotal = useCallback((lineItems: LineItem[]): number => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    return subtotal;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    invoices,
    selectedInvoice,
    loading,
    error,
    pagination,
    loadInvoices,
    loadInvoicesByCustomer,
    createInvoice,
    updateInvoice,
    markAsSent,
    selectInvoice,
    calculateTotal,
    clearError,
  };
}

