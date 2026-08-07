# Setup Guide - Social Media Account Manager

Panduan lengkap untuk setup dan deployment aplikasi.

## 📋 Prerequisites

- Node.js 18+ 
- npm atau pnpm
- Account Cloudflare (gratis)
- Wrangler CLI

## 🔧 Installation Steps

### Step 1: Install Dependencies

```bash
npm install --legacy-peer-deps
```

**Note**: `--legacy-peer-deps` diperlukan karena peer dependency conflict antara wrangler dan workers-types.

### Step 2: Setup Cloudflare Account

1. Buat account di [Cloudflare](https://dash.cloudflare.com/sign-up)
2. Install dan login wrangler:

```bash
npm install -g wrangler
wrangler login
```

Browser akan terbuka untuk authorize wrangler.

### Step 3: Create D1 Database

```bash
wrangler d1 create social-manager-db
```

Output akan seperti ini:

```
✅ Successfully created DB 'social-manager-db'!

[[d1_databases]]
binding = "DB"
database_name = "social-manager-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Copy `database_id`** dan update di `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "social-manager-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # ← Paste disini
```

### Step 4: Run Database Migrations

#### Local Development

```bash
npm run db:migrate:local
```

#### Production

```bash
npm run db:migrate:remote
```

Verifikasi migration berhasil:

```bash
wrangler d1 execute social-manager-db --remote --command "SELECT name FROM sqlite_master WHERE type='table'"
```

Harus muncul: `users`, `projects`, `social_accounts`

### Step 5: Generate Secrets

#### JWT Secret

```bash
# Generate random string (minimal 32 chars)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Set secret
wrangler secret put JWT_SECRET
# Paste generated string
```

#### Encryption Key

```bash
# Generate 32 bytes = 64 hex chars
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set secret
wrangler secret put ENCRYPTION_KEY
# Paste generated hex string
```

**Verifikasi secrets:**

```bash
wrangler secret list
```

Output:

```
- JWT_SECRET
- ENCRYPTION_KEY
```

### Step 6: Test Locally

```bash
npm run dev
```

Opens:
- Frontend: http://localhost:5173
- Worker API: http://localhost:8787

**Test flow:**
1. Register new user
2. Login
3. Create project ("Test Project")
4. Add social account (Gmail, test@example.com)
5. Decrypt password
6. Edit profile
7. Delete account & project

### Step 7: Run Tests

```bash
# Unit tests
npm run test

# Type check
npm run type-check

# E2E (requires wrangler dev running)
npm run test:e2e
```

Semua tests harus passing (17/17).

### Step 8: Build for Production

```bash
npm run build
```

Verify build output:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   ├── ui-[hash].js
│   └── vendor-[hash].js
```

Total gzip size: ~50KB

### Step 9: Deploy to Cloudflare

```bash
npm run deploy
```

Output:

```
✨ Compiled Worker successfully
✨ Uploaded 5 assets
✨ Deployed to https://social-manager.your-subdomain.workers.dev
```

**Copy URL** dan test di browser.

### Step 10: (Optional) Custom Domain

1. Di Cloudflare Dashboard → Workers & Pages → social-manager
2. Settings → Triggers → Add Custom Domain
3. Input domain: `social.yourdomain.com`
4. Cloudflare akan auto-setup DNS

Update CORS di `src/worker/index.ts`:

```typescript
app.use('/api/*', cors({
  origin: 'https://social.yourdomain.com',
  // ...
}));
```

Redeploy:

```bash
npm run deploy
```

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] ✅ Register page loads
- [ ] ✅ Can create new user
- [ ] ✅ Login works
- [ ] ✅ Dashboard shows empty state
- [ ] ✅ Can create project
- [ ] ✅ Can add social account
- [ ] ✅ Can decrypt password
- [ ] ✅ Can edit account
- [ ] ✅ Can delete account
- [ ] ✅ Can edit profile
- [ ] ✅ Logout works
- [ ] ✅ Protected routes redirect to login
- [ ] ✅ Dark mode active
- [ ] ✅ Responsive on mobile
- [ ] ✅ Icons display correctly

---

## 🐛 Common Issues

### Issue: "Database not found"

**Solution:**

```bash
wrangler d1 list
# Verify database exists and copy ID
# Update wrangler.toml with correct database_id
```

### Issue: "Unauthorized" on API calls

**Solution:**

Check JWT_SECRET is set:

```bash
wrangler secret list
# If missing:
wrangler secret put JWT_SECRET
```

Verify token in browser DevTools → Application → Local Storage → `auth-token`

### Issue: "Invalid ENCRYPTION_KEY"

**Solution:**

Must be exactly 64 hex characters (32 bytes):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
wrangler secret put ENCRYPTION_KEY
```

### Issue: CORS errors

**Solution:**

Update origin in `src/worker/index.ts`:

```typescript
app.use('/api/*', cors({
  origin: 'https://your-actual-domain.com',
  credentials: true,
}));
```

Redeploy.

### Issue: "npm install" peer dependency errors

**Solution:**

```bash
npm install --legacy-peer-deps
```

### Issue: Migration fails

**Solution:**

```bash
# Reset local DB (dev only)
rm .wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite

# Re-run migration
npm run db:migrate:local

# For remote, check database_id matches:
wrangler d1 info social-manager-db
```

### Issue: Build fails

**Solution:**

```bash
# Clear cache
rm -rf node_modules dist .wrangler
npm install --legacy-peer-deps
npm run build
```

### Issue: "Worker exceeded CPU time"

**Solution:**

Bcrypt 10 rounds takes ~300ms. If timeout, reduce in `src/worker/routes/auth.ts`:

```typescript
const hash = await bcrypt.hash(password, 8); // Reduce from 10 to 8
```

Trade-off: slightly less security for faster response.

---

## 📊 Performance Benchmarks

After deployment, test performance:

```bash
# Test cold start
curl -w "@curl-format.txt" https://your-worker.workers.dev/api/health

# Test auth endpoint
curl -X POST https://your-worker.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

Expected:
- Cold start: < 100ms
- API response: < 200ms (excluding bcrypt)
- Auth endpoint: ~300-500ms (bcrypt overhead)

---

## 🔐 Security Hardening (Production)

### 1. Tighten CORS

```typescript
app.use('/api/*', cors({
  origin: 'https://yourdomain.com', // Exact domain only
  credentials: true,
}));
```

### 2. Enable Rate Limiting Globally

Edit `src/worker/routes/projects.ts`, `accounts.ts`:

```typescript
import { rateLimit } from '../middleware/rateLimit';

// Add to all routes
app.use('*', rateLimit({ limit: 100, window: 60 * 1000 }));
```

### 3. Add CSP Headers

Edit `src/worker/index.ts`:

```typescript
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
  },
}));
```

### 4. Enable WAF (Cloudflare)

Dashboard → Security → WAF → Enable managed rules

### 5. Monitor Logs

```bash
wrangler tail social-manager
```

Watch for:
- Failed login attempts (brute force)
- Rate limit hits
- SQL errors (potential injection attempts)

---

## 📈 Monitoring & Analytics

### Enable Cloudflare Analytics

Dashboard → Workers & Pages → social-manager → Analytics

Metrics:
- Requests per second
- Error rate
- CPU time
- Subrequests (D1 queries)

### Setup Alerting

Dashboard → Notifications → Add:
- Worker error rate > 5%
- CPU time exceeded
- D1 query failures

---

## 🚀 Next Steps

After successful deployment:

1. **Add More Features:**
   - 2FA (TOTP)
   - Password sharing (encrypted links)
   - Audit logs
   - Export to CSV
   - Browser extension

2. **Optimize:**
   - Add Redis caching (Workers KV)
   - Implement refresh tokens
   - Compress API responses

3. **Scale:**
   - Upgrade to Workers Paid plan (no CPU limits)
   - Add CDN caching for static assets
   - Implement database connection pooling

---

**Congratulations!** 🎉 Aplikasi Anda sudah live dan production-ready.

**Deployment URL:** Check `wrangler deploy` output atau Cloudflare Dashboard.

Jika ada pertanyaan, lihat code comments atau troubleshooting section diatas.
