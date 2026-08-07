# 🚀 Quick Deploy Guide

Panduan cepat untuk deployment dalam 5 menit.

## Prerequisites

- Node.js 18+
- Cloudflare account (gratis)

## Step-by-Step

### 1️⃣ Install & Login (2 menit)

```bash
# Clone atau gunakan project ini
cd social-manager

# Install dependencies
npm install --legacy-peer-deps

# Login to Cloudflare
wrangler login
```

### 2️⃣ Database Setup (1 menit)

```bash
# Create D1 database
wrangler d1 create social-manager-db

# Copy database_id dari output
# Paste ke wrangler.toml baris 14:
# database_id = "paste-disini"

# Run migration
npm run db:migrate:remote
```

### 3️⃣ Set Secrets (1 menit)

```bash
# Generate & set JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
wrangler secret put JWT_SECRET
# Paste generated value

# Generate & set encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
wrangler secret put ENCRYPTION_KEY
# Paste generated value
```

### 4️⃣ Deploy (1 menit)

```bash
# Build & deploy
npm run deploy
```

### ✅ Done!

Your app is live at: `https://social-manager.your-subdomain.workers.dev`

---

## Verification

1. Open deployment URL
2. Register new account
3. Create project "Test Project"
4. Add Gmail account
5. Verify password decryption works

---

## Next Steps

- [ ] Add custom domain (optional)
- [ ] Update CORS to production domain
- [ ] Enable Cloudflare WAF
- [ ] Setup monitoring

---

## Troubleshooting

**Problem:** Database not found

```bash
wrangler d1 list
# Verify database exists, update wrangler.toml
```

**Problem:** Unauthorized errors

```bash
wrangler secret list
# Verify JWT_SECRET exists
```

**Problem:** Encryption errors

```bash
# Verify ENCRYPTION_KEY is 64 hex chars
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
wrangler secret put ENCRYPTION_KEY
```

---

## Support

- 📖 Full docs: `README.md`
- 🔧 Setup guide: `SETUP.md`
- 🔐 Security: `SECURITY.md`
- 📡 API docs: `API.md`

---

**Total deployment time: ~5 minutes** ⚡
