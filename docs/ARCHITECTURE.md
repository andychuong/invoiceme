# InvoiceMe Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Principles](#architecture-principles)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Database Design](#database-design)
6. [Security Architecture](#security-architecture)
7. [Multi-Tenancy Design](#multi-tenancy-design)
8. [API Design](#api-design)
9. [Data Flow](#data-flow)
10. [Deployment Architecture](#deployment-architecture)

---

## System Overview

InvoiceMe is a modern, multi-tenant invoice management system built with a clear separation between backend and frontend, following industry best practices for scalability, maintainability, and security.

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                         Frontend                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │         Next.js 16 (React 19 + TypeScript)         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │   Pages    │  │ Components │  │  Services  │    │  │
│  │  │(App Router)│  │ (Chakra UI)│  │   (API)    │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS / REST API
                            │ (JWT Authentication)
                            ▼
┌────────────────────────────────────────────────────────────┐
│                         Backend                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Spring Boot 3.2 (Java 17)                    │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │         Infrastructure Layer                   │  │  │
│  │  │  • REST Controllers                            │  │  │
│  │  │  • Security (JWT, RBAC)                        │  │  │
│  │  │  • DTOs & Mappers                              │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │         Application Layer                      │  │  │
│  │  │  • Commands (Write Operations)                 │  │  │
│  │  │  • Queries (Read Operations)                   │  │  │
│  │  │  • CQRS Pattern                                │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │         Domain Layer                           │  │  │
│  │  │  • Entities (Customer, Invoice, Payment)       │  │  │
│  │  │  • Business Logic                              │  │  │
│  │  │  • Domain Rules                                │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
                            │
                            │ JDBC
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                    │
│  • Multi-tenant data with company_id isolation              │
│  • Flyway migrations for schema management                  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16, React 19, TypeScript | Modern web application framework |
| **UI Library** | Chakra UI v3 | Component library and design system |
| **Backend** | Spring Boot 3.2, Java 17 | Enterprise-grade backend framework |
| **Security** | Spring Security, JWT | Authentication and authorization |
| **Database** | PostgreSQL | Relational database with ACID compliance |
| **ORM** | Spring Data JPA, Hibernate | Object-relational mapping |
| **Migrations** | Flyway | Database version control |
| **API** | REST | HTTP-based API communication |

---

## Architecture Principles

### 1. Clean Architecture

The system follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                  │
│  (Controllers, Repositories, External Services)         │
│  • Depends on: Application + Domain                     │
│  • Contains: REST APIs, Database Access, Security       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                     │
│  (Use Cases, Commands, Queries)                         │
│  • Depends on: Domain                                   │
│  • Contains: Business workflows, CQRS handlers          │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Domain Layer                          │
│  (Entities, Business Rules)                             │
│  • Depends on: Nothing (Pure business logic)            │
│  • Contains: Core entities, Domain rules                │
└─────────────────────────────────────────────────────────┘
```

**Benefits:**
- **Independence**: Domain logic is independent of frameworks
- **Testability**: Core business logic can be tested in isolation
- **Flexibility**: Easy to swap out infrastructure components
- **Maintainability**: Clear boundaries between layers

### 2. CQRS (Command Query Responsibility Segregation)

Separates read and write operations for better scalability and clarity:

**Commands (Write Operations):**
```java
CreateCustomerCommand → CreateCustomerHandler → Customer Entity
UpdateInvoiceCommand → UpdateInvoiceHandler → Invoice Entity
```

**Queries (Read Operations):**
```java
ListCustomersQuery → ListCustomersHandler → List<Customer>
GetInvoiceByIdQuery → GetInvoiceByIdHandler → Invoice
```

**Benefits:**
- Clear separation of concerns
- Optimized read and write models
- Better performance tuning opportunities
- Easier to reason about data flow

### 3. Vertical Slice Architecture

Features are organized by business capability, not technical layer:

```
customer/
├── commands/
│   ├── CreateCustomerCommand.java
│   ├── CreateCustomerHandler.java
│   ├── UpdateCustomerCommand.java
│   └── UpdateCustomerHandler.java
├── queries/
│   ├── GetCustomerByIdQuery.java
│   ├── GetCustomerByIdHandler.java
│   ├── ListCustomersQuery.java
│   └── ListCustomersHandler.java
└── Customer.java (Domain Entity)
```

**Benefits:**
- Features are self-contained
- Easy to locate related code
- Reduced coupling between features
- Parallel development friendly

### 4. Domain-Driven Design (DDD)

The domain model drives the architecture:

**Entities:**
- `Customer` - Represents a business customer
- `Invoice` - Represents a billable document
- `Payment` - Represents a financial transaction
- `Company` - Represents a tenant organization
- `User` - Represents a system user

**Aggregates:**
- Invoice is the aggregate root for LineItems
- Company is the aggregate root for CompanyMemberships

**Value Objects:**
- Invoice status (DRAFT, SENT, PAID)
- User roles (ADMIN, ACCOUNTANT, OPERATOR)

---

## Backend Architecture

### Layer Structure

#### 1. Domain Layer (`com.invoiceme.domain`)

**Purpose:** Contains pure business logic and entities

**Components:**
- **Entities**: Customer, Invoice, Payment, Company, User, CompanyMembership
- **Business Rules**: Invoice validation, payment application logic
- **Domain Events**: (Future: InvoiceCreated, PaymentReceived)

**Key Characteristics:**
- No dependencies on frameworks
- Pure Java objects (POJOs)
- Contains business validation logic
- Uses JPA annotations only for persistence mapping

**Example Entity:**
```java
@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;
    
    // Business logic
    public void update(String name, String email, String address, String phone) {
        validate(name, email);
        this.name = name;
        this.email = email;
        // ...
    }
    
    private void validate(String name, String email) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer name cannot be empty");
        }
        // ...
    }
}
```

#### 2. Application Layer (`com.invoiceme.application`)

**Purpose:** Orchestrates business workflows using CQRS pattern

**Commands (Write Operations):**
```java
// Command DTO
public class CreateCustomerCommand {
    private UUID companyId;
    private String name;
    private String email;
    private String address;
    private String phone;
}

// Command Handler
@Service
public class CreateCustomerHandler {
    private final CustomerRepository customerRepository;
    private final CompanyRepository companyRepository;
    
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
// Query DTO
public class ListCustomersQuery {
    private UUID companyId;
    private Pageable pageable;
}

// Query Handler
@Service
public class ListCustomersHandler {
    private final CustomerRepository customerRepository;
    
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

**Components:**

**a) API Controllers:**
```java
@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CreateCustomerHandler createCustomerHandler;
    private final ListCustomersHandler listCustomersHandler;
    
    @PostMapping
    public ResponseEntity<CustomerResponseDTO> createCustomer(
            @Valid @RequestBody CustomerRequestDTO request,
            Authentication authentication) {
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UUID companyId = userDetails.getDefaultCompanyId();
        
        CreateCustomerCommand command = new CreateCustomerCommand(
            companyId,
            request.getName(),
            request.getEmail(),
            request.getAddress(),
            request.getPhone()
        );
        
        Customer customer = createCustomerHandler.handle(command);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(customerMapper.toResponseDTO(customer));
    }
}
```

**b) Repositories:**
```java
@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    // Company-scoped queries for multi-tenancy
    @Query("SELECT c FROM Customer c WHERE c.company.id = :companyId")
    Page<Customer> findByCompanyId(@Param("companyId") UUID companyId, Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE c.id = :id AND c.company.id = :companyId")
    Optional<Customer> findByIdAndCompanyId(@Param("id") UUID id, @Param("companyId") UUID companyId);
}
```

**c) Security Configuration:**
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/companies/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### Design Patterns Used

| Pattern | Usage | Benefit |
|---------|-------|---------|
| **Repository** | Data access abstraction | Decouples domain from persistence |
| **Factory** | Entity creation | Encapsulates complex object creation |
| **Strategy** | Payment processing | Flexible payment methods |
| **DTO** | API boundaries | Separates API contracts from domain |
| **Mapper** | DTO ↔ Entity conversion | Clean transformation logic |
| **Builder** | Complex object construction | Readable object creation |

---

## Frontend Architecture

### Component Structure

```
frontend/
├── app/                        # Next.js App Router
│   ├── (auth)/                # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/           # Protected pages
│   │   ├── customers/
│   │   ├── invoices/
│   │   ├── payments/
│   │   └── company/
│   └── layout.tsx
│
├── components/                 # Reusable components
│   ├── user/
│   │   └── UserProfileModal.tsx
│   └── ...
│
├── services/                   # Business logic
│   ├── api/                   # API service layer
│   │   ├── customerService.ts
│   │   ├── invoiceService.ts
│   │   ├── companyService.ts
│   │   └── userService.ts
│   ├── authService.ts         # Authentication logic
│   └── httpClient.ts          # HTTP client wrapper
│
├── types/                      # TypeScript types
│   └── index.ts               # Shared type definitions
│
└── theme/                      # UI theme
    └── index.ts               # Chakra UI theme
```

### Key Architectural Decisions

#### 1. Service Layer Pattern

All API calls go through service classes:

```typescript
// services/api/customerService.ts
class CustomerService {
  private readonly BASE_URL = '/customers';

  async getCustomers(page: number = 0, size: number = 20): Promise<PageResponse<Customer>> {
    return httpClient.get<PageResponse<Customer>>(
      `${this.BASE_URL}?page=${page}&size=${size}`
    );
  }

  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    return httpClient.post<Customer>(this.BASE_URL, data);
  }
}

export const customerService = new CustomerService();
```

**Benefits:**
- Centralized API logic
- Easy to mock for testing
- Consistent error handling
- Type safety with TypeScript

#### 2. Authentication Service

Manages JWT tokens and user state:

```typescript
class AuthService {
  login(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  isAdmin(): boolean {
    const userData = this.getUserData();
    return userData?.role === 'ADMIN';
  }
}
```

#### 3. HTTP Client with Interceptors

Centralized HTTP client with JWT injection:

```typescript
class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Add JWT token
    this.client.interceptors.request.use((config) => {
      const token = authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          authService.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
}
```

#### 4. Route Protection

Protected routes with authentication checks:

```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userData, setUserData] = useState<AuthResponse | null>(null);

  useEffect(() => {
    const storedUserData = authService.getUserData();
    if (!storedUserData) {
      router.push('/login');
      return;
    }
    setUserData(storedUserData);
  }, [router]);

  if (!userData) {
    return <Spinner />;
  }

  return <>{children}</>;
}
```

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────────┐
│    companies    │
├─────────────────┤
│ id (PK)         │
│ name            │
│ logo_url        │
│ company_code    │◄─────────┐
│ created_at      │          │
│ updated_at      │          │
└─────────────────┘          │
         │                   │
         │ 1                 │
         │                   │
         │ N                 │
         ▼                   │
┌─────────────────┐          │
│     users       │          │
├─────────────────┤          │
│ id (PK)         │          │
│ username        │          │
│ password        │          │
│ email           │          │
│ display_name    │          │
│ profile_pic_url │          │
│ created_at      │          │
│ updated_at      │          │
└─────────────────┘          │
         │                   │
         │ 1                 │
         │                   │
         │ N                 │
         ▼                   │
┌─────────────────┐          │
│company_memberships│        │
├─────────────────┤          │
│ id (PK)         │          │
│ user_id (FK)    │          │
│ company_id (FK) │──────────┘
│ role            │
│ created_at      │
└─────────────────┘
         │
         │ company_id
         │
         ▼
┌─────────────────┐
│   customers     │
├─────────────────┤
│ id (PK)         │
│ company_id (FK) │
│ name            │
│ email           │
│ address         │
│ phone           │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │ 1
         │
         │ N
         ▼
┌─────────────────┐
│    invoices     │
├─────────────────┤
│ id (PK)         │
│ company_id (FK) │
│ customer_id (FK)│
│ invoice_number  │
│ issue_date      │
│ due_date        │
│ status          │
│ total_amount    │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │ 1
         ├──────────────┐
         │ N            │ N
         ▼              ▼
┌─────────────────┐  ┌─────────────────┐
│invoice_line_items│  │    payments     │
├─────────────────┤  ├─────────────────┤
│ id (PK)         │  │ id (PK)         │
│ invoice_id (FK) │  │ invoice_id (FK) │
│ description     │  │ amount          │
│ quantity        │  │ payment_date    │
│ unit_price      │  │ payment_method  │
│ amount          │  │ reference       │
│ created_at      │  │ created_at      │
└─────────────────┘  └─────────────────┘
```

### Multi-Tenancy Strategy

**Approach:** Shared database with discriminator column (`company_id`)

**Implementation:**
- Every tenant-scoped table has a `company_id` foreign key
- All queries include `WHERE company_id = :companyId`
- Row-level security enforced at application layer
- Repository methods are company-scoped

**Example:**
```sql
-- All customer queries are scoped by company
SELECT * FROM customers WHERE company_id = 'abc-123' AND id = 'xyz-789';

-- Prevents cross-tenant data access
SELECT * FROM invoices WHERE company_id = 'abc-123';
```

### Database Migrations

**Tool:** Flyway

**Migration Files:**
```
db/migration/
├── V1__Create_customers_table.sql
├── V2__Create_invoices_table.sql
├── V3__Create_invoice_line_items_table.sql
├── V4__Create_payments_table.sql
├── V5__Create_companies_and_users_tables.sql
└── V6__Add_company_code_and_remove_defaults.sql
```

**Benefits:**
- Version-controlled schema changes
- Automatic migration on startup
- Rollback support
- Consistent across environments

---

## Security Architecture

### Authentication Flow

```
┌──────────┐                                    ┌──────────┐
│  Client  │                                    │  Server  │
└────┬─────┘                                    └────┬─────┘
     │                                               │
     │  1. POST /api/auth/login                      │
     │    { username, password }                     │
     ├──────────────────────────────────────────────►│
     │                                               │
     │                                         2. Validate
     │                                            credentials
     │                                               │
     │  3. Return JWT + User Data                    │
     │    { token, userId, username, role, ... }     │
     │◄──────────────────────────────────────────────┤
     │                                               │
4. Store JWT                                         │
   in localStorage                                   │
     │                                               │
     │  5. Subsequent requests                       │
     │     Authorization: Bearer <JWT>               │
     ├──────────────────────────────────────────────►│
     │                                               │
     │                                         6. Validate JWT
     │                                            Extract user info
     │                                               │
     │  7. Return requested data                     │
     │◄──────────────────────────────────────────────┤
     │                                               │
```

### JWT Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "john",
    "userId": "abc-123",
    "role": "ADMIN",
    "companyId": "xyz-789",
    "iat": 1699564800,
    "exp": 1699651200
  },
  "signature": "..."
}
```

### Authorization Levels

#### 1. Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full access: manage company, users, customers, invoices, payments |
| **ACCOUNTANT** | Manage customers, invoices, payments (no company management) |
| **OPERATOR** | View and create customers, invoices (read-only payments) |

#### 2. Company-Scoped Access

All data access is automatically scoped to the user's company:

```java
@GetMapping
public ResponseEntity<PageResponseDTO<CustomerResponseDTO>> listCustomers(
        Authentication authentication) {
    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
    UUID companyId = userDetails.getDefaultCompanyId();
    
    // All queries automatically filtered by companyId
    ListCustomersQuery query = new ListCustomersQuery(companyId, pageable);
    // ...
}
```

#### 3. Resource-Level Authorization

Users can only access resources within their company:

```java
@GetMapping("/{id}")
public ResponseEntity<CustomerResponseDTO> getCustomer(
        @PathVariable UUID id,
        Authentication authentication) {
    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
    UUID companyId = userDetails.getDefaultCompanyId();
    
    // Query includes company_id check
    GetCustomerByIdQuery query = new GetCustomerByIdQuery(id, companyId);
    Customer customer = handler.handle(query); // Throws exception if not found
    // ...
}
```

### Security Best Practices

1. **Password Hashing:** BCrypt with salt
2. **JWT Expiration:** Configurable (default: 24 hours)
3. **HTTPS Only:** All production traffic over TLS
4. **CORS Configuration:** Whitelist allowed origins
5. **SQL Injection Prevention:** Parameterized queries via JPA
6. **XSS Prevention:** Input validation and output encoding
7. **CSRF Protection:** Disabled for stateless API (JWT-based)

---

## Multi-Tenancy Design

### Tenant Isolation Strategy

**Level:** Application-level (shared database, discriminator column)

**Advantages:**
- Cost-effective (single database)
- Easy to manage and backup
- Simpler deployment
- Good for SaaS with many small tenants

**Implementation:**

1. **Company Identification:**
   - Each company has a unique `company_code` (UUID)
   - Users belong to companies via `company_memberships` table
   - JWT contains `companyId` for request context

2. **Data Isolation:**
   - All tenant-scoped tables have `company_id` column
   - Repository methods enforce company filtering
   - No cross-tenant queries possible

3. **Tenant Context:**
```java
public class CustomUserDetails implements UserDetails {
    private final UUID userId;
    private final List<CompanyMembership> memberships;
    
    public UUID getDefaultCompanyId() {
        return memberships.isEmpty() ? null : memberships.get(0).getCompany().getId();
    }
}
```

### Company Management Features

1. **Company Creation:**
   - User signs up → Creates company → Becomes admin
   - Company gets unique `company_code` for invitations

2. **Team Invitations:**
   - Share `company_code` with team members
   - New users join existing company using code
   - Assigned role: OPERATOR (can be changed by admin)

3. **Security Features:**
   - Admins can regenerate `company_code` if leaked
   - Admins can remove users from company
   - Removed users lose all access to company data

4. **White-Labeling:**
   - Custom company name displayed in UI
   - Custom logo support
   - Per-company branding

---

## API Design

### RESTful Principles

**Resource-Based URLs:**
```
GET    /api/customers           # List customers
GET    /api/customers/{id}      # Get customer
POST   /api/customers           # Create customer
PUT    /api/customers/{id}      # Update customer
DELETE /api/customers/{id}      # Delete customer
```

**HTTP Status Codes:**
- `200 OK` - Successful GET, PUT
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Request/Response Format

**Request:**
```json
POST /api/customers
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "name": "Acme Corp",
  "email": "contact@acme.com",
  "phone": "(555) 123-4567",
  "address": "123 Main St, City, State 12345"
}
```

**Response:**
```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "abc-123-def-456",
  "name": "Acme Corp",
  "email": "contact@acme.com",
  "phone": "(555) 123-4567",
  "address": "123 Main St, City, State 12345",
  "createdAt": "2024-11-09T10:30:00Z",
  "updatedAt": "2024-11-09T10:30:00Z"
}
```

### Pagination

**Request:**
```
GET /api/customers?page=0&size=20&sort=name,asc
```

**Response:**
```json
{
  "content": [ /* array of customers */ ],
  "page": 0,
  "size": 20,
  "totalElements": 150,
  "totalPages": 8,
  "first": true,
  "last": false
}
```

### Error Handling

**Validation Error:**
```json
HTTP/1.1 400 Bad Request

{
  "timestamp": "2024-11-09T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Customer with email contact@acme.com already exists",
  "path": "/api/customers"
}
```

---

## Data Flow

### Create Invoice Flow

```
┌────────┐     ┌──────────┐     ┌─────────────┐     ┌──────────┐     ┌──────────┐
│ Client │────►│Controller│────►│   Handler   │────►│Repository│────►│ Database │
└────────┘     └──────────┘     └─────────────┘     └──────────┘     └──────────┘
    │               │                   │                  │                │
    │ 1. POST       │                   │                  │                │
    │  /invoices    │                   │                  │                │
    ├──────────────►│                   │                  │                │
    │               │ 2. Extract        │                  │                │
    │               │    companyId      │                  │                │
    │               │    from JWT       │                  │                │
    │               ├──────────────────►│                  │                │
    │               │                   │ 3. Validate      │                │
    │               │                   │    customer      │                │
    │               │                   │    belongs to    │                │
    │               │                   │    company       │                │
    │               │                   ├─────────────────►│                │
    │               │                   │                  │ 4. Check       │
    │               │                   │                  │    customer    │
    │               │                   │                  ├───────────────►│
    │               │                   │                  │◄───────────────┤
    │               │                   │◄─────────────────┤                │
    │               │                   │ 5. Create        │                │
    │               │                   │    invoice       │                │
    │               │                   │    entity        │                │
    │               │                   ├─────────────────►│                │
    │               │                   │                  │ 6. INSERT      │
    │               │                   │                  ├───────────────►│
    │               │                   │                  │◄───────────────┤
    │               │                   │◄─────────────────┤                │
    │               │◄──────────────────┤                  │                │
    │               │ 7. Map to DTO     │                  │                │
    │◄──────────────┤                   │                  │                │
    │ 8. 201        │                   │                  │                │
    │    Created    │                   │                  │                │
```

### Authentication Flow (Detailed)

```
┌────────┐     ┌──────────┐     ┌─────────────┐     ┌──────────┐     ┌──────────┐
│ Client │────►│  Auth    │────►│   User      │────►│   JWT    │────►│ Response │
│        │     │Controller│     │   Service   │     │ Provider │     │          │
└────────┘     └──────────┘     └─────────────┘     └──────────┘     └──────────┘
    │               │                   │                  │                │
    │ 1. POST       │                   │                  │                │
    │  /auth/login  │                   │                  │                │
    ├──────────────►│                   │                  │                │
    │               │ 2. Load user      │                  │                │
    │               │    with company   │                  │                │
    │               │    memberships    │                  │                │
    │               ├──────────────────►│                  │                │
    │               │                   │ 3. Verify        │                │
    │               │                   │    password      │                │
    │               │                   │    (BCrypt)      │                │
    │               │◄──────────────────┤                  │                │
    │               │ 4. Generate JWT   │                  │                │
    │               ├──────────────────────────────────────►│                │
    │               │                   │                  │ 5. Sign JWT    │
    │               │◄──────────────────────────────────────┤                │
    │               │ 6. Build response │                  │                │
    │               ├────────────────────────────────────────────────────────►│
    │◄──────────────────────────────────────────────────────────────────────┤
    │ 7. Return     │                   │                  │                │
    │    JWT + user │                   │                  │                │
    │    data       │                   │                  │                │
```

---

## Deployment Architecture

### Production Deployment (Railway)

```
┌────────────────────────────────────────────────────────────┐
│                        Railway Platform                    │
│                                                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │                Frontend Service                    │    │
│  │  • Next.js application                             │    │
│  │  • Environment: NEXT_PUBLIC_API_URL                │    │
│  │  • Port: 3000                                      │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                 │
│                          │ HTTPS                           │
│                          ▼                                 │
│  ┌────────────────────────────────────────────────────┐    │
│  │                Backend Service                     │    │
│  │  • Spring Boot application                         │    │
│  │  • Environment: DATABASE_URL, JWT_SECRET           │    │
│  │  • Port: 8080                                      │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                 │
│                          │ JDBC                            │
│                          ▼                                 │
│  ┌────────────────────────────────────────────────────┐    │
│  │              PostgreSQL Database                   │    │
│  │  • Managed PostgreSQL instance                     │    │
│  │  • Automatic backups                               │    │
│  │  • Connection pooling                              │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Local Development

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Frontend       │────►│    Backend       │────►│   PostgreSQL     │
│  localhost:3000  │     │  localhost:8080  │     │  localhost:5432  │
│                  │     │                  │     │                  │
│  • npm run dev   │     │  • mvn spring-   │     │  • Local DB      │
│  • Hot reload    │     │    boot:run      │     │  • invoiceme     │
│  • Dev mode      │     │  • Auto-restart  │     │    database      │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### Scaling Considerations

**Horizontal Scaling:**
- Frontend: Stateless, can scale to N instances
- Backend: Stateless (JWT), can scale to N instances
- Database: Vertical scaling, read replicas for read-heavy workloads

**Caching Strategy:**
- Browser caching for static assets
- API response caching (future: Redis)
- Database query optimization with indexes

**Performance Optimizations:**
- Lazy loading of entities
- Pagination for large datasets
- Database indexes on foreign keys
- Connection pooling

---

## Conclusion

InvoiceMe demonstrates a production-ready architecture with:

✅ **Clean separation of concerns** (Domain, Application, Infrastructure)  
✅ **CQRS pattern** for clear read/write separation  
✅ **Multi-tenancy** with complete data isolation  
✅ **Security-first** design with JWT and RBAC  
✅ **Scalable architecture** ready for growth  
✅ **Modern tech stack** with industry best practices  
✅ **Comprehensive testing** strategy  
✅ **Deployment-ready** configuration  

This architecture provides a solid foundation for building enterprise-grade SaaS applications with Spring Boot and Next.js.

---

**Document Version:** 1.0  
**Last Updated:** November 9, 2024  
**Maintained By:** Development Team

