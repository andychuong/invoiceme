# PRD: InvoiceMe Frontend Application

## 1. Overview

This PRD defines the frontend application development for InvoiceMe, focusing on building a production-quality React/Next.js application following MVVM (Model-View-ViewModel) architecture principles.

## 2. Technical Stack

- **Framework**: React.js or Next.js (TypeScript)
- **State Management**: React Context API or Zustand/Redux
- **HTTP Client**: Axios or Fetch API
- **UI Library**: shadcn/ui (built on Radix UI and Tailwind CSS)
- **Form Handling**: React Hook Form
- **Routing**: React Router (React) or Next.js App Router
- **Architecture**: MVVM (Model-View-ViewModel)

## 3. Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory (if using Next.js)
│   │   ├── (auth)/
│   │   │   └── login/
│   │   ├── (dashboard)/
│   │   │   ├── customers/
│   │   │   ├── invoices/
│   │   │   └── payments/
│   │   └── layout.tsx
│   ├── components/             # Reusable UI components
│   │   ├── common/
│   │   ├── customers/
│   │   ├── invoices/
│   │   └── payments/
│   ├── viewmodels/             # ViewModels (MVVM)
│   │   ├── CustomerViewModel.ts
│   │   ├── InvoiceViewModel.ts
│   │   └── PaymentViewModel.ts
│   ├── models/                 # Models (MVVM)
│   │   ├── Customer.ts
│   │   ├── Invoice.ts
│   │   └── Payment.ts
│   ├── services/               # API services
│   │   ├── api/
│   │   │   ├── customerService.ts
│   │   │   ├── invoiceService.ts
│   │   │   └── paymentService.ts
│   │   ├── authService.ts
│   │   └── httpClient.ts
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   ├── types/                  # TypeScript types
│   └── styles/                 # Global styles
├── public/                     # Static assets
└── package.json
```

## 4. MVVM Architecture

### 4.1 Model Layer
- **Purpose**: Data structures and business logic representation
- **Components**:
  - `Customer` model
  - `Invoice` model
  - `Payment` model
  - Type definitions/interfaces

### 4.2 ViewModel Layer
- **Purpose**: Business logic, state management, and data transformation
- **Components**:
  - `CustomerViewModel` - manages customer operations
  - `InvoiceViewModel` - manages invoice operations
  - `PaymentViewModel` - manages payment operations
  - Handles API calls, state updates, validation

### 4.3 View Layer
- **Purpose**: UI components and presentation
- **Components**:
  - React components (functional components)
  - Pages/views
  - UI components (buttons, forms, tables)

## 5. API Integration Contract

### 5.1 Base Configuration
- **API Base URL**: `http://localhost:8080/api` (development)
- **Production**: Configured via environment variables
- **Authentication**: JWT token stored in localStorage/sessionStorage

### 5.2 API Service Layer

#### Customer Service
```typescript
interface CustomerService {
  createCustomer(data: CreateCustomerRequest): Promise<Customer>;
  updateCustomer(id: string, data: UpdateCustomerRequest): Promise<Customer>;
  deleteCustomer(id: string): Promise<void>;
  getCustomerById(id: string): Promise<Customer>;
  listCustomers(page?: number, size?: number): Promise<PaginatedResponse<Customer>>;
}
```

#### Invoice Service
```typescript
interface InvoiceService {
  createInvoice(data: CreateInvoiceRequest): Promise<Invoice>;
  updateInvoice(id: string, data: UpdateInvoiceRequest): Promise<Invoice>;
  markInvoiceAsSent(id: string): Promise<Invoice>;
  getInvoiceById(id: string): Promise<Invoice>;
  listInvoicesByStatus(status: InvoiceStatus, page?: number): Promise<PaginatedResponse<Invoice>>;
  listInvoicesByCustomer(customerId: string, page?: number): Promise<PaginatedResponse<Invoice>>;
}
```

#### Payment Service
```typescript
interface PaymentService {
  recordPayment(data: CreatePaymentRequest): Promise<Payment>;
  getPaymentById(id: string): Promise<Payment>;
  listPaymentsForInvoice(invoiceId: string): Promise<Payment[]>;
}
```

#### Auth Service
```typescript
interface AuthService {
  login(username: string, password: string): Promise<AuthResponse>;
  logout(): void;
  getToken(): string | null;
  isAuthenticated(): boolean;
}
```

## 6. User Interface Requirements

### 6.1 Authentication

#### Login Page
- **Route**: `/login`
- **Components**: Login form with username/password fields
- **Functionality**:
  - Form validation
  - API authentication call
  - Token storage
  - Redirect to dashboard on success
  - Error handling and display

### 6.2 Customer Management

#### Customer List Page
- **Route**: `/customers`
- **Components**:
  - Customer list table (with pagination)
  - Search/filter functionality
  - "Create Customer" button
- **Features**:
  - Display: name, email, phone, actions (edit/delete)
  - Pagination controls
  - Loading states
  - Empty state

#### Create/Edit Customer Page
- **Route**: `/customers/new` or `/customers/:id/edit`
- **Components**:
  - Customer form (name, email, address, phone)
  - Save/Cancel buttons
- **Features**:
  - Form validation
  - API integration
  - Success/error handling
  - Redirect on success

### 6.3 Invoice Management

#### Invoice List Page
- **Route**: `/invoices`
- **Components**:
  - Invoice list table (with filters)
  - Status filter (Draft/Sent/Paid)
  - "Create Invoice" button
- **Features**:
  - Display: invoice number, customer, status, total, balance, due date
  - Filter by status
  - Pagination
  - Link to customer detail

#### Create/Edit Invoice Page
- **Route**: `/invoices/new` or `/invoices/:id/edit`
- **Components**:
  - Invoice form
  - Customer selector
  - Line items table (add/remove/edit)
  - Invoice totals display
  - Save/Mark as Sent buttons
- **Features**:
  - Dynamic line items (description, quantity, unit price, amount)
  - Automatic total calculation
  - Form validation
  - Status management (Draft only for new/edit)
  - "Mark as Sent" action (for draft invoices)

#### Invoice Detail Page
- **Route**: `/invoices/:id`
- **Components**:
  - Invoice details display
  - Line items table
  - Payments section
  - Record Payment form
- **Features**:
  - View invoice information
  - View all line items
  - View payment history
  - Record new payment
  - Display balance and status

### 6.4 Payment Management

#### Payment List Page (Optional)
- **Route**: `/payments`
- **Components**:
  - Payment list table
  - Filter by invoice
- **Features**:
  - Display: invoice, amount, date, method
  - Link to invoice detail

#### Record Payment (Integrated in Invoice Detail)
- **Components**:
  - Payment form (amount, date, method, reference)
  - Submit button
- **Features**:
  - Form validation
  - Amount validation (cannot exceed invoice balance)
  - API integration
  - Update invoice balance display

## 7. ViewModel Implementation

### 7.1 CustomerViewModel

```typescript
class CustomerViewModel {
  // State
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadCustomers(): Promise<void>;
  createCustomer(data: CreateCustomerRequest): Promise<void>;
  updateCustomer(id: string, data: UpdateCustomerRequest): Promise<void>;
  deleteCustomer(id: string): Promise<void>;
  selectCustomer(id: string): void;
}
```

### 7.2 InvoiceViewModel

```typescript
class InvoiceViewModel {
  // State
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadInvoices(status?: InvoiceStatus): Promise<void>;
  loadInvoicesByCustomer(customerId: string): Promise<void>;
  createInvoice(data: CreateInvoiceRequest): Promise<void>;
  updateInvoice(id: string, data: UpdateInvoiceRequest): Promise<void>;
  markAsSent(id: string): Promise<void>;
  selectInvoice(id: string): void;
  calculateTotal(lineItems: LineItem[]): number;
}
```

### 7.3 PaymentViewModel

```typescript
class PaymentViewModel {
  // State
  payments: Payment[];
  loading: boolean;
  error: string | null;
  
  // Actions
  loadPaymentsForInvoice(invoiceId: string): Promise<void>;
  recordPayment(data: CreatePaymentRequest): Promise<void>;
  validatePaymentAmount(amount: number, invoiceBalance: number): boolean;
}
```

## 8. Component Structure

### 8.1 Common Components
- `Button` - Reusable button component
- `Input` - Form input component
- `Table` - Data table component
- `Modal` - Modal dialog component
- `LoadingSpinner` - Loading indicator
- `ErrorMessage` - Error display component
- `Pagination` - Pagination controls

### 8.2 Customer Components
- `CustomerList` - Customer list view
- `CustomerForm` - Customer create/edit form
- `CustomerCard` - Customer card display

### 8.3 Invoice Components
- `InvoiceList` - Invoice list view
- `InvoiceForm` - Invoice create/edit form
- `InvoiceDetail` - Invoice detail view
- `LineItemTable` - Line items table with add/remove
- `InvoiceTotals` - Invoice totals display

### 8.4 Payment Components
- `PaymentForm` - Payment recording form
- `PaymentList` - Payment history list
- `PaymentCard` - Payment card display

## 9. State Management

### 9.1 Global State
- Authentication state (user, token)
- Theme preferences (if applicable)

### 9.2 Local State
- Component-specific state managed via React hooks
- ViewModel state for business logic

### 9.3 State Management Options
- **React Context API**: For global state (auth)
- **Zustand/Redux**: If complex state management needed
- **React Query/SWR**: For server state and caching

## 10. Routing

### 10.1 Route Structure

#### Public Routes
- `/login` - Login page

#### Protected Routes (require authentication)
- `/` or `/dashboard` - Dashboard (optional)
- `/customers` - Customer list
- `/customers/new` - Create customer
- `/customers/:id/edit` - Edit customer
- `/invoices` - Invoice list
- `/invoices/new` - Create invoice
- `/invoices/:id` - Invoice detail
- `/invoices/:id/edit` - Edit invoice
- `/payments` - Payment list (optional)

### 10.2 Route Protection
- Implement route guards/private routes
- Redirect to login if not authenticated
- Store intended destination for post-login redirect

## 11. Form Validation

### 11.1 Validation Rules

#### Customer Form
- Name: Required, min 2 characters
- Email: Required, valid email format
- Phone: Optional, valid phone format
- Address: Optional

#### Invoice Form
- Customer: Required
- Issue Date: Required, valid date
- Due Date: Required, after issue date
- Line Items: At least one required
  - Description: Required
  - Quantity: Required, > 0
  - Unit Price: Required, >= 0

#### Payment Form
- Invoice: Required (pre-selected from context)
- Amount: Required, > 0, <= invoice balance
- Payment Date: Required, valid date
- Payment Method: Required
- Reference Number: Optional

## 12. Error Handling

### 12.1 Error Types
- Network errors (API unavailable)
- Validation errors (form validation)
- Authentication errors (unauthorized)
- Business logic errors (from API)

### 12.2 Error Display
- Toast notifications for success/error messages
- Inline form validation errors
- Global error boundary for unexpected errors
- User-friendly error messages

## 13. UI/UX Requirements

### 13.1 Design Principles
- Clean, modern interface
- Responsive design (mobile-friendly)
- Consistent color scheme and typography
- Accessible components (ARIA labels, keyboard navigation)

### 13.2 User Experience
- Loading states for async operations
- Optimistic updates where appropriate
- Confirmation dialogs for destructive actions
- Success feedback after operations
- Smooth transitions and animations

## 14. Implementation Requirements

### 14.1 Setup
- [ ] Initialize React/Next.js project with TypeScript
- [ ] Set up project structure (MVVM)
- [ ] Configure routing
- [ ] Set up API client (Axios/Fetch)
- [ ] Configure environment variables

### 14.2 Authentication
- [ ] Implement login page
- [ ] Create auth service
- [ ] Implement token storage
- [ ] Create route protection
- [ ] Implement logout functionality

### 14.3 Customer Management
- [ ] Create Customer model and types
- [ ] Implement CustomerViewModel
- [ ] Create CustomerService
- [ ] Build CustomerList component
- [ ] Build CustomerForm component
- [ ] Implement CRUD operations

### 14.4 Invoice Management
- [ ] Create Invoice model and types
- [ ] Implement InvoiceViewModel
- [ ] Create InvoiceService
- [ ] Build InvoiceList component
- [ ] Build InvoiceForm component
- [ ] Build LineItemTable component
- [ ] Build InvoiceDetail component
- [ ] Implement invoice operations
- [ ] Implement balance calculation

### 14.5 Payment Management
- [ ] Create Payment model and types
- [ ] Implement PaymentViewModel
- [ ] Create PaymentService
- [ ] Build PaymentForm component
- [ ] Build PaymentList component
- [ ] Integrate payment recording in invoice detail

### 14.6 Common Components
- [ ] Build reusable UI components
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Implement form validation

### 14.7 Testing
- [ ] Component unit tests
- [ ] ViewModel unit tests
- [ ] Integration tests for user flows
- [ ] E2E tests (optional, using Cypress/Playwright)

## 15. Environment Configuration

### 15.1 Environment Variables
```env
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# .env.production
NEXT_PUBLIC_API_URL=https://your-api.railway.app/api
```

## 16. Success Criteria

- [ ] All pages and components implemented
- [ ] MVVM architecture properly implemented
- [ ] All API integrations working
- [ ] Authentication flow complete
- [ ] Form validation working
- [ ] Error handling implemented
- [ ] Responsive design
- [ ] UI is smooth and responsive (< 200ms perceived latency)
- [ ] Ready for backend integration

## 17. Dependencies

### 17.1 Core
- `react` / `next`
- `typescript`
- `react-router-dom` (if using React) or Next.js routing

### 17.2 UI Libraries
- `shadcn/ui` (components built on Radix UI and Tailwind CSS)
- `tailwindcss` (required for shadcn/ui)
- `@radix-ui/react-*` (peer dependencies for shadcn/ui components)
- `react-hook-form`
- `axios` or native `fetch`

### 17.3 Utilities
- `date-fns` (date formatting)
- `react-query` or `swr` (optional, for data fetching)
- `zod` or `yup` (form validation)

## 18. Mock Data (Development)

- Create mock API responses for development
- Use mock service layer when backend is unavailable
- Switch to real API when backend is ready

