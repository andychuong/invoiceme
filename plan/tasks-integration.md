# Integration Task List

## Phase 1: Pre-Integration Setup
- [ ] Verify backend is running on `http://localhost:8080`
- [ ] Verify frontend is running on `http://localhost:3000`
- [ ] Verify backend CORS is configured for frontend origin
- [ ] Verify API documentation is available (Swagger)
- [ ] Review API contracts between frontend and backend
- [ ] Set up environment variables for both projects

## Phase 2: Authentication Integration
- [ ] Test backend login endpoint manually (Postman/curl)
- [ ] Connect frontend login form to backend API
- [ ] Verify JWT token is received and stored
- [ ] Implement token in Authorization header for all requests
- [ ] Test protected routes with authentication
- [ ] Test token expiration handling
- [ ] Test logout functionality
- [ ] Verify redirect after login

## Phase 3: Customer API Integration
- [ ] Test Customer CRUD endpoints manually
- [ ] Integrate Create Customer
  - [ ] Verify request DTO matches
  - [ ] Test form submission
  - [ ] Verify success response
  - [ ] Test error handling
- [ ] Integrate List Customers
  - [ ] Verify pagination works
  - [ ] Test loading states
  - [ ] Verify empty state
- [ ] Integrate Get Customer by ID
  - [ ] Test customer detail view
  - [ ] Verify data display
- [ ] Integrate Update Customer
  - [ ] Test form pre-population
  - [ ] Test update submission
  - [ ] Verify updated data in list
- [ ] Integrate Delete Customer
  - [ ] Test confirmation dialog
  - [ ] Test deletion
  - [ ] Verify customer removed from list

## Phase 4: Invoice API Integration
- [ ] Test Invoice CRUD endpoints manually
- [ ] Integrate Create Invoice
  - [ ] Verify line items are sent correctly
  - [ ] Test invoice creation
  - [ ] Verify Draft status
  - [ ] Test total calculation
- [ ] Integrate List Invoices
  - [ ] Test status filtering
  - [ ] Test pagination
  - [ ] Test customer filter
- [ ] Integrate Get Invoice by ID
  - [ ] Test invoice detail display
  - [ ] Verify line items display
  - [ ] Verify payments display
  - [ ] Test balance calculation
- [ ] Integrate Update Invoice
  - [ ] Test line item updates
  - [ ] Test total recalculation
  - [ ] Test status restrictions
- [ ] Integrate Mark Invoice as Sent
  - [ ] Test state transition
  - [ ] Verify status update
  - [ ] Test that Sent invoices cannot be edited

## Phase 5: Payment API Integration
- [ ] Test Payment endpoints manually
- [ ] Integrate Record Payment
  - [ ] Test payment form validation
  - [ ] Test amount validation (cannot exceed balance)
  - [ ] Test payment recording
  - [ ] Verify invoice balance updates
  - [ ] Test invoice status transition (Sent → Paid)
- [ ] Integrate List Payments for Invoice
  - [ ] Test payment history display
  - [ ] Verify payment list updates after new payment
- [ ] Integrate Get Payment by ID (if applicable)

## Phase 6: Complete User Flows Testing
- [ ] Test Flow 1: Customer → Invoice → Payment
  1. Create customer
  2. Create invoice for customer
  3. Mark invoice as sent
  4. Record payment
  5. Verify balance updates
  6. Verify status changes to Paid
- [ ] Test Flow 2: Invoice Management
  1. Create multiple invoices
  2. Filter by status
  3. View invoice detail
  4. Edit draft invoice
  5. Mark as sent
  6. Verify sent invoice cannot be edited
- [ ] Test Flow 3: Payment Management
  1. Create invoice with balance
  2. Record partial payment
  3. Verify balance updates
  4. Record another payment
  5. Verify invoice becomes Paid

## Phase 7: Error Handling Integration
- [ ] Test network errors (API unavailable)
  - [ ] Verify error messages displayed
  - [ ] Test retry mechanisms
- [ ] Test validation errors
  - [ ] Test invalid form submissions
  - [ ] Verify backend validation errors displayed
  - [ ] Test field-level error display
- [ ] Test business logic errors
  - [ ] Test payment amount exceeding balance
  - [ ] Test editing sent invoice
  - [ ] Test deleting customer with invoices
  - [ ] Verify appropriate error messages

## Phase 8: Data Format Validation
- [ ] Verify date formats (ISO 8601)
- [ ] Verify UUID formats
- [ ] Verify decimal/money formats
- [ ] Test null/optional field handling
- [ ] Verify pagination request/response format
- [ ] Verify error response format

## Phase 9: Performance Validation
- [ ] Test all API endpoints for < 200ms response time
- [ ] Identify slow endpoints
- [ ] Optimize slow endpoints if necessary
- [ ] Test frontend page load times
- [ ] Verify smooth UI interactions
- [ ] Test with large datasets (pagination)

## Phase 10: Railway Deployment Preparation
- [ ] Create Railway account
- [ ] Set up Railway project
- [ ] Configure backend service
  - [ ] Set build command
  - [ ] Set start command
  - [ ] Configure environment variables
- [ ] Set up PostgreSQL service on Railway
- [ ] Configure frontend service
  - [ ] Set build command
  - [ ] Set start command
  - [ ] Configure environment variables
- [ ] Update environment variables for production
  - [ ] Backend: DATABASE_URL, JWT_SECRET, CORS_ALLOWED_ORIGINS
  - [ ] Frontend: NEXT_PUBLIC_API_URL

## Phase 11: Railway Deployment
- [ ] Deploy backend to Railway
- [ ] Verify backend deployment successful
- [ ] Test backend API in production
- [ ] Deploy frontend to Railway
- [ ] Verify frontend deployment successful
- [ ] Test frontend in production
- [ ] Verify all functionality works in production
- [ ] Test authentication in production
- [ ] Test all CRUD operations in production

## Phase 12: Final Testing & Validation
- [ ] Run all integration tests
- [ ] Test complete user flows in production
- [ ] Verify error handling in production
- [ ] Test performance in production
- [ ] Fix any production issues
- [ ] Document deployment process
- [ ] Create deployment guide

