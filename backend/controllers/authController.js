const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET";

// =====================================
// LOGIN
// =====================================
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND active = 1",
    [email],
    async (err, results) => {
      if (err) {
        console.error(err);
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

      res.json({
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
exports.register = (req, res) => {
  const { full_name, email, password, role } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({
      message: "Full name, email and password are required",
    });
  }

  db.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error(err);
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
          console.error(err);
          return res.status(500).json({
            message: "Password encryption failed",
          });
        }

        db.query(
          `INSERT INTO users
          (full_name, email, password, role, active)
          VALUES (?, ?, ?, ?, 1)`,
          [
            full_name,
            email,
            hashedPassword,
            role || "admin",
          ],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({
                message: "Could not create user",
              });
            }

            res.status(201).json({
              message: "User created successfully",
              userId: result.insertId,
            });
          }
        );
      });
    }
  );
};
