import { Invoice as InvoiceType, InvoiceStatus, LineItem as LineItemType, Customer } from '@/types';

export class Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName?: string;
  customer?: Customer;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  lineItems: LineItemType[];
  subtotal: number;
  tax?: number;
  total: number;
  balance: number;
  createdAt?: string;
  updatedAt?: string;

  constructor(data: InvoiceType) {
    this.id = data.id;
    this.invoiceNumber = data.invoiceNumber;
    this.customerId = data.customerId;
    this.customerName = data.customerName;
    this.customer = data.customer;
    // If customerName is provided but customer object is not, create a minimal customer object
    if (this.customerName && !this.customer) {
      this.customer = { name: this.customerName, id: this.customerId };
    }
    this.status = data.status;
    this.issueDate = data.issueDate;
    this.dueDate = data.dueDate;
    
    // Ensure line items have calculated amounts
    this.lineItems = data.lineItems.map(item => ({
      ...item,
      amount: item.amount || (item.quantity * item.unitPrice)
    }));
    
    // Calculate subtotal from line items if it's NaN or invalid
    const calculatedSubtotal = this.lineItems.reduce((sum, item) => {
      const amount = item.amount || (item.quantity * item.unitPrice);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    this.subtotal = (isNaN(data.subtotal) || data.subtotal === null || data.subtotal === undefined) 
      ? calculatedSubtotal 
      : data.subtotal;
    
    this.tax = data.tax || 0;
    
    // Calculate total from subtotal + tax if it's NaN or invalid
    const calculatedTotal = this.subtotal + (this.tax || 0);
    this.total = (isNaN(data.total) || data.total === null || data.total === undefined)
      ? calculatedTotal
      : data.total;
    
    // Ensure balance is calculated correctly (defaults to total if invalid)
    this.balance = (isNaN(data.balance) || data.balance === null || data.balance === undefined)
      ? this.total
      : data.balance;
    
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  get isDraft(): boolean {
    return this.status === InvoiceStatus.DRAFT;
  }

  get isSent(): boolean {
    return this.status === InvoiceStatus.SENT;
  }

  get isPaid(): boolean {
    return this.status === InvoiceStatus.PAID;
  }

  get canEdit(): boolean {
    return this.isDraft;
  }

  get canMarkAsSent(): boolean {
    return this.isDraft;
  }

  get isOverdue(): boolean {
    if (this.isPaid) return false;
    return new Date(this.dueDate) < new Date();
  }

  calculateLineItemAmount(quantity: number, unitPrice: number): number {
    return quantity * unitPrice;
  }

  calculateSubtotal(): number {
    return this.lineItems.reduce((sum, item) => sum + item.amount, 0);
  }

  calculateTotal(): number {
    const subtotal = this.calculateSubtotal();
    const taxAmount = this.tax || 0;
    return subtotal + taxAmount;
  }
}

