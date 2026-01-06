import bcrypt from "bcryptjs";
import pool from "../config/db.js";

const migrate = async () => {
  try {
    console.log("🔄 Starting password migration...");

    // 1. Check if password_hash column exists, if not add it
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='password_hash'
    `);

    if (checkColumn.rows.length === 0) {
      console.log("➕ Adding password_hash column...");
      await pool.query(
        "ALTER TABLE users ADD COLUMN password_hash VARCHAR(255)"
      );
      console.log("✅ password_hash column added");
    } else {
      console.log("✅ password_hash column already exists");
    }

    // 2. Fetch all users
    const { rows: users } = await pool.query(
      "SELECT user_id, email, username, role, password_hash FROM users"
    );

    // 3. Default passwords based on role
    const defaultPasswords = {
      "alice@company.com": "admin123",
      "bob@company.com": "manager123",
      "charlie@company.com": "employee123",
      "david@company.com": "employee123",
    };

    console.log("\n🔐 Setting default passwords for existing users...");

    for (const user of users) {
      // Only update if password_hash is null or empty
      if (!user.password_hash) {
        const defaultPass = defaultPasswords[user.email] || "password123";
        const hashedPassword = await bcrypt.hash(defaultPass, 10);

        await pool.query(
          "UPDATE users SET password_hash = $1 WHERE user_id = $2",
          [hashedPassword, user.user_id]
        );

        console.log(
          `  ✅ Password set for ${user.username} (${user.email}) - Role: ${user.role}`
        );
      } else {
        console.log(`  ⏭️  ${user.username} already has a password`);
      }
    }

    console.log("\n✨ Migration completed successfully!");
    console.log("\n📋 Default Login Credentials:");
    console.log("─────────────────────────────────────────");
    console.log("Admin:");
    console.log("  Email: alice@company.com");
    console.log("  Password: admin123");
    console.log("\nManager:");
    console.log("  Email: bob@company.com");
    console.log("  Password: manager123");
    console.log("\nEmployees:");
    console.log("  Email: charlie@company.com");
    console.log("  Password: employee123");
    console.log("  Email: david@company.com");
    console.log("  Password: employee123");
    console.log("─────────────────────────────────────────");

    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
};

migrate();
