import { Payment as PaymentType, PaymentMethod } from '@/types';

export class Payment {
  id: string;
  invoiceId: string;
  invoice?: any;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
  createdAt?: string;

  constructor(data: PaymentType) {
    this.id = data.id;
    this.invoiceId = data.invoiceId;
    this.invoice = data.invoice;
    this.amount = data.amount;
    this.paymentDate = data.paymentDate;
    this.paymentMethod = data.paymentMethod;
    this.referenceNumber = data.referenceNumber;
    this.notes = data.notes;
    this.createdAt = data.createdAt;
  }

  get displayMethod(): string {
    return this.paymentMethod.replace('_', ' ');
  }

  get formattedAmount(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(this.amount);
  }
}

