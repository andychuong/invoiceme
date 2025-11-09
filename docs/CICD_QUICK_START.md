# CI/CD Quick Start Guide

Get your CI/CD pipeline running in minutes!

## Prerequisites

- GitHub account with your code pushed
- Railway account (sign up at https://railway.app)
- 5-15 minutes of your time

## Already Have Railway Deployed? (5 Minutes)

If you've already successfully deployed to Railway, you can connect GitHub Actions in just 3 steps:

### 1. Get Railway Token (1 min)

Generate token from Railway dashboard:

1. Go to **Railway Dashboard** (https://railway.app/dashboard)
2. Click your **profile icon** (top right) → **Settings** → **Tokens**
3. Click **"New Token"** or **"Create Token"**
4. Name it (e.g., "GitHub Actions CI/CD")
5. **Copy the token immediately** (you won't see it again!)

### 2. Add GitHub Secret (2 min)
1. Go to GitHub repo → **Settings** → **Secrets** → **Actions**
2. Click **"New repository secret"**
3. Name: `RAILWAY_TOKEN`
4. Value: <paste-token-from-step-1>
5. Click **"Add secret"**

### 3. Push Workflow File (2 min)
```bash
# The workflow file should already be in your repo
# Just verify it exists and push
git add .github/workflows/ci-cd.yml
git commit -m "Enable CI/CD pipeline"
git push origin main
```

**That's it!** Your CI/CD pipeline is now active! 🎉

See [Full Setup Guide](CICD_SETUP.md#quick-setup-for-existing-railway-deployment) for more details.

---

## New Railway Setup (15 Minutes)

If you need to set up Railway from scratch, follow these steps:

### 1. Set Up Railway Services (5 min)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project (in your repo root)
railway init

# Create services in Railway dashboard:
# - PostgreSQL database
# - Backend service (root: /backend)
# - Frontend service (root: /frontend)
```

### 2. Configure Environment Variables (3 min)

**Backend Service:**
```bash
SPRING_DATASOURCE_URL=<from-railway-postgres>
SPRING_DATASOURCE_USERNAME=<from-railway-postgres>
SPRING_DATASOURCE_PASSWORD=<from-railway-postgres>
JWT_SECRET=<generate-256-bit-secret>
JWT_EXPIRATION=86400000
CORS_ALLOWED_ORIGINS=https://<frontend-url>.railway.app
SERVER_PORT=8080
```

**Frontend Service:**
```bash
NEXT_PUBLIC_API_URL=https://<backend-url>.railway.app/api
```

### 3. Get Railway Token (1 min)

Generate token from Railway dashboard:

1. Go to **Railway Dashboard** (https://railway.app/dashboard)
2. Click your **profile icon** (top right) → **Settings** → **Tokens**
3. Click **"New Token"** or **"Create Token"**
4. Name it (e.g., "GitHub Actions CI/CD")
5. **Copy the token immediately** (you won't see it again!)

### 4. Add GitHub Secret (2 min)

1. Go to GitHub repo → Settings → Secrets → Actions
2. Click "New repository secret"
3. Name: `RAILWAY_TOKEN`
4. Value: <paste-token-from-step-3>
5. Click "Add secret"

### 5. Push to GitHub (1 min)

```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

## That's It! 🎉

Your CI/CD pipeline is now active!

## What Happens Next?

### On Every Push/PR:
- ✅ Backend tests run automatically
- ✅ Frontend builds and type-checks
- ✅ Results show in GitHub PR

### On Merge to Main:
- ✅ All tests run again
- ✅ Backend deploys to Railway
- ✅ Frontend deploys to Railway
- ✅ Database migrations run automatically

## Verify It's Working

### 1. Check GitHub Actions
```
Go to: https://github.com/<your-repo>/actions
Look for: Green checkmarks ✅
```

### 2. Check Railway Deployments
```
Go to: https://railway.app/dashboard
Look for: "Deployed" status
```

### 3. Test Your App
```bash
# Backend health check
curl https://<your-backend>.railway.app/actuator/health

# Frontend
open https://<your-frontend>.railway.app
```

## Common Issues & Quick Fixes

### Tests Fail in CI
```bash
# Make sure they pass locally first
cd backend && ./mvnw test
cd frontend && npm run build
```

### Deployment Fails
```bash
# Check Railway logs
railway logs --service backend
railway logs --service frontend
```

### Can't Connect to Database
```bash
# Verify environment variables in Railway dashboard
# Make sure SPRING_DATASOURCE_URL is correct
```

### CORS Errors
```bash
# Update CORS_ALLOWED_ORIGINS in backend service
# Should match your frontend URL exactly
```

## Next Steps

- [ ] Set up staging environment for `develop` branch
- [ ] Add Slack notifications
- [ ] Set up automated backups
- [ ] Configure custom domain
- [ ] Add monitoring/alerting

## Need Help?

- Full guide: `docs/CICD_SETUP.md`
- Railway docs: https://docs.railway.app
- GitHub Actions docs: https://docs.github.com/en/actions

---

**Time to Production:** 
- Already have Railway: ~5 minutes
- New Railway setup: ~15 minutes

**Difficulty:** Easy  
**Cost:** $5/month (Railway Hobby plan)

