import { httpClient } from '../httpClient';
import { Payment, CreatePaymentRequest } from '@/types';

class PaymentService {
  async recordPayment(data: CreatePaymentRequest): Promise<Payment> {
    return httpClient.post<Payment>('/payments', data);
  }

  async getPaymentById(id: string): Promise<Payment> {
    return httpClient.get<Payment>(`/payments/${id}`);
  }

  async listPaymentsForInvoice(invoiceId: string): Promise<Payment[]> {
    return httpClient.get<Payment[]>(`/invoices/${invoiceId}/payments`);
  }
}

export const paymentService = new PaymentService();

