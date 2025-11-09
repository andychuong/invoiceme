# InvoiceMe Frontend

A modern invoice management system built with Next.js, TypeScript, and shadcn/ui.

## Features

- **Customer Management**: Create, read, update, and delete customers
- **Invoice Management**: Create invoices with line items, manage invoice status (Draft → Sent → Paid)
- **Payment Management**: Record payments against invoices, track payment history
- **Authentication**: Secure login with JWT token management
- **MVVM Architecture**: Clean separation of concerns with Models, ViewModels, and Views

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **UI Library**: shadcn/ui (built on Radix UI and Tailwind CSS)
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **State Management**: React Hooks (MVVM pattern)
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   │   └── login/
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── customers/
│   │   ├── invoices/
│   │   └── payments/
│   ├── layout.tsx
│   └── page.tsx
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── common/            # Common reusable components
│   ├── customers/         # Customer-specific components
│   ├── invoices/          # Invoice-specific components
│   └── payments/          # Payment-specific components
├── models/                 # Domain models (MVVM)
├── viewmodels/             # ViewModels (MVVM)
├── services/               # API services
│   ├── api/               # API service implementations
│   ├── authService.ts
│   └── httpClient.ts
├── types/                  # TypeScript type definitions
├── hooks/                  # Custom React hooks
└── lib/                    # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:8080/api`)

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint

## Architecture

### MVVM Pattern

The application follows the MVVM (Model-View-ViewModel) architecture:

- **Models**: Domain entities (`Customer`, `Invoice`, `Payment`)
- **ViewModels**: Business logic and state management (`useCustomerViewModel`, `useInvoiceViewModel`, `usePaymentViewModel`)
- **Views**: React components (pages and UI components)

### API Integration

- All API calls are made through service classes
- HTTP client handles authentication tokens automatically
- Error handling is centralized in the HTTP client
- Token management is handled by `authService`

## Features Implementation

### Authentication
- Login page with form validation
- JWT token storage in localStorage
- Automatic token injection in API requests
- Route protection for dashboard pages
- Automatic redirect to login on 401 errors

### Customer Management
- List customers with pagination
- Create new customers
- Edit existing customers
- Delete customers with confirmation
- Form validation

### Invoice Management
- List invoices with status filtering
- Create invoices with dynamic line items
- Edit draft invoices only
- Mark invoices as sent
- View invoice details
- Automatic total calculation
- Balance tracking

### Payment Management
- Record payments against invoices
- Payment amount validation (cannot exceed balance)
- View payment history
- Automatic invoice balance updates
- Invoice status transitions (Sent → Paid when balance = 0)

## API Endpoints

The frontend expects the following backend API endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/{id}` - Get customer by ID
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/{id}` - Get invoice by ID
- `PUT /api/invoices/{id}` - Update invoice
- `PATCH /api/invoices/{id}/mark-sent` - Mark invoice as sent
- `GET /api/invoices/{invoiceId}/payments` - List payments for invoice
- `POST /api/payments` - Record payment
- `GET /api/payments/{id}` - Get payment by ID

## Development Notes

- All components use TypeScript for type safety
- Form validation uses Zod schemas
- Error handling is consistent across all components
- Loading states are implemented for async operations
- Toast notifications provide user feedback
- Responsive design for mobile and desktop

## Deployment

The frontend can be deployed to Railway or any static hosting service:

1. Build the application:
```bash
npm run build
```

2. Set environment variables in your deployment platform

3. Deploy the `out` directory (for static export) or use Next.js server mode

For Railway deployment, configure:
- Build command: `npm run build`
- Start command: `npm start`
- Environment variable: `NEXT_PUBLIC_API_URL` (your backend URL)
