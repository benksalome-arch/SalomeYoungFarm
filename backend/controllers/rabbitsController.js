const db = require("../db");

// ======================================
// Get all rabbits
// ======================================

exports.getRabbits = (req, res) => {

  db.query(
    "SELECT * FROM rabbits ORDER BY created_at DESC",
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
    "SELECT * FROM rabbits WHERE id=?",
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
      tag_number,
      name,
      breed,
      sex,
      birth_date,
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
    `UPDATE rabbits
     SET
       tag_number=?,
       name=?,
       breed=?,
       sex=?,
       birth_date=?,
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