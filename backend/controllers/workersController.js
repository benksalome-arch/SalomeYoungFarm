const db = require("../db");
const bcrypt = require("bcrypt");

// Get all workers
exports.getAllWorkers = (req, res) => {
  db.query(
    "SELECT id, full_name, email, phone, role, active, created_at FROM users ORDER BY full_name",
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json(results);
    }
  );
};

// Get one worker
exports.getWorkerById = (req, res) => {
  db.query(
    "SELECT id, full_name, email, phone, role, active FROM users WHERE id=?",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Worker not found",
        });
      }

      res.json(results[0]);
    }
  );
};

// Create worker
// Workers created by an administrator are active immediately.
exports.createWorker = async (req, res) => {
  let { full_name, email, phone, password, role } = req.body;

  full_name = full_name?.trim();
  email = email?.trim() || null;
  phone = phone?.trim() || null;
  role = role?.trim().toLowerCase();

  if (!full_name || (!email && !phone) || !password || !role) {
    return res.status(400).json({
      message: "Full name, password, role, and either email or phone are required.",
    });
  }

  if (!["worker", "manager", "admin"].includes(role)) {
    return res.status(400).json({
      message: "Invalid account role.",
    });
  }

  try {
    const existing = await new Promise((resolve, reject) => {
      db.query(
        "SELECT id FROM users WHERE (email IS NOT NULL AND email = ?) OR (phone IS NOT NULL AND phone = ?) LIMIT 1",
        [email, phone],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    if (existing.length > 0) {
      return res.status(409).json({
        message: "An account with this email or phone number already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      `INSERT INTO users
      (full_name, email, phone, password, role, active)
      VALUES (?, ?, ?, ?, ?, 1)`,
      [full_name, email, phone, hashedPassword, role],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: err.sqlMessage || "Database error" });
        }

        res.json({
          message: "Account created successfully!",
          id: result.insertId,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update worker
exports.updateWorker = (req, res) => {
  const {
    full_name,
    email,
    phone,
    role,
    active,
  } = req.body;

  db.query(
    `UPDATE users
     SET
     full_name=?,
     email=?,
     phone=?,
     role=?,
     active=?
     WHERE id=?`,
    [
      full_name,
      email,
      phone,
      role,
      active,
      req.params.id,
    ],
    (err) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Worker updated successfully!",
      });
    }
  );
};

// Delete worker
exports.deleteWorker = (req, res) => {
  db.query(
    "DELETE FROM users WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Worker deleted successfully!",
      });
    }
  );
};