# PRD: InvoiceMe Backend API

## 1. Overview

This PRD defines the backend API development for InvoiceMe, focusing on building a production-quality Spring Boot REST API following Domain-Driven Design (DDD), CQRS, and Vertical Slice Architecture principles.

## 2. Technical Stack

- **Framework**: Java with Spring Boot
- **Database**: PostgreSQL (production), H2/SQLite (development/testing)
- **Architecture**: DDD, CQRS, Vertical Slice Architecture, Clean Architecture
- **API Style**: RESTful APIs
- **Build Tool**: Maven or Gradle

## 3. Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── invoiceme/
│   │   │           ├── domain/           # Domain layer (DDD)
│   │   │           │   ├── customer/
│   │   │           │   ├── invoice/
│   │   │           │   └── payment/
│   │   │           ├── application/     # Application layer (CQRS)
│   │   │           │   ├── commands/     # Write operations
│   │   │           │   └── queries/      # Read operations
│   │   │           ├── infrastructure/   # Infrastructure layer
│   │   │           │   ├── persistence/
│   │   │           │   ├── api/          # REST controllers
│   │   │           │   └── config/
│   │   │           └── shared/           # Shared utilities
│   │   └── resources/
│   │       ├── application.properties
│   │       └── db/migration/             # Flyway/Liquibase migrations
│   └── test/
│       └── java/
│           └── integration/              # Integration tests
└── pom.xml / build.gradle
```

## 4. Domain Model (DDD)

### 4.1 Customer Domain

**Aggregate Root**: `Customer`
- **Properties**: id, name, email, address, phone, createdAt, updatedAt
- **Domain Logic**: Validation rules, business invariants
- **Value Objects**: Email, Address (if applicable)

### 4.2 Invoice Domain

**Aggregate Root**: `Invoice`
- **Properties**: id, customerId, invoiceNumber, status (Draft/Sent/Paid), issueDate, dueDate, totalAmount, balance, createdAt, updatedAt
- **Domain Logic**: 
  - State transitions (Draft → Sent → Paid)
  - Balance calculation
  - Line item management
- **Entities**: `InvoiceLineItem` (id, description, quantity, unitPrice, amount)
- **Value Objects**: InvoiceNumber, Money

### 4.3 Payment Domain

**Aggregate Root**: `Payment`
- **Properties**: id, invoiceId, amount, paymentDate, paymentMethod, referenceNumber, createdAt
- **Domain Logic**: 
  - Payment validation
  - Invoice balance updates
- **Value Objects**: Money, PaymentMethod

## 5. CQRS Implementation

### 5.1 Commands (Write Operations)

#### Customer Commands
- `CreateCustomerCommand` → `CreateCustomerHandler`
- `UpdateCustomerCommand` → `UpdateCustomerHandler`
- `DeleteCustomerCommand` → `DeleteCustomerHandler`

#### Invoice Commands
- `CreateInvoiceCommand` → `CreateInvoiceHandler`
- `UpdateInvoiceCommand` → `UpdateInvoiceHandler`
- `MarkInvoiceAsSentCommand` → `MarkInvoiceAsSentHandler`
- `RecordPaymentCommand` → `RecordPaymentHandler`

#### Payment Commands
- `RecordPaymentCommand` → `RecordPaymentHandler`

### 5.2 Queries (Read Operations)

#### Customer Queries
- `GetCustomerByIdQuery` → `GetCustomerByIdHandler`
- `ListAllCustomersQuery` → `ListAllCustomersHandler`

#### Invoice Queries
- `GetInvoiceByIdQuery` → `GetInvoiceByIdHandler`
- `ListInvoicesByStatusQuery` → `ListInvoicesByStatusHandler`
- `ListInvoicesByCustomerQuery` → `ListInvoicesByCustomerHandler`

#### Payment Queries
- `GetPaymentByIdQuery` → `GetPaymentByIdHandler`
- `ListPaymentsForInvoiceQuery` → `ListPaymentsForInvoiceHandler`

## 6. REST API Contract

### 6.1 Base URL
- **Development**: `http://localhost:8080/api`
- **Production**: Configured via environment variables

### 6.2 Authentication
- **Endpoint**: `POST /api/auth/login`
- **Request**: `{ "username": "string", "password": "string" }`
- **Response**: `{ "token": "string", "expiresIn": number }`
- **Security**: JWT tokens for authenticated requests

### 6.3 Customer Endpoints

#### Create Customer
- **POST** `/api/customers`
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "address": "string",
    "phone": "string"
  }
  ```
- **Response**: `201 Created` with customer DTO

#### Update Customer
- **PUT** `/api/customers/{id}`
- **Request Body**: Same as create
- **Response**: `200 OK` with updated customer DTO

#### Delete Customer
- **DELETE** `/api/customers/{id}`
- **Response**: `204 No Content`

#### Get Customer by ID
- **GET** `/api/customers/{id}`
- **Response**: `200 OK` with customer DTO

#### List All Customers
- **GET** `/api/customers`
- **Query Params**: `?page=0&size=20&sort=name,asc`
- **Response**: `200 OK` with paginated customer list

### 6.4 Invoice Endpoints

#### Create Invoice (Draft)
- **POST** `/api/invoices`
- **Request Body**:
  ```json
  {
    "customerId": "uuid",
    "issueDate": "2024-01-01",
    "dueDate": "2024-01-31",
    "lineItems": [
      {
        "description": "string",
        "quantity": 1,
        "unitPrice": 100.00
      }
    ]
  }
  ```
- **Response**: `201 Created` with invoice DTO

#### Update Invoice
- **PUT** `/api/invoices/{id}`
- **Request Body**: Same as create (allows updating line items)
- **Response**: `200 OK` with updated invoice DTO

#### Mark Invoice as Sent
- **PATCH** `/api/invoices/{id}/mark-sent`
- **Response**: `200 OK` with updated invoice DTO

#### Get Invoice by ID
- **GET** `/api/invoices/{id}`
- **Response**: `200 OK` with invoice DTO (includes line items and payments)

#### List Invoices by Status
- **GET** `/api/invoices?status=DRAFT`
- **Query Params**: `status=DRAFT|SENT|PAID`, `page`, `size`, `sort`
- **Response**: `200 OK` with paginated invoice list

#### List Invoices by Customer
- **GET** `/api/customers/{customerId}/invoices`
- **Query Params**: `page`, `size`, `sort`
- **Response**: `200 OK` with paginated invoice list

### 6.5 Payment Endpoints

#### Record Payment
- **POST** `/api/payments`
- **Request Body**:
  ```json
  {
    "invoiceId": "uuid",
    "amount": 100.00,
    "paymentDate": "2024-01-15",
    "paymentMethod": "CASH|CARD|BANK_TRANSFER",
    "referenceNumber": "string"
  }
  ```
- **Response**: `201 Created` with payment DTO

#### Get Payment by ID
- **GET** `/api/payments/{id}`
- **Response**: `200 OK` with payment DTO

#### List Payments for Invoice
- **GET** `/api/invoices/{invoiceId}/payments`
- **Response**: `200 OK` with payment list

## 7. DTOs (Data Transfer Objects)

### 7.1 Customer DTOs
- `CustomerRequestDTO` (for create/update)
- `CustomerResponseDTO` (for responses)

### 7.2 Invoice DTOs
- `InvoiceRequestDTO` (for create/update)
- `InvoiceResponseDTO` (for responses)
- `InvoiceLineItemDTO` (nested in invoice DTOs)

### 7.3 Payment DTOs
- `PaymentRequestDTO` (for create)
- `PaymentResponseDTO` (for responses)

### 7.4 Common DTOs
- `ErrorResponseDTO` (for error handling)
- `PageResponseDTO<T>` (for paginated responses)

## 8. Database Schema

### 8.1 Tables

#### customers
- `id` (UUID, PK)
- `name` (VARCHAR, NOT NULL)
- `email` (VARCHAR, UNIQUE, NOT NULL)
- `address` (TEXT)
- `phone` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### invoices
- `id` (UUID, PK)
- `customer_id` (UUID, FK → customers.id)
- `invoice_number` (VARCHAR, UNIQUE, NOT NULL)
- `status` (VARCHAR, NOT NULL) - DRAFT, SENT, PAID
- `issue_date` (DATE, NOT NULL)
- `due_date` (DATE, NOT NULL)
- `total_amount` (DECIMAL(19,2), NOT NULL)
- `balance` (DECIMAL(19,2), NOT NULL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### invoice_line_items
- `id` (UUID, PK)
- `invoice_id` (UUID, FK → invoices.id)
- `description` (VARCHAR, NOT NULL)
- `quantity` (INTEGER, NOT NULL)
- `unit_price` (DECIMAL(19,2), NOT NULL)
- `amount` (DECIMAL(19,2), NOT NULL)
- `created_at` (TIMESTAMP)

#### payments
- `id` (UUID, PK)
- `invoice_id` (UUID, FK → invoices.id)
- `amount` (DECIMAL(19,2), NOT NULL)
- `payment_date` (DATE, NOT NULL)
- `payment_method` (VARCHAR, NOT NULL)
- `reference_number` (VARCHAR)
- `created_at` (TIMESTAMP)

### 8.2 Indexes
- `customers.email` (unique index)
- `invoices.customer_id` (index for queries)
- `invoices.status` (index for filtering)
- `invoices.invoice_number` (unique index)
- `invoice_line_items.invoice_id` (index)
- `payments.invoice_id` (index)

## 9. Implementation Requirements

### 9.1 Domain Layer
- [ ] Implement Customer aggregate with domain logic
- [ ] Implement Invoice aggregate with state machine and balance calculation
- [ ] Implement Payment aggregate with validation
- [ ] Create value objects (Email, Money, InvoiceNumber, etc.)
- [ ] Implement domain events (optional but encouraged)

### 9.2 Application Layer (CQRS)
- [ ] Implement all command handlers
- [ ] Implement all query handlers
- [ ] Create command/query DTOs
- [ ] Implement command/query validation

### 9.3 Infrastructure Layer
- [ ] Set up Spring Boot application
- [ ] Configure PostgreSQL/H2 database
- [ ] Implement JPA repositories or custom repositories
- [ ] Create database migrations (Flyway/Liquibase)
- [ ] Implement REST controllers
- [ ] Create DTO mappers
- [ ] Implement JWT authentication
- [ ] Configure CORS for frontend integration
- [ ] Set up error handling and validation

### 9.4 Testing
- [ ] Unit tests for domain logic
- [ ] Unit tests for command/query handlers
- [ ] Integration tests for REST endpoints
- [ ] Integration test for complete Customer → Invoice → Payment flow
- [ ] Performance tests (ensure <200ms response time)

## 10. Environment Configuration

### 10.1 Application Properties
```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/invoiceme
spring.datasource.username=postgres
spring.datasource.password=password

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:3000
```

### 10.2 Environment Variables (for Railway)
- `DATABASE_URL` (Railway PostgreSQL connection string)
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`

## 11. Success Criteria

- [ ] All REST endpoints implemented and functional
- [ ] CQRS pattern properly implemented
- [ ] DDD principles followed (rich domain models)
- [ ] Database schema created and migrations working
- [ ] Authentication implemented
- [ ] All integration tests passing
- [ ] API response times < 200ms
- [ ] Code follows Clean Architecture layers
- [ ] Vertical Slice Architecture structure in place
- [ ] Ready for frontend integration

## 12. Dependencies

### 12.1 Required Spring Boot Starters
- `spring-boot-starter-web`
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-validation`
- `spring-boot-starter-security`
- `spring-boot-starter-test`

### 12.2 Database
- `postgresql` (runtime)
- `h2` (test scope)

### 12.3 Other
- `jjwt` (JWT tokens)
- `flyway-core` or `liquibase-core` (migrations)
- `mapstruct` (DTO mapping, optional)

## 13. API Documentation

- Use Swagger/OpenAPI for API documentation
- Endpoint: `/api/swagger-ui.html` or `/api/docs`
- Document all endpoints, request/response schemas, and error codes

