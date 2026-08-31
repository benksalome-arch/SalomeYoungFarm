const db = require("../db");

// ======================================
// Get all rabbit litter records
// ======================================

exports.getLitters = (req, res) => {
  db.query(
    `SELECT
        rl.*,
        rb.breeding_date,
        rb.rabbit_id,
        rb.male_rabbit_id,
        female.tag AS female_tag_number,
        female.name AS female_name,
        male.tag AS male_tag_number,
        male.name AS male_name
     FROM rabbit_litters rl
     JOIN rabbit_breeding rb
       ON rl.breeding_id = rb.id
     JOIN rabbits female
       ON rb.rabbit_id = female.id
     LEFT JOIN rabbits male
       ON rb.male_rabbit_id = male.id
     ORDER BY rl.birth_date DESC, rl.id DESC`,
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
// Get litters for one breeding record
// ======================================

exports.getBreedingLitters = (req, res) => {
  db.query(
    `SELECT
        rl.*,
        rb.breeding_date,
        rb.rabbit_id,
        rb.male_rabbit_id,
        female.tag AS female_tag_number,
        female.name AS female_name,
        male.tag AS male_tag_number,
        male.name AS male_name
     FROM rabbit_litters rl
     JOIN rabbit_breeding rb
       ON rl.breeding_id = rb.id
     JOIN rabbits female
       ON rb.rabbit_id = female.id
     LEFT JOIN rabbits male
       ON rb.male_rabbit_id = male.id
     WHERE rl.breeding_id = ?
     ORDER BY rl.birth_date DESC, rl.id DESC`,
    [req.params.breedingId],
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
// Create litter record
// ======================================

exports.createLitter = (req, res) => {
  const {
    breeding_id,
    birth_date,
    total_kits,
    live_kits,
    dead_kits,
    notes,
  } = req.body;

  // ======================================
  // Validate breeding record
  // ======================================

  db.query(
    "SELECT * FROM rabbit_breeding WHERE id = ?",
    [breeding_id],
    (breedingErr, breedingRecords) => {
      if (breedingErr) {
        console.error(breedingErr);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (breedingRecords.length === 0) {
        return res.status(404).json({
          message: "Breeding record not found.",
        });
      }

      // ======================================
      // Validate kit quantities
      // ======================================

      const total = Number(total_kits || 0);
      const live = Number(live_kits || 0);
      const dead = Number(dead_kits || 0);

      if (total < 0 || live < 0 || dead < 0) {
        return res.status(400).json({
          message: "Kit quantities cannot be negative.",
        });
      }

      if (live + dead !== total) {
        return res.status(400).json({
          message:
            "Live kits plus dead kits must equal total kits.",
        });
      }

      // ======================================
      // Create litter record
      // ======================================

      db.query(
        `INSERT INTO rabbit_litters
        (
          breeding_id,
          birth_date,
          total_kits,
          live_kits,
          dead_kits,
          notes
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          breeding_id,
          birth_date,
          total,
          live,
          dead,
          notes || null,
        ],
        (insertErr, result) => {
          if (insertErr) {
            console.error(insertErr);

            return res.status(500).json({
              message: "Database error",
            });
          }

          // ======================================
          // Update breeding status
          // ======================================

          db.query(
            `UPDATE rabbit_breeding
             SET status = "Completed"
             WHERE id = ?`,
            [breeding_id],
            (updateErr) => {
              if (updateErr) {
                console.error(updateErr);
              }

              res.status(201).json({
                message:
                  "Rabbit litter recorded successfully!",
                id: result.insertId,
              });
            }
          );
        }
      );
    }
  );
};

// ======================================
// Delete litter record
// ======================================

exports.deleteLitter = (req, res) => {
  db.query(
    "DELETE FROM rabbit_litters WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message:
          "Rabbit litter record deleted successfully!",
      });
    }
  );
};