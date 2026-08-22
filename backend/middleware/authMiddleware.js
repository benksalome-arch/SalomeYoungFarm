const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "salome-young-farm-change-this-secret";

// =====================================
// AUTHENTICATE TOKEN
// =====================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role) {
      decoded.role = String(decoded.role).toLowerCase();
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification error:", error);

    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
}

// =====================================
// REQUIRE ADMIN
// =====================================
function requireAdmin(req, res, next) {
  const role = req.user?.role
    ? String(req.user.role).toLowerCase()
    : "";

  if (role !== "admin") {
    return res.status(403).json({
      message: "Administrator access required",
    });
  }

  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
};
