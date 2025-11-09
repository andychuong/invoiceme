# Deployment Plan: InvoiceMe Application

## Table of Contents
1. [Overview](#overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Railway Platform Setup](#railway-platform-setup)
4. [Database Setup](#database-setup)
5. [Backend Deployment](#backend-deployment)
6. [Frontend Deployment](#frontend-deployment)
7. [Environment Configuration](#environment-configuration)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Testing and Validation](#testing-and-validation)
10. [Monitoring and Health Checks](#monitoring-and-health-checks)
11. [Rollback Strategy](#rollback-strategy)
12. [Post-Deployment Tasks](#post-deployment-tasks)
13. [Troubleshooting Guide](#troubleshooting-guide)

---

## Overview

This deployment plan outlines the steps to deploy the InvoiceMe full-stack application to Railway. The application consists of:

- **Backend**: Spring Boot 3.2.0 (Java 17) REST API
- **Frontend**: Next.js 16.0.1 (React 19, TypeScript) application
- **Database**: PostgreSQL (managed by Railway)
- **Platform**: Railway (full-stack deployment)

### Architecture Overview

```
┌─────────────────┐
│   Next.js App   │ (Frontend Service)
│   (Port 3000)   │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│  Spring Boot    │ (Backend Service)
│  (Port 8080)    │
└────────┬────────┘
         │
         │ JDBC
         │
┌────────▼────────┐
│   PostgreSQL    │ (Database Service)
│   (Managed)     │
└─────────────────┘
```

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All integration tests pass locally
- [ ] Code review completed
- [ ] No linter errors in frontend (`npm run lint`)
- [ ] Backend compiles without warnings
- [ ] Database migrations are tested and validated
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

---

## Railway Platform Setup

### Step 1: Create Railway Account and Project

1. **Sign up/Login to Railway**
   - Visit https://railway.app
   - Sign up with GitHub account (recommended for CI/CD integration)

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select the InvoiceMe repository

### Step 2: Create Services

Railway will automatically detect services, but we'll configure them explicitly:

1. **Database Service** (PostgreSQL)
   - Add new service → "Database" → "PostgreSQL"
   - Railway will automatically provision a PostgreSQL instance
   - Note the connection details (will be available as environment variables)

2. **Backend Service** (Spring Boot)
   - Add new service → "GitHub Repo" → Select repository
   - Configure root directory: `backend/`
   - Set build command: `./mvnw clean package -DskipTests`
   - Set start command: `java -jar target/invoiceme-backend-1.0.0.jar`

3. **Frontend Service** (Next.js)
   - Add new service → "GitHub Repo" → Select repository
   - Configure root directory: `frontend/`
   - Set build command: `npm ci && npm run build`
   - Set start command: `npm start`
   - Set output directory: `.next`

### Step 3: Railway Configuration Files

Create Railway configuration files for better control:

#### `railway.json` (Project Root)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "java -jar target/invoiceme-backend-1.0.0.jar",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### `backend/railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "./mvnw clean package -DskipTests"
  },
  "deploy": {
    "startCommand": "java -jar target/invoiceme-backend-1.0.0.jar",
    "healthcheckPath": "/actuator/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### `frontend/railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## Database Setup

### Step 1: Provision PostgreSQL Database

1. **Create Database Service**
   - Railway automatically creates a PostgreSQL database
   - Connection details are available as environment variables:
     - `PGHOST`
     - `PGPORT`
     - `PGDATABASE`
     - `PGUSER`
     - `PGPASSWORD`
     - `DATABASE_URL` (full connection string)

### Step 2: Configure Database Migrations

Flyway will automatically run migrations on application startup. Ensure:

1. **Migration Files are Present**
   - `backend/src/main/resources/db/migration/V1__Create_customers_table.sql`
   - `backend/src/main/resources/db/migration/V2__Create_invoices_table.sql`
   - `backend/src/main/resources/db/migration/V3__Create_invoice_line_items_table.sql`
   - `backend/src/main/resources/db/migration/V4__Create_payments_table.sql`

2. **Verify Migration Configuration**
   - Flyway is enabled in production
   - Migration files are included in the JAR artifact

### Step 3: Test Database Connection

Before deploying backend, verify database connectivity:

```bash
# Using Railway CLI (if installed)
railway connect postgres

# Or using psql with connection string from Railway dashboard
psql $DATABASE_URL
```

---

## Backend Deployment

### Step 1: Create Dockerfile (Optional but Recommended)

Create `backend/Dockerfile` for consistent builds:

```dockerfile
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/invoiceme-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Step 2: Configure Build Settings

In Railway dashboard for backend service:

1. **Build Settings**
   - Root Directory: `backend`
   - Build Command: `./mvnw clean package -DskipTests`
   - Output Directory: `target`

2. **Deploy Settings**
   - Start Command: `java -jar target/invoiceme-backend-1.0.0.jar`
   - Health Check Path: `/actuator/health` (if Spring Actuator is configured)

### Step 3: Environment Variables

Set the following environment variables in Railway for backend service:

```bash
# Database Configuration (from PostgreSQL service)
SPRING_DATASOURCE_URL=${DATABASE_URL}
SPRING_DATASOURCE_USERNAME=${PGUSER}
SPRING_DATASOURCE_PASSWORD=${PGPASSWORD}

# JWT Configuration
JWT_SECRET=<generate-strong-secret-minimum-256-bits>
JWT_EXPIRATION=86400000

# Server Configuration
SERVER_PORT=8080

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.railway.app

# Logging
LOGGING_LEVEL_COM_INVOICEME=INFO
LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_SECURITY=WARN

# Flyway
SPRING_FLYWAY_ENABLED=true
SPRING_FLYWAY_LOCATIONS=classpath:db/migration
SPRING_FLYWAY_BASELINE_ON_MIGRATE=true

# JPA
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_JPA_SHOW_SQL=false
```

### Step 4: Deploy Backend

1. **Trigger Deployment**
   - Push to main branch (if auto-deploy is enabled)
   - Or manually trigger deployment from Railway dashboard

2. **Monitor Build Logs**
   - Watch build logs in Railway dashboard
   - Verify Maven build succeeds
   - Check for any compilation errors

3. **Verify Deployment**
   - Check service logs for startup messages
   - Verify Flyway migrations ran successfully
   - Test health endpoint: `https://your-backend.railway.app/actuator/health`

### Step 5: Add Spring Actuator (Recommended)

Add Spring Actuator for health checks and monitoring:

**Add to `pom.xml`:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

**Add to `application.properties`:**
```properties
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=when-authorized
management.health.db.enabled=true
```

---

## Frontend Deployment

### Step 1: Configure Build Settings

In Railway dashboard for frontend service:

1. **Build Settings**
   - Root Directory: `frontend`
   - Build Command: `npm ci && npm run build`
   - Output Directory: `.next`

2. **Deploy Settings**
   - Start Command: `npm start`
   - Health Check Path: `/`

### Step 2: Environment Variables

Set the following environment variables in Railway for frontend service:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api

# Node Environment
NODE_ENV=production

# Next.js Configuration
NEXT_TELEMETRY_DISABLED=1
```

### Step 3: Update Next.js Configuration

Update `frontend/next.config.ts` for production:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // For Railway deployment
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Enable compression
  compress: true,
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
```

### Step 4: Deploy Frontend

1. **Trigger Deployment**
   - Push to main branch (if auto-deploy is enabled)
   - Or manually trigger deployment from Railway dashboard

2. **Monitor Build Logs**
   - Watch build logs in Railway dashboard
   - Verify npm install and build succeed
   - Check for any TypeScript or build errors

3. **Verify Deployment**
   - Check service logs for startup messages
   - Test frontend URL: `https://your-frontend.railway.app`
   - Verify API connectivity from frontend

### Step 5: Configure Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to service settings → "Networking"
   - Add custom domain
   - Configure DNS records as instructed

---

## Environment Configuration

### Environment Variables Summary

#### Backend Service Variables

| Variable | Description | Example/Notes |
|----------|-------------|---------------|
| `SPRING_DATASOURCE_URL` | Database connection URL | From Railway PostgreSQL service |
| `SPRING_DATASOURCE_USERNAME` | Database username | From Railway PostgreSQL service |
| `SPRING_DATASOURCE_PASSWORD` | Database password | From Railway PostgreSQL service |
| `JWT_SECRET` | JWT signing secret | Generate strong secret (256+ bits) |
| `JWT_EXPIRATION` | JWT expiration time (ms) | 86400000 (24 hours) |
| `SERVER_PORT` | Server port | 8080 |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | Frontend URL |
| `LOGGING_LEVEL_COM_INVOICEME` | Application log level | INFO (production) |
| `SPRING_FLYWAY_ENABLED` | Enable Flyway migrations | true |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Hibernate DDL mode | validate |

#### Frontend Service Variables

| Variable | Description | Example/Notes |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | https://backend.railway.app/api |
| `NODE_ENV` | Node environment | production |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | 1 |

#### Database Service Variables (Auto-generated by Railway)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Full PostgreSQL connection string |
| `PGHOST` | Database host |
| `PGPORT` | Database port |
| `PGDATABASE` | Database name |
| `PGUSER` | Database user |
| `PGPASSWORD` | Database password |

### Generating JWT Secret

Generate a strong JWT secret:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## CI/CD Pipeline

### Option 1: Railway Auto-Deploy (Recommended)

Railway automatically deploys on push to main branch:

1. **Enable Auto-Deploy**
   - Go to service settings → "Settings" → "Deploy"
   - Enable "Auto Deploy"
   - Select branch: `main` or `master`

2. **Deployment Triggers**
   - Push to main branch → Automatic deployment
   - Manual deployment available from dashboard

### Option 2: GitHub Actions (Advanced)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.0.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
          
      - name: Deploy Frontend to Railway
        uses: bervProject/railway-deploy@v1.0.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: frontend
```

### Option 3: Railway CLI

Install Railway CLI and deploy manually:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

---

## Testing and Validation

### Pre-Deployment Testing

1. **Local Testing**
   ```bash
   # Backend
   cd backend
   ./mvnw clean test
   
   # Frontend
   cd frontend
   npm run lint
   npm run build
   ```

2. **Integration Testing**
   ```bash
   # Run integration tests
   cd backend
   ./mvnw test -Dtest=CustomerInvoicePaymentIntegrationTest
   ```

### Post-Deployment Validation

1. **Backend Health Check**
   ```bash
   curl https://your-backend.railway.app/actuator/health
   ```

2. **API Endpoint Testing**
   ```bash
   # Test authentication
   curl -X POST https://your-backend.railway.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"test","password":"test"}'
   
   # Test customer endpoint (with auth token)
   curl https://your-backend.railway.app/api/customers \
     -H "Authorization: Bearer <token>"
   ```

3. **Frontend Testing**
   - Open frontend URL in browser
   - Test login functionality
   - Test customer creation
   - Test invoice creation with line items
   - Test payment recording

4. **Database Verification**
   ```sql
   -- Connect to database and verify tables
   \dt
   
   -- Check migration history
   SELECT * FROM flyway_schema_history;
   ```

### Smoke Tests

Create a simple smoke test script:

```bash
#!/bin/bash
# smoke-test.sh

BACKEND_URL="https://your-backend.railway.app"
FRONTEND_URL="https://your-frontend.railway.app"

echo "Testing Backend Health..."
curl -f "$BACKEND_URL/actuator/health" || exit 1

echo "Testing Frontend..."
curl -f "$FRONTEND_URL" || exit 1

echo "All smoke tests passed!"
```

---

## Monitoring and Health Checks

### Backend Monitoring

1. **Spring Actuator Endpoints**
   - `/actuator/health` - Health check
   - `/actuator/info` - Application info
   - `/actuator/metrics` - Application metrics (if enabled)

2. **Railway Metrics**
   - CPU usage
   - Memory usage
   - Request count
   - Error rate

3. **Log Monitoring**
   - View logs in Railway dashboard
   - Set up log aggregation (optional)
   - Monitor error rates

### Frontend Monitoring

1. **Next.js Metrics**
   - Build time
   - Page load time
   - API response times

2. **Error Tracking**
   - Monitor client-side errors
   - Track API failures
   - User session tracking (optional)

### Database Monitoring

1. **Railway Database Metrics**
   - Connection count
   - Query performance
   - Storage usage

2. **Migration Monitoring**
   - Verify all migrations applied
   - Check for migration failures
   - Monitor schema changes

---

## Rollback Strategy

### Railway Rollback

1. **Automatic Rollback**
   - Railway can automatically rollback on health check failures
   - Configure in service settings

2. **Manual Rollback**
   - Go to service → "Deployments"
   - Select previous successful deployment
   - Click "Redeploy"

### Database Rollback

1. **Migration Rollback**
   - Flyway supports migration rollback (requires manual SQL)
   - Create rollback migration files (V5__Rollback_*.sql)
   - Test rollback in staging environment first

2. **Database Backup**
   - Railway provides automatic backups
   - Manual backup before major deployments
   - Point-in-time recovery available

### Rollback Checklist

- [ ] Identify the issue
- [ ] Determine rollback scope (backend, frontend, or both)
- [ ] Backup current database state
- [ ] Execute rollback
- [ ] Verify application functionality
- [ ] Document the issue and resolution

---

## Post-Deployment Tasks

### Immediate Tasks

1. **Verify All Services**
   - [ ] Backend is running and healthy
   - [ ] Frontend is accessible
   - [ ] Database is connected
   - [ ] API endpoints are responding

2. **Test Core Functionality**
   - [ ] User authentication works
   - [ ] Customer CRUD operations work
   - [ ] Invoice creation with line items works
   - [ ] Payment recording works
   - [ ] Invoice status transitions work

3. **Security Verification**
   - [ ] HTTPS is enabled
   - [ ] CORS is configured correctly
   - [ ] JWT tokens are working
   - [ ] API endpoints are secured

### Documentation Updates

1. **Update README**
   - Add deployment instructions
   - Document environment variables
   - Add troubleshooting section

2. **API Documentation**
   - Verify Swagger/OpenAPI is accessible
   - Test API documentation endpoint
   - Document any custom endpoints

### Performance Optimization

1. **Monitor Performance**
   - Check API response times
   - Monitor database query performance
   - Review frontend load times

2. **Optimize as Needed**
   - Add database indexes if needed
   - Optimize API queries
   - Enable caching where appropriate

---

## Troubleshooting Guide

### Common Issues

#### Backend Won't Start

**Issue**: Backend service fails to start

**Solutions**:
1. Check build logs for compilation errors
2. Verify Java version (should be 17)
3. Check environment variables are set correctly
4. Verify database connection string
5. Check port conflicts (should use Railway-assigned port)

#### Database Connection Failed

**Issue**: Cannot connect to database

**Solutions**:
1. Verify `DATABASE_URL` environment variable
2. Check database service is running
3. Verify network connectivity between services
4. Check database credentials
5. Verify Flyway migrations can run

#### Frontend Build Fails

**Issue**: Frontend build fails

**Solutions**:
1. Check Node.js version (should be compatible with Next.js 16)
2. Verify all dependencies are in `package.json`
3. Check for TypeScript errors
4. Verify environment variables are set
5. Check build logs for specific errors

#### CORS Errors

**Issue**: CORS errors when frontend calls backend

**Solutions**:
1. Verify `CORS_ALLOWED_ORIGINS` includes frontend URL
2. Check backend CORS configuration
3. Verify frontend is using correct API URL
4. Check browser console for specific CORS errors

#### Migration Failures

**Issue**: Flyway migrations fail

**Solutions**:
1. Check migration SQL syntax
2. Verify database permissions
3. Check for conflicting migrations
4. Review Flyway schema history
5. Manually verify migration SQL

### Debugging Commands

```bash
# Check backend logs
railway logs --service backend

# Check frontend logs
railway logs --service frontend

# Connect to database
railway connect postgres

# Check environment variables
railway variables

# View service status
railway status
```

### Getting Help

1. **Railway Documentation**: https://docs.railway.app
2. **Railway Discord**: https://discord.gg/railway
3. **Railway Support**: support@railway.app
4. **Application Logs**: Check Railway dashboard logs

---

## Deployment Checklist

### Pre-Deployment
- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Environment variables documented
- [ ] Database migrations tested
- [ ] Security review completed

### Deployment
- [ ] Railway project created
- [ ] Database service provisioned
- [ ] Backend service configured
- [ ] Frontend service configured
- [ ] Environment variables set
- [ ] Services deployed successfully

### Post-Deployment
- [ ] Health checks passing
- [ ] Core functionality tested
- [ ] API endpoints verified
- [ ] Frontend accessible
- [ ] Database migrations applied
- [ ] Monitoring configured
- [ ] Documentation updated

---

## Appendix

### Railway Service URLs

After deployment, note your service URLs:

- **Backend**: `https://your-backend.railway.app`
- **Frontend**: `https://your-frontend.railway.app`
- **Database**: Managed internally by Railway

### Useful Railway Commands

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Open service
railway open

# View variables
railway variables

# Connect to database
railway connect postgres
```

### Environment Variable Template

Create a `.env.example` file for reference:

```bash
# Backend
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/invoiceme
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=password
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRATION=86400000
SERVER_PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NODE_ENV=development
```

---

**Last Updated**: [Current Date]
**Version**: 1.0.0
**Author**: Deployment Team

