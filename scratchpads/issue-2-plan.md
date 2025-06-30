# Issue #2 Analysis: Frontend Cannot Connect to Backend Database

**Issue Link**: https://github.com/EdwardJiazhenTan/LeetTrack/issues/2

## Problem Summary

The frontend deployed at https://www.leettrack.app cannot connect to the backend API at https://api.leettrack.app, resulting in users seeing "NO_PATHS_AVAILABLE" on the `/paths/` page despite the backend being fully functional and returning data.

## Root Cause Analysis

### Backend Status (✅ Working)
- API endpoint `https://api.leettrack.app/api/v1/learning-paths` returns HTTP 200 with 3774 bytes of data
- CORS is properly configured and responds with `Access-Control-Allow-Origin: https://www.leettrack.app`
- Database connection is working correctly
- All API endpoints are functional when tested directly

### Frontend Issues (❌ Not Working)
- Frontend shows "NO_PATHS_AVAILABLE" message instead of loading data
- API configuration appears to have environment variable issues
- Potential mismatch between expected and actual API URLs

## Technical Investigation

### Configuration Analysis

1. **GitHub Actions Workflow** (`.github/workflows/frontend-deploy.yml:48`):
   ```yaml
   env:
     NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
   ```
   - Uses GitHub secret for API URL during build
   - Must verify secret is correctly set

2. **Frontend API Configuration** (`frontend/app/config/api.ts`):
   - Uses `process.env.NEXT_PUBLIC_API_URL` as base URL
   - Throws error if environment variable is not set
   - Builds URLs using `buildApiUrl()` function

3. **API URL Building Logic**:
   - Frontend calls `getApiUrl("/learning-paths")`
   - Should resolve to `https://api.leettrack.app/api/v1/learning-paths`
   - Documentation specifies `NEXT_PUBLIC_API_URL` should be `https://api.leettrack.app` (without `/api/v1`)

4. **Backend CORS Configuration** (`backend/app/__init__.py:42-52`):
   - Production uses `CORS_ORIGINS` environment variable
   - Falls back to allowing all origins (*) if not set (with warning)
   - Development allows `http://localhost:3000`

### Potential Issues

1. **Environment Variable Missing**: `NEXT_PUBLIC_API_URL` may not be set in Vercel deployment
2. **Incorrect API URL**: Secret may contain wrong URL or include `/api/v1` suffix
3. **Build-time vs Runtime**: Next.js environment variables are embedded at build time
4. **Domain Mismatch**: Frontend might be using different domain than expected

## Implementation Plan

### Phase 1: Diagnosis (High Priority)
1. **Verify Environment Variables**
   - Check Vercel project settings for `NEXT_PUBLIC_API_URL`
   - Verify GitHub secret `NEXT_PUBLIC_API_URL` is set to `https://api.leettrack.app`
   - Test local build with correct environment variable

2. **Debug Frontend API Calls**
   - Add temporary console logging to `app/services/api.ts`
   - Log actual URLs being constructed by `buildApiUrl()`
   - Check browser network tab for failed requests during live testing

3. **Verify Backend CORS**
   - Check if `CORS_ORIGINS` is properly set on EC2 backend
   - Test CORS with exact frontend domain: `https://www.leettrack.app`

### Phase 2: Fix Implementation (High Priority)
1. **Environment Variable Fix**
   - Set/correct `NEXT_PUBLIC_API_URL=https://api.leettrack.app` in Vercel
   - Update GitHub secret if incorrect
   - Trigger new deployment

2. **API Configuration Hardening**
   - Add fallback API URL for development
   - Improve error handling for missing environment variables
   - Add runtime API connectivity check

3. **CORS Configuration Update**
   - Ensure `CORS_ORIGINS=https://www.leettrack.app` is set on backend
   - Remove wildcard fallback for production security
   - Add proper error logging for CORS issues

### Phase 3: Testing & Verification (Medium Priority)
1. **End-to-End Testing**
   - Test `/paths/` page loads data correctly
   - Verify all API endpoints work from frontend
   - Test authentication flows

2. **Error Handling Improvement**
   - Add better error messages for API connectivity issues
   - Implement retry logic for failed API calls
   - Add loading states and error boundaries

### Phase 4: Documentation & Monitoring (Low Priority)
1. **Update Documentation**
   - Document correct environment variable configuration
   - Add troubleshooting guide for API connectivity
   - Update deployment checklist

2. **Add Monitoring**
   - Add API health checks to frontend
   - Implement error reporting for API failures
   - Add metrics for API response times

## Task Breakdown

### Immediate Actions (Can be done in parallel)
- [ ] **Task 1**: Check Vercel environment variables
- [ ] **Task 2**: Verify GitHub secrets configuration  
- [ ] **Task 3**: Add debug logging to frontend API calls
- [ ] **Task 4**: Test API endpoints with exact frontend domain

### Implementation Tasks (Sequential)
- [ ] **Task 5**: Fix environment variable configuration
- [ ] **Task 6**: Deploy and test fixes
- [ ] **Task 7**: Update CORS configuration if needed
- [ ] **Task 8**: Remove debug logging and finalize

### Verification Tasks
- [ ] **Task 9**: End-to-end testing of all affected pages
- [ ] **Task 10**: Performance testing of API calls
- [ ] **Task 11**: Documentation updates

## Risk Assessment

- **High Risk**: Environment variable configuration errors could break entire frontend
- **Medium Risk**: CORS changes could affect other integrations
- **Low Risk**: Debug logging changes are safe and easily reversible

## Success Criteria

1. `/paths/` page loads and displays learning paths correctly
2. All API calls from frontend work without errors
3. No CORS errors in browser console
4. Authentication and other features work correctly
5. Performance is acceptable (API calls < 2s response time)

## Dependencies

- Access to Vercel project settings
- Access to GitHub repository secrets
- Access to backend EC2 server for CORS configuration
- Ability to trigger new deployments

## Estimated Timeline

- **Diagnosis**: 1-2 hours
- **Implementation**: 2-4 hours  
- **Testing**: 1-2 hours
- **Total**: 4-8 hours

## Notes

- This is a critical issue affecting core application functionality
- Backend is confirmed working, issue is isolated to frontend configuration
- Should be relatively straightforward fix once root cause is identified
- Priority should be given to quick diagnosis and fix