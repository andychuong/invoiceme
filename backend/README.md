# InvoiceMe Backend API

A production-quality Spring Boot REST API for multi-tenant invoice management, built following Domain-Driven Design (DDD), CQRS, and Vertical Slice Architecture principles.

## Features

### Core Functionality
- **Customer Management** - CRUD operations for customers with company scoping
- **Invoice Management** - Create, update, and track invoices with line items
- **Payment Processing** - Record and track payments against invoices
- **Multi-Tenancy** - Complete data isolation between companies

### Company & Team Management
- **Company Management** - Create companies, manage settings, white-labeling
- **User Management** - User authentication, profile management
- **Team Collaboration** - Company memberships with role-based access
- **Secure Invitations** - Company code system for team invitations
- **Access Control** - Admin controls for removing users and regenerating codes

### Security & Architecture
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Admin, Accountant, and Operator roles
- **Clean Architecture** - Clear separation of Domain, Application, and Infrastructure layers
- **CQRS Pattern** - Separated Commands (write) and Queries (read)
- **Database Migrations** - Version-controlled schema with Flyway

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 17 | Programming language |
| **Spring Boot** | 3.2.0 | Application framework |
| **Spring Security** | 6.x | Authentication & authorization |
| **Spring Data JPA** | 3.x | Database access |
| **PostgreSQL** | 12+ | Production database |
| **H2** | 2.x | Development/testing database |
| **Flyway** | 9.x | Database migrations |
| **Lombok** | 1.18.x | Boilerplate reduction |
| **Maven** | 3.6+ | Build tool |

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/invoiceme/
│   │   │   │
│   │   │   ├── domain/                    # Domain Layer (DDD)
│   │   │   │   ├── customer/
│   │   │   │   │   └── Customer.java      # Customer entity
│   │   │   │   ├── invoice/
│   │   │   │   │   ├── Invoice.java       # Invoice aggregate root
│   │   │   │   │   └── InvoiceLineItem.java
│   │   │   │   ├── payment/
│   │   │   │   │   └── Payment.java       # Payment entity
│   │   │   │   ├── company/
│   │   │   │   │   ├── Company.java       # Company entity
│   │   │   │   │   └── CompanyMembership.java
│   │   │   │   └── user/
│   │   │   │       └── User.java          # User entity
│   │   │   │
│   │   │   ├── application/               # Application Layer (CQRS)
│   │   │   │   ├── commands/              # Write operations
│   │   │   │   │   ├── customer/
│   │   │   │   │   │   ├── CreateCustomerCommand.java
│   │   │   │   │   │   ├── CreateCustomerHandler.java
│   │   │   │   │   │   ├── UpdateCustomerCommand.java
│   │   │   │   │   │   └── UpdateCustomerHandler.java
│   │   │   │   │   ├── invoice/
│   │   │   │   │   └── payment/
│   │   │   │   │
│   │   │   │   └── queries/               # Read operations
│   │   │   │       ├── customer/
│   │   │   │       │   ├── GetCustomerByIdQuery.java
│   │   │   │       │   ├── GetCustomerByIdHandler.java
│   │   │   │       │   ├── ListCustomersQuery.java
│   │   │   │       │   └── ListCustomersHandler.java
│   │   │   │       ├── invoice/
│   │   │   │       └── payment/
│   │   │   │
│   │   │   └── infrastructure/            # Infrastructure Layer
│   │   │       ├── api/                   # REST API
│   │   │       │   ├── controller/
│   │   │       │   │   ├── AuthController.java
│   │   │       │   │   ├── CustomerController.java
│   │   │       │   │   ├── InvoiceController.java
│   │   │       │   │   ├── PaymentController.java
│   │   │       │   │   ├── CompanyController.java
│   │   │       │   │   └── UserController.java
│   │   │       │   │
│   │   │       │   └── dto/               # Data Transfer Objects
│   │   │       │       ├── auth/
│   │   │       │       ├── customer/
│   │   │       │       ├── invoice/
│   │   │       │       ├── payment/
│   │   │       │       ├── company/
│   │   │       │       └── user/
│   │   │       │
│   │   │       ├── persistence/           # Database access
│   │   │       │   ├── CustomerRepository.java
│   │   │       │   ├── InvoiceRepository.java
│   │   │       │   ├── PaymentRepository.java
│   │   │       │   ├── CompanyRepository.java
│   │   │       │   ├── UserRepository.java
│   │   │       │   └── CompanyMembershipRepository.java
│   │   │       │
│   │   │       └── config/                # Configuration
│   │   │           └── security/
│   │   │               ├── SecurityConfig.java
│   │   │               ├── JwtTokenProvider.java
│   │   │               ├── JwtAuthenticationFilter.java
│   │   │               ├── CustomUserDetails.java
│   │   │               └── CustomUserDetailsService.java
│   │   │
│   │   └── resources/
│   │       ├── application.properties     # Default configuration
│   │       ├── application-local.properties  # Local development
│   │       ├── application-dev.properties    # Development (H2)
│   │       └── db/migration/              # Flyway migrations
│   │           ├── V1__Create_customers_table.sql
│   │           ├── V2__Create_invoices_table.sql
│   │           ├── V3__Create_invoice_line_items_table.sql
│   │           ├── V4__Create_payments_table.sql
│   │           ├── V5__Create_companies_and_users_tables.sql
│   │           └── V6__Add_company_code_and_remove_defaults.sql
│   │
│   └── test/
│       └── java/com/invoiceme/
│           └── integration/
│               └── CustomerInvoicePaymentIntegrationTest.java
│
└── pom.xml                                # Maven configuration
```

## Getting Started

### Prerequisites

- **Java 17** or higher
- **Maven 3.6+** (or use included Maven wrapper)
- **PostgreSQL 12+** (for production)
- **Git** (for version control)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd "Teamfront InvoiceMe/backend"
```

2. **Set up PostgreSQL database:**
```bash
# Create database
createdb invoiceme

# Or using psql
psql -U postgres
CREATE DATABASE invoiceme;
\q
```

3. **Configure database connection:**

Create `src/main/resources/application-local.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/invoiceme
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Configuration
jwt.secret=your-super-secret-key-minimum-256-bits-for-production
jwt.expiration=86400000

# CORS Configuration
cors.allowed-origins=http://localhost:3000
```

4. **Run the application:**

**Option 1: Using Maven wrapper (recommended)**
```bash
# macOS/Linux - Ensure Java 17 is used
export JAVA_HOME=/opt/homebrew/opt/openjdk@17  # Adjust path as needed
export PATH=$JAVA_HOME/bin:$PATH

./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

**Option 2: Using installed Maven**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

**Option 3: Using the startup script**
```bash
# Create and run the startup script
./start-backend.sh
```

5. **Verify the application is running:**
```bash
curl http://localhost:8080/api/auth/login
```

The API will be available at `http://localhost:8080/api`

### Quick Start Script

Create `start-backend.sh` in the backend directory:

```bash
#!/bin/bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH=$JAVA_HOME/bin:$PATH
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Make it executable:
```bash
chmod +x start-backend.sh
```

## Architecture

### Clean Architecture Layers

#### 1. Domain Layer (`com.invoiceme.domain`)
**Purpose:** Contains pure business logic and entities

- **Entities**: Customer, Invoice, Payment, Company, User, CompanyMembership
- **Business Rules**: Validation, domain logic
- **No Dependencies**: Independent of frameworks

**Example:**
```java
@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;
    
    // Business logic
    public void update(String name, String email, String address, String phone) {
        validate(name, email);
        this.name = name;
        this.email = email;
        this.address = address;
        this.phone = phone;
    }
}
```

#### 2. Application Layer (`com.invoiceme.application`)
**Purpose:** Orchestrates business workflows using CQRS

**Commands (Write Operations):**
```java
@Service
public class CreateCustomerHandler {
    @Transactional
    public Customer handle(CreateCustomerCommand command) {
        Company company = companyRepository.findById(command.getCompanyId())
            .orElseThrow(() -> new IllegalArgumentException("Company not found"));
            
        Customer customer = Customer.create(
            command.getName(),
            command.getEmail(),
            command.getAddress(),
            command.getPhone(),
            company
        );
        
        return customerRepository.save(customer);
    }
}
```

**Queries (Read Operations):**
```java
@Service
public class ListCustomersHandler {
    @Transactional(readOnly = true)
    public Page<Customer> handle(ListCustomersQuery query) {
        return customerRepository.findByCompanyId(
            query.getCompanyId(), 
            query.getPageable()
        );
    }
}
```

#### 3. Infrastructure Layer (`com.invoiceme.infrastructure`)
**Purpose:** Handles external concerns (API, persistence, security)

- **REST Controllers**: HTTP endpoints
- **Repositories**: Database access
- **Security**: JWT authentication, RBAC
- **DTOs**: API contracts

### CQRS Pattern

**Benefits:**
- Clear separation of read and write operations
- Optimized queries for different use cases
- Better scalability
- Easier to reason about data flow

**Example Flow:**
```
Client → Controller → Command/Query → Handler → Repository → Database
```

## Security

### Authentication Flow

1. **User Login:**
   - POST `/api/auth/login` with username/password
   - Backend validates credentials (BCrypt)
   - Returns JWT token + user data

2. **Authenticated Requests:**
   - Client sends `Authorization: Bearer <JWT>` header
   - `JwtAuthenticationFilter` validates token
   - Loads `CustomUserDetails` with company memberships
   - Request proceeds with authenticated context

3. **Authorization:**
   - Role-based access control (RBAC)
   - Company-scoped data access
   - Resource-level permissions

### User Roles

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full access: manage company, users, customers, invoices, payments |
| **ACCOUNTANT** | Manage customers, invoices, payments (no company management) |
| **OPERATOR** | View and create customers, invoices (read-only payments) |

### Multi-Tenancy

**Strategy:** Shared database with discriminator column (`company_id`)

**Implementation:**
- Every tenant-scoped table has `company_id` foreign key
- All queries automatically filtered by `company_id`
- Row-level security enforced at application layer
- Repository methods are company-scoped

**Example:**
```java
@Query("SELECT c FROM Customer c WHERE c.company.id = :companyId")
Page<Customer> findByCompanyId(@Param("companyId") UUID companyId, Pageable pageable);
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/signup` - Create new company and user (auto-login)
- `POST /api/auth/join` - Join existing company with code (auto-login)

### Companies (Admin only)
- `GET /api/companies/{id}` - Get company details
- `PUT /api/companies/{id}` - Update company (name, logo)
- `GET /api/companies/{id}/members` - List team members
- `POST /api/companies/{id}/regenerate-code` - Regenerate company code
- `DELETE /api/companies/{companyId}/members/{userId}` - Remove member

### Customers
- `GET /api/customers` - List customers (paginated, company-scoped)
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Invoices
- `GET /api/invoices` - List invoices (paginated, company-scoped)
- `GET /api/invoices/{id}` - Get invoice by ID
- `GET /api/invoices/status/{status}` - List invoices by status
- `GET /api/invoices/customer/{customerId}` - List invoices by customer
- `POST /api/invoices` - Create invoice (Draft status)
- `PUT /api/invoices/{id}` - Update invoice (Draft only)
- `POST /api/invoices/{id}/mark-sent` - Mark invoice as Sent

### Payments
- `GET /api/payments/invoice/{invoiceId}` - List payments for invoice
- `GET /api/payments/{id}` - Get payment by ID
- `POST /api/payments` - Record payment

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

## Database

### Schema Overview

**Core Tables:**
- `companies` - Company information and settings
- `users` - User accounts
- `company_memberships` - User-company relationships with roles
- `customers` - Customer information (company-scoped)
- `invoices` - Invoice headers (company-scoped)
- `invoice_line_items` - Invoice line items
- `payments` - Payment records

### Migrations

Flyway automatically runs migrations on startup:

```sql
-- V5__Create_companies_and_users_tables.sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    profile_picture_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, company_id)
);
```

### Adding New Migrations

1. Create new file: `V{version}__{description}.sql`
2. Write SQL DDL statements
3. Restart application (migrations run automatically)

**Example:**
```sql
-- V7__Add_customer_notes.sql
ALTER TABLE customers ADD COLUMN notes TEXT;
```

## Testing

### Run All Tests
```bash
./mvnw test
```

### Run Integration Tests
```bash
./mvnw test -Dtest=*IntegrationTest
```

### Integration Test Example

```java
@SpringBootTest
@ActiveProfiles("dev")
@Transactional
public class CustomerInvoicePaymentIntegrationTest {
    @Test
    public void testCompleteCustomerInvoicePaymentFlow() {
        // 1. Create company
        Company company = new Company();
        company.setName("Test Company");
        company = companyRepository.save(company);

        // 2. Create customer
        CreateCustomerCommand customerCommand = new CreateCustomerCommand(
            company.getId(), "John Doe", "john@example.com", "123 Main St", "555-1234"
        );
        Customer customer = createCustomerHandler.handle(customerCommand);

        // 3. Create invoice
        // 4. Record payment
        // 5. Verify invoice status
    }
}
```

## Environment Variables

### Required Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | Database connection URL | `jdbc:postgresql://localhost:5432/invoiceme` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `your_password` |
| `JWT_SECRET` | JWT signing secret (256+ bits) | `your-super-secret-key-here` |
| `JWT_EXPIRATION` | JWT expiration time (ms) | `86400000` (24 hours) |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |

### Profiles

- **local**: Local development with PostgreSQL
- **dev**: Development with H2 in-memory database
- **prod**: Production configuration

## Deployment

### Railway Deployment

1. **Create PostgreSQL service** on Railway
2. **Set environment variables:**
```
DATABASE_URL=<railway-postgres-url>
JWT_SECRET=<your-secret-key>
CORS_ALLOWED_ORIGINS=<frontend-url>
```
3. **Deploy** the application

### Build for Production

```bash
# Build JAR file
./mvnw clean package

# Run JAR
java -jar target/invoiceme-backend-1.0.0.jar
```

### Docker Deployment

```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/invoiceme-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build and run:
```bash
docker build -t invoiceme-backend .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/invoiceme \
  -e JWT_SECRET=your-secret \
  invoiceme-backend
```

## Development

### Adding a New Feature

1. **Domain Layer**: Create/update entity
2. **Application Layer**: Create Command/Query and Handler
3. **Infrastructure Layer**:
   - Add repository method if needed
   - Create DTOs
   - Add controller endpoint
4. **Database**: Create migration if schema changes
5. **Test**: Write integration test

### Code Style

- Follow Java naming conventions
- Use Lombok for boilerplate reduction
- Use `@Transactional` for write operations
- Use `@Transactional(readOnly = true)` for queries
- Validate input in handlers
- Return appropriate HTTP status codes

## Troubleshooting

### Common Issues

**Issue: "Port 8080 already in use"**
```bash
# Find and kill process
lsof -i:8080
kill -9 <PID>
```

**Issue: "Flyway checksum mismatch"**
```bash
# Reset database
dropdb invoiceme
createdb invoiceme
# Restart application
```

**Issue: "Java version mismatch"**
```bash
# Check Java version
java -version

# Set JAVA_HOME (macOS with Homebrew)
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH=$JAVA_HOME/bin:$PATH
```

**Issue: "Bad credentials" on login**
- Verify password hash in database
- Check BCrypt encoder configuration
- Ensure migrations ran successfully

## Additional Resources

- [Architecture Documentation](../docs/ARCHITECTURE.md)
- [Deployment Guide](../docs/plan/DEPLOYMENT-QUICK-START.md)
- [Database Setup](../docs/DATABASE_SETUP.md)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Documentation](https://spring.io/projects/spring-security)

## License

This project is part of the InvoiceMe assessment.

---

**Version:** 1.0  
**Last Updated:** November 9, 2024  
**Framework:** Spring Boot 3.2.0 with Java 17
