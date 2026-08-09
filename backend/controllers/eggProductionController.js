const db = require("../db");

// ======================================
// Get all egg production records
// ======================================

exports.getEggProduction = (req, res) => {
  db.query(
    `SELECT
        ep.*,
        c.tag_number,
        c.name
     FROM egg_production ep
     LEFT JOIN chickens c
       ON ep.chicken_id = c.id
     ORDER BY ep.production_date DESC, ep.id DESC`,
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
// Get one egg production record
// ======================================

exports.getEggRecord = (req, res) => {
  db.query(
    "SELECT * FROM egg_production WHERE id=?",
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
          message: "Record not found",
        });
      }

      res.json(results[0]);
    }
  );
};

// ======================================
// Create egg production record
// ======================================

exports.createEggRecord = (req, res) => {

  const {
    chicken_id,
    production_date,
    eggs_collected,
    broken_eggs,
    notes,
  } = req.body;

  db.query(
    `INSERT INTO egg_production
    (
      chicken_id,
      production_date,
      eggs_collected,
      broken_eggs,
      notes
    )
    VALUES (?,?,?,?,?)`,
    [
      chicken_id,
      production_date,
      eggs_collected,
      broken_eggs,
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
        message: "Egg production recorded successfully!",
        id: result.insertId,
      });

    }
  );

};

// ======================================
// Update egg production record
// ======================================

exports.updateEggRecord = (req, res) => {

  const {
    chicken_id,
    production_date,
    eggs_collected,
    broken_eggs,
    notes,
  } = req.body;

  db.query(
    `UPDATE egg_production
     SET
       chicken_id=?,
       production_date=?,
       eggs_collected=?,
       broken_eggs=?,
       notes=?
     WHERE id=?`,
    [
      chicken_id,
      production_date,
      eggs_collected,
      broken_eggs,
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
        message: "Egg production updated successfully!",
      });

    }
  );

};

// ======================================
// Delete egg production record
// ======================================

exports.deleteEggRecord = (req, res) => {

  db.query(
    "DELETE FROM egg_production WHERE id=?",
    [req.params.id],
    (err) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Egg production record deleted successfully!",
      });

    }
  );

};