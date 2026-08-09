const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET";

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