import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user; // Contains user_id, username, email, role
    next();
  });
};

// Middleware to check if user has admin role
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Middleware to check if user has admin or manager role
export const requireManagerOrAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "manager") {
    return res.status(403).json({ error: "Manager or Admin access required" });
  }
  next();
};
