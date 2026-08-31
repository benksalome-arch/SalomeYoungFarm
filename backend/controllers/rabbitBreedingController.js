const db = require("../db");

// ======================================
// Get all rabbit breeding records
// ======================================

exports.getBreedingRecords = (req, res) => {
  db.query(
    `SELECT
        rb.*,
        female.tag AS female_tag_number,
        female.name AS female_name,
        male.tag AS male_tag_number,
        male.name AS male_name
     FROM rabbit_breeding rb
     JOIN rabbits female
       ON rb.rabbit_id = female.id
     LEFT JOIN rabbits male
       ON rb.male_rabbit_id = male.id
     ORDER BY rb.breeding_date DESC, rb.id DESC`,
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
// Get breeding history for one rabbit
// ======================================

exports.getRabbitBreeding = (req, res) => {
  db.query(
    `SELECT
        rb.*,
        female.tag AS female_tag_number,
        female.name AS female_name,
        male.tag AS male_tag_number,
        male.name AS male_name
     FROM rabbit_breeding rb
     JOIN rabbits female
       ON rb.rabbit_id = female.id
     LEFT JOIN rabbits male
       ON rb.male_rabbit_id = male.id
     WHERE rb.rabbit_id = ?
     ORDER BY rb.breeding_date DESC, rb.id DESC`,
    [req.params.rabbitId],
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
// Create rabbit breeding record
// ======================================

exports.createBreedingRecord = (req, res) => {
  const {
    rabbit_id,
    breeding_date,
    male_rabbit_id,
    breeding_type,
    expected_birth_date,
    status,
    notes,
  } = req.body;

  // ======================================
  // Validate female rabbit
  // ======================================

  db.query(
    "SELECT * FROM rabbits WHERE id = ?",
    [rabbit_id],
    (femaleErr, females) => {
      if (femaleErr) {
        console.error(femaleErr);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (females.length === 0) {
        return res.status(404).json({
          message: "Female rabbit not found.",
        });
      }

      const femaleRabbit = females[0];

      if (
        String(femaleRabbit.sex).toLowerCase() !==
        "female"
      ) {
        return res.status(400).json({
          message: "The selected rabbit must be female.",
        });
      }

      // ======================================
      // Validate male rabbit
      // ======================================

      if (!male_rabbit_id) {
        return res.status(400).json({
          message: "Please select a male rabbit.",
        });
      }

      db.query(
        "SELECT * FROM rabbits WHERE id = ?",
        [male_rabbit_id],
        (maleErr, males) => {
          if (maleErr) {
            console.error(maleErr);

            return res.status(500).json({
              message: "Database error",
            });
          }

          if (males.length === 0) {
            return res.status(404).json({
              message: "Male rabbit not found.",
            });
          }

          const maleRabbit = males[0];

          if (
            String(maleRabbit.sex).toLowerCase() !==
            "male"
          ) {
            return res.status(400).json({
              message: "The selected rabbit must be male.",
            });
          }

          // ======================================
          // Prevent same rabbit
          // ======================================

          if (
            Number(rabbit_id) ===
            Number(male_rabbit_id)
          ) {
            return res.status(400).json({
              message:
                "Female and male rabbits must be different.",
            });
          }

          // ======================================
          // Create breeding record
          // ======================================

          db.query(
            `INSERT INTO rabbit_breeding
            (
              rabbit_id,
              breeding_date,
              male_rabbit_id,
              breeding_type,
              expected_birth_date,
              status,
              notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              rabbit_id,
              breeding_date,
              male_rabbit_id,
              breeding_type,
              expected_birth_date || null,
              status || "Planned",
              notes || null,
            ],
            (insertErr, result) => {
              if (insertErr) {
                console.error(insertErr);

                return res.status(500).json({
                  message: "Database error",
                });
              }

              res.status(201).json({
                message:
                  "Rabbit breeding record added successfully!",
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
// Delete breeding record
// ======================================

exports.deleteBreedingRecord = (req, res) => {
  db.query(
    "DELETE FROM rabbit_breeding WHERE id = ?",
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
          "Rabbit breeding record deleted successfully!",
      });
    }
  );
};