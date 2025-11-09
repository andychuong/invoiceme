# Frontend Development Task List

## Phase 1: Project Setup
- [ ] Initialize React/Next.js project with TypeScript
- [ ] Set up project structure (MVVM architecture)
- [ ] Configure routing (React Router or Next.js App Router)
- [ ] Set up environment variables
- [ ] Configure build tools and dependencies
- [ ] Set up shadcn/ui (install and configure)
- [ ] Configure Tailwind CSS (required for shadcn/ui)
- [ ] Install shadcn/ui components as needed

## Phase 2: Core Infrastructure
- [ ] Create HTTP client (Axios or Fetch wrapper)
- [ ] Implement API service base class
- [ ] Set up authentication service
- [ ] Create token storage utilities
- [ ] Implement route protection/guards
- [ ] Set up error handling utilities
- [ ] Create loading state utilities

## Phase 3: Models & Types
- [ ] Define Customer model and types
- [ ] Define Invoice model and types
- [ ] Define Payment model and types
- [ ] Define API request/response types
- [ ] Define common types (pagination, errors, etc.)

## Phase 4: ViewModels (MVVM)
- [ ] Implement CustomerViewModel
  - [ ] State management
  - [ ] Load customers
  - [ ] Create customer
  - [ ] Update customer
  - [ ] Delete customer
- [ ] Implement InvoiceViewModel
  - [ ] State management
  - [ ] Load invoices
  - [ ] Create invoice
  - [ ] Update invoice
  - [ ] Mark as sent
  - [ ] Calculate totals
- [ ] Implement PaymentViewModel
  - [ ] State management
  - [ ] Load payments
  - [ ] Record payment
  - [ ] Validate payment amount

## Phase 5: API Services
- [ ] Implement CustomerService
  - [ ] Create customer API call
  - [ ] Update customer API call
  - [ ] Delete customer API call
  - [ ] Get customer by ID API call
  - [ ] List customers API call
- [ ] Implement InvoiceService
  - [ ] Create invoice API call
  - [ ] Update invoice API call
  - [ ] Mark as sent API call
  - [ ] Get invoice by ID API call
  - [ ] List invoices by status API call
  - [ ] List invoices by customer API call
- [ ] Implement PaymentService
  - [ ] Record payment API call
  - [ ] Get payment by ID API call
  - [ ] List payments for invoice API call
- [ ] Implement AuthService
  - [ ] Login API call
  - [ ] Logout functionality
  - [ ] Token management

## Phase 6: Common Components
- [ ] Create Button component
- [ ] Create Input component
- [ ] Create Table component
- [ ] Create Modal component
- [ ] Create LoadingSpinner component
- [ ] Create ErrorMessage component
- [ ] Create Pagination component
- [ ] Create Form components

## Phase 7: Authentication UI
- [ ] Create Login page
- [ ] Implement login form
- [ ] Add form validation
- [ ] Implement error handling
- [ ] Add success redirect
- [ ] Test login flow

## Phase 8: Customer UI
- [ ] Create CustomerList component
  - [ ] Display customer table
  - [ ] Add pagination
  - [ ] Add search/filter
  - [ ] Add loading states
  - [ ] Add empty state
- [ ] Create CustomerForm component
  - [ ] Create form fields
  - [ ] Add form validation
  - [ ] Handle create/update
  - [ ] Add error handling
- [ ] Create CustomerCard component (optional)
- [ ] Create Customer pages/routes
  - [ ] Customer list page
  - [ ] Create customer page
  - [ ] Edit customer page

## Phase 9: Invoice UI
- [ ] Create InvoiceList component
  - [ ] Display invoice table
  - [ ] Add status filter
  - [ ] Add pagination
  - [ ] Add loading states
- [ ] Create InvoiceForm component
  - [ ] Customer selector
  - [ ] Date fields
  - [ ] Line items table (add/remove/edit)
  - [ ] Invoice totals display
  - [ ] Form validation
- [ ] Create InvoiceDetail component
  - [ ] Display invoice information
  - [ ] Display line items
  - [ ] Display payments
  - [ ] Display balance
- [ ] Create LineItemTable component
  - [ ] Add line item
  - [ ] Remove line item
  - [ ] Edit line item
  - [ ] Calculate amounts
- [ ] Create InvoiceTotals component
- [ ] Create Invoice pages/routes
  - [ ] Invoice list page
  - [ ] Create invoice page
  - [ ] Edit invoice page
  - [ ] Invoice detail page

## Phase 10: Payment UI
- [ ] Create PaymentForm component
  - [ ] Payment form fields
  - [ ] Amount validation (cannot exceed balance)
  - [ ] Form validation
  - [ ] Submit handling
- [ ] Create PaymentList component
  - [ ] Display payment history
  - [ ] Format payment data
- [ ] Create PaymentCard component (optional)
- [ ] Integrate payment form in InvoiceDetail
- [ ] Create Payment pages/routes (optional)

## Phase 11: Integration & Testing
- [ ] Connect all components to ViewModels
- [ ] Connect all ViewModels to Services
- [ ] Test all user flows
- [ ] Fix any integration issues
- [ ] Add loading states everywhere
- [ ] Add error handling everywhere
- [ ] Test form validations
- [ ] Test error scenarios

## Phase 12: Polish & Optimization
- [ ] Add responsive design
- [ ] Improve UI/UX
- [ ] Add animations/transitions
- [ ] Optimize bundle size
- [ ] Test performance
- [ ] Fix any bugs
- [ ] Code review and refactoring

