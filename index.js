import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "TeamAuth-RBAC API",
    version: "1.0.0",
    description: "Role-Based Access Control Authentication System",
    documentation: {
      api: "/docs",
      github: "https://github.com/yourusername/teamauth-rbac"
    },
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   - POST /api/auth/register - Register new user`);
  console.log(`   - POST /api/auth/login - Login user`);
  console.log(`   - GET /api/auth/profile - Get current user profile`);
  console.log(`   - GET /api/users - Get all users (Manager/Admin)`);
  console.log(`   - GET /api/users/:id - Get user by ID (Manager/Admin)`);
  console.log(`   - POST /api/users - Create user (Admin only)`);
  console.log(`   - PUT /api/users/:id/role - Update user role (Admin only)`);
  console.log(`   - DELETE /api/users/:id - Delete user (Admin only)`);
});
