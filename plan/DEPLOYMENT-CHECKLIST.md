# Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment

### Code Quality
- [ ] All integration tests pass locally
- [ ] Code review completed
- [ ] No linter errors (`npm run lint` in frontend)
- [ ] Backend compiles without warnings
- [ ] Database migrations tested and validated
- [ ] Environment variables documented

### Security
- [ ] JWT secret key is strong (minimum 256 bits)
- [ ] Database credentials are secure
- [ ] CORS configuration is appropriate for production
- [ ] No hardcoded secrets in code
- [ ] API endpoints are properly secured

### Documentation
- [ ] API documentation (Swagger/OpenAPI) is accessible
- [ ] README files are updated
- [ ] Environment variable documentation is complete

### Repository
- [ ] Code is pushed to GitHub repository
- [ ] Main/master branch is stable
- [ ] Git tags are created for releases (optional)

## Railway Setup

### Project Creation
- [ ] Railway account created
- [ ] Project created from GitHub repository
- [ ] GitHub integration configured

### Database Service
- [ ] PostgreSQL database service created
- [ ] Database connection details noted
- [ ] Database service is running

### Backend Service
- [ ] Backend service created
- [ ] Root directory set to `backend/`
- [ ] Build command configured: `./mvnw clean package -DskipTests`
- [ ] Start command configured: `java -jar target/invoiceme-backend-1.0.0.jar`
- [ ] Environment variables set (see deployment plan)
- [ ] Health check path configured: `/actuator/health`

### Frontend Service
- [ ] Frontend service created
- [ ] Root directory set to `frontend/`
- [ ] Build command configured: `npm ci && npm run build`
- [ ] Start command configured: `npm start`
- [ ] Environment variables set (see deployment plan)

## Environment Variables

### Backend Variables
- [ ] `SPRING_DATASOURCE_URL` = `${DATABASE_URL}`
- [ ] `SPRING_DATASOURCE_USERNAME` = `${PGUSER}`
- [ ] `SPRING_DATASOURCE_PASSWORD` = `${PGPASSWORD}`
- [ ] `JWT_SECRET` = (strong secret generated)
- [ ] `JWT_EXPIRATION` = `86400000`
- [ ] `SERVER_PORT` = `8080`
- [ ] `CORS_ALLOWED_ORIGINS` = (frontend URL)
- [ ] `SPRING_FLYWAY_ENABLED` = `true`
- [ ] `SPRING_JPA_HIBERNATE_DDL_AUTO` = `validate`
- [ ] `LOGGING_LEVEL_COM_INVOICEME` = `INFO`

### Frontend Variables
- [ ] `NEXT_PUBLIC_API_URL` = (backend API URL)
- [ ] `NODE_ENV` = `production`
- [ ] `NEXT_TELEMETRY_DISABLED` = `1`

## Deployment

### Backend Deployment
- [ ] Backend build successful
- [ ] Backend service started
- [ ] Flyway migrations executed successfully
- [ ] Health check endpoint responding
- [ ] API endpoints accessible

### Frontend Deployment
- [ ] Frontend build successful
- [ ] Frontend service started
- [ ] Frontend URL accessible
- [ ] API connectivity verified

## Post-Deployment Verification

### Health Checks
- [ ] Backend health endpoint: `/actuator/health`
- [ ] Frontend loads successfully
- [ ] Database connection verified

### Core Functionality
- [ ] User authentication works
- [ ] Customer CRUD operations work
- [ ] Invoice creation with line items works
- [ ] Payment recording works
- [ ] Invoice status transitions work (Draft → Sent → Paid)

### Security Verification
- [ ] HTTPS is enabled
- [ ] CORS is configured correctly
- [ ] JWT tokens are working
- [ ] API endpoints are secured

### Performance
- [ ] API response times acceptable (< 200ms)
- [ ] Frontend load times acceptable
- [ ] Database queries optimized

## Monitoring Setup

- [ ] Railway metrics dashboard reviewed
- [ ] Log aggregation configured (optional)
- [ ] Error tracking set up (optional)
- [ ] Alerting configured (optional)

## Documentation

- [ ] Deployment instructions documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide reviewed
- [ ] API documentation accessible

## Rollback Plan

- [ ] Rollback procedure documented
- [ ] Previous deployment version identified
- [ ] Database backup strategy in place
- [ ] Rollback tested (optional)

## Final Steps

- [ ] All services running and healthy
- [ ] Core functionality verified
- [ ] Team notified of deployment
- [ ] Deployment documented
- [ ] Post-deployment monitoring active

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Version**: _______________
**Notes**: _______________

