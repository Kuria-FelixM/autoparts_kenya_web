# Deployment Guide

Complete guide to building, testing, and deploying the frontend to production.

---

## Development Setup

### **Prerequisites**
- Node.js ≥18.0.0
- npm ≥9.0.0 or yarn ≥3.0.0
- Git

### **Installation**

```bash
cd autoparts_kenya_web
npm install
```

### **Environment Variables**

Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### **Start Dev Server**

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Building for Production

### **Build Process**

```bash
# Create optimized production build
npm run build

# Output folder: .next/
# Static assets: .vercel/ (if using Vercel)
```

The build process:
1. ✅ TypeScript compilation & type checking
2. ✅ Next.js optimization & code splitting
3. ✅ CSS purging (remove unused Tailwind classes)
4. ✅ Image optimization (WebP conversion)
5. ✅ Bundle analysis
6. ✅ Minification & compression

### **Pre-build Validation**

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format check
npm run format
```

Fix any issues before building:
```bash
npm run lint -- --fix
npm run format
```

---

## Environment Configuration

### **Production Variables**

```bash
# .env.production.local
NEXT_PUBLIC_API_URL=https://api.autopartskenya.com/api/v1
```

### **Secrets** (Never commit)

```bash
# .env.local (git-ignored)
# Store sensitive data here, never in .env.production
DATABASE_PASSWORD=xxx
API_KEY=xxx
```

### **Public Variables** (Safe to commit)

```bash
# .env.example
NEXT_PUBLIC_API_URL=https://api.examples.com/api/v1
```

---

## Deployment Options

### **Option 1: Vercel (Recommended)**

**Why Vercel?**
- Optimized for Next.js
- Zero-config deployment
- Automatic CI/CD
- Global CDN
- Serverless functions
- Environment variables UI
- Free SSL certificates

#### **Setup**

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/import
   - Select GitHub repository
   - Click "Import"

3. **Configure**:
   - Framework: Next.js (auto-detected)
   - Root directory: ./autoparts_kenya_web (if monorepo)
   - Environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://api.autopartskenya.com/api/v1
     ```

4. **Deploy**:
   - Vercel auto-detects `npm run build`
   - Click "Deploy"

5. **Setup domain**:
   - Settings → Domains
   - Add custom domain
   - Update DNS records (CNAME)

#### **Automatic Deployments**

After setup, every push to `main` branch:
- ✅ Vercel auto-builds
- ✅ Runs tests (if configured)
- ✅ Deploys to production
- ✅ Creates preview for PRs

#### **Rollback**

In Vercel dashboard:
1. Go to Deployments
2. Select previous deployment
3. Click "Promote to Production"

---

### **Option 2: Docker + Self-hosted**

#### **Dockerfile**

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build Next.js app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
```

#### **Build & Run**

```bash
# Build Docker image
docker build -t autoparts-frontend:1.0 .

# Run locally to test
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 \
  autoparts-frontend:1.0
```

#### **Push to Registry**

```bash
# Tag for Docker Hub
docker tag autoparts-frontend:1.0 myregistry/autoparts-frontend:1.0

# Login to registry
docker login myregistry

# Push image
docker push myregistry/autoparts-frontend:1.0
```

#### **Deploy on Linux Server**

```bash
# SSH into server
ssh user@server-ip

# Pull image
docker pull myregistry/autoparts-frontend:1.0

# Run container
docker run -d \
  -p 80:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.autopartskenya.com/api/v1 \
  --name autoparts-frontend \
  --restart unless-stopped \
  myregistry/autoparts-frontend:1.0

# Check logs
docker logs -f autoparts-frontend
```

---

### **Option 3: AWS Amplify**

#### **Setup**

1. Connect GitHub repository
2. Amplify detects Next.js automatically
3. Configure environment variables
4. Deploy

```bash
npm install -g @aws-amplify/cli
amplify init
amplify publish
```

#### **Benefits**
- Global CDN
- API Gateway integration
- Lambda functions
- DynamoDB support
- Authentication (Cognito)

---

### **Option 4: Firebase Hosting**

#### **Setup**

```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

**Limitations**:
- No Node.js SSR (use static export instead)
- Next.js features like API routes not supported
- Better for static sites, not ideal for dynamic apps

---

## Performance Optimization

### **Image Optimization**

```ts
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.autopartskenya.com',
        pathname: '/media/products/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
    sizes: [320, 640, 1024, 1280],
    formats: ['image/webp', 'image/avif'],
  },
}
```

### **Caching Headers**

```ts
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
    ]
  },
}
```

### **Compression**

```bash
# Gzip compression (Auto on Vercel)
sudo apt-get install gzip

# Brotli (better compression)
npm install --save-dev compression-webpack-plugin
```

### **CDN Configuration**

```ts
// cloudflare.com setup (example)
// Page Rules:
// api.autopartskenya.com/api/v1* → 5 min cache
// autoparts-kenya.com/images/* → 30 day cache
// autoparts-kenya.com/* → 5 min cache
```

---

## Security Hardening

### **HTTPS Enforcement**

```ts
// next.config.mjs
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/(.*)',
        destination: 'https://:host/:0',
        permanent: true,
      },
    ]
  },
}
```

### **Security Headers**

```ts
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ]
  },
}
```

### **Environment Secret Management**

```bash
# Use secrets manager, never hardcode
# Vercel Secrets: vercel env ls
# AWS Secrets Manager
# .env.local (NEVER commit)
```

### **API Key Rotation**

```bash
# Update in Vercel/hosting dashboard
# vercel env set NEXT_PUBLIC_API_URL value
# No redeploy needed
```

---

## Monitoring & Analytics

### **Performance Monitoring**

```bash
# Web Vitals tracking
npm install web-vitals

# Sentry error tracking
npm install @sentry/react
```

### **Analytics Setup**

```tsx
// Google Analytics
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`window.dataLayer = window.dataLayer || [];`}
</Script>
```

### **Monitoring Checklist**

- ✅ Uptime monitoring (Uptime Robot)
- ✅ Error tracking (Sentry)
- ✅ Performance monitoring (Vercel Analytics)
- ✅ User analytics (Google Analytics)
- ✅ Log aggregation (Papertrail, Datadog)
- ✅ Alerting (PagerDuty, Slack)

---

## Advanced Deployment

### **Multi-region Deployment**

```bash
# Deploy to multiple regions
# Vercel: Auto multi-region
# AWS Amplify: Configure regions
# Docker: Push to multiple registries
```

### **Canary Deployments**

```bash
# Vercel: Use Preview deployments
# Test on preview.autoparts-kenya.vercel.app
# Promote to production when ready
```

### **Blue-Green Deployment**

```bash
# Docker: Run two versions
docker run -d --name frontend-blue myregistry/autoparts:v1.0
docker run -d --name frontend-green myregistry/autoparts:v1.1

# Switch traffic via load balancer
nginx reverse proxy → blue or green
```

---

## Post-Deployment Testing

### **Smoke Tests**

```bash
# Check frontend loads
curl https://autoparts-kenya.vercel.app/

# Check API connectivity
curl https://api.autopartskenya.com/api/v1/health/

# Check redirects
curl -I https://autoparts-kenya.vercel.app/
```

### **Functional Tests** (Manual)

- [ ] Home page loads
- [ ] Search works
- [ ] Product detail loads
- [ ] Add to cart works
- [ ] Checkout flow completes
- [ ] Profile page shows user
- [ ] Admin dashboard loads (owner account)
- [ ] Logout works
- [ ] Mobile responsive (test on actual device)
- [ ] Touch interactions work (swipe, tap)
- [ ] Offline cart persists
- [ ] Error pages display correctly

### **Performance Tests**

```bash
# Lighthouse CI
npm install -g @lhci/cli@^0.9.0
lhci autorun

# Expected scores:
# Performance: ≥90
# Accessibility: ≥95
# Best Practices: ≥95
# SEO: ≥95
```

### **Browser Testing**

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

## Rollback Procedure

### **If Deployment Fails**

**Vercel**:
```
Dashboard → Deployments → Select previous → Promote to Production
```

**Docker**:
```bash
# Switch to previous image
docker run -d --name frontend-rollback myregistry/autoparts:v1.0
docker stop frontend-latest
docker rename frontend-rollback frontend-latest
```

**Manual revert**:
```bash
git revert HEAD
git push origin main
# Redeploy
```

---

## Maintenance Checklist

### **Regular Tasks**

- [ ] Weekly: Monitor error rates (Sentry)
- [ ] Weekly: Check performance metrics (Vercel Analytics)
- [ ] Bi-weekly: Update dependencies (`npm audit`)
- [ ] Monthly: Review security headers & HTTPS
- [ ] Monthly: Check CDN cache hit rates
- [ ] Quarterly: Load testing
- [ ] Quarterly: Security audit (OWASP)

### **Dependency Updates**

```bash
# Check outdated packages
npm outdated

# Update patches (safe)
npm update

# Update minors (review)
npm upgrade

# Update majors (breaking changes)
npm install package@latest
```

### **Database Backups** (if using)

```bash
# Daily backups
cron: 0 2 * * * / backup database script

# Store in S3 or Google Cloud Storage
# Retention: 30 days
```

---

## Cost Estimation

### **Vercel Hosting**
- **Free** (up to 100 deployments/month)
- **Pro** ($20/month) → unlimited deployments
- **Enterprise** → custom pricing

### **AWS S3 + CloudFront**
- **Storage**: $0.023/GB/month
- **Data transfer**: $0.085/GB (out)
- **Requests**: $0.0075/10K requests

### **Docker VPS**
- **DigitalOcean Droplet**: $5-20/month
- **Linode**: $5-12/month
- **Hetzner**: €2.50-4.50/month

### **Database** (if needed)
- **Firebase/Firestore**: $0.06/100K reads
- **MongoDB Atlas**: $0-100+/month
- **PostgreSQL RDS**: $10-50+/month

---

## Troubleshooting

### **Build Fails**

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### **Stuck on Build**

```bash
# Check logs
npm run build -- --debug

# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### **Deployment Hangs**

```bash
# Check environment variables
echo $NEXT_PUBLIC_API_URL

# Check API connectivity
curl $NEXT_PUBLIC_API_URL/health

# Check network policies, firewalls
```

### **Page Not Loading in Production**

```bash
# Check logs in hosting dashboard
# Vercel: Deployments → Select deployment → Logs
# AWS: CloudWatch logs

# Test locally with production build
npm run build
npm start
```

### **CORS Errors**

```bash
# Backend must allow frontend domain
# CORS headers in Django:
ALLOWED_HOSTS = ['autoparts-kenya.vercel.app']
CORS_ALLOWED_ORIGINS = ['https://autoparts-kenya.vercel.app']
```

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Docker Docs**: https://docs.docker.com

---

**Last Updated**: February 6, 2026
