# CI/CD Pipeline Architecture

## Overview

This document describes the complete CI/CD architecture for the InvoiceMe application using GitHub Actions and Railway.

## Pipeline Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Developer                                │
│                              │                                   │
│                              ▼                                   │
│                    ┌──────────────────┐                         │
│                    │   Git Push/PR    │                         │
│                    └──────────────────┘                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GitHub Actions                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    Trigger Events                       │    │
│  │  • Push to main/develop                                 │    │
│  │  • Pull Request to main/develop                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                             │                                    │
│                             ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Parallel Test Jobs                          │   │
│  │                                                           │   │
│  │  ┌──────────────────┐      ┌──────────────────┐        │   │
│  │  │  Backend Tests   │      │  Frontend Build  │        │   │
│  │  │                  │      │                  │        │   │
│  │  │  • Maven Tests   │      │  • npm install   │        │   │
│  │  │  • JUnit         │      │  • Type Check    │        │   │
│  │  │  • Integration   │      │  • Build         │        │   │
│  │  │  • Reports       │      │  • Artifacts     │        │   │
│  │  └──────────────────┘      └──────────────────┘        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                    │
│                             ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Tests Pass?                                 │   │
│  │              ┌─────┴─────┐                              │   │
│  │              │    Yes    │    No                        │   │
│  │              ▼           ▼                              │   │
│  │         Continue      Fail & Notify                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                    │
│                             ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         Is Main Branch Push?                             │   │
│  │              ┌─────┴─────┐                              │   │
│  │              │    Yes    │    No                        │   │
│  │              ▼           ▼                              │   │
│  │          Deploy      Stop (PR)                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                    │
│                             ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Parallel Deployment Jobs                       │   │
│  │                                                           │   │
│  │  ┌──────────────────┐      ┌──────────────────┐        │   │
│  │  │ Deploy Backend   │      │ Deploy Frontend  │        │   │
│  │  │                  │      │                  │        │   │
│  │  │ • Railway CLI    │      │ • Railway CLI    │        │   │
│  │  │ • Build JAR      │      │ • Build Next.js  │        │   │
│  │  │ • Upload         │      │ • Upload         │        │   │
│  │  └──────────────────┘      └──────────────────┘        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                    │
│                             ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Notify Status                               │   │
│  │              • Success ✅                                │   │
│  │              • Failure ❌                                │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Railway                                  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Backend Service                         │   │
│  │                                                           │   │
│  │  • Receives deployment                                   │   │
│  │  • Builds with Nixpacks                                  │   │
│  │  • Runs Flyway migrations                                │   │
│  │  • Starts Spring Boot app                                │   │
│  │  • Health check: /actuator/health                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 Frontend Service                         │   │
│  │                                                           │   │
│  │  • Receives deployment                                   │   │
│  │  • Builds with Nixpacks                                  │   │
│  │  • Builds Next.js production                             │   │
│  │  • Starts Next.js server                                 │   │
│  │  • Health check: /                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                         │   │
│  │                                                           │   │
│  │  • Managed PostgreSQL instance                           │   │
│  │  • Automatic backups                                     │   │
│  │  • Connection pooling                                    │   │
│  │  • Migrations applied on backend startup                 │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      End Users                                   │
│                                                                  │
│  • Access frontend: https://<app>.railway.app                   │
│  • Frontend calls backend API                                   │
│  • Backend queries PostgreSQL                                   │
│  • Secure, isolated data per company                            │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### GitHub Actions Workflow

**File:** `.github/workflows/ci-cd.yml`

**Jobs:**

1. **backend-test**
   - Runs on: `ubuntu-latest`
   - Java: 17 (Temurin)
   - Steps:
     - Checkout code
     - Setup JDK
     - Run Maven tests
     - Generate test reports
     - Upload artifacts

2. **frontend-test**
   - Runs on: `ubuntu-latest`
   - Node: 18
   - Steps:
     - Checkout code
     - Setup Node.js
     - Install dependencies
     - Type check (TypeScript)
     - Build production bundle
     - Upload artifacts

3. **deploy-backend**
   - Runs on: `ubuntu-latest`
   - Depends on: backend-test, frontend-test
   - Condition: main branch push
   - Steps:
     - Checkout code
     - Install Railway CLI
     - Deploy to Railway

4. **deploy-frontend**
   - Runs on: `ubuntu-latest`
   - Depends on: backend-test, frontend-test
   - Condition: main branch push
   - Steps:
     - Checkout code
     - Install Railway CLI
     - Deploy to Railway

5. **notify**
   - Runs on: `ubuntu-latest`
   - Depends on: deploy-backend, deploy-frontend
   - Always runs (success or failure)
   - Reports deployment status

### Railway Services

#### Backend Service

**Configuration:** `backend/railway.json`

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "./mvnw clean package -DskipTests"
  },
  "deploy": {
    "startCommand": "java -Dserver.port=$PORT -jar target/invoiceme-backend-1.0.0.jar",
    "healthcheckPath": "/actuator/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Environment Variables:**
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION`
- `CORS_ALLOWED_ORIGINS`
- `SERVER_PORT`

#### Frontend Service

**Configuration:** `frontend/railway.json`

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
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

**Environment Variables:**
- `NEXT_PUBLIC_API_URL`

#### PostgreSQL Database

**Type:** Managed PostgreSQL  
**Version:** Latest stable  
**Features:**
- Automatic backups
- Connection pooling
- High availability
- Automatic scaling

## Deployment Sequence

### 1. Code Push

```
Developer → Git Push → GitHub
```

### 2. CI Pipeline

```
GitHub Actions Triggered
    ↓
Run Tests in Parallel
    ├── Backend Tests (Maven)
    └── Frontend Build (Next.js)
    ↓
Generate Reports
    ↓
Upload Artifacts
```

### 3. CD Pipeline (Main Branch Only)

```
Tests Pass
    ↓
Deploy in Parallel
    ├── Backend → Railway
    └── Frontend → Railway
    ↓
Railway Builds
    ├── Backend: Maven Package
    └── Frontend: Next.js Build
    ↓
Railway Deploys
    ├── Backend: Start Spring Boot
    │   └── Run Flyway Migrations
    └── Frontend: Start Next.js
    ↓
Health Checks
    ├── Backend: /actuator/health
    └── Frontend: /
    ↓
Deployment Complete ✅
```

## Security Considerations

### Secrets Management

**GitHub Secrets:**
- `RAILWAY_TOKEN` - Railway API token for deployments

**Railway Environment Variables:**
- Database credentials (encrypted at rest)
- JWT secret (never exposed in logs)
- API keys (secure storage)

### Network Security

- **HTTPS Only** - Railway provides SSL certificates
- **CORS** - Configured to allow only frontend domain
- **JWT** - Secure token-based authentication
- **Database** - Private network, not publicly accessible

## Monitoring & Observability

### GitHub Actions

- **Workflow Status** - Green/Red badges
- **Test Reports** - JUnit XML reports
- **Artifacts** - Test results and build outputs
- **Logs** - Detailed execution logs

### Railway

- **Deployment Logs** - Real-time build and runtime logs
- **Metrics** - CPU, memory, network usage
- **Health Checks** - Automatic endpoint monitoring
- **Alerts** - Deployment failure notifications

## Rollback Strategy

### Automatic Rollback

Railway automatically rolls back if:
- Health check fails
- Application crashes on startup
- Deployment times out

### Manual Rollback

```bash
# Via Railway CLI
railway rollback --service backend

# Via Railway Dashboard
# Navigate to Deployments → Select previous version → Redeploy
```

## Performance Optimization

### Build Caching

**GitHub Actions:**
- Maven dependencies cached
- Node modules cached
- Docker layers cached

**Railway:**
- Nixpacks build cache
- Docker layer cache
- npm/Maven cache

### Deployment Speed

- **Average Build Time:** 3-5 minutes
- **Average Deploy Time:** 1-2 minutes
- **Total Pipeline:** 5-10 minutes

## Cost Analysis

### GitHub Actions

- **Free Tier:** 2,000 minutes/month
- **Typical Usage:** ~100 minutes/month
- **Cost:** $0 (within free tier)

### Railway

- **Hobby Plan:** $5/month (includes $5 credit)
- **Backend:** ~$3/month
- **Frontend:** ~$2/month
- **Database:** ~$5/month
- **Total:** ~$10/month

## Scaling Strategy

### Horizontal Scaling

```
Railway Dashboard → Service → Settings → Scale
- Increase replicas
- Load balancing automatic
```

### Vertical Scaling

```
Railway Dashboard → Service → Settings → Resources
- Increase CPU/Memory
- Automatic resource allocation
```

## Disaster Recovery

### Database Backups

- **Automatic:** Daily backups by Railway
- **Manual:** `railway run pg_dump`
- **Retention:** 7 days (Hobby), 30 days (Pro)

### Service Recovery

- **Automatic Restart:** On failure
- **Health Check:** Monitors availability
- **Rollback:** To last known good deployment

## Future Enhancements

### Planned Improvements

1. **Staging Environment**
   - Deploy `develop` branch to staging
   - Test before production

2. **E2E Tests**
   - Playwright/Cypress tests
   - Run in CI pipeline

3. **Performance Tests**
   - Load testing with k6
   - Performance regression detection

4. **Security Scanning**
   - Dependency vulnerability scanning
   - SAST/DAST integration

5. **Monitoring**
   - Application Performance Monitoring (APM)
   - Error tracking (Sentry)
   - Log aggregation (Datadog/ELK)

---

**Last Updated:** November 9, 2024  
**Version:** 1.0  
**Status:** Production Ready

