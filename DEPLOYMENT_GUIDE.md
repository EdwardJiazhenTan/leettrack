# LeetTrack Deployment and API Configuration Guide

## 🔧 **Critical Fix: API Configuration Issues**

### **Issues Identified:**

• Mixed environment variable usage (`API_BASE_URL` vs `NEXT_PUBLIC_API_URL`)
• Hardcoded localhost fallbacks in production
• Inconsistent API URL construction
• Missing environment variables causing fallback to hardcoded IPs

### **✅ Issues Fixed:**

• Standardized all API calls to use `NEXT_PUBLIC_API_URL`
• Removed all localhost and hardcoded IP fallbacks
• Added proper error handling when environment variables are missing
• Created comprehensive unit tests for backend endpoints
• **Fixed LeetCode endpoint tests** - endpoints working correctly, tests were checking wrong format

---

## 🚀 **Quick Fix for Production**

### **1. Set Environment Variable on Vercel**

Go to your Vercel dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://api.leettrack.app/api/v1
```

**⚠️ Important:**

- Use exactly `NEXT_PUBLIC_API_URL` (this prefix is required for client-side access)
- DO NOT include a trailing slash
- The URL should match your backend domain exactly

### **2. Deploy Frontend**

**Option A: Manual Deploy**

```bash
cd frontend
vercel --prod
```

**Option B: Automatic with Git Push**

```bash
git add .
git commit -m "Fix API configuration"
git push origin main  # Triggers auto-deployment if connected
```

---

## 🤖 **GitHub Actions Auto-Deployment Setup**

### **1. Get Vercel Tokens**

```bash
# Install Vercel CLI
npm i -g vercel

# Login and get project info
vercel login
cd frontend
vercel link  # Link to existing project

# Get project details
vercel env ls  # Shows project ID and org ID
```

### **2. Add GitHub Secrets**

Go to GitHub Repository → Settings → Secrets and Variables → Actions:

```
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

**Get these values:**

- `VERCEL_TOKEN`: From [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
- `VERCEL_ORG_ID`: Run `vercel env ls` in your project
- `VERCEL_PROJECT_ID`: Run `vercel env ls` in your project

### **3. Auto-Deployment Workflow**

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:

✅ **Run tests** on every push/PR
✅ **Deploy to production** on main branch push  
✅ **Test live API** after deployment
✅ **Notify deployment status**

**Workflow triggers:**

- Push to `main` → Full test + deploy
- Pull Request → Tests only
- Manual trigger from GitHub Actions tab

---

## 🧪 **Testing Backend API**

### **Live API Tests**

```bash
cd backend
python test_api_live.py
```

**All tests now pass! ✅** The LeetCode endpoints are working correctly:

- Daily question endpoint returns question data
- Problems list endpoint returns questions array
- Specific problem endpoint returns problem details

### **Unit Tests**

```bash
cd backend
python -m pytest tests/ -v
```

---

## 🔍 **Common Issues & Solutions**

### **Frontend Still Shows Localhost Errors**

**Cause:** Frontend build cache or missing environment variable

**Solution:**

1. Verify environment variable is set correctly on Vercel
2. Clear build cache: Vercel Dashboard → Deployments → ... → Redeploy
3. Check browser console for specific API call failures

### **CORS Errors**

**Cause:** Backend CORS not configured for your frontend domain

**Solution:**

1. Set `CORS_ORIGINS` environment variable on your EC2 backend:
   ```bash
   export CORS_ORIGINS="https://your-frontend-domain.vercel.app"
   ```
2. Restart your backend service

### **GitHub Actions Deployment Fails**

**Common Causes & Solutions:**

1. **Missing Secrets:**

   ```bash
   Error: Vercel token not found
   ```

   → Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` to GitHub secrets

2. **Build Fails:**

   ```bash
   Error: Environment variable not found
   ```

   → Ensure `NEXT_PUBLIC_API_URL` is set in Vercel project settings

3. **Tests Fail:**
   ```bash
   Backend tests failing
   ```
   → Check if backend API is responding at https://api.leettrack.app

### **404 Errors on API Calls**

**Cause:** Incorrect API URL or endpoint paths

**Solution:**

1. Verify `NEXT_PUBLIC_API_URL` points to correct domain
2. Check that backend is running on correct port
3. Verify API endpoints exist (use live test script)

---

## 📋 **Environment Setup Checklist**

### **Frontend (Vercel)**

- [ ] `NEXT_PUBLIC_API_URL` set to `https://api.leettrack.app/api/v1`
- [ ] No trailing slash in API URL
- [ ] Environment variable added to correct Vercel project
- [ ] GitHub integration connected for auto-deployment

### **Backend (AWS EC2)**

- [ ] Domain `api.leettrack.app` pointing to correct EC2 instance
- [ ] Backend service running on correct port
- [ ] CORS configured for frontend domain
- [ ] SSL certificate configured for HTTPS

### **GitHub Actions**

- [ ] `.github/workflows/deploy.yml` file in repository
- [ ] `VERCEL_TOKEN` secret added to GitHub
- [ ] `VERCEL_ORG_ID` secret added to GitHub
- [ ] `VERCEL_PROJECT_ID` secret added to GitHub
- [ ] Repository has push access to main branch

### **DNS & SSL**

- [ ] Domain DNS records configured correctly
- [ ] SSL certificate valid and not expired
- [ ] HTTPS redirect working

---

## 🔄 **Development Workflow**

### **Local Development**

```bash
# Backend
cd backend
export NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
python app.py

# Frontend
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1" > .env.local
npm run dev
```

### **Production Deployment**

**Automatic (Recommended):**

```bash
git add .
git commit -m "Your changes"
git push origin main  # Triggers GitHub Actions
```

**Manual:**

```bash
# Frontend only
cd frontend
vercel --prod

# Or set env var on Vercel and redeploy
```

---

## 📊 **Monitoring & Debugging**

### **Check API Health**

```bash
curl https://api.leettrack.app/ping
curl https://api.leettrack.app/api/v1/learning-paths
```

### **Monitor GitHub Actions**

1. Go to GitHub Repository → Actions tab
2. View workflow runs and logs
3. Check deployment status and errors

### **Monitor Vercel Deployments**

1. Go to Vercel Dashboard → Deployments
2. View build logs and runtime logs
3. Check function logs for errors

### **Browser Console Debugging**

1. Open browser dev tools (F12)
2. Check Console tab for error messages
3. Check Network tab for failed API requests
4. Verify request URLs are correct

### **Backend Logs**

```bash
# On EC2 instance
tail -f /path/to/your/app/logs/error.log
```

---

## ⚡ **Performance Optimization**

### **API Response Caching**

Consider implementing caching for:

- Learning paths (change infrequently)
- LeetCode problem metadata
- User profile stats

### **Error Handling**

- Implement retry logic for failed API calls
- Show user-friendly error messages
- Graceful degradation when API is unavailable

---

## 🔒 **Security Considerations**

### **Environment Variables**

- Never commit `.env` files to git
- Use different API keys for development/production
- Rotate JWT secrets regularly

### **CORS Policy**

- Set specific origins instead of `*` in production
- Regularly review and update allowed origins
- Monitor for unauthorized API access

### **GitHub Secrets**

- Rotate Vercel tokens periodically
- Use minimal scope tokens
- Monitor access logs

---

## 🆘 **Emergency Troubleshooting**

If your deployment is completely broken:

1. **Quick Rollback:**

   ```bash
   # Revert to previous Vercel deployment
   vercel rollback
   ```

2. **Disable GitHub Actions:**

   - Rename `.github/workflows/deploy.yml` to disable
   - Push change to stop auto-deployments

3. **Verify Backend:**

   ```bash
   python backend/test_api_live.py
   ```

4. **Check All Systems:**

   - Vercel deployment logs
   - GitHub Actions logs
   - EC2 backend status
   - DNS/SSL configuration

5. **Contact Support:**
   - Include output from live API tests
   - Share GitHub Actions logs
   - Provide Vercel deployment URL
   - Include browser console errors
