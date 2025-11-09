import { Customer as CustomerType } from '@/types';

export class Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;

  constructor(data: CustomerType) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  get displayName(): string {
    return this.name;
  }

  get contactInfo(): string {
    return this.email || this.phone || 'No contact info';
  }
}

