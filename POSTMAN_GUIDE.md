# 🚀 Role-Based Authentication API - Postman Testing Guide

## Base URL

```
http://localhost:3000
```

## 📝 API Endpoints

### 1. Register New User (Public)

**POST** `/api/auth/register`

**Body (JSON):**

```json
{
  "username": "john_doe",
  "email": "john@company.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "user_id": 5,
    "username": "john_doe",
    "email": "john@company.com",
    "role": "employee",
    "created_at": "2025-12-29T10:30:00.000Z"
  }
}
```

---

### 2. Login (Public)

**POST** `/api/auth/login`

**Body (JSON):**

```json
{
  "email": "alice@company.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "username": "Alice_Super",
    "email": "alice@company.com",
    "role": "admin",
    "manager_id": null
  }
}
```

**⚠️ Important:** Copy the `token` from the response. You'll need it for protected routes!

---

### 3. Get Current User Profile (Protected)

**GET** `/api/auth/profile`

**Headers:**

```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**

```json
{
  "user": {
    "user_id": 1,
    "username": "Alice_Super",
    "email": "alice@company.com",
    "role": "admin",
    "manager_id": null,
    "created_at": "2025-12-29T10:15:45.552Z"
  }
}
```

---

### 4. Get All Users (Manager/Admin Only)

**GET** `/api/users`

**Headers:**

```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**

```json
{
  "users": [
    {
      "user_id": 1,
      "username": "Alice_Super",
      "email": "alice@company.com",
      "role": "admin",
      "manager_id": null,
      "created_at": "2025-12-29T10:15:45.552Z"
    },
    ...
  ]
}
```

---

### 5. Get User by ID (Manager/Admin Only)

**GET** `/api/users/:id`

Example: `/api/users/3`

**Headers:**

```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**

```json
{
  "user": {
    "user_id": 3,
    "username": "Charlie_Work",
    "email": "charlie@company.com",
    "role": "employee",
    "manager_id": null,
    "created_at": "2025-12-29T10:15:45.552Z"
  }
}
```

---

### 6. Create User (Admin Only)

**POST** `/api/users`

**Headers:**

```
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

**Body (JSON):**

```json
{
  "username": "new_manager",
  "email": "manager@company.com",
  "password": "secure123",
  "role": "manager",
  "manager_id": 1
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "user_id": 6,
    "username": "new_manager",
    "email": "manager@company.com",
    "role": "manager",
    "manager_id": 1,
    "created_at": "2025-12-29T11:00:00.000Z"
  }
}
```

---

### 7. Update User Role (Admin Only)

**PUT** `/api/users/:id/role`

Example: `/api/users/3/role`

**Headers:**

```
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

**Body (JSON):**

```json
{
  "role": "manager",
  "manager_id": 1
}
```

**Response:**

```json
{
  "message": "User role updated successfully",
  "user": {
    "user_id": 3,
    "username": "Charlie_Work",
    "email": "charlie@company.com",
    "role": "manager",
    "manager_id": 1
  }
}
```

---

### 8. Delete User (Admin Only)

**DELETE** `/api/users/:id`

Example: `/api/users/5`

**Headers:**

```
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

**Response:**

```json
{
  "message": "User deleted successfully",
  "deleted_user": {
    "user_id": 5,
    "username": "john_doe"
  }
}
```

---

## 🔐 How to Use in Postman

### Step 1: Set Up Environment Variable (Optional but Recommended)

1. Create a new environment in Postman
2. Add variable: `token` (leave value empty for now)
3. Add variable: `base_url` with value: `http://localhost:3000`

### Step 2: Login to Get Token

1. Send POST request to `/api/auth/login`
2. Copy the `token` from the response
3. If using environment: Set the `token` variable value

### Step 3: Use Token in Protected Routes

For all protected routes, add header:

- **Key:** `Authorization`
- **Value:** `Bearer {{token}}` (if using environment) or `Bearer YOUR_ACTUAL_TOKEN`

---

## 👥 Role Permissions

| Action           | Employee | Manager              | Admin |
| ---------------- | -------- | -------------------- | ----- |
| Login/Register   | ✅       | ✅                   | ✅    |
| View own profile | ✅       | ✅                   | ✅    |
| View all users   | ❌       | ✅ (only their team) | ✅    |
| View user by ID  | ❌       | ✅ (only their team) | ✅    |
| Create user      | ❌       | ❌                   | ✅    |
| Update user role | ❌       | ❌                   | ✅    |
| Delete user      | ❌       | ❌                   | ✅    |

---

## 🧪 Test Scenarios

### Scenario 1: Admin Workflow

1. Login as Alice (admin)
2. View all users
3. Create a new manager
4. Update an employee to manager
5. Delete a user

### Scenario 2: Manager Workflow

1. Login as Bob (manager)
2. View all users (should only see their team)
3. Try to update a role (should fail - admin only)

### Scenario 3: Employee Workflow

1. Register a new employee
2. Login with new credentials
3. View own profile
4. Try to view all users (should fail - unauthorized)

---

## ⚠️ Common Errors

### 401 Unauthorized

```json
{
  "error": "Access token required"
}
```

**Fix:** Add Authorization header with Bearer token

### 403 Forbidden

```json
{
  "error": "Admin access required"
}
```

**Fix:** Login with admin credentials for admin-only routes

### 400 Bad Request

```json
{
  "error": "Email and password are required"
}
```

**Fix:** Check request body has all required fields

---

## 🎯 Quick Start Testing

1. **Start the server:**

   ```bash
   npm start
   ```

2. **First, you need to set passwords for existing users.** Run the migration script or manually update passwords.

3. **Login as Admin:**

   - Email: `alice@company.com`
   - Password: (set your password first)

4. **Start testing!**
