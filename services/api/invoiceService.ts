import { httpClient } from '../httpClient';
import {
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  PaginatedResponse,
} from '@/types';

class InvoiceService {
  async createInvoice(data: CreateInvoiceRequest): Promise<Invoice> {
    return httpClient.post<Invoice>('/invoices', data);
  }

  async updateInvoice(id: string, data: UpdateInvoiceRequest): Promise<Invoice> {
    return httpClient.put<Invoice>(`/invoices/${id}`, data);
  }

  async markInvoiceAsSent(id: string): Promise<Invoice> {
    return httpClient.patch<Invoice>(`/invoices/${id}/mark-sent`);
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    return httpClient.get<Invoice>(`/invoices/${id}`);
  }

  async listInvoices(page: number = 0, size: number = 10): Promise<PaginatedResponse<Invoice>> {
    return httpClient.get<PaginatedResponse<Invoice>>('/invoices', {
      params: { page, size },
    });
  }

  async listInvoicesByStatus(
    status: string, // DRAFT, SENT, PAID
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<Invoice>> {
    return httpClient.get<PaginatedResponse<Invoice>>('/invoices', {
      params: { status, page, size },
    });
  }

  async listInvoicesByCustomer(
    customerId: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<Invoice>> {
    return httpClient.get<PaginatedResponse<Invoice>>(`/invoices/customers/${customerId}`, {
      params: { page, size },
    });
  }
}

export const invoiceService = new InvoiceService();

