import bcrypt from "bcryptjs";
import pool from "../config/db.js";

// Get all users (Admin and Manager)
export const getAllUsers = async (req, res) => {
  try {
    let query =
      "SELECT user_id, username, email, role, manager_id, created_at FROM users ORDER BY created_at DESC";

    // If manager, only show their employees
    if (req.user.role === "manager") {
      query =
        "SELECT user_id, username, email, role, manager_id, created_at FROM users WHERE manager_id = $1 OR user_id = $1 ORDER BY created_at DESC";
      const result = await pool.query(query, [req.user.user_id]);
      return res.json({ users: result.rows });
    }

    const result = await pool.query(query);
    res.json({ users: result.rows });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT user_id, username, email, role, manager_id, created_at FROM users WHERE user_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // If manager, check if this is their employee
    if (
      req.user.role === "manager" &&
      result.rows[0].manager_id !== req.user.user_id &&
      result.rows[0].user_id !== req.user.user_id
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update user role (Admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, manager_id } = req.body;

    // Validate role
    const validRoles = ["admin", "manager", "employee"];
    if (!role || !validRoles.includes(role)) {
      return res
        .status(400)
        .json({ error: "Invalid role. Must be admin, manager, or employee" });
    }

    // Check if user exists
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [id]
    );
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent admin from changing their own role
    if (parseInt(id) === req.user.user_id) {
      return res.status(400).json({ error: "You cannot change your own role" });
    }

    // Update user role
    let query =
      "UPDATE users SET role = $1, manager_id = $2 WHERE user_id = $3 RETURNING user_id, username, email, role, manager_id";
    const result = await pool.query(query, [role, manager_id || null, id]);

    res.json({
      message: "User role updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Create user (Admin only)
export const createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role = "employee",
      manager_id,
    } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    // Validate role
    const validRoles = ["admin", "manager", "employee"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Check if user already exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash, role, manager_id) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, username, email, role, manager_id, created_at",
      [username, email, hashedPassword, role, manager_id || null]
    );

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.user_id) {
      return res
        .status(400)
        .json({ error: "You cannot delete your own account" });
    }

    const result = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING user_id, username",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      deleted_user: result.rows[0],
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
