const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const JWT_SECRET =
  process.env.JWT_SECRET || "salome-young-farm-change-this-secret";

// =====================================
// EMAIL CONFIGURATION
// =====================================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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
          message: "Login failed. Please try again later.",
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          message:
            "Invalid email or password. Please check your login details and try again.",
        });
      }

      const user = results[0];

      try {
        const passwordCorrect = await bcrypt.compare(
          password,
          user.password
        );

        if (!passwordCorrect) {
          return res.status(401).json({
            message:
              "Invalid email or password. Please check your login details and try again.",
          });
        }
      } catch (error) {
        console.error("Password comparison error:", error);

        return res.status(500).json({
          message: "Login failed. Please try again later.",
        });
      }

      if (!user.active) {
        return res.status(401).json({
          message:
            "Invalid email or password. Please check your login details and try again.",
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
          message: "Registration failed. Please try again later.",
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
            message: "Registration failed. Please try again later.",
          });
        }

        db.query(
          `INSERT INTO users
          (full_name, email, password, role, active)
          VALUES (?, ?, ?, 'worker', 0)`,
          [full_name, email, hashedPassword],
          (err, result) => {
            if (err) {
              console.error("User creation error:", err);

              return res.status(500).json({
                message: "Registration failed. Please try again later.",
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

// =====================================
// CHANGE PASSWORD
// =====================================

exports.changePassword = async (req, res) => {
  const userId = req.user?.id;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!userId) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "All password fields are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: "New password must be at least 6 characters",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "New passwords do not match",
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      message: "New password must be different from your current password",
    });
  }

  db.query(
    "SELECT password FROM users WHERE id = ?",
    [userId],
    async (err, results) => {
      if (err) {
        console.error("Change password database error:", err);

        return res.status(500).json({
          message: "Password change failed. Please try again later.",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "User account not found",
        });
      }

      try {
        const passwordCorrect = await bcrypt.compare(
          currentPassword,
          results[0].password
        );

        if (!passwordCorrect) {
          return res.status(401).json({
            message: "Current password is incorrect",
          });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.query(
          "UPDATE users SET password = ? WHERE id = ?",
          [hashedPassword, userId],
          (updateErr) => {
            if (updateErr) {
              console.error(
                "Password update database error:",
                updateErr
              );

              return res.status(500).json({
                message:
                  "Password change failed. Please try again later.",
              });
            }

            return res.json({
              message: "Password changed successfully",
            });
          }
        );
      } catch (error) {
        console.error("Change password error:", error);

        return res.status(500).json({
          message: "Password change failed. Please try again later.",
        });
      }
    }
  );
};

// =====================================
// FORGOT PASSWORD
// =====================================

exports.forgotPassword = async (req, res) => {
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();

  if (!email) {
    return res.status(400).json({
      message: "Email address is required",
    });
  }

  db.query(
    "SELECT id, full_name, email FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("Forgot password database error:", err);

        return res.status(500).json({
          message: "Password reset request failed. Please try again later.",
        });
      }

      // Do not reveal whether an email exists.
      if (results.length === 0) {
        return res.json({
          message:
            "If an account with that email exists, a password reset link has been sent.",
        });
      }

      const user = results[0];

      try {
        // Generate secure random token.
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Store only a hash of the token in the database.
        const tokenHash = crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex");

        // Token expires after 30 minutes.
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

        // Invalidate previous unused tokens.
        await new Promise((resolve, reject) => {
          db.query(
            "UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0",
            [user.id],
            (updateErr) => {
              if (updateErr) reject(updateErr);
              else resolve();
            }
          );
        });

        await new Promise((resolve, reject) => {
          db.query(
            `INSERT INTO password_resets
            (user_id, token_hash, expires_at, used)
            VALUES (?, ?, ?, 0)`,
            [user.id, tokenHash, expiresAt],
            (insertErr) => {
              if (insertErr) reject(insertErr);
              else resolve();
            }
          );
        });

        const frontendUrl =
          process.env.FRONTEND_URL ||
          "https://salomeyoungfarm-production-1288.up.railway.app";

        const resetLink =
          `${frontendUrl}/reset-password?token=${resetToken}`;

        await transporter.sendMail({
          from:
            process.env.SMTP_FROM ||
            process.env.SMTP_USER,

          to: user.email,

          subject: "Salome Young Farm - Password Reset",

          text:
            `Hello ${user.full_name},\n\n` +
            `We received a request to reset your Salome Young Farm password.\n\n` +
            `Use this link to create a new password:\n\n` +
            `${resetLink}\n\n` +
            `This link will expire in 30 minutes and can only be used once.\n\n` +
            `If you did not request a password reset, you can safely ignore this email.\n\n` +
            `Salome Young Farm`,

          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
              <h2>Salome Young Farm</h2>

              <p>Hello ${user.full_name},</p>

              <p>
                We received a request to reset your password.
              </p>

              <p>
                Click the button below to create a new password:
              </p>

              <p>
                <a
                  href="${resetLink}"
                  style="
                    display:inline-block;
                    padding:12px 20px;
                    background:#198754;
                    color:white;
                    text-decoration:none;
                    border-radius:6px;
                  "
                >
                  Reset Password
                </a>
              </p>

              <p>
                This link will expire in <strong>30 minutes</strong>
                and can only be used once.
              </p>

              <p>
                If you did not request this password reset,
                you can safely ignore this email.
              </p>

              <p>Salome Young Farm</p>
            </div>
          `,
        });

        return res.json({
          message:
            "If an account with that email exists, a password reset link has been sent.",
        });
      } catch (error) {
        console.error("Forgot password email error:", error);

        return res.status(500).json({
          message:
            "Password reset request failed. Please try again later.",
        });
      }
    }
  );
};

// =====================================
// RESET PASSWORD
// =====================================

exports.resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Token and all password fields are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: "New password must be at least 6 characters",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "New passwords do not match",
    });
  }

  try {
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    db.query(
      `SELECT id, user_id, expires_at, used
       FROM password_resets
       WHERE token_hash = ?
       LIMIT 1`,
      [tokenHash],
      async (err, results) => {
        if (err) {
          console.error("Reset password database error:", err);

          return res.status(500).json({
            message: "Password reset failed. Please try again later.",
          });
        }

        if (results.length === 0) {
          return res.status(400).json({
            message: "This password reset link is invalid.",
          });
        }

        const reset = results[0];

        if (reset.used) {
          return res.status(400).json({
            message: "This password reset link has already been used.",
          });
        }

        if (new Date(reset.expires_at).getTime() < Date.now()) {
          return res.status(400).json({
            message: "This password reset link has expired.",
          });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.query(
          "UPDATE users SET password = ? WHERE id = ?",
          [hashedPassword, reset.user_id],
          (updateErr) => {
            if (updateErr) {
              console.error(
                "Reset password update error:",
                updateErr
              );

              return res.status(500).json({
                message:
                  "Password reset failed. Please try again later.",
              });
            }

            db.query(
              "UPDATE password_resets SET used = 1 WHERE id = ?",
              [reset.id],
              (tokenErr) => {
                if (tokenErr) {
                  console.error(
                    "Reset token update error:",
                    tokenErr
                  );

                  return res.status(500).json({
                    message:
                      "Password reset completed, but the reset token could not be closed.",
                  });
                }

                return res.json({
                  message:
                    "Password reset successfully. You can now log in with your new password.",
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Password reset failed. Please try again later.",
    });
  }
};
