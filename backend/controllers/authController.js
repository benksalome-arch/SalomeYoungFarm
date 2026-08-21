cd /workspaces/SalomeYoungFarm

cat > backend/controllers/authController.js <<'EOF'
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "salome-young-farm-change-this-secret";

// =====================================
// LOGIN
// =====================================
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("Login database error:", err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const user = results[0];

      const passwordCorrect = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordCorrect) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      // Account exists but has not been approved
      if (!user.active) {
        return res.status(403).json({
          message:
            "Your account has been created but is waiting for administrator approval.",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          name: user.full_name,
        },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
        },
      });
    }
  );
};

// =====================================
// REGISTER
// =====================================
// Public registration is allowed,
// but EVERY new account is created as:
// role = worker
// active = 0
//
// The new user therefore CANNOT log in
// until an administrator approves the account.
// =====================================
exports.register = (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({
      message: "Full name, email and password are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  db.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Registration database error:", err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length > 0) {
        return res.status(409).json({
          message: "A user with this email already exists",
        });
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Password encryption error:", err);
          return res.status(500).json({
            message: "Password encryption failed",
          });
        }

        db.query(
          `INSERT INTO users
          (full_name, email, password, role, active)
          VALUES (?, ?, ?, 'worker', 0)`,
          [
            full_name,
            email,
            hashedPassword,
          ],
          (err, result) => {
            if (err) {
              console.error("User creation error:", err);
              return res.status(500).json({
                message: "Could not create user",
              });
            }

            return res.status(201).json({
              message:
                "Account created successfully. Your account is waiting for administrator approval.",
              userId: result.insertId,
            });
          }
        );
      });
    }
  );
};
EOF