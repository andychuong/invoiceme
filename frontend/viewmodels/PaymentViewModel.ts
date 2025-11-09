'use client';

import { useState, useCallback } from 'react';
import { paymentService } from '@/services/api/paymentService';
import { Payment as PaymentModel } from '@/models/Payment';
import { Payment, CreatePaymentRequest } from '@/types';

export function usePaymentViewModel() {
  const [payments, setPayments] = useState<PaymentModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPaymentsForInvoice = useCallback(async (invoiceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response: Payment[] = await paymentService.listPaymentsForInvoice(invoiceId);
      const paymentModels = response.map((p) => new PaymentModel(p));
      setPayments(paymentModels);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load payments';
      setError(errorMessage);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const recordPayment = useCallback(async (data: CreatePaymentRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentService.recordPayment(data);
      const paymentModel = new PaymentModel(response);
      setPayments((prev) => [paymentModel, ...prev]);
      return paymentModel;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to record payment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const validatePaymentAmount = useCallback(
    (amount: number, invoiceBalance: number): boolean => {
      return amount > 0 && amount <= invoiceBalance;
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    payments,
    loading,
    error,
    loadPaymentsForInvoice,
    recordPayment,
    validatePaymentAmount,
    clearError,
  };
}

