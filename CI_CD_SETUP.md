# CI/CD Pipeline Setup Guide

## Overview

This document outlines the comprehensive CI/CD pipeline for LeetTrack, including automated testing, security scanning, and deployment to both Vercel (frontend) and AWS EC2 (backend).

## Pipeline Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Push/PR to    │    │     Parallel    │    │   Deploy to     │
│   main/develop  │───▶│     Testing     │───▶│   Production    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                       ┌──────┴──────┐
                       │ Security    │
                       │ Scanning    │
                       └─────────────┘
```

## Pipeline Jobs

### 1. **Backend Tests** (`test-backend`)

- **Environment**: Ubuntu Latest, Python 3.12
- **Steps**:
  - Code linting with flake8
  - Unit tests with pytest
  - Live API testing (main branch only)
- **Dependencies**: Backend requirements.txt
- **Caching**: Python packages via pip cache

### 2. **Frontend Tests & Build** (`test-frontend`)

- **Environment**: Ubuntu Latest, Node.js 18
- **Steps**:
  - ESLint code linting
  - TypeScript type checking
  - Next.js production build
  - Build artifact upload
- **Dependencies**: Frontend package-lock.json
- **Caching**: npm dependencies

### 3. **Security Scan** (`security-scan`)

- **Tool**: Trivy vulnerability scanner
- **Scope**: Filesystem scan for dependencies
- **Output**: SARIF format uploaded to GitHub Security tab
- **Runs**: Parallel with tests

### 4. **Frontend Deployment** (`deploy-frontend`)

- **Target**: Vercel
- **Trigger**: Push to main branch only
- **Dependencies**: Requires both test jobs to pass
- **Action**: amondnet/vercel-action@v25

### 5. **Backend Deployment** (`deploy-backend`)

- **Target**: AWS EC2
- **Trigger**: Push to main branch only
- **Dependencies**: Requires both test jobs to pass
- **Method**: SSH deployment with service restart

### 6. **CORS Update** (`update-cors`)

- **Purpose**: Automatically update backend CORS with new Vercel URL
- **Dependencies**: Requires frontend deployment to complete
- **Method**: SSH script execution

### 7. **Notification** (`notify`)

- **Purpose**: Report deployment status
- **Runs**: Always (even on failure)
- **Output**: Success/failure summary

## Required GitHub Secrets

### Vercel Deployment

```bash
VERCEL_TOKEN          # Vercel API token
VERCEL_ORG_ID         # Organization ID from Vercel
VERCEL_PROJECT_ID     # Project ID from Vercel
```

### AWS EC2 Deployment

```bash
EC2_HOST              # EC2 instance public IP/hostname
EC2_USER              # SSH username (usually 'ubuntu')
EC2_SSH_KEY           # Private SSH key for EC2 access
```

### API Configuration

```bash
API_BASE_URL              # Backend API URL for live testing
NEXT_PUBLIC_API_URL       # Frontend environment variable
```

## Setup Instructions

### 1. **Configure GitHub Secrets**

Go to your repository → Settings → Secrets and variables → Actions:

```bash
# Add each secret with its corresponding value
gh secret set VERCEL_TOKEN --body "your_vercel_token"
gh secret set VERCEL_ORG_ID --body "your_org_id"
gh secret set VERCEL_PROJECT_ID --body "your_project_id"
gh secret set EC2_HOST --body "your_ec2_ip"
gh secret set EC2_USER --body "ubuntu"
gh secret set EC2_SSH_KEY --body "$(cat ~/.ssh/your_key.pem)"
gh secret set API_BASE_URL --body "https://api.leettrack.app/api/v1"
gh secret set NEXT_PUBLIC_API_URL --body "https://api.leettrack.app/api/v1"
```

### 2. **Vercel Setup**

Get required IDs from Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Login and get project info
vercel login
vercel link
vercel env ls  # Note the project and org IDs
```

### 3. **EC2 Permissions**

Ensure your EC2 user has necessary permissions:

```bash
# On EC2 instance, add to sudoers for systemctl
sudo visudo
# Add: ubuntu ALL=(ALL) NOPASSWD: /bin/systemctl restart leettrack-backend, /bin/systemctl restart nginx
```

### 4. **SSH Key Setup**

```bash
# Generate SSH key pair (if not exists)
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Add public key to EC2
ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@your-ec2-ip

# Add private key to GitHub secrets
cat ~/.ssh/id_rsa | gh secret set EC2_SSH_KEY --body-file -
```

## Triggering the Pipeline

### Automatic Triggers

- **Push to main**: Full CI/CD with deployment
- **Push to develop**: CI only (no deployment)
- **Pull Request to main**: CI only

### Manual Trigger

```bash
# Via GitHub CLI
gh workflow run ci-cd.yml

# Via GitHub UI
# Go to Actions → CI/CD Pipeline → Run workflow
```

## Pipeline Monitoring

### Success Indicators ✅

- All test jobs pass
- Security scan completes (warnings allowed)
- Frontend deploys to Vercel successfully
- Backend deploys to EC2 successfully
- CORS configuration updates
- Notification shows success

### Failure Scenarios ❌

- **Test failures**: Check logs for specific errors
- **Build failures**: Usually TypeScript or dependency issues
- **Deployment failures**: Check SSH access and service status
- **CORS failures**: Check script permissions and network access

## Branch Strategy

```
main (production)     ←─── Pull Requests ←─── develop (staging)
  ↓                                              ↓
Full CI/CD                                   CI Only
Deploy to Prod                           No Deployment
```

## Maintenance Tasks

### Weekly

- [ ] Review security scan results
- [ ] Update dependencies if needed
- [ ] Check deployment logs

### Monthly

- [ ] Rotate SSH keys
- [ ] Review and update secrets
- [ ] Performance optimization

### Quarterly

- [ ] Update GitHub Actions versions
- [ ] Review pipeline efficiency
- [ ] Update documentation

## Troubleshooting

### Common Issues

**1. Frontend Build Failures**

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check linting
npm run lint

# Check environment variables
echo $NEXT_PUBLIC_API_URL
```

**2. Backend Test Failures**

```bash
# Run tests locally
cd backend
python -m pytest tests/ -v

# Check API connectivity
python test_api_live.py
```

**3. SSH Connection Issues**

```bash
# Test SSH connection
ssh -i ~/.ssh/key.pem ubuntu@your-ec2-ip

# Check key permissions
chmod 600 ~/.ssh/key.pem
```

**4. CORS Update Failures**

```bash
# Manually update CORS
ssh ubuntu@your-ec2-ip
cd /home/ubuntu/LeetTrack/backend
./update_cors_for_vercel.sh "https://your-vercel-url"
```

## Performance Metrics

- **Average pipeline duration**: ~8-12 minutes
- **Cache hit rate**: ~80-90% for dependencies
- **Deployment success rate**: Target >95%
- **Security scan time**: ~2-3 minutes

## Security Considerations

- SSH keys rotated quarterly
- Secrets encrypted at rest
- Vulnerability scanning on every build
- HTTPS-only communications
- Principle of least privilege for EC2 access

## Next Steps

1. **Monitoring**: Integrate with monitoring tools (DataDog, New Relic)
2. **Testing**: Add integration tests and E2E testing
3. **Staging**: Set up staging environment pipeline
4. **Rollback**: Implement automated rollback mechanisms
5. **Performance**: Add performance testing to pipeline
