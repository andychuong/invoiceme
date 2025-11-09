# CI/CD Setup Guide with GitHub Actions & Railway

This guide explains how to set up continuous integration and deployment for the InvoiceMe application using GitHub Actions and Railway.

## Overview

The CI/CD pipeline automatically:
1. Runs backend tests on every push/PR
2. Builds and type-checks the frontend
3. Deploys to Railway when code is merged to `main`

## Architecture

```
GitHub Push/PR
    ↓
GitHub Actions
    ├── Backend Tests (Maven)
    ├── Frontend Build (Next.js)
    └── Type Checking (TypeScript)
    ↓
Tests Pass?
    ↓ Yes
Deploy to Railway
    ├── Backend Service
    ├── Frontend Service
    └── PostgreSQL Database
```

## Prerequisites

1. GitHub repository with your code
2. Railway account (https://railway.app)
3. Railway CLI installed locally (for initial setup)

## ✅ Already Have Railway Deployed? (Start Here!)

**If you already have your Railway services set up** (Postgres, Frontend, Backend), you can skip all the Railway setup steps and jump straight to connecting GitHub Actions!

### Your Existing Railway Services

Based on your Railway dashboard, you already have:
- ✅ **Postgres** - Database service (deployed via Docker Image)
- ✅ **Frontend** - Frontend service at `invoiceme.up.railway.app` (deployed via GitHub)
- ✅ **Backend** - Backend service at `invoiceme-backend.up.railway.app` (deployed via GitHub)

### What You Need to Do (3 Steps - 5 minutes)

Since your services are already deployed and working, you just need to connect GitHub Actions:

1. **Get Railway Token** (1 min) - Generate token for GitHub Actions
2. **Add GitHub Secret** (2 min) - Add Railway token to GitHub Secrets
3. **Push Workflow File** (2 min) - Push the CI/CD workflow and watch it deploy!

👉 **Jump to:** [Quick Setup for Existing Railway Deployment](#quick-setup-for-existing-railway-deployment)

**Note:** Your service names ("backend" and "frontend") already match the workflow file, so no changes needed! ✅

---

## New Railway Setup (Skip if you already have services deployed)

## Step 1: Railway Setup (New Deployment)

> **Note:** If you already have Railway services deployed, skip to [Step 2: Get Railway Token](#step-2-get-railway-token)

### 1.1 Create Railway Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create a new project
railway init
```

### 1.2 Create Services

In Railway dashboard:

1. **Create PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Note the connection details

2. **Create Backend Service**
   - Click "New" → "Empty Service"
   - Name it "backend"
   - Link to your GitHub repo
   - Set root directory to `/backend`

3. **Create Frontend Service**
   - Click "New" → "Empty Service"
   - Name it "frontend"
   - Link to your GitHub repo
   - Set root directory to `/frontend`

### 1.3 Configure Environment Variables

#### Backend Service Variables

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://<railway-db-host>:<port>/<database>
SPRING_DATASOURCE_USERNAME=<username>
SPRING_DATASOURCE_PASSWORD=<password>

# JWT
JWT_SECRET=<generate-strong-secret-256-bits>
JWT_EXPIRATION=86400000

# CORS
CORS_ALLOWED_ORIGINS=https://<your-frontend-url>.railway.app

# Server
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

#### Frontend Service Variables

```bash
NEXT_PUBLIC_API_URL=https://<your-backend-url>.railway.app/api
```

### 1.4 Get Railway Token

Generate a token from the Railway dashboard:

1. Go to **Railway Dashboard** (https://railway.app/dashboard)
2. Click on your **profile/account icon** (top right)
3. Go to **Settings** → **Tokens** (or **Developer Settings** → **Tokens**)
4. Click **"New Token"** or **"Create Token"**
5. Give it a name (e.g., "GitHub Actions CI/CD")
6. **Copy the token immediately** - you won't be able to see it again!

**Note:** The Railway CLI doesn't have a `tokens create` command. Tokens must be generated from the dashboard.

## Quick Setup for Existing Railway Deployment

If you've already successfully deployed to Railway, follow these simplified steps:

### Step 1: Verify Your Railway Services ✅

You should already have these services in your Railway dashboard:

1. **Go to Railway Dashboard** (https://railway.app/dashboard)
2. **Verify your services exist:**
   - ✅ **Postgres** - Database service (deployed via Docker Image)
   - ✅ **Frontend** - Frontend service (invoiceme.up.railway.app, deployed via GitHub)
   - ✅ **Backend** - Backend service (invoiceme-backend.up.railway.app, deployed via GitHub)

3. **Your service names:**
   - Backend service: **"backend"** ✅ (matches workflow)
   - Frontend service: **"frontend"** ✅ (matches workflow)
   - Database: **"Postgres"** ✅

**Good news:** Your service names match the workflow file, so no changes needed!

### Step 2: Get Railway Token

**You don't need to run `railway init`** - your project already exists! You just need to generate a token from the Railway dashboard.

**Option 1: Generate Token from Railway Dashboard (Recommended)**

1. Go to **Railway Dashboard** (https://railway.app/dashboard)
2. Click on your **profile/account icon** (top right)
3. Go to **Settings** → **Tokens** (or **Developer Settings** → **Tokens**)
4. Click **"New Token"** or **"Create Token"**
5. Give it a name (e.g., "GitHub Actions CI/CD")
6. Copy the token immediately (you won't be able to see it again!)

**Option 2: Generate Token via Railway API**

If you prefer using the API:
```bash
# Login to Railway first
railway login

# Then generate token via API (if available)
# Note: This may require using the Railway API directly
```

**Note:** You don't need to link your local repo (`railway link`) or initialize a new project (`railway init`) since your services are already deployed. You just need the token for GitHub Actions to deploy.

### Step 3: Add GitHub Secret

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add:
   ```
   Name: RAILWAY_TOKEN
   Value: <paste-token-from-step-2>
   ```
4. Click **"Add secret"**

### Step 4: Verify Railway Configuration Files

Ensure these files exist in your repository:

- ✅ `.github/workflows/ci-cd.yml` - GitHub Actions workflow
- ✅ `backend/railway.json` - Backend Railway config
- ✅ `frontend/railway.json` - Frontend Railway config

If missing, they should already be in your repo. If not, check the files were committed.

### Step 5: Verify Workflow Service Names ✅

Your Railway service names match the workflow file perfectly:
- Backend service: **"backend"** ✅
- Frontend service: **"frontend"** ✅

**No changes needed!** The workflow file (`.github/workflows/ci-cd.yml`) already uses:
```yaml
# Backend deployment
run: railway up --service backend

# Frontend deployment
run: railway up --service frontend
```

**Note:** Since your services are already linked to your GitHub repo in Railway (deployed via GitHub), Railway will automatically detect and deploy to the correct services.

### Step 6: Verify Environment Variables

Since you've already successfully deployed, your environment variables should already be configured. Double-check in Railway dashboard:

**Backend Service:**
- `SPRING_DATASOURCE_URL` - Should point to your Railway PostgreSQL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `JWT_SECRET` - Strong secret (256+ bits)
- `JWT_EXPIRATION` - Usually 86400000
- `CORS_ALLOWED_ORIGINS` - Should include: `https://invoiceme.up.railway.app`
- `SERVER_PORT` - Usually 8080

**Frontend Service:**
- `NEXT_PUBLIC_API_URL` - Should be: `https://invoiceme-backend.up.railway.app/api`

**To verify:** Go to Railway dashboard → Select service → Variables tab

### Step 7: Test the Pipeline

```bash
# Commit and push the workflow file
git add .github/workflows/ci-cd.yml
git commit -m "Add CI/CD pipeline"
git push origin main

# Watch GitHub Actions
# Go to: https://github.com/<your-repo>/actions
```

### Step 8: Verify Deployment

1. **Check GitHub Actions:**
   - Go to your repo → Actions tab
   - Look for green checkmarks ✅

2. **Check Railway:**
   - Go to Railway dashboard
   - Verify new deployments appear
   - Check logs for any errors

3. **Test Your App:**
   ```bash
   # Backend health check
   curl https://invoiceme-backend.up.railway.app/actuator/health
   
   # Frontend
   open https://invoiceme.up.railway.app
   ```

### Troubleshooting for Existing Deployments

**Issue: Railway can't find services**
```bash
# Link to your Railway project (if not already linked)
railway link

# List your services to verify
railway status
```

**Issue: Deployment fails with "service not found"**
- ✅ Your service names ("backend" and "frontend") match the workflow
- If still failing, check Railway dashboard → Service → Settings → Service name
- Since services are linked via GitHub, Railway should auto-detect them

**Issue: Environment variables missing**
- Check Railway dashboard → Service → Variables tab
- Backend: Ensure `CORS_ALLOWED_ORIGINS` includes `https://invoiceme.up.railway.app`
- Frontend: Ensure `NEXT_PUBLIC_API_URL` is `https://invoiceme-backend.up.railway.app/api`

**Issue: Tests pass but deployment doesn't trigger**
- Ensure you're pushing to `main` branch
- Check workflow file is in `.github/workflows/ci-cd.yml`
- Verify workflow syntax is correct
- Check GitHub Actions tab for any workflow errors

**Issue: Deployment succeeds but app doesn't work**
- Check Railway logs: Railway dashboard → Service → Deployments → View logs
- Verify environment variables are set correctly
- Check database connection in backend logs
- Verify CORS settings match your frontend URL

## Step 2: GitHub Secrets Setup (New Setup)

Add the following secrets to your GitHub repository:

1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add:

```
Name: RAILWAY_TOKEN
Value: <your-railway-token-from-step-1.4>
```

## Step 3: GitHub Actions Workflow

The workflow file is already created at `.github/workflows/ci-cd.yml`

### Workflow Stages

#### 1. Backend Tests
- Runs on every push/PR
- Executes Maven tests
- Generates test reports
- Uploads test artifacts

#### 2. Frontend Build
- Runs on every push/PR
- Installs dependencies
- Type checks with TypeScript
- Builds production bundle
- Uploads build artifacts

#### 3. Deploy Backend (main branch only)
- Deploys backend to Railway
- Only runs after tests pass
- Only on `main` branch pushes

#### 4. Deploy Frontend (main branch only)
- Deploys frontend to Railway
- Only runs after tests pass
- Only on `main` branch pushes

## Step 4: Railway Configuration Files

Configuration files are already created:

### Backend (`backend/railway.json`)
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "./mvnw clean package -DskipTests"
  },
  "deploy": {
    "startCommand": "java -Dserver.port=$PORT -jar target/invoiceme-backend-1.0.0.jar",
    "healthcheckPath": "/actuator/health"
  }
}
```

### Frontend (`frontend/railway.json`)
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/"
  }
}
```

## Step 5: Deployment Workflow

### For Development (PR)

```bash
# 1. Create a feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "Add new feature"

# 3. Push to GitHub
git push origin feature/my-feature

# 4. Create Pull Request
# GitHub Actions will automatically:
# - Run backend tests
# - Build frontend
# - Report results on PR
```

### For Production (Main)

```bash
# 1. Merge PR to main (after tests pass)
# GitHub Actions will automatically:
# - Run all tests again
# - Deploy backend to Railway
# - Deploy frontend to Railway

# 2. Monitor deployment
# Check Railway dashboard for deployment status
# Check GitHub Actions for pipeline status
```

## Step 6: Monitoring & Logs

### GitHub Actions Logs

1. Go to your repo → Actions tab
2. Click on the latest workflow run
3. View logs for each job

### Railway Logs

1. Go to Railway dashboard
2. Select your service (backend/frontend)
3. Click "Deployments" → View logs

### Health Checks

```bash
# Backend health check
curl https://<your-backend-url>.railway.app/actuator/health

# Frontend health check
curl https://<your-frontend-url>.railway.app
```

## Step 7: Database Migrations

Flyway migrations run automatically on backend startup:

1. Railway starts the backend service
2. Spring Boot connects to PostgreSQL
3. Flyway checks for pending migrations
4. Migrations are applied automatically
5. Application starts

### Manual Migration Check

```bash
# Connect to Railway backend
railway run --service backend bash

# Check Flyway status
./mvnw flyway:info
```

## Troubleshooting

### Tests Failing in CI

**Problem:** Tests pass locally but fail in CI

**Solutions:**
1. Check Java version (should be 17)
2. Check Node version (should be 18)
3. Verify environment variables
4. Check for platform-specific issues

```bash
# Run tests locally with same setup as CI
docker run -it --rm \
  -v $(pwd):/app \
  -w /app/backend \
  eclipse-temurin:17 \
  ./mvnw clean test
```

### Deployment Failing

**Problem:** Deployment fails on Railway

**Solutions:**
1. Check Railway logs for errors
2. Verify environment variables are set
3. Check database connection
4. Verify build commands in `railway.json`

```bash
# Test Railway deployment locally
railway run --service backend java -jar target/invoiceme-backend-1.0.0.jar
```

### Database Connection Issues

**Problem:** Backend can't connect to database

**Solutions:**
1. Verify `SPRING_DATASOURCE_URL` is correct
2. Check database credentials
3. Ensure database is running
4. Check network/firewall settings

```bash
# Test database connection
railway run --service backend \
  psql $DATABASE_URL -c "SELECT 1"
```

### CORS Errors

**Problem:** Frontend can't connect to backend

**Solutions:**
1. Verify `CORS_ALLOWED_ORIGINS` includes frontend URL
2. Check `NEXT_PUBLIC_API_URL` is correct
3. Ensure both services are deployed
4. Check browser console for exact error

## Advanced Configuration

### Branch-Specific Deployments

To deploy different branches to different environments:

```yaml
# In .github/workflows/ci-cd.yml
deploy-staging:
  if: github.ref == 'refs/heads/develop'
  env:
    RAILWAY_ENVIRONMENT: staging
```

### Automated Database Backups

```bash
# Add to Railway cron job
railway run --service database \
  pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### Slack Notifications

Add to workflow:

```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Security Best Practices

1. **Never commit secrets** - Use GitHub Secrets and Railway environment variables
2. **Rotate tokens regularly** - Generate new Railway tokens periodically
3. **Use HTTPS** - Railway provides SSL certificates automatically
4. **Limit access** - Use Railway's team features to control access
5. **Monitor logs** - Regularly check logs for suspicious activity

## Cost Optimization

### Railway Pricing

- **Hobby Plan:** $5/month (includes $5 credit)
- **Pro Plan:** $20/month (includes $20 credit)
- Usage-based pricing after credits

### Tips to Reduce Costs

1. **Use sleep mode** for development environments
2. **Optimize Docker images** to reduce build time
3. **Use caching** in GitHub Actions
4. **Monitor resource usage** in Railway dashboard

## Maintenance

### Regular Tasks

1. **Weekly:** Check deployment logs for errors
2. **Monthly:** Review and update dependencies
3. **Quarterly:** Rotate secrets and tokens
4. **As needed:** Scale services based on usage

### Updating Dependencies

```bash
# Backend
cd backend
./mvnw versions:display-dependency-updates

# Frontend
cd frontend
npm outdated
```

## Testing the Pipeline

### Test Locally Before Pushing

```bash
# Run backend tests
cd backend
./mvnw clean test

# Build frontend
cd frontend
npm run build

# Type check
npx tsc --noEmit
```

### Test Railway Deployment Locally

```bash
# Install Railway CLI
npm install -g @railway/cli

# Link to your project
railway link

# Test backend deployment
cd backend
railway run ./mvnw spring-boot:run

# Test frontend deployment
cd frontend
railway run npm run dev
```

## Support & Resources

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Railway Docs:** https://docs.railway.app
- **Railway CLI:** https://docs.railway.app/develop/cli
- **Railway Discord:** https://discord.gg/railway

## Checklist

Before going live with CI/CD:

- [ ] Railway project created
- [ ] PostgreSQL database provisioned
- [ ] Backend service configured
- [ ] Frontend service configured
- [ ] Environment variables set
- [ ] GitHub secrets added
- [ ] Railway token generated
- [ ] Workflow file committed
- [ ] Railway config files committed
- [ ] Test deployment successful
- [ ] Health checks passing
- [ ] Database migrations working
- [ ] CORS configured correctly
- [ ] Monitoring set up
- [ ] Team notified

---

**Last Updated:** November 9, 2024  
**Version:** 1.0  
**Status:** Production Ready

