# 🧪 Quick Testing Guide

## ✅ System Status

- ✅ Database connected
- ✅ Passwords migrated
- ✅ Server running on http://localhost:3000

## 🎯 Test in Postman - Quick Steps

### Option 1: Import Collection (Recommended)

1. Open Postman
2. Click "Import" button
3. Select `Postman_Collection.json` from this folder
4. Collection will be imported with all endpoints ready!

### Option 2: Manual Testing

#### Step 1: Login as Admin

```
POST http://localhost:3000/api/auth/login

Body (JSON):
{
  "email": "alice@company.com",
  "password": "admin123"
}
```

**Copy the `token` from response!**

#### Step 2: Test Protected Route

```
GET http://localhost:3000/api/users

Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Step 3: Create a New User (Admin Only)

```
POST http://localhost:3000/api/users

Headers:
Authorization: Bearer YOUR_TOKEN_HERE

Body (JSON):
{
  "username": "sarah_manager",
  "email": "sarah@company.com",
  "password": "secure123",
  "role": "manager",
  "manager_id": 1
}
```

#### Step 4: Update User Role (Admin Only)

```
PUT http://localhost:3000/api/users/3/role

Headers:
Authorization: Bearer YOUR_TOKEN_HERE

Body (JSON):
{
  "role": "manager",
  "manager_id": 1
}
```

## 🔑 Test Different Roles

### Test as Manager:

1. Login with `bob@company.com` / `manager123`
2. Try to get all users - ✅ Should work (only shows their team)
3. Try to update a role - ❌ Should fail (admin only)

### Test as Employee:

1. Login with `charlie@company.com` / `employee123`
2. Try to get all users - ❌ Should fail (403 Forbidden)
3. Get own profile - ✅ Should work

## 📊 Expected Results

### ✅ Should Work:

- Employee can register, login, view own profile
- Manager can view users in their team
- Admin can do everything

### ❌ Should Fail:

- Employee trying to view all users (403)
- Manager trying to update roles (403)
- Employee trying to create users (403)
- Request without token (401)
- Request with invalid token (403)

## 🎓 Skills Demonstrated

✅ PostgreSQL database design
✅ Node.js + Express REST API
✅ JWT authentication
✅ bcrypt password hashing
✅ Role-based access control (RBAC)
✅ Middleware for authorization
✅ Secure API endpoints
✅ Professional error handling
✅ Clean code architecture

## 📝 Notes for Your Portfolio

**Key Features:**

- 3-tier role system (Admin, Manager, Employee)
- Only admins can assign/update roles
- Managers can only view their team
- Secure password storage with bcrypt
- JWT tokens with expiration
- RESTful API design
- PostgreSQL relational database

**Security Highlights:**

- Passwords never stored in plain text
- Token-based authentication
- Role-based middleware protection
- SQL injection prevention
- Input validation on all endpoints

Perfect for demonstrating your full-stack skills! 🚀
