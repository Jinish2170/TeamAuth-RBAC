# Sample API Requests - Copy & Paste into Postman

## 1. LOGIN AS ADMIN

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "alice@company.com",
  "password": "admin123"
}
```

## 2. GET ALL USERS (use admin token)

```
GET http://localhost:3000/api/users
Authorization: Bearer YOUR_TOKEN_HERE
```

## 3. CREATE NEW MANAGER (admin only)

```
POST http://localhost:3000/api/users
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "username": "sarah_manager",
  "email": "sarah@company.com",
  "password": "manager456",
  "role": "manager",
  "manager_id": 1
}
```

## 4. UPDATE USER ROLE (admin only)

```
PUT http://localhost:3000/api/users/3/role
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "role": "manager",
  "manager_id": 1
}
```

## 5. REGISTER NEW EMPLOYEE (public)

```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "jane_employee",
  "email": "jane@company.com",
  "password": "password123"
}
```

## 6. GET USER PROFILE (any authenticated user)

```
GET http://localhost:3000/api/auth/profile
Authorization: Bearer YOUR_TOKEN
```

## 7. GET SPECIFIC USER

```
GET http://localhost:3000/api/users/2
Authorization: Bearer YOUR_TOKEN
```

## 8. DELETE USER (admin only)

```
DELETE http://localhost:3000/api/users/5
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

## LOGIN CREDENTIALS

**Admin:**

- Email: alice@company.com
- Password: admin123

**Manager:**

- Email: bob@company.com
- Password: manager123

**Employees:**

- Email: charlie@company.com | Password: employee123
- Email: david@company.com | Password: employee123

---

## HOW TO USE TOKEN

After login, you'll get a response like:

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Copy the token value and use it in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace YOUR_TOKEN_HERE with the actual token!
