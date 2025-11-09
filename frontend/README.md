# InvoiceMe Frontend

A modern, multi-tenant invoice management system built with Next.js 16, React 19, TypeScript, and Chakra UI v3.

## Features

### Core Functionality
- **Customer Management** - Create, update, delete, and manage customers
- **Invoice Management** - Create invoices with line items, track status (Draft → Sent → Paid)
- **Payment Processing** - Record payments against invoices, track payment history
- **Multi-Tenancy** - Complete data isolation between companies

### Company & Team Management
- **Company Portal** - White-label your company with custom name and logo
- **Team Collaboration** - Share customers and invoices within your company
- **User Roles** - Admin, Accountant, and Operator roles with different permissions
- **Secure Invitations** - Join companies using unique company codes
- **Profile Management** - Edit user profile, display name, email, and profile picture

### User Experience
- **Authentication** - Secure JWT-based authentication with auto-login
- **Responsive Design** - Mobile-first design that works on all devices
- **Real-time Feedback** - Toast notifications for user actions
- **Loading States** - Smooth loading indicators for async operations
- **Form Validation** - Client-side validation with helpful error messages

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library with latest features |
| **TypeScript** | Type safety and better developer experience |
| **Chakra UI v3** | Modern component library and design system |
| **Axios** | HTTP client for API communication |
| **Sonner** | Toast notifications |
| **Lucide React** | Beautiful icon library |
| **date-fns** | Date manipulation and formatting |

## Project Structure

```
frontend/
├── app/                        # Next.js App Router
│   ├── (auth)/                # Authentication pages (public)
│   │   ├── login/             # Login page
│   │   └── signup/            # Signup page (create/join company)
│   │
│   ├── (dashboard)/           # Protected dashboard pages
│   │   ├── customers/         # Customer management
│   │   ├── invoices/          # Invoice management
│   │   ├── payments/          # Payment management
│   │   ├── company/           # Company settings (admin only)
│   │   └── layout.tsx         # Dashboard layout with navigation
│   │
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page (redirects to login)
│   └── providers.tsx          # Global providers (Chakra UI)
│
├── components/                 # Reusable components
│   ├── ui/                    # Chakra UI components (if customized)
│   └── user/                  # User-specific components
│       └── UserProfileModal.tsx
│
├── services/                   # Business logic layer
│   ├── api/                   # API service implementations
│   │   ├── customerService.ts # Customer API calls
│   │   ├── invoiceService.ts  # Invoice API calls
│   │   ├── paymentService.ts  # Payment API calls
│   │   ├── companyService.ts  # Company API calls
│   │   └── userService.ts     # User API calls
│   │
│   ├── authService.ts         # Authentication logic
│   └── httpClient.ts          # HTTP client with interceptors
│
├── types/                      # TypeScript type definitions
│   └── index.ts               # Shared types (Customer, Invoice, etc.)
│
├── theme/                      # UI theme configuration
│   └── index.ts               # Chakra UI theme customization
│
└── public/                     # Static assets
    └── logo.svg               # Application logo
```

## Getting Started

### Prerequisites

- **Node.js 18+** or higher
- **npm** or **yarn** or **pnpm**
- Backend API running (see backend README)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env.local` file:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - You'll be redirected to the login page

### First Time Setup

1. Click "Sign up" on the login page
2. Choose "Create Company" to start a new company
3. Fill in your details and company name
4. Save the generated company code to invite team members
5. Start managing customers and invoices!

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |

## Architecture

### Service Layer Pattern

All API calls go through service classes for better organization and testability:

```typescript
// services/api/customerService.ts
class CustomerService {
  async getCustomers(page: number = 0, size: number = 20): Promise<PageResponse<Customer>> {
    return httpClient.get<PageResponse<Customer>>(
      `/customers?page=${page}&size=${size}`
    );
  }

  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    return httpClient.post<Customer>('/customers', data);
  }
}

export const customerService = new CustomerService();
```

### HTTP Client with Interceptors

Centralized HTTP client that automatically:
- Injects JWT tokens in all requests
- Handles authentication errors (401)
- Redirects to login when session expires
- Provides consistent error handling

```typescript
// services/httpClient.ts
class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
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

### Authentication Service

Manages JWT tokens and user state:

```typescript
// services/authService.ts
class AuthService {
  login(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

### Route Protection

Dashboard routes are automatically protected:

```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = authService.getUserData();
    if (!storedUserData) {
      router.push('/login');
      return;
    }
    setUserData(storedUserData);
  }, [router]);

  if (!userData) {
    return <Spinner />; // Show loading while checking auth
  }

  return <>{children}</>;
}
```

## UI Components

### Chakra UI v3

The application uses Chakra UI v3 with the following key components:

- **Layout**: `Box`, `Container`, `Flex`, `HStack`, `VStack`
- **Forms**: `Field.Root`, `Field.Label`, `Input`, `Button`
- **Feedback**: `Spinner`, Toast notifications (via Sonner)
- **Navigation**: `MenuRoot`, `MenuTrigger`, `MenuContent`, `MenuItem`
- **Data Display**: `Card`, `Badge`, `Avatar`, native HTML tables
- **Overlays**: `DialogRoot`, `DialogContent`, `DialogHeader`, `DialogBody`, `DialogFooter`
- **Tabs**: `Tabs.Root`, `Tabs.List`, `Tabs.Trigger`, `Tabs.Content`

### Theme Customization

Custom theme configuration in `theme/index.ts`:

```typescript
import { createSystem, defaultConfig } from '@chakra-ui/react';

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        primary: { value: '#3182CE' },
        // ... other colors
      },
    },
  },
});
```

## Authentication Flow

1. **Login/Signup**
   - User enters credentials or creates account
   - Backend validates and returns JWT + user data
   - Frontend stores token in localStorage
   - User is redirected to dashboard

2. **Authenticated Requests**
   - HTTP client automatically adds `Authorization: Bearer <token>` header
   - Backend validates JWT and extracts user info
   - Returns requested data scoped to user's company

3. **Session Expiration**
   - Backend returns 401 when JWT expires
   - HTTP client intercepts 401 response
   - User is logged out and redirected to login

## API Integration

### Expected Backend Endpoints

#### Authentication
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/signup` - Create new company and user
- `POST /api/auth/join` - Join existing company with code

#### Companies
- `GET /api/companies/{id}` - Get company details
- `PUT /api/companies/{id}` - Update company (name, logo)
- `GET /api/companies/{id}/members` - List team members
- `POST /api/companies/{id}/regenerate-code` - Regenerate company code
- `DELETE /api/companies/{companyId}/members/{userId}` - Remove member

#### Customers
- `GET /api/customers` - List customers (paginated, company-scoped)
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

#### Invoices
- `GET /api/invoices` - List invoices (paginated, company-scoped)
- `GET /api/invoices/{id}` - Get invoice by ID
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/{id}` - Update invoice
- `POST /api/invoices/{id}/mark-sent` - Mark invoice as sent

#### Payments
- `GET /api/payments/invoice/{invoiceId}` - List payments for invoice
- `POST /api/payments` - Record payment
- `GET /api/payments/{id}` - Get payment by ID

#### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8080/api` |

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Deployment

### Railway Deployment

1. **Create a new Railway project**
2. **Connect your GitHub repository**
3. **Configure build settings:**
   - Build command: `npm run build`
   - Start command: `npm start`
4. **Set environment variables:**
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
5. **Deploy!**

### Vercel Deployment

1. **Import your repository to Vercel**
2. **Configure environment variables:**
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
3. **Deploy!**

### Docker Deployment

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

## Testing

### Manual Testing Checklist

- [ ] Login with valid credentials
- [ ] Create a new company via signup
- [ ] Join existing company with code
- [ ] Create, edit, delete customers
- [ ] Create invoices with line items
- [ ] Mark invoices as sent
- [ ] Record payments
- [ ] Update company settings (admin)
- [ ] Invite team members (admin)
- [ ] Edit user profile
- [ ] Logout and re-login

## Key Features

### Multi-Tenancy
- All data is automatically scoped to the user's company
- Users can only see customers, invoices, and payments from their company
- Company isolation is enforced at the API level

### Role-Based Access
- **Admin**: Full access to all features including company management
- **Accountant**: Manage customers, invoices, and payments
- **Operator**: View and create customers and invoices

### White-Labeling
- Admins can customize company name and logo
- Company branding appears in the header
- Personalized experience for each company

## 📖 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow React best practices (hooks, functional components)
- Use Chakra UI components for consistency
- Keep components small and focused
- Extract reusable logic into custom hooks

### State Management
- Use React hooks for local state (`useState`, `useEffect`)
- Use service layer for API calls
- Store auth data in localStorage
- Avoid prop drilling (use context if needed)

### Error Handling
- Display user-friendly error messages
- Use toast notifications for feedback
- Log errors to console for debugging
- Handle loading and error states in UI

## Troubleshooting

### Common Issues

**Issue: "Cannot connect to backend"**
- Check that backend is running on port 8080
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

**Issue: "401 Unauthorized"**
- Token may have expired, try logging in again
- Check that JWT is being sent in request headers
- Verify backend JWT secret matches

**Issue: "Page not found after login"**
- Clear browser cache and localStorage
- Check that routes are properly defined
- Verify authentication redirect logic

## License

This project is part of the InvoiceMe assessment.

---

**Version:** 1.0  
**Last Updated:** November 9, 2024  
**Framework:** Next.js 16 with React 19
