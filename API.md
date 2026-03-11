# 📚 API Endpoints Documentation

**Base URL:** `http://localhost:3000/api`

---

## 🔐 Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /auth/register`

**Description:** Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "TEACHER"
}
```

**Request Parameters:**
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| name | string | ✅ | 1-100 characters |
| email | string | ✅ | Valid email format, unique |
| password | string | ✅ | 6-128 characters |
| role | enum | ✅ | `ADMIN`, `TEACHER`, or `DEAN` |

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "TEACHER",
    "created_at": "2026-03-04T10:30:00Z"
  },
  "token": "<jwt-token-here>"
}
```

**Error Responses:**
- `400` - Validation error:
```json
{
  "success": false,
  "message": "email must be a valid email address"
}
```

- `409` - Email already registered (conflict):
```json
{
  "success": false,
  "message": "Email 'john@example.com' is already registered"
}
```

- `500` - Internal server error:
```json
{
  "success": false,
  "message": "An unexpected error occurred"
}
```

---

### 2. Login User
**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and retrieve user data

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Request Parameters:**
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| email | string | ✅ | Valid email format |
| password | string | ✅ | 6-128 characters |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "TEACHER",
    "created_at": "2026-03-04T10:30:00Z"
  },
  "token": "<jwt-token-here>"
}
```

**Error Responses:**
- `400` - Validation error:
```json
{
  "success": false,
  "message": "email must be a valid email address"
}
```

- `401` - Invalid credentials:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

- `500` - Internal server error:
```json
{
  "success": false,
  "message": "An unexpected error occurred"
}
```

---

## 👨‍🎓 Student Endpoints

### 3. Create Student
**Endpoint:** `POST /students`

**Description:** Create a new student record

**Request Body:**
```json
{
  "name": "Jane Student",
  "age": 15,
  "year_level": "Grade 9",
  "rfid_uid": "04:A1:B2:C3:D4",
  "fingerprint_id": null
}
```

**Request Parameters:**
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| name | string | ✅ | 1-100 characters |
| age | number | ✅ | Integer between 5-120 |
| year_level | string | ✅ | Grade 1-12 |
| rfid_uid | string | ❌ | 1-100 hex characters or null |
| fingerprint_id | string | ❌ | 1-255 characters or null |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "student_id": "7c8f3e2a-4b91-4c6d-a5e3-2f8b9c7d6e4a",
    "name": "Jane Student",
    "age": 15,
    "year_level": "Grade 9",
    "rfid_uid": "04:A1:B2:C3:D4",
    "fingerprint_id": null,
    "created_at": "2026-03-04T10:35:00Z"
  }
}
```

---

### 4. Get Student
**Endpoint:** `GET /students/:id`

**Description:** Retrieve a student by ID

**URL Parameters:**
| Field | Type | Required |
|-------|------|----------|
| id | string | ✅ |

**Example:** `GET /students/7c8f3e2a-4b91-4c6d-a5e3-2f8b9c7d6e4a`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Student retrieved successfully",
  "data": {
    "student_id": "7c8f3e2a-4b91-4c6d-a5e3-2f8b9c7d6e4a",
    "name": "Jane Student",
    "age": 15,
    "year_level": "Grade 9",
    "rfid_uid": "04:A1:B2:C3:D4",
    "fingerprint_id": null,
    "created_at": "2026-03-04T10:35:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Student not found"
}
```

---

### 5. Update Student RFID
**Endpoint:** `PATCH /students/:id/rfid`

**Description:** Update or assign RFID to a student

**URL Parameters:**
| Field | Type | Required |
|-------|------|----------|
| id | string | ✅ |

**Request Body:**
```json
{
  "rfid_uid": "04:A1:B2:C3:D4"
}
```

**Request Parameters:**
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| rfid_uid | string | ✅ | 1-100 hex characters |

**Success Response (200):**
```json
{
  "success": true,
  "message": "RFID updated successfully",
  "data": {
    "student_id": "7c8f3e2a-4b91-4c6d-a5e3-2f8b9c7d6e4a",
    "rfid_uid": "04:A1:B2:C3:D4"
  }
}
```

**Error Responses:**
- `400` - RFID already assigned:
```json
{
  "success": false,
  "message": "RFID '04:A1:B2:C3:D4' is already assigned to another student"
}
```

---

### 6. Get Student RFID
**Endpoint:** `GET /students/:id/rfid`

**Description:** Retrieve a student's RFID UID

**URL Parameters:**
| Field | Type | Required |
|-------|------|----------|
| id | string | ✅ |

**Success Response (200):**
```json
{
  "success": true,
  "message": "RFID retrieved successfully",
  "data": {
    "student_id": "7c8f3e2a-4b91-4c6d-a5e3-2f8b9c7d6e4a",
    "rfid_uid": "04:A1:B2:C3:D4"
  }
}
```

---

### 7. Update Student Fingerprint
**Endpoint:** `PATCH /students/:id/fingerprint`

**Description:** Update or assign fingerprint ID to a student

**URL Parameters:**
| Field | Type | Required |
|-------|------|----------|
| id | string | ✅ |

**Request Body:**
```json
{
  "fingerprint_id": "fingerprint_template_base64_encoded..."
}
```

**Request Parameters:**
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| fingerprint_id | string | ✅ | 1-255 characters |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Fingerprint updated successfully",
  "data": {
    "student_id": "7c8f3e2a-4b91-4c6d-a5e3-2f8b9c7d6e4a",
    "fingerprint_id": "fingerprint_template_base64_encoded..."
  }
}
```

---

### 8. Get Student Fingerprint
**Endpoint:** `GET /students/:id/fingerprint`

**Description:** Retrieve a student's fingerprint ID

**URL Parameters:**
| Field | Type | Required |
|-------|------|----------|
| id | string | ✅ |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Fingerprint retrieved successfully",
  "data": {
    "student_id": "7c8f3e2a-4b91-4c6d-a5e3-2f8b9c7d6e4a",
    "fingerprint_id": "fingerprint_template_base64_encoded..."
  }
}
```

---

## ✅ Health Check

### 9. API Health Check
**Endpoint:** `GET /api`

**Description:** Check if the API is running

**Success Response (200):**
```json
{
  "message": "✅ Hono backend is running!"
}
```

---

## 📊 Response Format Standards

### Success Response Structure
All successful responses follow this structure:
```json
{
  "success": true,
  "message": "Descriptive message",
  "data": { /* optional */ }
}
```

### Error Response Structure
All error responses follow this structure:
```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error or invalid input |
| 401 | Unauthorized - Invalid credentials |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## 🔒 User Roles

The system supports three user roles:

| Role | Description |
|------|-------------|
| ADMIN | Administrator with full system access |
| TEACHER | Teacher account for managing students |
| DEAN | Dean/Administrator account |

---

## 🔐 Security Features

✅ **Password Encryption:** All passwords are hashed using bcryptjs (10 salt rounds)

✅ **Email Validation:** Valid email format required and enforced as unique

✅ **Input Validation:** All inputs validated before processing

✅ **Secure Responses:** Passwords never included in API responses

✅ **Error Handling:** Internal errors logged, user-friendly messages returned

---

## 📝 Usage Examples

### Register a new teacher
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@school.edu",
    "password": "SecurePass123",
    "role": "TEACHER"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@school.edu",
    "password": "SecurePass123"
  }'
```

### Create a student
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Student",
    "age": 15,
    "year_level": "Grade 9",
    "rfid_uid": "04:A1:B2:C3:D4",
    "fingerprint_id": null
  }'
```

---

## � HTTP Status Codes Reference

| Code | Status | Description | Common Scenarios |
|------|--------|-------------|------------------|
| 200 | OK | Request successful | Login, data retrieval, updates |
| 201 | Created | Resource created successfully | User registration, student creation |
| 400 | Bad Request | Validation error in request | Invalid email format, missing fields, weak password |
| 401 | Unauthorized | Authentication failed | Invalid credentials, incorrect password |
| 409 | Conflict | Resource already exists | Duplicate email during registration |
| 500 | Internal Server Error | Server error | Database errors, unexpected exceptions |

---

## 🏷️ Internal Error Codes

The API uses internal error codes to help identify specific issues:

| Error Code | HTTP Status | Description | Solution |
|------------|-------------|-------------|----------|
| DUPLICATE_EMAIL | 409 | Email already registered | Use a different email address |
| INVALID_CREDENTIALS | 401 | Wrong email or password | Verify email and password are correct |
| USER_NOT_FOUND | 401 | User does not exist | Check email address or register first |
| INTERNAL_ERROR | 500 | Unexpected server error | Contact support or check logs |

---

## �📋 Database Collections

### Users Collection
- **Collection:** `users`
- **Fields:** `user_id`, `name`, `email`, `role`, `password` (hashed), `created_at`, `updated_at`

### Students Collection
- **Collection:** `students`
- **Fields:** `student_id`, `name`, `age`, `year_level`, `rfid_uid`, `fingerprint_id`, `created_at`, `updated_at`
