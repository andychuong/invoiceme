import { httpClient } from '../httpClient';
import {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  PaginatedResponse,
} from '@/types';

class CustomerService {
  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    return httpClient.post<Customer>('/customers', data);
  }

  async updateCustomer(id: string, data: UpdateCustomerRequest): Promise<Customer> {
    return httpClient.put<Customer>(`/customers/${id}`, data);
  }

  async deleteCustomer(id: string): Promise<void> {
    return httpClient.delete<void>(`/customers/${id}`);
  }

  async getCustomerById(id: string): Promise<Customer> {
    return httpClient.get<Customer>(`/customers/${id}`);
  }

  async listCustomers(page: number = 0, size: number = 10): Promise<PaginatedResponse<Customer>> {
    return httpClient.get<PaginatedResponse<Customer>>('/customers', {
      params: { page, size },
    });
  }
}

export const customerService = new CustomerService();

