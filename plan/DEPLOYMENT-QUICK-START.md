# Deployment Quick Start Guide

This is a condensed version of the full deployment plan. Use this for quick reference during deployment.

## Prerequisites

- [ ] GitHub repository with code pushed
- [ ] Railway account (sign up at https://railway.app)
- [ ] Strong JWT secret generated

## Step-by-Step Deployment

### 1. Create Railway Project

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your InvoiceMe repository

### 2. Create Database Service

1. Click "New" → "Database" → "PostgreSQL"
2. Railway will automatically provision PostgreSQL
3. Note the connection variables (available in service settings)

### 3. Deploy Backend

1. Click "New" → "GitHub Repo" → Select your repo
2. Set root directory: `backend`
3. Railway will auto-detect Java/Maven
4. Add environment variables (see below)
5. Deploy

**Backend Environment Variables:**
```
SPRING_DATASOURCE_URL=${DATABASE_URL}
SPRING_DATASOURCE_USERNAME=${PGUSER}
SPRING_DATASOURCE_PASSWORD=${PGPASSWORD}
JWT_SECRET=<generate-strong-secret>
JWT_EXPIRATION=86400000
SERVER_PORT=8080
CORS_ALLOWED_ORIGINS=invoiceme-production.up.railway.app
SPRING_FLYWAY_ENABLED=true
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
```

### 4. Deploy Frontend

1. Click "New" → "GitHub Repo" → Select your repo
2. Set root directory: `frontend`
3. Railway will auto-detect Node.js/Next.js
4. Add environment variables (see below)
5. Deploy

**Frontend Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 5. Verify Deployment

1. Check backend health: `https://your-backend.railway.app/actuator/health`
2. Check frontend: `https://your-frontend.railway.app`
3. Test login functionality
4. Test core features (create customer, invoice, payment)

## Generate JWT Secret

```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Java version (17), verify env vars, check logs |
| Database connection failed | Verify `DATABASE_URL` is set correctly |
| Frontend build fails | Check Node.js version, verify dependencies |
| CORS errors | Update `CORS_ALLOWED_ORIGINS` with frontend URL |
| Migration failures | Check Flyway logs, verify SQL syntax |

## Useful Commands

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# View logs
railway logs

# Connect to database
railway connect postgres
```

## Next Steps

After successful deployment:
1. Set up custom domains (optional)
2. Configure monitoring
3. Set up automated backups
4. Review full deployment plan for advanced configuration

For detailed information, see [deployment-plan.md](./deployment-plan.md).

