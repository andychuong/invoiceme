# Backend Development Task List

## Phase 1: Project Setup
- [ ] Initialize Spring Boot project with Maven/Gradle
- [ ] Set up project structure (DDD, CQRS, VSA)
- [ ] Configure application.properties
- [ ] Set up database configuration (PostgreSQL/H2)
- [ ] Configure CORS for frontend integration
- [ ] Set up logging configuration

## Phase 2: Domain Layer (DDD)
- [ ] Create Customer aggregate root with domain logic
- [ ] Create Invoice aggregate root with state machine
- [ ] Create Payment aggregate root
- [ ] Implement InvoiceLineItem entity
- [ ] Create value objects (Email, Money, InvoiceNumber, etc.)
- [ ] Implement domain events (optional but encouraged)
- [ ] Add domain validation and business rules

## Phase 3: Application Layer (CQRS)
- [ ] Set up CQRS infrastructure (Command/Query handlers)
- [ ] Implement Customer Commands (Create, Update, Delete)
- [ ] Implement Customer Queries (GetById, ListAll)
- [ ] Implement Invoice Commands (Create, Update, MarkAsSent, RecordPayment)
- [ ] Implement Invoice Queries (GetById, ListByStatus, ListByCustomer)
- [ ] Implement Payment Commands (RecordPayment)
- [ ] Implement Payment Queries (GetById, ListForInvoice)
- [ ] Create command/query DTOs
- [ ] Implement command/query validation

## Phase 4: Infrastructure Layer - Database
- [ ] Design database schema
- [ ] Create database migrations (Flyway/Liquibase)
- [ ] Implement Customer repository
- [ ] Implement Invoice repository
- [ ] Implement Payment repository
- [ ] Create database indexes
- [ ] Test database operations

## Phase 5: Infrastructure Layer - API
- [ ] Create REST controllers for Customer endpoints
- [ ] Create REST controllers for Invoice endpoints
- [ ] Create REST controllers for Payment endpoints
- [ ] Create REST controller for Authentication
- [ ] Implement DTO mappers (Domain → DTO)
- [ ] Implement request/response DTOs
- [ ] Set up error handling and validation
- [ ] Configure Swagger/OpenAPI documentation

## Phase 6: Authentication
- [ ] Implement JWT token generation
- [ ] Create authentication service
- [ ] Implement login endpoint
- [ ] Set up Spring Security configuration
- [ ] Implement JWT filter for protected endpoints
- [ ] Test authentication flow

## Phase 7: Testing
- [ ] Write unit tests for domain logic
- [ ] Write unit tests for command handlers
- [ ] Write unit tests for query handlers
- [ ] Write integration tests for REST endpoints
- [ ] Write integration test for Customer → Invoice → Payment flow
- [ ] Performance testing (ensure < 200ms response time)
- [ ] Fix any failing tests

## Phase 8: Documentation & Polish
- [ ] Complete API documentation (Swagger)
- [ ] Document environment variables
- [ ] Create README with setup instructions
- [ ] Code review and refactoring
- [ ] Verify all requirements met

