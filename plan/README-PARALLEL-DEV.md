# Parallel Development Guide

## Overview

This project is structured for **parallel development** of backend and frontend, with a separate integration phase. This allows two developers (or one developer working in parallel) to build the backend and frontend simultaneously.

## Project Structure

```
InvoiceMe/
├── prd.md                    # Main PRD (overall project)
├── prd-backend.md            # Backend-specific PRD
├── prd-frontend.md           # Frontend-specific PRD
├── prd-integration.md        # Integration PRD
├── tasks-backend.md          # Backend task list
├── tasks-frontend.md         # Frontend task list
└── tasks-integration.md      # Integration task list
```

## Development Phases

### Phase 1: Parallel Development (Backend + Frontend)

**Backend Developer** works from:
- `prd-backend.md` - Complete backend requirements
- `tasks-backend.md` - Backend task checklist

**Frontend Developer** works from:
- `prd-frontend.md` - Complete frontend requirements
- `tasks-frontend.md` - Frontend task checklist

### Phase 2: Integration

**Both developers** work together using:
- `prd-integration.md` - Integration requirements
- `tasks-integration.md` - Integration task checklist

## API Contract

The backend and frontend teams must agree on the **API contract** before starting parallel development. This is defined in:

### Backend PRD (Section 6): REST API Contract
- All endpoint definitions
- Request/response DTOs
- Authentication flow
- Error response format

### Frontend PRD (Section 5): API Integration Contract
- Service interfaces
- Expected request/response formats
- Authentication requirements

## Key Interfaces for Parallel Development

### 1. Authentication
- **Backend**: `POST /api/auth/login` → Returns JWT token
- **Frontend**: Expects JWT token, stores in localStorage

### 2. Customer Endpoints
- `POST /api/customers` - Create
- `GET /api/customers` - List (with pagination)
- `GET /api/customers/{id}` - Get by ID
- `PUT /api/customers/{id}` - Update
- `DELETE /api/customers/{id}` - Delete

### 3. Invoice Endpoints
- `POST /api/invoices` - Create (Draft)
- `GET /api/invoices` - List (with status filter)
- `GET /api/invoices/{id}` - Get by ID
- `PUT /api/invoices/{id}` - Update
- `PATCH /api/invoices/{id}/mark-sent` - Mark as Sent
- `GET /api/customers/{customerId}/invoices` - List by Customer

### 4. Payment Endpoints
- `POST /api/payments` - Record Payment
- `GET /api/payments/{id}` - Get by ID
- `GET /api/invoices/{invoiceId}/payments` - List for Invoice

## Mock Data Strategy

### Frontend Development
While backend is being developed, frontend can:
1. Create mock API services that return mock data
2. Implement all UI components and ViewModels
3. Test all user flows with mock data
4. Switch to real API when backend is ready

### Backend Development
While frontend is being developed, backend can:
1. Use Postman/curl to test all endpoints
2. Use Swagger/OpenAPI for API documentation
3. Test with sample data
4. Ensure CORS is configured for frontend origin

## Development Workflow

### Week 1-2: Parallel Development

**Backend Team:**
1. Set up Spring Boot project
2. Implement domain layer (DDD)
3. Implement CQRS (commands/queries)
4. Implement REST API endpoints
5. Set up database and migrations
6. Implement authentication
7. Write integration tests
8. Document API (Swagger)

**Frontend Team:**
1. Set up React/Next.js project
2. Implement MVVM architecture
3. Create all ViewModels
4. Create all UI components
5. Implement mock API services
6. Test all user flows with mock data
7. Implement authentication UI
8. Polish UI/UX

### Week 3: Integration

**Both Teams:**
1. Review API contract alignment
2. Replace mock services with real API calls
3. Test all endpoints integration
4. Fix integration issues
5. Test complete user flows
6. Performance testing
7. Deploy to Railway
8. Final testing and validation

## Communication Points

### Before Starting
- [ ] Review and agree on API contract
- [ ] Agree on data formats (dates, UUIDs, decimals)
- [ ] Agree on error response format
- [ ] Agree on pagination format
- [ ] Set up shared API documentation (Swagger)

### During Development
- [ ] Share API documentation updates
- [ ] Communicate any contract changes
- [ ] Share environment variable requirements
- [ ] Coordinate CORS configuration

### Before Integration
- [ ] Verify backend is running and accessible
- [ ] Verify frontend is running and accessible
- [ ] Review API contract one final time
- [ ] Prepare integration test plan

## Environment Setup

### Backend
```properties
# application.properties
server.port=8080
cors.allowed-origins=http://localhost:3000
```

### Frontend
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Testing Strategy

### Backend Testing
- Unit tests for domain logic
- Unit tests for command/query handlers
- Integration tests for REST endpoints
- Integration test for complete flow (Customer → Invoice → Payment)

### Frontend Testing
- Component unit tests
- ViewModel unit tests
- Integration tests with mock API
- E2E tests (after integration)

### Integration Testing
- End-to-end user flows
- Error scenario testing
- Performance testing
- Production deployment testing

## Success Criteria

### Backend Complete When:
- [ ] All REST endpoints implemented
- [ ] All integration tests passing
- [ ] API documentation complete (Swagger)
- [ ] CORS configured for frontend
- [ ] Authentication working
- [ ] Performance < 200ms

### Frontend Complete When:
- [ ] All components implemented
- [ ] All ViewModels implemented
- [ ] All user flows working with mock data
- [ ] Authentication UI working
- [ ] Responsive design complete
- [ ] Ready for API integration

### Integration Complete When:
- [ ] All API endpoints connected
- [ ] All user flows working end-to-end
- [ ] Error handling working
- [ ] Performance requirements met
- [ ] Deployed to Railway
- [ ] Production environment functional

## Tips for Parallel Development

1. **API Contract First**: Agree on API contract before starting
2. **Mock Data**: Frontend can use mock data while backend develops
3. **Documentation**: Keep API documentation updated
4. **Communication**: Regular check-ins to ensure alignment
5. **Version Control**: Use feature branches for parallel work
6. **Integration Early**: Start integration testing as soon as possible
7. **Flexibility**: Be ready to adjust based on integration findings

## Next Steps

1. **Backend Developer**: Start with `prd-backend.md` and `tasks-backend.md`
2. **Frontend Developer**: Start with `prd-frontend.md` and `tasks-frontend.md`
3. **Both Developers**: Use `prd-integration.md` and `tasks-integration.md` for integration phase

Good luck with parallel development! 🚀

