# 🖥️ Local Development Guide

Panduan lengkap untuk menjalankan aplikasi di lokal.

## ✅ Prerequisites

Pastikan sudah terinstall:
- Node.js 18+ 
- npm

## 🚀 Step-by-Step Local Setup

### 1. Install Dependencies

```bash
cd /root/tools/social-manager
npm install --legacy-peer-deps
```

### 2. Setup Local Database

```bash
# Run migration (sudah dilakukan)
npm run db:migrate:local
```

✅ Database local sudah ready di: `.wrangler/state/v3/d1/`

### 3. Jalankan Development Server

```bash
npm run dev
```

**Apa yang terjadi:**
- Frontend (Vite): `http://localhost:5173` 🌐
- Worker API: `http://localhost:8787` ⚙️
- Vite proxy API ke Worker automatically

**Output yang diharapkan:**
```
> social-manager@1.0.0 dev
> concurrently "vite" "wrangler dev --port 8787"

[0] VITE v6.3.5  ready in 500 ms
[0] ➜  Local:   http://localhost:5173/
[1] ⛅️ wrangler 4.19.0
[1] Your worker has access to the following bindings:
[1] - D1 Databases:
[1]   - DB: social-manager-db
[1] ⎔ Starting local server...
[1] [wrangler:inf] Ready on http://localhost:8787
```

### 4. Buka Browser

```bash
# Buka di browser:
http://localhost:5173
```

## 🎯 Testing Flow

### 1. Register User Baru

1. Klik "Don't have an account? Register"
2. Isi form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `test12345`
3. Submit

✅ Auto-login setelah register

### 2. Create Project

1. Dashboard akan muncul (kosong)
2. Klik tombol "+ New Project"
3. Isi:
   - Name: `Banten IT Solutions`
   - Description: `Social media accounts for Banten IT`
4. Save

### 3. Add Social Account

1. Klik project card "Banten IT Solutions"
2. Klik "+ Add Account"
3. Isi form:
   - Platform: **Gmail** (dropdown)
   - Account Name: `work@bantenitcom`
   - Email/Handle: `work@bantenit.com`
   - Password: `MySecurePassword123!`
   - Notes: `Main work email` (optional)
4. Save

✅ Password akan di-encrypt dengan AES-256-GCM

### 4. Decrypt Password

1. Di account card, klik icon **Eye** (reveal password)
2. Password akan decrypted dan muncul di alert
3. Bisa copy dengan tombol "Copy"

### 5. Test Platform Lainnya

Tambahkan account untuk platform lain:
- YouTube, Facebook, Instagram, Threads
- WhatsApp, Telegram, TikTok
- Shopee, X, LinkedIn

### 6. Filter by Platform

Di project detail page:
1. Pilih platform dari dropdown filter
2. List akan filter hanya platform yang dipilih

### 7. Edit Account

1. Klik icon **Pencil** pada account card
2. Edit data (ganti password, notes, dll)
3. Save

### 8. Delete Account

1. Klik icon **Trash** pada account card
2. Confirm delete

### 9. Edit Profile

1. Klik menu "Profile" di sidebar
2. Edit:
   - Name
   - Email
   - Password (harus isi current password)
3. Save

### 10. Logout

Klik "Sign Out" di sidebar bottom.

## 🛠️ Development Commands

```bash
# Development server (Vite + Wrangler)
npm run dev

# Build production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm run test

# Run E2E tests (butuh dev server running)
npm run test:e2e

# Type check
npm run type-check

# Database commands
npm run db:generate        # Generate new migration
npm run db:migrate:local   # Apply migrations (local)
npm run db:migrate:remote  # Apply migrations (production)
```

## 📂 Local Database Location

Database SQLite disimpan di:
```
.wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite
```

Bisa dibuka dengan SQLite viewer untuk inspect data.

## 🔧 Environment Variables (Local)

File `.dev.vars` sudah dibuat dengan:
```
JWT_SECRET=dev-jwt-secret-min-32-characters-long-for-local-testing
ENCRYPTION_KEY=0000000000000000000000000000000000000000000000000000000000000000
```

**Note:** Ini hanya untuk development. Production menggunakan `wrangler secret put`.

## 🐛 Troubleshooting

### Port sudah digunakan

**Error:** `Port 5173 already in use`

**Solution:**
```bash
# Kill process di port 5173
lsof -ti:5173 | xargs kill -9

# Atau ubah port di vite.config.ts:
export default defineConfig({
  server: { port: 3000 }
})
```

### Database error

**Error:** `D1_ERROR: no such table: users`

**Solution:**
```bash
# Re-run migration
npm run db:migrate:local
```

### CORS error

**Error:** `Access to fetch blocked by CORS`

**Solution:**  
Pastikan API requests melalui Vite proxy (`:5173`), bukan langsung ke `:8787`.

### Wrangler error

**Error:** `wrangler: command not found`

**Solution:**
```bash
npm install -g wrangler
# Atau gunakan npx:
npx wrangler dev --port 8787
```

## 🔍 Debug Mode

### View API Requests

Buka DevTools → Network tab untuk lihat:
- API calls
- Request/Response
- Headers
- Status codes

### View Local Storage

DevTools → Application → Local Storage → `http://localhost:5173`

Check `auth-token` untuk JWT token.

### View Console Logs

DevTools → Console untuk lihat:
- React errors
- API responses
- Validation errors

## 📊 Hot Reload

**Frontend:** Auto-reload on file change (Vite HMR)  
**Backend:** Auto-reload on file change (Wrangler)

Edit file → Save → Browser auto-refresh

## 🗄️ Reset Database

Untuk reset semua data lokal:

```bash
# Delete local database
rm -rf .wrangler/state/v3/d1

# Re-run migration
npm run db:migrate:local

# Restart dev server
npm run dev
```

## 📱 Test Responsive Design

### Desktop
- Default: `http://localhost:5173`

### Mobile View
DevTools → Toggle device toolbar (Ctrl+Shift+M)
- iPhone 12/13/14
- iPad
- Custom sizes

### Tablet
Resize browser window atau DevTools responsive mode.

## ⚡ Performance Tips

### Fast Refresh
- Edit React components → instant update
- No full page reload

### TypeScript
- VSCode will show errors in real-time
- Run `npm run type-check` untuk full check

### Testing During Dev
```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Tests (watch mode)
npm run test -- --watch

# Terminal 3: Type checking
npm run type-check -- --watch
```

## 🎨 UI Development

### Tailwind Classes
- Classes auto-completed in VSCode (dengan Tailwind extension)
- Changes reflect immediately (HMR)

### Icons
Semua icons dari Lucide React. Lihat: https://lucide.dev

### Colors
Zinc palette: 950, 900, 800, 700, ... 50

## 🔐 Security Testing (Local)

### Test Rate Limiting

```bash
# Spam login requests
for i in {1..15}; do
  curl -X POST http://localhost:8787/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"wrong@test.com","password":"wrong"}'
done

# Setelah 10 requests, harus return 429 Too Many Requests
```

### Test Password Encryption

1. Add account dengan password `test123`
2. Check database:
   ```bash
   sqlite3 .wrangler/state/v3/d1/*.sqlite
   SELECT password_encrypted FROM social_accounts;
   ```
3. Harus encrypted (tidak plain text)

### Test JWT Expiry

JWT expires setelah 7 days. Untuk test:
1. Login → copy token dari localStorage
2. Decode di https://jwt.io
3. Check `exp` claim

## 📝 Notes

- **Auto-save:** Tidak ada, harus klik Save button
- **Session:** Persists di localStorage (tetap login after refresh)
- **Database:** SQLite local file (persists after restart)
- **Hot reload:** Frontend instant, backend ~1-2 detik

## ✅ Ready for Development!

Aplikasi sudah running di: `http://localhost:5173`

**Happy coding! 🚀**
