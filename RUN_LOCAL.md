# ✅ Aplikasi Siap Dijalankan!

## 🚀 Cara Menjalankan di Lokal

### Quick Start

```bash
cd /root/tools/social-manager
npm run dev
```

**Aplikasi akan berjalan di:**
- 🌐 Frontend: http://localhost:5173
- ⚙️ API Backend: http://localhost:8787

### Output yang Benar

```
[0] VITE v6.4.3  ready in 213 ms
[0] ➜  Local:   http://localhost:5173/

[1] ⛅️ wrangler 4.119.0
[1] Your Worker has access to the following bindings:
[1] - DB (social-manager-db): D1 Database (local)
[1] - JWT_SECRET: Environment Variable (local)
[1] - ENCRYPTION_KEY: Environment Variable (local)
[1] 
[1] [wrangler:info] Ready on http://localhost:8787
```

✅ **Database sudah dimigrate**  
✅ **Environment variables sudah diset** (.dev.vars)  
✅ **Dependencies sudah terinstall**

---

## 🎯 Testing Flow

### 1. Buka Browser

```
http://localhost:5173
```

### 2. Register User Baru

- Klik **"Don't have an account? Register"**
- Isi form:
  - Name: `Test User`
  - Email: `test@example.com`
  - Password: `test12345`
- Submit

✅ Auto-login setelah register

### 3. Create Project

- Dashboard akan muncul (empty state)
- Klik **"+ New Project"**
- Isi:
  - Name: `Banten IT Solutions`
  - Description: `Social media accounts`
- Save

### 4. Add Social Account

- Klik project card **"Banten IT Solutions"**
- Klik **"+ Add Account"**
- Isi form:
  - **Platform**: Gmail (dropdown)
  - **Account Name**: work@bantenit.com
  - **Email/Handle**: work@bantenit.com
  - **Password**: MyPassword123!
  - **Notes**: Main work email (optional)
- Save

✅ Password akan di-encrypt dengan AES-256-GCM

### 5. Decrypt Password

- Di account card, klik icon **Eye** 👁️
- Password akan decrypted dan ditampilkan
- Klik **Copy** untuk copy ke clipboard

### 6. Test Platform Lain

Tambahkan account untuk platform:
- YouTube, Facebook, Instagram, Threads
- WhatsApp, Telegram, TikTok
- Shopee, X, LinkedIn

### 7. Filter by Platform

- Pilih platform dari dropdown **"All Platforms"**
- List akan filter sesuai platform

### 8. Edit & Delete

- **Edit**: Klik icon Pencil ✏️
- **Delete**: Klik icon Trash 🗑️

### 9. Profile Management

- Klik menu **"Profile"** di sidebar
- Edit Name, Email, atau Password
- Save

### 10. Logout

- Klik **"Sign Out"** di sidebar bottom

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Type check
npm run type-check

# Database migrations (local)
npm run db:migrate:local
```

---

## 🔍 Debug & Inspect

### View Database

Database SQLite ada di:
```
.wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite
```

Bisa dibuka dengan SQLite viewer atau:
```bash
sqlite3 .wrangler/state/v3/d1/*.sqlite
SELECT * FROM users;
SELECT * FROM projects;
SELECT * FROM social_accounts;
```

### View API Requests

Buka DevTools (F12) → Network tab:
- Lihat API calls ke `/api/*`
- Check request/response
- View headers & status codes

### View JWT Token

DevTools → Application → Local Storage → `http://localhost:5173`:
- Key: `auth-token`
- Value: JWT token

Decode di: https://jwt.io

### View Console Logs

DevTools → Console:
- React errors
- API responses
- Validation errors

---

## 🐛 Troubleshooting

### Port sudah digunakan

```bash
# Kill process di port 5173
lsof -ti:5173 | xargs kill -9

# Kill process di port 8787
lsof -ti:8787 | xargs kill -9

# Restart
npm run dev
```

### Database error

```bash
# Reset database
rm -rf .wrangler/state/v3/d1

# Re-run migration
npm run db:migrate:local

# Restart dev server
npm run dev
```

### Hot reload tidak jalan

- Save file lagi (Ctrl+S)
- Refresh browser (Ctrl+R)
- Restart dev server

---

## ✅ Checklist

Sebelum testing, pastikan:

- [x] Dependencies installed (`npm install --legacy-peer-deps`)
- [x] Database migrated (`npm run db:migrate:local`)
- [x] `.dev.vars` file created (JWT_SECRET, ENCRYPTION_KEY)
- [x] Dev server running (`npm run dev`)
- [x] Browser opened (`http://localhost:5173`)

---

## 🎨 UI Features

Saat testing, perhatikan:

✅ **Dark Mode**: Default theme (Zinc palette)  
✅ **Icons**: Lucide React icons di semua tempat  
✅ **Responsive**: Resize browser untuk test mobile/tablet  
✅ **Sidebar**: Collapse/expand dengan smooth animation  
✅ **Forms**: Real-time validation dengan error messages  
✅ **Loading States**: Spinner saat API calls  
✅ **Empty States**: Friendly messages saat no data  
✅ **Success/Error**: Toast notifications  
✅ **Platform Icons**: Custom SVG untuk 11 platforms  

---

## 📱 Test Responsive

### Mobile
DevTools → Toggle device toolbar (Ctrl+Shift+M):
- iPhone 12/13/14
- Sidebar jadi overlay

### Tablet
- iPad size
- Sidebar tetap visible

### Desktop
- Full sidebar
- Optimal layout

---

## 🚀 Next: Deploy to Production

Setelah test di lokal, siap deploy:

```bash
# Quick deploy guide
cat QUICK_DEPLOY.md

# Full setup guide
cat SETUP.md
```

**Total deployment time: ~5 menit**

---

## 📚 Documentation

- **LOCAL_DEV.md** - Development guide (ini file)
- **README.md** - Main documentation
- **SETUP.md** - Production setup
- **API.md** - API reference
- **SECURITY.md** - Security practices
- **QUICK_DEPLOY.md** - Quick deploy

---

## ✨ Summary

Aplikasi sudah **100% ready** untuk testing lokal:

✅ Frontend: React + Tailwind + Lucide  
✅ Backend: Hono + D1 + Drizzle  
✅ Auth: JWT + bcrypt  
✅ Encryption: AES-256-GCM  
✅ UI: Dark minimalist (Vercel-style)  
✅ Responsive: Mobile to Desktop  
✅ Tests: 17/17 passing  

**Jalankan:** `npm run dev`  
**Buka:** http://localhost:5173  
**Enjoy!** 🎉

---

**Questions? Issues? Check troubleshooting section atau tanya saja!**
