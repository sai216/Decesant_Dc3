# API Endpoints Required for Start Audit Flow

## Overview
Based on the authentication and audit submission flow, here are all the required backend API endpoints.

**Authentication Provider**: **Privy.io** - Handles email, SMS, and Google OAuth authentication without requiring crypto wallets.

---

## 1. AUTHENTICATION ENDPOINTS (Using Privy.io SDK)

### Why Privy?
- ✅ Supports Email, SMS, and Google OAuth in one SDK
- ✅ No wallet required (can disable wallet features)
- ✅ Built-in session management
- ✅ SOC 2 Type II compliant
- ✅ Handles OTP generation and verification
- ✅ Easy frontend integration

### 1.1 Privy Email Authentication
```http
POST /api/privy/auth/email
```
**Purpose**: Authenticate user with email (Privy handles OTP)  
**Request Body**:
```json
{
  "email": "user@example.com"
}
```
**Response**:
```json
{
  "success": true,
  "message": "OTP sent to email",
  "userId": "did:privy:...",
  "expiresIn": 600
}
```

---

```http
POST /api/privy/auth/email/verify
```
**Purpose**: Verify email OTP code  
**Request Body**:
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```
**Response**:
```json
{
  "success": true,
  "user": {
    "id": "did:privy:clxxx",
    "email": "user@example.com",
    "createdAt": "2026-01-31T10:00:00Z"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 3600
}
```

---

### 1.2 Privy SMS Authentication
```http
POST /api/privy/auth/sms
```
**Purpose**: Send OTP via SMS (Privy handles delivery)  
**Request Body**:
```json
{
  "phoneNumber": "+14155552671"
}
```
**Response**:
```json
{
  "success": true,
  "message": "OTP sent via SMS",
  "userId": "did:privy:...",
  "expiresIn": 300
}
```

---

```http
POST /api/privy/auth/sms/verify
```
**Purpose**: Verify SMS OTP  
**Request Body**:
```json
{
  "phoneNumber": "+14155552671",
  "code": "123456"
}
```
**Response**:
```json
{
  "success": true,
  "user": {
    "id": "did:privy:clxxx",
    "phoneNumber": "+14155552671"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 3600
}
```

---

### 1.3 Privy Google OAuth
```http
GET /api/privy/auth/google
```
**Purpose**: Initiate Google OAuth flow via Privy  
**Query Parameters**:
- `redirect_uri`: URL to return after auth

**Response**: HTTP 302 redirect to Privy-managed Google OAuth

---

```http
POST /api/privy/auth/google/callback
```
**Purpose**: Handle OAuth callback from Privy  
**Request Body**:
```json
{
  "authorizationCode": "4/0AY0e-g7...",
  "idToken": "eyJhbGc..."
}
```
**Response**:
```json
{
  "success": true,
  "user": {
    "id": "did:privy:clxxx",
    "email": "user@gmail.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/..."
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 3600
}
```

---

## 2. MANIFEST COMPOSITION ENDPOINTS

### 2.1 Upload Files
```http
POST /api/audit/manifest/upload
```
**Purpose**: Upload supporting documents for audit  
**Headers**:
- `Authorization`: Bearer {accessToken}
- `Content-Type`: multipart/form-data

**Request Body** (FormData):
```
files: File[] (max 25MB each)
```
**Response**:
```json
{
  "success": true,
  "files": [
    {
      "id": "file_123",
      "name": "document.pdf",
      "size": 1048576,
      "url": "https://cdn.example.com/files/file_123.pdf",
      "uploadedAt": "2026-01-31T10:30:00Z"
    }
  ]
}
```

---

### 2.2 Submit Manifest
```http
POST /api/audit/manifest
```
**Purpose**: Submit Loom video URL and document URLs  
**Headers**:
- `Authorization`: Bearer {accessToken}

**Request Body**:
```json
{
  "loomUrl": "https://loom.com/share/abc123",
  "docsUrl": "https://docs.google.com/document/d/xyz",
  "uploadedFiles": ["file_123", "file_456"]
}
```
**Response**:
```json
{
  "success": true,
  "manifestId": "manifest_123",
  "createdAt": "2026-01-31T10:35:00Z"
}
```

---

## 3. AUTH IDENTITY ENDPOINTS

### 3.1 Submit Identity Information
```http
POST /api/audit/identity
```
**Purpose**: Submit LinkedIn, business email, and WhatsApp for verification  
**Headers**:
- `Authorization`: Bearer {accessToken}

**Request Body**:
```json
{
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "businessEmail": "john@company.com",
  "whatsappNumber": "+14155552671"
}
```
**Response**:
```json
{
  "success": true,
  "identityId": "ident_123",
  "otpSent": true,
  "otpSentTo": "+1415****671"
}
```

---

## 4. OTP VERIFICATION ENDPOINTS

### 4.1 Send WhatsApp OTP
```http
POST /api/audit/otp/send
```
**Purpose**: Send OTP to WhatsApp number  
**Headers**:
- `Authorization`: Bearer {accessToken}

**Request Body**:
```json
{
  "phoneNumber": "+14155552671"
}
```
**Response**:
```json
{
  "success": true,
  "message": "OTP sent to WhatsApp",
  "expiresIn": 300
}
```

---

### 4.2 Verify WhatsApp OTP
```http
POST /api/audit/otp/verify
```
**Purpose**: Verify 6-digit OTP code  
**Headers**:
- `Authorization`: Bearer {accessToken}

**Request Body**:
```json
{
  "phoneNumber": "+14155552671",
  "code": "123456"
}
```
**Response**:
```json
{
  "success": true,
  "verified": true,
  "identityVerified": true
}
```

---

## 5. GOOGLE MEET SCHEDULING ENDPOINTS

### 5.1 Check Calendar Availability
```http
GET /api/audit/calendar/availability
```
**Purpose**: Get available time slots for audit call  
**Headers**:
- `Authorization`: Bearer {accessToken}

**Query Parameters**:
- `date`: 2026-02-15
- `timezone`: America/Los_Angeles

**Response**:
```json
{
  "success": true,
  "availableSlots": [
    {
      "start": "2026-02-15T09:00:00Z",
      "end": "2026-02-15T10:00:00Z",
      "available": true
    },
    {
      "start": "2026-02-15T14:00:00Z",
      "end": "2026-02-15T15:00:00Z",
      "available": true
    }
  ]
}
```

---

### 5.2 Schedule Google Meet
```http
POST /api/audit/calendar/schedule
```
**Purpose**: Create Google Meet event and send invites  
**Headers**:
- `Authorization`: Bearer {accessToken}

**Request Body**:
```json
{
  "date": "2026-02-15",
  "time": "14:00",
  "timezone": "America/Los_Angeles",
  "duration": 60,
  "attendees": ["user@example.com"],
  "title": "Audit Consultation"
}
```
**Response**:
```json
{
  "success": true,
  "meeting": {
    "id": "meet_123",
    "meetLink": "https://meet.google.com/abc-defg-hij",
    "eventId": "evt_123",
    "startTime": "2026-02-15T14:00:00-08:00",
    "endTime": "2026-02-15T15:00:00-08:00",
    "calendarInviteSent": true
  }
}
```

---

## 6. SESSION MANAGEMENT ENDPOINTS

### 6.1 Refresh Access Token
```http
POST /api/auth/refresh
```
**Purpose**: Get new access token using refresh token  
**Request Body**:
```json
{
  "refreshToken": "eyJhbGc..."
}
```
**Response**:
```json
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "expiresIn": 3600
}
```

---

### 6.2 Logout
```http
POST /api/auth/logout
```
**Purpose**: Invalidate user session  
**Headers**:
- `Authorization`: Bearer {accessToken}

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 6.3 Get Current User
```http
GET /api/auth/me
```
**Purpose**: Get authenticated user information  
**Headers**:
- `Authorization`: Bearer {accessToken}

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "phoneNumber": "+14155552671",
    "name": "John Doe",
    "picture": "https://...",
    "verified": true,
    "createdAt": "2026-01-31T10:00:00Z"
  }
}
```

---

## 7. AUDIT SUBMISSION ENDPOINT

### 7.1 Complete Audit Submission
```http
POST /api/audit/submit
```
**Purpose**: Finalize entire audit submission  
**Headers**:
- `Authorization`: Bearer {accessToken}

**Request Body**:
```json
{
  "manifestId": "manifest_123",
  "identityId": "ident_123",
  "meetingId": "meet_123"
}
```
**Response**:
```json
{
  "success": true,
  "auditId": "audit_123",
  "status": "submitted",
  "submittedAt": "2026-01-31T10:45:00Z",
  "nextSteps": [
    "Review your email for confirmation",
    "Join the Google Meet at scheduled time",
    "Check your dashboard for audit status"
  ]
}
```

---

## ENVIRONMENT VARIABLES NEEDED

```env
# Privy Authentication (Replaces Google/Email/SMS individual configs)
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
PRIVY_VERIFICATION_KEY=your_verification_key
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# WhatsApp (for OTP verification in audit flow)
WHATSAPP_API_KEY=your_key
WHATSAPP_FROM_NUMBER=+14155551234

# Google Calendar API
GOOGLE_CALENDAR_API_KEY=your_key
GOOGLE_CALENDAR_ID=your_calendar_id

# JWT Tokens
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=3600
REFRESH_TOKEN_EXPIRES_IN=604800

# File Storage (AWS S3, Google Cloud Storage, etc.)
STORAGE_BUCKET=your_bucket_name
STORAGE_REGION=us-west-2
STORAGE_ACCESS_KEY=your_access_key
STORAGE_SECRET_KEY=your_secret_key
```

---

## RECOMMENDED TECH STACK

### Backend Framework Options:
- **Node.js**: Express.js, NestJS, Fastify
- **Python**: FastAPI, Django, Flask
- **Go**: Gin, Echo, Fiber

### Authentication:
- **Privy.io** ⭐ **RECOMMENDED** - All-in-one auth (email, SMS, Google OAuth)
  - Built-in OTP delivery
  - Session management included
  - No need for separate email/SMS services for auth
  - Supports progressive authentication (start with email, add wallet later if needed)

### Alternative Authentication (if not using Privy):
- **NextAuth.js** (Next.js specific)
- **Firebase Auth** (serverless)
- **Auth0** (managed service)
- **Supabase Auth** (open source)

### WhatsApp OTP (for audit verification):
- Twilio
- MessageBird
- AWS SNS
- Vonage

### File Storage:
- AWS S3
- Google Cloud Storage
- Azure Blob Storage
- Cloudflare R2

### Calendar Integration:
- Google Calendar API
- Microsoft Graph API (Outlook)
- Calendly API

---

## SECURITY CONSIDERATIONS

1. **Rate Limiting**: Implement rate limiting on all auth endpoints (max 5 attempts per 15 minutes)
2. **CORS**: Configure CORS to only allow your frontend domain
3. **HTTPS Only**: All endpoints must use HTTPS in production
4. **Token Expiry**: Access tokens expire in 1 hour, refresh tokens in 7 days
5. **Input Validation**: Validate all inputs (email format, E.164 phone, URL format)
6. **File Validation**: Check file types, sizes, and scan for malware
7. **OTP Security**: 6-digit codes, expire in 5 minutes, max 3 attempts
8. **CSRF Protection**: Use state parameter for OAuth flows
9. **XSS Prevention**: Sanitize all user inputs
10. **Database**: Hash sensitive data, encrypt files at rest

---

## WEBHOOK ENDPOINTS (Optional)

### Google Calendar Webhook
```http
POST /api/webhooks/calendar
```
**Purpose**: Receive calendar event updates from Google  

### Payment Webhook (if using Stripe)
```http
POST /api/webhooks/stripe
```
**Purpose**: Handle payment confirmations and failures
