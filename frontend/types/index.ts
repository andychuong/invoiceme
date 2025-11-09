// Common types
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Customer types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Invoice types
export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
}

export interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName?: string;
  customer?: Customer;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  lineItems: LineItem[];
  subtotal: number;
  tax?: number;
  total: number;
  balance: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInvoiceRequest {
  customerId: string;
  issueDate: string;
  dueDate: string;
  lineItems: Omit<LineItem, 'id' | 'amount'>[];
  tax?: number;
}

export interface UpdateInvoiceRequest {
  customerId?: string;
  issueDate?: string;
  dueDate?: string;
  lineItems?: Omit<LineItem, 'id' | 'amount'>[];
  tax?: number;
}

// Payment types
export enum PaymentMethod {
  CASH = 'CASH',
  CHECK = 'CHECK',
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  OTHER = 'OTHER',
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoice?: Invoice;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
  createdAt?: string;
}

export interface CreatePaymentRequest {
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
}

// Auth types
export interface AuthResponse {
  token: string;
  expiresIn: number;
  userId: string;
  username: string;
  email: string;
  displayName?: string;
  profilePictureUrl?: string;
  companyId: string;
  companyName: string;
  companyLogoUrl?: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// User types
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileRequest {
  displayName?: string;
  email?: string;
  profilePictureUrl?: string;
}

// Company types
export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  companyCode?: string;  // UUID code for employees to join
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCompanyRequest {
  name: string;
  logoUrl?: string;
}

export interface CompanyMember {
  id: string;
  userId: string;
  username: string;
  email: string;
  displayName?: string;
  profilePictureUrl?: string;
  role: string;
  joinedAt: string;
}

export interface InviteUserRequest {
  username: string;
  email: string;
  password: string;
  displayName?: string;
  role: 'ADMIN' | 'ACCOUNTANT' | 'OPERATOR';
}

