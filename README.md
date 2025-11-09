# InvoiceMe

A modern, multi-tenant invoice management system built with Spring Boot and Next.js, featuring company management, team collaboration, and secure data isolation.

## Features

### Core Functionality
- **Customer Management** - Create, update, and manage customer information
- **Invoice Management** - Create invoices with line items, track status (Draft, Sent, Paid)
- **Payment Processing** - Record payments against invoices and track balances
- **Multi-Tenancy** - Complete data isolation between companies

### Company & Team Management
- **Company Portal** - White-label your company with custom name and logo
- **Team Collaboration** - Share customers and invoices within your company
- **User Roles** - Admin, Accountant, and Operator roles with different permissions
- **Secure Invitations** - Generate company codes to invite team members
- **Access Control** - Admins can remove users and regenerate company codes

### Security
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Granular permissions per role
- **Company Isolation** - Users can only access their company's data
- **Code Regeneration** - Regenerate company codes if leaked

## Technology Stack

### Backend
- **Java 17** with Spring Boot 3.2.0
- **Spring Security** with JWT authentication
- **Spring Data JPA** with PostgreSQL
- **Flyway** for database migrations
- **Domain-Driven Design** (DDD) with CQRS pattern
- **Vertical Slice Architecture**

### Frontend
- **Next.js 16.0.1** with React 19
- **TypeScript** for type safety
- **Chakra UI v3** for modern UI components
- **React Hook Form** with Zod validation
- **Axios** for API communication

### Database
- **PostgreSQL** (production)
- **H2** (development/testing)

## Project Structure

```
InvoiceMe/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/java/com/invoiceme/
│   │   │   ├── application/    # Commands & Queries (CQRS)
│   │   │   ├── domain/         # Domain entities
│   │   │   └── infrastructure/ # API, Persistence, Security
│   │   └── resources/
│   │       └── db/migration/   # Flyway migrations
│   └── pom.xml
│
├── frontend/                # Next.js frontend
│   ├── app/                 # App router (pages)
│   ├── components/          # React components
│   ├── services/            # API services
│   └── types/               # TypeScript types
│
├── docs/                    # Documentation
│   ├── plan/                # Project planning docs
│   ├── DATABASE_SETUP.md    # Database setup guide
│   ├── QUICK_START.md       # Quick start guide
│   └── ...                  # Other documentation
│
└── README.md                # This file
```

## Architecture

The application follows **Clean Architecture** principles with three main layers:

### Domain Layer
- Core business entities (Customer, Invoice, Payment, Company, User)
- Domain logic and business rules
- No dependencies on external frameworks

### Application Layer
- **Commands** (write operations): Create, Update, Delete
- **Queries** (read operations): Retrieve, List
- **CQRS pattern** for clear separation of concerns
- **Vertical Slice Architecture** for feature organization

### Infrastructure Layer
- REST API controllers
- JPA repositories
- Database migrations
- Security configuration (JWT, RBAC)
- API DTOs and mappers

## Getting Started

### Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **PostgreSQL 12** or higher
- **Maven 3.6** or higher

### CI/CD Pipeline

This project includes automated testing and deployment with GitHub Actions and Railway:

- **Automated Tests** - Runs on every push/PR
- **Type Checking** - TypeScript validation
- **Automated Deployment** - Deploys to Railway on merge to main
- **Health Checks** - Monitors application status

See [CI/CD Quick Start](docs/CICD_QUICK_START.md) for 15-minute setup guide.

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd "Teamfront InvoiceMe"
```

2. **Set up PostgreSQL database**
```bash
createdb invoiceme
```

3. **Start the backend**
```bash
cd backend
export JAVA_HOME=/opt/homebrew/opt/openjdk@17  # macOS with Homebrew
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

4. **Start the frontend** (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### First Time Setup

1. Navigate to http://localhost:3000/signup
2. Create a new company account
3. Save your company code to invite team members
4. Start creating customers and invoices!

## Documentation

### Getting Started
- [Quick Start Guide](docs/QUICK_START.md) - Get up and running quickly
- [Database Setup](docs/DATABASE_SETUP.md) - Detailed database configuration
- [Local Deployment Guide](docs/plan/LOCAL_DEPLOYMENT_GUIDE.md) - Complete local setup

### CI/CD & Deployment
- [**CI/CD Quick Start**](docs/CICD_QUICK_START.md) - **15-minute automated deployment setup**
- [CI/CD Setup Guide](docs/CICD_SETUP.md) - Complete CI/CD documentation with GitHub Actions & Railway
- [Production Readiness](docs/PRODUCTION_READINESS.md) - Production deployment checklist

### Architecture & Design
- [**Architecture Documentation**](docs/ARCHITECTURE.md) - **Complete system architecture guide**
- [Product Requirements](docs/plan/prd.md) - Full product specification
- [Backend PRD](docs/plan/prd-backend.md) - Backend architecture details
- [Frontend PRD](docs/plan/prd-frontend.md) - Frontend architecture details
- [Design System](docs/plan/design-system.md) - UI/UX design guidelines

### Deployment
- [Deployment Quick Start](docs/plan/DEPLOYMENT-QUICK-START.md) - Deploy to Railway
- [Deployment Plan](docs/plan/deployment-plan.md) - Complete deployment guide
- [Deployment Checklist](docs/plan/DEPLOYMENT-CHECKLIST.md) - Pre-deployment checklist

### Development
- [Testing Guide](docs/plan/TESTING_GUIDE.md) - Testing strategies
- [Implementation Summary](docs/plan/IMPLEMENTATION_SUMMARY.md) - Implementation notes

## Authentication & Authorization

### User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: manage company, invite/remove users, manage all data |
| **Accountant** | Manage customers, invoices, and payments |
| **Operator** | View and create customers and invoices (read-only for payments) |

### Company Management

- **Admins** can:
  - Update company name and logo (white-labeling)
  - View and copy company code
  - Regenerate company code (for security)
  - Remove team members
  - Manage all company data

- **All users** can:
  - Edit their profile (name, email, display picture)
  - View company members
  - Access company-scoped data only

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - Create new company
- `POST /api/auth/join` - Join existing company

### Companies
- `GET /api/companies/{id}` - Get company details
- `PUT /api/companies/{id}` - Update company (admin only)
- `GET /api/companies/{id}/members` - List team members
- `POST /api/companies/{id}/regenerate-code` - Regenerate company code (admin only)
- `DELETE /api/companies/{companyId}/members/{userId}` - Remove member (admin only)

### Customers
- `GET /api/customers` - List customers (company-scoped)
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Invoices
- `GET /api/invoices` - List invoices (company-scoped)
- `GET /api/invoices/{id}` - Get invoice by ID
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/{id}` - Update invoice
- `POST /api/invoices/{id}/mark-sent` - Mark invoice as sent

### Payments
- `GET /api/payments/invoice/{invoiceId}` - List payments for invoice
- `POST /api/payments` - Record payment

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

## Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Linting
```bash
cd frontend
npm run lint
```

### Integration Testing
The application includes integration tests for the complete Customer → Invoice → Payment flow.

## Environment Variables

### Backend (`application-local.properties`)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/invoiceme
spring.datasource.username=your_username
spring.datasource.password=your_password
jwt.secret=your-secret-key
jwt.expiration=86400000
cors.allowed-origins=http://localhost:3000
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Deployment

The application is configured for deployment on Railway with PostgreSQL.

### Railway Setup
1. Create a new Railway project
2. Add PostgreSQL service
3. Deploy backend and frontend services
4. Configure environment variables
5. Run database migrations

See [Deployment Quick Start](docs/plan/DEPLOYMENT-QUICK-START.md) for detailed instructions.

## Contributing

1. Follow Domain-Driven Design principles
2. Maintain clear separation between Commands and Queries (CQRS)
3. Use Vertical Slice Architecture for feature organization
4. Write tests for new features
5. Ensure all linting checks pass
6. Update documentation as needed

## License

This project is part of an assessment and is not intended for production use without proper security review and testing.

## Support & Troubleshooting

For common issues and solutions, refer to:
- [Database Setup Guide](docs/DATABASE_SETUP.md)
- [Local Deployment Guide](docs/plan/LOCAL_DEPLOYMENT_GUIDE.md)
- [Testing Guide](docs/plan/TESTING_GUIDE.md)

## Key Features Implemented

✅ Multi-tenant architecture with complete data isolation  
✅ Company management with white-labeling  
✅ Role-based access control (Admin, Accountant, Operator)  
✅ Secure company code system for team invitations  
✅ Admin controls: remove users, regenerate company codes  
✅ User profile management  
✅ Customer, Invoice, and Payment management  
✅ JWT authentication with Spring Security  
✅ Responsive UI with Chakra UI v3  
✅ Database migrations with Flyway  

---

Built with Spring Boot, Next.js, and PostgreSQL
