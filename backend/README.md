# InvoiceMe Backend API

A production-quality Spring Boot REST API for invoice management, built following Domain-Driven Design (DDD), CQRS, and Vertical Slice Architecture principles.

## Architecture

- **Domain-Driven Design (DDD)**: Rich domain models with business logic
- **CQRS**: Separation of Commands (write) and Queries (read)
- **Vertical Slice Architecture**: Organized by features/use cases
- **Clean Architecture**: Clear separation between Domain, Application, and Infrastructure layers

## Tech Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL (production), H2 (development/testing)
- **Build Tool**: Maven
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/invoiceme/
│   │   │   ├── domain/              # Domain layer (DDD)
│   │   │   │   ├── customer/
│   │   │   │   ├── invoice/
│   │   │   │   └── payment/
│   │   │   ├── application/         # Application layer (CQRS)
│   │   │   │   ├── commands/        # Write operations
│   │   │   │   └── queries/          # Read operations
│   │   │   └── infrastructure/      # Infrastructure layer
│   │   │       ├── persistence/     # Repositories
│   │   │       ├── api/             # REST controllers, DTOs
│   │   │       └── config/          # Configuration
│   │   └── resources/
│   │       ├── application.properties
│   │       └── db/migration/        # Flyway migrations
│   └── test/
└── pom.xml
```

## Setup

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL (for production) or H2 (for development)

### Configuration

1. **Database Setup**:
   - For PostgreSQL: Update `application.properties` with your database credentials
   - For H2 (development): Use `application-dev.properties` profile

2. **Environment Variables**:
   ```properties
   server.port=8080
   spring.datasource.url=jdbc:postgresql://localhost:5432/invoiceme
   spring.datasource.username=postgres
   spring.datasource.password=password
   jwt.secret=your-secret-key-minimum-256-bits
   jwt.expiration=86400000
   cors.allowed-origins=http://localhost:3000
   ```

### Running the Application

```bash
# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run

# Or run with dev profile (uses H2)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

**Note**: The project includes a Maven wrapper (`mvnw`), so you don't need to install Maven globally. If you have Maven installed, you can use `mvn` instead of `./mvnw`.

The API will be available at `http://localhost:8080/api`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token

### Customers
- `GET /api/customers` - List all customers (paginated)
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Invoices
- `GET /api/invoices` - List all invoices (paginated, optional status filter)
- `GET /api/invoices/{id}` - Get invoice by ID
- `POST /api/invoices` - Create invoice (Draft)
- `PUT /api/invoices/{id}` - Update invoice (only Draft)
- `PATCH /api/invoices/{id}/mark-sent` - Mark invoice as Sent
- `GET /api/customers/{customerId}/invoices` - List invoices by customer

### Payments
- `GET /api/payments/{id}` - Get payment by ID
- `POST /api/payments` - Record payment
- `GET /api/invoices/{invoiceId}/payments` - List payments for invoice

## API Documentation

Swagger UI is available at:
- `http://localhost:8080/swagger-ui.html`
- `http://localhost:8080/api/swagger-ui.html`

## Database Migrations

Flyway migrations are automatically applied on startup. Migration files are located in `src/main/resources/db/migration/`.

## Testing

```bash
# Run all tests
./mvnw test

# Run integration tests
./mvnw test -Dtest=*IntegrationTest
```

## Default Credentials

- Username: `admin`
- Password: `admin`

**Note**: Change these in production! The default user is configured in `SecurityConfig.java`.

## Development

### Adding a New Feature

1. **Domain Layer**: Add domain entities and business logic
2. **Application Layer**: Create Command/Query and Handler
3. **Infrastructure Layer**: 
   - Add repository if needed
   - Create DTOs and mappers
   - Add REST controller

### Code Style

- Follow Java naming conventions
- Use Lombok for boilerplate reduction
- Use MapStruct for DTO mapping
- Write unit and integration tests

## Deployment

### Railway

1. Create a PostgreSQL service on Railway
2. Set environment variables:
   - `DATABASE_URL` (Railway PostgreSQL connection string)
   - `JWT_SECRET`
   - `CORS_ALLOWED_ORIGINS`
   - `PORT` (Railway assigned port)
3. Deploy the application

### Build for Production

```bash
./mvnw clean package
java -jar target/invoiceme-backend-1.0.0.jar
```

## License

This project is part of the InvoiceMe assessment.

