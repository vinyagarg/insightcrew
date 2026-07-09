# InsightCrew Frontend - Deployment Guide

## Pre-Deployment Checklist

- ✓ TypeScript compilation successful
- ✓ All components render correctly
- ✓ Responsive design verified (mobile, tablet, desktop)
- ✓ Accessibility tested (screen readers, keyboard nav)
- ✓ Performance optimized (production build)
- ✓ Error handling implemented
- ✓ Environment variables documented
- ✓ API contract defined
- ✓ CSS optimized (no warnings)

## Local Build Verification

```bash
# Build production bundle
pnpm build

# Start production server
pnpm start

# Verify no console errors
# Test all routes: /, /test, /session/[id], /session/[id]/report
```

## Environment Setup

### Required Variables

Create `.env.local` or set in your deployment platform:

```env
# Backend API URL (REQUIRED)
NEXT_PUBLIC_API_URL=https://your-api.example.com

# Optional: Analytics (if using Vercel Analytics)
# Automatically enabled in production
```

### Environment Variable Notes

- `NEXT_PUBLIC_API_URL` is exposed to the browser (prefixed with `NEXT_PUBLIC_`)
- Use your actual backend API hostname
- Must support CORS (frontend makes requests from browser)
- Include protocol (http:// or https://)

## Deployment Options

### Option 1: Vercel (Recommended)

**Fastest deployment for Next.js apps:**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Follow prompts:
#    - Link to Vercel account
#    - Select framework: Next.js
#    - Set NEXT_PUBLIC_API_URL in environment variables

# 4. Set domain in Vercel dashboard
```

**For GitHub integration:**
1. Push code to GitHub
2. Go to vercel.com/new
3. Select GitHub repository
4. Configure environment variables
5. Deploy

### Option 2: Docker

**For self-hosted or container deployments:**

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN pnpm build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start
CMD ["pnpm", "start"]
```

**Build and run:**
```bash
docker build -t insightcrew-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com \
  insightcrew-frontend
```

### Option 3: AWS/EC2

**Manual deployment on AWS:**

```bash
# 1. SSH into EC2 instance
ssh -i key.pem ec2-user@instance.amazonaws.com

# 2. Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 3. Clone repository
git clone https://github.com/your-org/insightcrew.git
cd insightcrew

# 4. Install and build
npm install -g pnpm
pnpm install
NEXT_PUBLIC_API_URL=https://api.example.com pnpm build

# 5. Run with PM2 (recommended)
npm install -g pm2
pm2 start pnpm --name insightcrew -- start

# 6. Setup reverse proxy (Nginx)
# See nginx.conf example below
```

### Option 4: Netlify (with edge functions)

```toml
# netlify.toml
[build]
  command = "pnpm build && pnpm export"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Note**: Requires `output: export` in next.config.mjs for static export.
Not compatible with dynamic routes (`/session/[sessionId]`) - use Vercel instead.

### Option 5: DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build command: `pnpm build`
3. Configure start command: `pnpm start`
4. Add environment variable: `NEXT_PUBLIC_API_URL`
5. Deploy

## Production Nginx Configuration

```nginx
# nginx.conf example
upstream nextjs {
    server localhost:3000;
}

server {
    listen 80;
    server_name insightcrew.example.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name insightcrew.example.com;
    
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/insightcrew.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/insightcrew.example.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Compression
    gzip on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml application/json;
    
    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
    }
    
    # Static files - cache aggressively
    location /_next/static {
        proxy_pass http://nextjs;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## SSL/TLS Certificate

**For HTTPS (strongly recommended):**

```bash
# Using Let's Encrypt with Certbot
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d insightcrew.example.com
```

## Health Checks

Configure your deployment platform to check:

```
GET / HTTP/1.1
Expected: 200 OK
```

Or:

```
GET /api/health (if you add a health endpoint)
Expected: {"status": "ok"}
```

## CDN & Caching

### CloudFlare Setup

1. Add domain to CloudFlare
2. Update nameservers
3. Enable automatic HTTPS
4. Set caching rules:
   - `_next/static/*` → Cache everything (1 year)
   - `/test` → Don't cache (dev only)
   - `/session/*` → Don't cache (dynamic)

### Caching Strategy

```
Static: /_next/static/*
  → Cache for 1 year (immutable)
  → Served from CDN edge

Dynamic: /session/*, /api/*
  → Don't cache (served from origin)
  → Realtime content

HTML: /, *, /session/* (HTML chunks)
  → Cache for 5 minutes (stale-while-revalidate)
  → Validates on each request
```

## Monitoring & Logging

### Vercel (built-in)
- Real-time logs in dashboard
- Performance metrics
- Error tracking
- Deployment history

### Manual Setup (AWS/EC2)

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs insightcrew

# CloudWatch integration
pm2 install pm2-auto-pull
```

## Performance Optimization

### Already Implemented
- ✓ Tailwind CSS purging
- ✓ Code splitting
- ✓ Image optimization
- ✓ Font optimization (Google Fonts CSS-in-JS)
- ✓ Efficient polling (2s intervals)
- ✓ Local storage for session history

### Additional Optimizations

```javascript
// next.config.mjs - Add if needed
export default {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  headers: async () => {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

## Rollback Procedure

### Vercel
1. Go to Deployments
2. Click "..." on previous deployment
3. Click "Promote to Production"

### Manual
```bash
# Keep tagged releases in git
git tag v1.0.0
git push origin v1.0.0

# Rollback: checkout and redeploy
git checkout v1.0.0
pnpm build
pm2 restart insightcrew
```

## Post-Deployment Tests

```bash
# Test homepage
curl https://insightcrew.example.com/

# Test session route
curl https://insightcrew.example.com/session/test-id

# Test report route
curl https://insightcrew.example.com/session/test-id/report

# Test API integration
# (manually: enter query in UI, verify it calls your API)

# Test mobile responsiveness
# Use browser DevTools or BrowserStack
```

## Troubleshooting

### "API URL not configured" error
- Verify `NEXT_PUBLIC_API_URL` is set
- Check it's accessible from the frontend (CORS)
- Use full URL including protocol

### CORS errors from API
- Backend must allow requests from frontend domain
- Add to backend CORS headers:
  ```
  Access-Control-Allow-Origin: https://insightcrew.example.com
  Access-Control-Allow-Methods: GET, POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
  ```

### Session pages not loading
- Check API is responding at configured URL
- Verify status endpoint returns correct format
- Check browser console for errors

### Slow initial load
- Check Vercel/hosting CPU allocation
- Review Next.js build output size
- Consider CDN for static assets
- Monitor network waterfall in DevTools

### Fonts not loading
- Check Google Fonts CDN is accessible
- Verify font URLs in next/font imports
- Check CORS if using self-hosted fonts

## Success Metrics

After deployment, monitor:

- **Page Load Time**: < 3s (LCP)
- **Time to Interactive**: < 5s (TTI)
- **Cumulative Layout Shift**: < 0.1 (CLS)
- **99th Percentile Response**: < 200ms
- **Error Rate**: < 0.1%
- **Uptime**: > 99.9%

## Support & Maintenance

- Monitor error logs daily
- Update dependencies monthly
- Run security audits quarterly
- Test API integration monthly
- Review performance metrics weekly

---

**Need help?** See README.md for feature overview or SETUP.md for development setup.
