# API Documentation - Social Media Account Manager

Complete API reference for all endpoints.

## Base URL

- **Local Development**: `http://localhost:8787/api`
- **Production**: `https://your-worker.workers.dev/api`

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

Token expires after **7 days**.

---

## Endpoints

### Health Check

#### `GET /api/health`

Check API status.

**Response:**
```json
{
  "status": "ok",
  "ts": 1723006633027
}
```

---

## Authentication Endpoints

### Register User

#### `POST /api/auth/register`

Create new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Validation:**
- `name`: 1-200 characters
- `email`: Valid email format, unique
- `password`: Minimum 8 characters

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-08-07T04:57:13.027Z",
    "updatedAt": "2026-08-07T04:57:13.027Z"
  }
}
```

**Error Responses:**
```json
// 400 Bad Request
{
  "error": "Email already exists"
}

// 400 Bad Request (validation)
{
  "error": "Invalid email format"
}
```

**Rate Limit:** 10 requests per 15 minutes per IP

---

### Login

#### `POST /api/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-08-07T04:57:13.027Z",
    "updatedAt": "2026-08-07T04:57:13.027Z"
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "error": "Invalid credentials"
}

// 429 Too Many Requests
{
  "error": "Too many requests. Please try again later."
}
```

**Rate Limit:** 10 requests per 15 minutes per IP

---

## Profile Endpoints

### Get Profile

#### `GET /api/profile`

Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-08-07T04:57:13.027Z",
    "updatedAt": "2026-08-07T04:57:13.027Z"
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "error": "Unauthorized"
}
```

---

### Update Profile

#### `PUT /api/profile`

Update user name, email, or password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Rules:**
- All fields optional
- To change password: must provide `currentPassword` and `newPassword`
- To change email: must provide unique email
- `newPassword`: minimum 8 characters

**Response (200 OK):**
```json
{
  "user": {
    "id": "abc123",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2026-08-07T04:57:13.027Z",
    "updatedAt": "2026-08-07T05:10:22.153Z"
  }
}
```

**Error Responses:**
```json
// 400 Bad Request
{
  "error": "Email already in use"
}

// 400 Bad Request
{
  "error": "Current password is incorrect"
}

// 400 Bad Request
{
  "error": "Current password required to set new password"
}
```

---

## Projects Endpoints

### List Projects

#### `GET /api/projects`

Get all projects for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "projects": [
    {
      "id": "proj123",
      "userId": "abc123",
      "name": "Banten IT Solutions",
      "description": "Social accounts for Banten IT",
      "createdAt": "2026-08-07T04:57:13.027Z",
      "updatedAt": "2026-08-07T04:57:13.027Z"
    },
    {
      "id": "proj456",
      "userId": "abc123",
      "name": "Personal Brand",
      "description": null,
      "createdAt": "2026-08-07T05:00:00.000Z",
      "updatedAt": "2026-08-07T05:00:00.000Z"
    }
  ]
}
```

---

### Create Project

#### `POST /api/projects`

Create new project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Optional description"
}
```

**Validation:**
- `name`: 1-200 characters, required
- `description`: 0-1000 characters, optional

**Response (201 Created):**
```json
{
  "project": {
    "id": "proj789",
    "userId": "abc123",
    "name": "New Project",
    "description": "Optional description",
    "createdAt": "2026-08-07T05:15:00.000Z",
    "updatedAt": "2026-08-07T05:15:00.000Z"
  }
}
```

---

### Update Project

#### `PUT /api/projects/:id`

Update existing project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "project": {
    "id": "proj789",
    "userId": "abc123",
    "name": "Updated Name",
    "description": "Updated description",
    "createdAt": "2026-08-07T05:15:00.000Z",
    "updatedAt": "2026-08-07T05:20:00.000Z"
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": "Project not found"
}

// 403 Forbidden
{
  "error": "Unauthorized to access this project"
}
```

---

### Delete Project

#### `DELETE /api/projects/:id`

Delete project and all associated social accounts.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": "Project not found"
}
```

**Note:** Cascade deletes all social_accounts under this project.

---

## Social Accounts Endpoints

### List Social Accounts

#### `GET /api/accounts?project_id=<id>`

Get all social accounts for a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `project_id` (required): Project ID

**Response (200 OK):**
```json
{
  "accounts": [
    {
      "id": "acc123",
      "projectId": "proj789",
      "platform": "Gmail",
      "accountName": "work@company.com",
      "emailHandle": "work@company.com",
      "passwordEncrypted": "encrypted_base64_string...",
      "notes": "Main work email",
      "createdAt": "2026-08-07T05:15:00.000Z",
      "updatedAt": "2026-08-07T05:15:00.000Z"
    },
    {
      "id": "acc456",
      "projectId": "proj789",
      "platform": "Instagram",
      "accountName": "@company_official",
      "emailHandle": "social@company.com",
      "passwordEncrypted": "encrypted_base64_string...",
      "notes": null,
      "createdAt": "2026-08-07T05:16:00.000Z",
      "updatedAt": "2026-08-07T05:16:00.000Z"
    }
  ]
}
```

**Error Responses:**
```json
// 400 Bad Request
{
  "error": "project_id required"
}

// 403 Forbidden
{
  "error": "Unauthorized to access this project"
}
```

---

### Create Social Account

#### `POST /api/accounts`

Add new social account to project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "projectId": "proj789",
  "platform": "Gmail",
  "accountName": "work@company.com",
  "emailHandle": "work@company.com",
  "password": "PlainTextPassword123!",
  "notes": "Optional notes"
}
```

**Supported Platforms:**
- Gmail
- YouTube
- Facebook
- Instagram
- Threads
- WhatsApp
- Telegram
- TikTok
- Shopee
- X
- LinkedIn

**Validation:**
- `projectId`: Valid project ID owned by user
- `platform`: Must be one of supported platforms
- `accountName`: 1-200 characters
- `emailHandle`: 1-200 characters
- `password`: 1-500 characters (will be encrypted)
- `notes`: 0-1000 characters, optional

**Response (201 Created):**
```json
{
  "account": {
    "id": "acc789",
    "projectId": "proj789",
    "platform": "Gmail",
    "accountName": "work@company.com",
    "emailHandle": "work@company.com",
    "passwordEncrypted": "encrypted_base64_string...",
    "notes": "Optional notes",
    "createdAt": "2026-08-07T05:20:00.000Z",
    "updatedAt": "2026-08-07T05:20:00.000Z"
  }
}
```

**Note:** Password is encrypted with AES-256-GCM before storage.

---

### Update Social Account

#### `PUT /api/accounts/:id`

Update existing social account.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "platform": "Gmail",
  "accountName": "updated@company.com",
  "emailHandle": "updated@company.com",
  "password": "NewPassword456!",
  "notes": "Updated notes"
}
```

**Rules:**
- All fields optional
- Provide `password` to update encrypted password
- Cannot change `projectId`

**Response (200 OK):**
```json
{
  "account": {
    "id": "acc789",
    "projectId": "proj789",
    "platform": "Gmail",
    "accountName": "updated@company.com",
    "emailHandle": "updated@company.com",
    "passwordEncrypted": "new_encrypted_base64_string...",
    "notes": "Updated notes",
    "createdAt": "2026-08-07T05:20:00.000Z",
    "updatedAt": "2026-08-07T05:25:00.000Z"
  }
}
```

---

### Delete Social Account

#### `DELETE /api/accounts/:id`

Delete social account.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": "Account not found"
}
```

---

### Decrypt Account Password

#### `GET /api/accounts/:id/password`

Decrypt and retrieve account password.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "password": "PlainTextPassword123!"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": "Account not found"
}

// 500 Internal Server Error
{
  "error": "Failed to decrypt password"
}
```

**Security Notes:**
- Password decrypted on-demand only
- Not logged or cached
- Requires valid JWT token
- User must own the project

---

## Error Codes Summary

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `/api/auth/register` | 10 requests / 15 minutes per IP |
| `/api/auth/login` | 10 requests / 15 minutes per IP |
| All other endpoints | No limit (add as needed) |

Rate limit headers:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1723007493
```

---

## Example cURL Commands

### Register
```bash
curl -X POST https://your-worker.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"SecurePass123!"}'
```

### Login
```bash
curl -X POST https://your-worker.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123!"}'
```

### Create Project
```bash
curl -X POST https://your-worker.workers.dev/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Banten IT Solutions","description":"Social accounts"}'
```

### Create Social Account
```bash
curl -X POST https://your-worker.workers.dev/api/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "projectId":"proj123",
    "platform":"Gmail",
    "accountName":"work@company.com",
    "emailHandle":"work@company.com",
    "password":"MyPassword123!",
    "notes":"Work email"
  }'
```

### Decrypt Password
```bash
curl https://your-worker.workers.dev/api/accounts/acc123/password \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## TypeScript Types

All API types available in `src/client/lib/types.ts`:

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccount {
  id: string;
  projectId: string;
  platform: string;
  accountName: string;
  emailHandle: string;
  passwordEncrypted: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

**Questions?** Check inline code documentation in `src/worker/routes/` for implementation details.
