# TeamAuth-RBAC 🔐

A production-ready Role-Based Access Control (RBAC) authentication system built with Node.js, Express, PostgreSQL, and JWT tokens. Perfect for applications requiring hierarchical user management with Admin, Manager, and Employee roles.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌟 Features

- ✅ **JWT-based Authentication** - Secure token-based authentication
- ✅ **Role-Based Access Control** - Three-tier permission system (Admin/Manager/Employee)
- ✅ **Password Security** - bcrypt password hashing with salt rounds
- ✅ **Hierarchical Management** - Managers can view and manage their team
- ✅ **RESTful API** - Well-structured API endpoints
- ✅ **Input Validation** - Comprehensive request validation
- ✅ **Error Handling** - Proper error responses and logging
- ✅ **PostgreSQL Database** - Robust relational database with indexed queries

## � Documentation

- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference with examples
- **[Database Setup Guide](DATABASE_SETUP.md)** - Detailed database configuration and troubleshooting
- **[Testing Guide](TESTING_GUIDE.md)** - How to test the application
- **[Postman Guide](POSTMAN_GUIDE.md)** - Using Postman collection for testing
- **[Contributing](CONTRIBUTING.md)** - How to contribute to this project

## �🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/Jinish2170/TeamAuth-RBAC.git
cd teamauth-rbac
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database Configuration
DB_USER=your_db_user
DB_HOST=localhost
DB_DATABASE=teamauth_db
DB_PASSWORD=your_db_password
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Setup Database

Follow the detailed instructions in [DATABASE_SETUP.md](DATABASE_SETUP.md)

Quick setup:
```bash
# Run the database setup script
psql -U your_username -d teamauth_db -f src/scripts/setup_database.sql

# Migrate passwords for existing users (if applicable)
node src/scripts/migrate_passwords.js
```

### 5. Start the Server

**Development mode:**
```bash
npm start
```

**Production mode:**
```bash
npm run prod
```

The server will be running at `http://localhost:3000`

## 👥 Default Users

After database setup, you can login with these default accounts:

| Role     | Email                  | Password      |
|----------|------------------------|---------------|
| Admin    | alice@company.com      | admin123      |
| Manager  | bob@company.com        | manager123    |
| Employee | charlie@company.com    | employee123   |
| Employee | david@company.com      | employee123   |

**⚠️ Important:** Change these passwords in production!

## 📚 API Documentation

### Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "employee",
    "manager_id": null
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### User Management Endpoints

#### Get All Users (Manager/Admin)
```http
GET /api/users
Authorization: Bearer <token>
```

#### Get User by ID (Manager/Admin)
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Create User (Admin Only)
```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "new_user",
  "email": "user@example.com",
  "password": "password123",
  "role": "manager",
  "manager_id": 1
}
```

#### Update User Role (Admin Only)
```http
PUT /api/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "manager",
  "manager_id": 1
}
```

#### Delete User (Admin Only)
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

## 🔑 Role Permissions

| Action                    | Employee | Manager | Admin |
|---------------------------|----------|---------|-------|
| Register (self)           | ✅       | ✅      | ✅    |
| Login                     | ✅       | ✅      | ✅    |
| View own profile          | ✅       | ✅      | ✅    |
| View all users            | ❌       | ✅*     | ✅    |
| View user by ID           | ❌       | ✅*     | ✅    |
| Create users              | ❌       | ❌      | ✅    |
| Update user roles         | ❌       | ❌      | ✅    |
| Delete users              | ❌       | ❌      | ✅    |

*Managers can only view their own team members

## 🗂️ Project Structure

```
teamauth-rbac/
├── src/
│   ├── config/
│   │   └── db.js                 # Database connection configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   └── userController.js     # User management logic
│   ├── middleware/
│   │   └── auth.js               # JWT verification & RBAC middleware
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication routes
│   │   └── userRoutes.js         # User management routes
│   └── scripts/
│       ├── setup_database.sql    # Database schema
│       └── migrate_passwords.js  # Password migration script
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── index.js                      # Application entry point
├── package.json                  # Dependencies and scripts
├── DATABASE_SETUP.md             # Database setup guide
└── README.md                     # This file
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: Secure token generation with expiration
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Configurable CORS middleware
- **Role Validation**: Server-side role checking
- **Environment Variables**: Sensitive data in .env files

## 🧪 Testing

You can use the included Postman collection for testing:

1. Import `Postman_Collection.json` into Postman
2. Set up environment variables (baseUrl, token)
3. Run the collection

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed testing instructions.

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server with nodemon
- `npm run prod` - Start production server

### Database Migrations

To add new database migrations or modify the schema, update the files in `src/scripts/`.

## 📝 Environment Variables

| Variable        | Description                          | Default     | Required |
|-----------------|--------------------------------------|-------------|----------|
| DB_USER         | PostgreSQL username                  | -           | Yes      |
| DB_HOST         | PostgreSQL host                      | localhost   | Yes      |
| DB_DATABASE     | Database name                        | -           | Yes      |
| DB_PASSWORD     | Database password                    | -           | Yes      |
| DB_PORT         | PostgreSQL port                      | 5432        | Yes      |
| JWT_SECRET      | Secret key for JWT signing (min 32)  | -           | Yes      |
| JWT_EXPIRES_IN  | JWT expiration time                  | 24h         | No       |
| PORT            | Server port                          | 3000        | No       |
| NODE_ENV        | Environment (development/production) | development | No       |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Authentication with [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- Password hashing with [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- Database: [PostgreSQL](https://www.postgresql.org/)

## 📧 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Made with ❤️ by Jinish**
- Security best practices
- Clean code architecture
- Professional error handling

Perfect for showcasing your backend development skills! 🚀
