import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password, role = "employee" } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    // Check if user already exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User already exists with this email or username" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user (only employees can self-register)
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING user_id, username, email, role, created_at",
      [username, email, hashedPassword, "employee"]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      message: "User registered successfully",
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const result = await pool.query(
      "SELECT user_id, username, email, password_hash, role, manager_id FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Check if password_hash exists
    if (!user.password_hash) {
      return res
        .status(401)
        .json({
          error: "Password not set for this user. Please contact admin.",
        });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        manager_id: user.manager_id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT user_id, username, email, role, manager_id, created_at FROM users WHERE user_id = $1",
      [req.user.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
