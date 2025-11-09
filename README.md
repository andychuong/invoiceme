# InvoiceMe

A full-stack invoice management system built with Spring Boot and Next.js, following Domain-Driven Design (DDD), CQRS, and Vertical Slice Architecture principles.

## Overview

InvoiceMe is a production-quality ERP-style invoicing system that demonstrates modern software architecture principles. The application manages customers, invoices, and payments with a clean separation of concerns between the domain, application, and infrastructure layers.

## Features

- Customer Management: Create, update, and manage customer information
- Invoice Management: Create invoices with line items, track status (Draft, Sent, Paid), and manage invoice lifecycle
- Payment Processing: Record payments against invoices and track balances
- Authentication: Secure login and session management
- Responsive UI: Modern, responsive user interface built with Next.js and Chakra UI

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security (JWT authentication)
- Spring Data JPA
- PostgreSQL
- Flyway (database migrations)
- MapStruct (DTO mapping)
- Maven

### Frontend
- Next.js 16.0.1
- React 19
- TypeScript
- Chakra UI
- React Hook Form
- Zod (validation)
- Axios (HTTP client)

### Database
- PostgreSQL (production)
- H2 (development/testing)

## Project Structure

```
Teamfront InvoiceMe/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/invoiceme/
│   │   │   │       ├── application/    # Application layer (Commands & Queries)
│   │   │   │       ├── domain/         # Domain layer (Entities)
│   │   │   │       └── infrastructure/ # Infrastructure layer (API, Persistence)
│   │   │   └── resources/
│   │   │       ├── db/migration/       # Flyway migrations
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
├── frontend/                # Next.js frontend
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   ├── services/            # API services
│   ├── models/              # Domain models
│   ├── viewmodels/          # View models
│   └── package.json
│
├── plan/                    # Project documentation
│   ├── deployment-plan.md
│   ├── prd.md
│   └── ...
│
└── scripts/                 # Utility scripts
```

## Architecture

The application follows Clean Architecture principles with three main layers:

### Domain Layer
- Core business entities (Customer, Invoice, Payment)
- Domain logic and business rules
- No dependencies on external frameworks

### Application Layer
- Commands (write operations): Create, Update, Delete
- Queries (read operations): Retrieve, List
- CQRS pattern implementation
- Vertical Slice Architecture

### Infrastructure Layer
- REST API controllers
- JPA repositories
- Database migrations
- Security configuration
- API DTOs and mappers

## Getting Started

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 12 or higher (for production)
- Maven 3.6 or higher

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Configure database connection in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/invoiceme
spring.datasource.username=postgres
spring.datasource.password=your_password
```

3. Run the application:
```bash
./mvnw spring-boot:run
```

The backend API will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Development

### Running Tests

Backend:
```bash
cd backend
./mvnw test
```

Frontend:
```bash
cd frontend
npm run lint
```

### Database Migrations

Flyway automatically runs migrations on application startup. Migration files are located in `backend/src/main/resources/db/migration/`.

Migration files follow the naming convention: `V{version}__{description}.sql`

### API Documentation

Once the backend is running, API documentation is available at:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Deployment

The application is configured for deployment on Railway. See the deployment documentation for detailed instructions:

- Full deployment plan: `plan/deployment-plan.md`
- Quick start guide: `plan/DEPLOYMENT-QUICK-START.md`
- Deployment checklist: `plan/DEPLOYMENT-CHECKLIST.md`

### Railway Configuration

The project includes Railway configuration files:
- `railway.json` - Root configuration
- `backend/railway.json` - Backend service configuration
- `frontend/railway.json` - Frontend service configuration

### Environment Variables

#### Backend
- `SPRING_DATASOURCE_URL` - Database connection URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `JWT_SECRET` - JWT signing secret (generate a strong secret)
- `JWT_EXPIRATION` - JWT expiration time in milliseconds
- `CORS_ALLOWED_ORIGINS` - Allowed CORS origins (frontend URL)

#### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NODE_ENV` - Node environment (production)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Customers
- `GET /api/customers` - List customers (paginated)
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Invoices
- `GET /api/invoices` - List invoices (paginated)
- `GET /api/invoices/{id}` - Get invoice by ID
- `GET /api/invoices/status/{status}` - List invoices by status
- `GET /api/invoices/customer/{customerId}` - List invoices by customer
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/{id}` - Update invoice
- `POST /api/invoices/{id}/mark-sent` - Mark invoice as sent

### Payments
- `GET /api/payments/invoice/{invoiceId}` - List payments for invoice
- `GET /api/payments/{id}` - Get payment by ID
- `POST /api/payments` - Record payment

## Invoice Lifecycle

1. **Draft** - Invoice is created but not yet sent
2. **Sent** - Invoice has been sent to the customer
3. **Paid** - Invoice has been fully paid

## Payment Processing

- Payments are applied against invoice balances
- Multiple payments can be recorded for a single invoice
- Invoice balance is automatically calculated
- Invoice status automatically updates to "Paid" when balance reaches zero

## Development Guidelines

### Code Quality
- Follow Domain-Driven Design principles
- Maintain clear separation between Commands and Queries (CQRS)
- Use Vertical Slice Architecture for feature organization
- Write integration tests for critical flows
- Use explicit DTOs for API boundaries

### Testing
- Integration tests are required for core functionality
- Test the complete Customer -> Invoice -> Payment flow
- Use H2 database for local testing

## Contributing

1. Follow the architectural principles outlined in the PRD
2. Write tests for new features
3. Ensure all linting checks pass
4. Update documentation as needed

## License

This project is part of an assessment and is not intended for production use without proper security review and testing.

## Support

For deployment issues, refer to:
- Deployment plan: `plan/deployment-plan.md`
- Troubleshooting guide in the deployment documentation

