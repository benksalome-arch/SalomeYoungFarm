const db = require("../db");

// ============================
// Get all feed usage
// ============================

exports.getUsage = (req, res) => {
  db.query(
    `SELECT
        fu.*,
        f.feed_name,
        f.cost_per_unit
     FROM feed_usage fu
     LEFT JOIN feed f
       ON fu.feed_id = f.id
     ORDER BY fu.usage_date DESC, fu.id DESC`,
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

// ============================
// Record feed usage
// ============================

exports.createUsage = (req, res) => {

  let {
    feed_id,
    animal_type,
    animal_id,
    quantity_used,
    usage_date,
    notes,
  } = req.body;

  if (!animal_id) {
    animal_id = null;
  }

  db.query(
    "SELECT * FROM feed WHERE id=?",
    [feed_id],
    (err, feed) => {

      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (feed.length === 0) {
        return res.status(404).json({
          message: "Feed not found",
        });
      }

      const item = feed[0];

      if (Number(item.quantity) < Number(quantity_used)) {
        return res.status(400).json({
          message: "Not enough feed in stock.",
        });
      }

      const totalCost =
        Number(quantity_used) *
        Number(item.cost_per_unit);

      db.query(
        `INSERT INTO feed_usage
        (
          feed_id,
          animal_type,
          animal_id,
          quantity_used,
          usage_date,
          notes
        )
        VALUES (?,?,?,?,?,?)`,
        [
          feed_id,
          animal_type,
          animal_id,
          quantity_used,
          usage_date,
          notes,
        ],
        (usageErr, result) => {

          if (usageErr) {
            console.error(usageErr);

            return res.status(500).json({
              message: "Database error",
            });
          }

          db.query(
            "UPDATE feed SET quantity = quantity - ? WHERE id=?",
            [
              quantity_used,
              feed_id,
            ],
            (updateErr) => {

              if (updateErr) {
                console.error(updateErr);
              }

              db.query(
                `INSERT INTO finance
                (
                  transaction_date,
                  type,
                  category,
                  description,
                  amount,
                  payment_method,
                  created_by
                )
                VALUES (?,?,?,?,?,?,?)`,
                [
                  usage_date,
                  "Expense",
                  "Feed",
                  `${animal_type} feed consumption`,
                  totalCost,
                  "Cash",
                  null,
                ],
                (financeErr) => {

                  if (financeErr) {
                    console.error(financeErr);
                  }

                  res.json({
                    message: "Feed usage recorded successfully!",
                    id: result.insertId,
                  });

                }
              );

            }
          );

        }
      );

    }
  );

};

// ============================
// Delete feed usage
// ============================

exports.deleteUsage = (req, res) => {

  db.query(
    "DELETE FROM feed_usage WHERE id=?",
    [req.params.id],
    (err) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Feed usage deleted successfully!",
      });

    }
  );

};