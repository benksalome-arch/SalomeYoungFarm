const db = require("../db");

// ======================================
// Get all rabbits
// ======================================

exports.getRabbits = (req, res) => {

  db.query(
    "SELECT *, tag AS tag_number, date_of_birth AS birth_date FROM rabbits ORDER BY created_at DESC",
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

// ======================================
// Get one rabbit
// ======================================

exports.getRabbit = (req, res) => {

  db.query(
    "SELECT *, tag AS tag_number, date_of_birth AS birth_date FROM rabbits WHERE id=?",
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
          message: "Rabbit not found",
        });
      }

      res.json(results[0]);

    }
  );

};

// ======================================
// Create rabbit
// ======================================

exports.createRabbit = (req, res) => {

  const {
    tag_number,
    name,
    breed,
    sex,
    birth_date,
    source,
    quantity,
    status,
    purchase_price,
    notes,
  } = req.body;

  db.query(
    `INSERT INTO rabbits
    (
      tag,
      name,
      breed,
      sex,
      date_of_birth,
      source,
      quantity,
      status,
      purchase_price,
      notes
    )
    VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [
      tag_number,
      name,
      breed,
      sex,
      birth_date,
      source,
      quantity,
      status,
      purchase_price,
      notes,
    ],
    (err, result) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Rabbit added successfully!",
        id: result.insertId,
      });

    }
  );

};

// ======================================
// Update rabbit
// ======================================

exports.updateRabbit = (req, res) => {

  const {
    tag_number,
    name,
    breed,
    sex,
    birth_date,
    source,
    quantity,
    status,
    purchase_price,
    notes,
  } = req.body;

  db.query(
    "SELECT id FROM rabbits WHERE tag=? AND id<>?",
    [tag_number, req.params.id],
    (checkErr, existing) => {

      if (checkErr) {
        console.error(checkErr);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (existing.length > 0) {
        return res.status(400).json({
          message: "Rabbit tag number is already in use.",
        });
      }

      db.query(
        `UPDATE rabbits
         SET
           tag=?,
           name=?,
           breed=?,
           sex=?,
           date_of_birth=?,
           source=?,
           quantity=?,
           status=?,
           purchase_price=?,
           notes=?
         WHERE id=?`,
        [
          tag_number,
          name,
          breed,
          sex,
          birth_date,
          source,
          quantity,
          status,
          purchase_price,
          notes,
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
            message: "Rabbit updated successfully!",
          });

        }
      );

    }
  );

};

// ======================================
// Delete rabbit
// ======================================

exports.deleteRabbit = (req, res) => {

  db.query(
    "DELETE FROM rabbits WHERE id=?",
    [req.params.id],
    (err) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Rabbit deleted successfully!",
      });

    }
  );

};