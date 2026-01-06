# API Documentation

Complete API reference for TeamAuth-RBAC.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require a JWT token. Include it in the request header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register New User

Creates a new user account with the role "employee".

**Endpoint:** `POST /auth/register`

**Access:** Public

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "user_id": 5,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "employee",
    "created_at": "2026-01-06T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `400` - User already exists
- `500` - Server error

---

### Login

Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "alice@company.com",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "username": "alice",
    "email": "alice@company.com",
    "role": "admin",
    "manager_id": null
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `401` - Password not set for user
- `500` - Server error

---

### Get Current User Profile

Retrieve authenticated user's profile information.

**Endpoint:** `GET /auth/profile`

**Access:** Protected (Requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "user": {
    "user_id": 1,
    "username": "alice",
    "email": "alice@company.com",
    "role": "admin",
    "manager_id": null,
    "created_at": "2026-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401` - No token provided
- `401` - Invalid token
- `404` - User not found
- `500` - Server error

---

## User Management Endpoints

### Get All Users

Retrieve list of users. Managers see only their team, Admins see all users.

**Endpoint:** `GET /users`

**Access:** Manager, Admin

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "users": [
    {
      "user_id": 1,
      "username": "alice",
      "email": "alice@company.com",
      "role": "admin",
      "manager_id": null,
      "created_at": "2026-01-01T00:00:00.000Z"
    },
    {
      "user_id": 2,
      "username": "bob",
      "email": "bob@company.com",
      "role": "manager",
      "manager_id": 1,
      "created_at": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Access denied (employee role)
- `500` - Server error

---

### Get User by ID

Retrieve specific user information. Managers can only view their team members.

**Endpoint:** `GET /users/:id`

**Access:** Manager, Admin

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (integer) - User ID

**Success Response (200):**
```json
{
  "user": {
    "user_id": 3,
    "username": "charlie",
    "email": "charlie@company.com",
    "role": "employee",
    "manager_id": 2,
    "created_at": "2026-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Access denied
- `404` - User not found
- `500` - Server error

---

### Create User

Create a new user with any role (Admin only).

**Endpoint:** `POST /users`

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "new_manager",
  "email": "manager@example.com",
  "password": "securePass123",
  "role": "manager",
  "manager_id": 1
}
```

**Fields:**
- `username` (string, required) - Unique username
- `email` (string, required) - Unique email address
- `password` (string, required) - User password
- `role` (string, required) - One of: admin, manager, employee
- `manager_id` (integer, optional) - Manager's user ID

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "user_id": 6,
    "username": "new_manager",
    "email": "manager@example.com",
    "role": "manager",
    "manager_id": 1,
    "created_at": "2026-01-06T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `400` - Invalid role
- `400` - User already exists
- `401` - Unauthorized
- `403` - Access denied (not admin)
- `500` - Server error

---

### Update User Role

Update a user's role and manager assignment (Admin only).

**Endpoint:** `PUT /users/:id/role`

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `id` (integer) - User ID to update

**Request Body:**
```json
{
  "role": "manager",
  "manager_id": 1
}
```

**Fields:**
- `role` (string, required) - New role: admin, manager, or employee
- `manager_id` (integer, optional) - New manager's user ID

**Success Response (200):**
```json
{
  "message": "User role updated successfully",
  "user": {
    "user_id": 3,
    "username": "charlie",
    "email": "charlie@company.com",
    "role": "manager",
    "manager_id": 1
  }
}
```

**Error Responses:**
- `400` - Invalid role
- `400` - Cannot change own role
- `401` - Unauthorized
- `403` - Access denied (not admin)
- `404` - User not found
- `500` - Server error

---

### Delete User

Delete a user account (Admin only).

**Endpoint:** `DELETE /users/:id`

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (integer) - User ID to delete

**Success Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `400` - Cannot delete own account
- `401` - Unauthorized
- `403` - Access denied (not admin)
- `404` - User not found
- `500` - Server error

---

## Role-Based Access Control

### Role Hierarchy

1. **Admin** - Full system access
2. **Manager** - Team management access
3. **Employee** - Limited access to own profile

### Endpoint Access Matrix

| Endpoint                | Employee | Manager | Admin |
|-------------------------|----------|---------|-------|
| POST /auth/register     | ✅       | ✅      | ✅    |
| POST /auth/login        | ✅       | ✅      | ✅    |
| GET /auth/profile       | ✅       | ✅      | ✅    |
| GET /users              | ❌       | ✅*     | ✅    |
| GET /users/:id          | ❌       | ✅*     | ✅    |
| POST /users             | ❌       | ❌      | ✅    |
| PUT /users/:id/role     | ❌       | ❌      | ✅    |
| DELETE /users/:id       | ❌       | ❌      | ✅    |

*Managers can only access their team members

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Example Workflows

### Complete User Registration and Login Flow

```bash
# 1. Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123"
  }'

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'

# 3. Save the token from response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 4. Get profile
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Admin Workflow

```bash
# 1. Login as admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@company.com",
    "password": "admin123"
  }'

# 2. Save token
ADMIN_TOKEN="..."

# 3. View all users
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 4. Create new manager
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane_manager",
    "email": "jane@company.com",
    "password": "secure123",
    "role": "manager",
    "manager_id": 1
  }'

# 5. Update user role
curl -X PUT http://localhost:3000/api/users/5/role \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "manager",
    "manager_id": 1
  }'

# 6. Delete user
curl -X DELETE http://localhost:3000/api/users/5 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Manager Workflow

```bash
# 1. Login as manager
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@company.com",
    "password": "manager123"
  }'

# 2. Save token
MANAGER_TOKEN="..."

# 3. View team members (only employees assigned to this manager)
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer $MANAGER_TOKEN"

# 4. View specific team member
curl http://localhost:3000/api/users/3 \
  -H "Authorization: Bearer $MANAGER_TOKEN"
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider implementing rate limiting middleware.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

---

For testing these endpoints, see [TESTING_GUIDE.md](TESTING_GUIDE.md) or use the Postman collection.
