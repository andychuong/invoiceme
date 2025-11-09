# PRD: InvoiceMe Backend-Frontend Integration

## 1. Overview

This PRD defines the integration phase for InvoiceMe, focusing on connecting the backend API with the frontend application, ensuring seamless communication, and preparing for deployment on Railway.

## 2. Integration Goals

- Connect frontend to backend API
- Verify all API endpoints work correctly
- Ensure authentication flow works end-to-end
- Validate data flow (create, read, update, delete operations)
- Fix any integration issues
- Prepare for Railway deployment

## 3. Pre-Integration Checklist

### 3.1 Backend Readiness
- [ ] All REST endpoints implemented and tested
- [ ] CORS configured for frontend origin
- [ ] Authentication endpoints working
- [ ] API documentation available (Swagger/OpenAPI)
- [ ] Environment variables documented
- [ ] Backend running locally on `http://localhost:8080`

### 3.2 Frontend Readiness
- [ ] All components implemented
- [ ] ViewModels implemented
- [ ] API service layer implemented
- [ ] Environment variables configured
- [ ] Frontend running locally on `http://localhost:3000` (or configured port)

## 4. API Integration Tasks

### 4.1 Authentication Integration

#### Task: Connect Login Flow
- **Frontend**: Update `authService.ts` to call backend `/api/auth/login`
- **Backend**: Verify JWT token generation and response format
- **Integration Steps**:
  1. Test login with valid credentials
  2. Verify token is stored correctly
  3. Verify token is sent in subsequent requests
  4. Test token expiration handling
  5. Test logout functionality

#### Task: Implement Token Management
- **Frontend**: 
  - Store JWT token in localStorage/sessionStorage
  - Add token to Authorization header for all API requests
  - Implement token refresh logic (if applicable)
  - Handle token expiration and redirect to login

#### Task: Route Protection
- **Frontend**: 
  - Verify protected routes redirect to login when not authenticated
  - Verify authenticated users can access protected routes
  - Test redirect after login

### 4.2 Customer API Integration

#### Task: Customer CRUD Operations
- **Create Customer**:
  - Frontend: `POST /api/customers`
  - Verify request/response DTOs match
  - Test form submission and success handling
  - Verify customer appears in list after creation

- **List Customers**:
  - Frontend: `GET /api/customers`
  - Verify pagination works
  - Test loading states
  - Verify empty state display

- **Get Customer by ID**:
  - Frontend: `GET /api/customers/{id}`
  - Test customer detail view
  - Verify data display

- **Update Customer**:
  - Frontend: `PUT /api/customers/{id}`
  - Test edit form pre-population
  - Verify update success
  - Verify updated data in list

- **Delete Customer**:
  - Frontend: `DELETE /api/customers/{id}`
  - Test confirmation dialog
  - Verify deletion success
  - Verify customer removed from list

### 4.3 Invoice API Integration

#### Task: Invoice CRUD Operations
- **Create Invoice (Draft)**:
  - Frontend: `POST /api/invoices`
  - Verify line items are sent correctly
  - Test invoice number generation (if frontend handles)
  - Verify invoice created with Draft status
  - Test total amount calculation

- **List Invoices**:
  - Frontend: `GET /api/invoices`
  - Test status filtering
  - Verify pagination
  - Test customer filter

- **Get Invoice by ID**:
  - Frontend: `GET /api/invoices/{id}`
  - Verify invoice detail display
  - Verify line items display
  - Verify payments display
  - Test balance calculation display

- **Update Invoice**:
  - Frontend: `PUT /api/invoices/{id}`
  - Test line item updates (add/remove/edit)
  - Verify total recalculation
  - Test status restrictions (only Draft can be edited)

- **Mark Invoice as Sent**:
  - Frontend: `PATCH /api/invoices/{id}/mark-sent`
  - Test state transition (Draft → Sent)
  - Verify status update in UI
  - Test that Sent invoices cannot be edited

### 4.4 Payment API Integration

#### Task: Payment Operations
- **Record Payment**:
  - Frontend: `POST /api/payments`
  - Test payment form validation
  - Verify amount validation (cannot exceed balance)
  - Test payment recording
  - Verify invoice balance updates
  - Test invoice status transition (Sent → Paid when balance = 0)

- **List Payments for Invoice**:
  - Frontend: `GET /api/invoices/{invoiceId}/payments`
  - Verify payment history display
  - Test payment list updates after new payment

- **Get Payment by ID**:
  - Frontend: `GET /api/payments/{id}`
  - Test payment detail view (if applicable)

## 5. Data Flow Validation

### 5.1 Complete User Flows

#### Flow 1: Customer → Invoice → Payment
1. Create a customer
2. Create an invoice for that customer (with line items)
3. Mark invoice as sent
4. Record a payment for the invoice
5. Verify invoice balance updates
6. Verify invoice status changes to Paid when balance = 0

#### Flow 2: Invoice Management
1. Create multiple invoices for a customer
2. Filter invoices by status
3. View invoice detail
4. Edit draft invoice
5. Mark invoice as sent
6. Verify sent invoice cannot be edited

#### Flow 3: Payment Management
1. Create invoice with balance
2. Record partial payment
3. Verify balance updates
4. Record another payment
5. Verify invoice becomes Paid when balance = 0

### 5.2 Error Handling Validation

#### Network Errors
- Test API unavailable scenario
- Verify error messages displayed
- Test retry mechanisms (if implemented)

#### Validation Errors
- Test invalid form submissions
- Verify backend validation errors displayed in frontend
- Test field-level error display

#### Business Logic Errors
- Test payment amount exceeding balance
- Test editing sent invoice
- Test deleting customer with invoices
- Verify appropriate error messages

## 6. CORS Configuration

### 6.1 Backend CORS Setup
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000") // Development
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### 6.2 Frontend CORS Handling
- Verify API calls include credentials
- Test CORS preflight requests
- Verify CORS errors are handled gracefully

## 7. Environment Configuration

### 7.1 Development Environment

#### Backend (.env or application.properties)
```properties
server.port=8080
cors.allowed-origins=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 7.2 Production Environment (Railway)

#### Backend Environment Variables
- `DATABASE_URL` - Railway PostgreSQL connection string
- `JWT_SECRET` - JWT secret key
- `CORS_ALLOWED_ORIGINS` - Frontend URL (Railway frontend service URL)
- `PORT` - Railway assigned port

#### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL (Railway backend service URL)

## 8. API Contract Verification

### 8.1 Request/Response DTOs
- [ ] Verify all DTOs match between frontend and backend
- [ ] Test date format handling
- [ ] Test UUID format handling
- [ ] Verify decimal/money format handling
- [ ] Test null/optional field handling

### 8.2 Error Response Format
- Verify error response structure matches
- Test error code mapping
- Verify error message display

### 8.3 Pagination
- Verify pagination request parameters match
- Test pagination response structure
- Verify pagination UI works correctly

## 9. Performance Validation

### 9.1 API Response Times
- Test all endpoints for < 200ms response time
- Identify slow endpoints
- Optimize if necessary

### 9.2 Frontend Performance
- Test page load times
- Verify smooth UI interactions
- Test with large datasets (pagination)
- Optimize if necessary

## 10. Testing Integration

### 10.1 End-to-End Testing
- [ ] Test complete user flows
- [ ] Test error scenarios
- [ ] Test edge cases
- [ ] Verify integration tests pass

### 10.2 Manual Testing Checklist
- [ ] Login flow
- [ ] Customer CRUD operations
- [ ] Invoice CRUD operations
- [ ] Payment recording
- [ ] Invoice status transitions
- [ ] Balance calculations
- [ ] Error handling
- [ ] Form validation
- [ ] Pagination
- [ ] Search/filter functionality

## 11. Railway Deployment Preparation

### 11.1 Backend Deployment

#### Railway Configuration
- Create `railway.json` or configure via Railway dashboard
- Set up PostgreSQL service
- Configure environment variables
- Set build command: `./mvnw clean package` or `./gradlew build`
- Set start command: `java -jar target/invoiceme-*.jar`

#### Database Migration
- Ensure Flyway/Liquibase migrations run on deployment
- Verify database schema creation
- Test with production database

### 11.2 Frontend Deployment

#### Railway Configuration
- Configure as static site or Node.js service
- Set build command: `npm run build`
- Set start command: `npm start` (Next.js) or serve static files
- Configure environment variables
- Set public directory if static site

### 11.3 Service Configuration
- Backend service connects to PostgreSQL service
- Frontend service connects to backend service
- Configure service URLs in environment variables
- Set up custom domains (if needed)

## 12. Integration Tasks Checklist

### 12.1 Phase 1: Basic Integration
- [ ] Set up CORS
- [ ] Connect authentication
- [ ] Test login/logout flow
- [ ] Verify token management

### 12.2 Phase 2: Customer Integration
- [ ] Integrate customer list
- [ ] Integrate customer create
- [ ] Integrate customer update
- [ ] Integrate customer delete
- [ ] Test all customer operations

### 12.3 Phase 3: Invoice Integration
- [ ] Integrate invoice list
- [ ] Integrate invoice create
- [ ] Integrate invoice update
- [ ] Integrate mark as sent
- [ ] Integrate invoice detail
- [ ] Test invoice operations
- [ ] Verify line items handling

### 12.4 Phase 4: Payment Integration
- [ ] Integrate payment recording
- [ ] Integrate payment list
- [ ] Test payment operations
- [ ] Verify balance calculations
- [ ] Test status transitions

### 12.5 Phase 5: Error Handling
- [ ] Test network errors
- [ ] Test validation errors
- [ ] Test business logic errors
- [ ] Verify error display

### 12.6 Phase 6: Performance & Polish
- [ ] Optimize slow endpoints
- [ ] Add loading states
- [ ] Improve error messages
- [ ] Test with real data
- [ ] Performance testing

### 12.7 Phase 7: Deployment
- [ ] Configure Railway services
- [ ] Set up environment variables
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Test production deployment
- [ ] Verify all functionality works in production

## 13. Common Integration Issues & Solutions

### 13.1 CORS Issues
- **Problem**: CORS errors in browser console
- **Solution**: Verify backend CORS configuration, check allowed origins

### 13.2 Authentication Issues
- **Problem**: 401 Unauthorized errors
- **Solution**: Verify token is sent in headers, check token format, verify JWT secret

### 13.3 Data Format Mismatches
- **Problem**: Date/UUID format errors
- **Solution**: Standardize date formats (ISO 8601), verify UUID handling

### 13.4 Missing Fields
- **Problem**: Null values or missing data
- **Solution**: Verify DTO mapping, check optional vs required fields

## 14. Success Criteria

- [ ] All API endpoints integrated and working
- [ ] Authentication flow complete
- [ ] All CRUD operations functional
- [ ] Error handling working correctly
- [ ] Performance meets requirements (< 200ms)
- [ ] Application deployed to Railway
- [ ] Production environment fully functional
- [ ] All integration tests passing
- [ ] Documentation updated

## 15. Post-Integration Tasks

### 15.1 Documentation
- [ ] Update API documentation
- [ ] Document environment variables
- [ ] Create deployment guide
- [ ] Document known issues/workarounds

### 15.2 Monitoring
- [ ] Set up error logging
- [ ] Monitor API performance
- [ ] Set up alerts (if applicable)

### 15.3 Optimization
- [ ] Identify and fix performance bottlenecks
- [ ] Optimize database queries
- [ ] Optimize frontend bundle size
- [ ] Implement caching where appropriate

