const db = require("../db");

// ======================================
// Get all egg sales
// ======================================

exports.getSales = (req, res) => {

  db.query(
    "SELECT * FROM egg_sales ORDER BY sale_date DESC, id DESC",
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
// Create egg sale
// ======================================

exports.createSale = (req, res) => {

  const {
    sale_date,
    customer,
    quantity,
    price_per_egg,
    payment_method,
    notes,
  } = req.body;

  const total_amount =
    Number(quantity) * Number(price_per_egg);

  db.query(
    `INSERT INTO egg_sales
    (
      sale_date,
      customer,
      quantity,
      price_per_egg,
      total_amount,
      payment_method,
      notes
    )
    VALUES (?,?,?,?,?,?,?)`,
    [
      sale_date,
      customer,
      quantity,
      price_per_egg,
      total_amount,
      payment_method,
      notes,
    ],
    (err, result) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      // Automatically create finance income
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
          sale_date,
          "Income",
          "Egg Sales",
          `Egg sale to ${customer || "Walk-in Customer"}`,
          total_amount,
          payment_method,
          null,
        ],
        (financeErr) => {

          if (financeErr) {
            console.error(financeErr);
          }

          res.json({
            message: "Egg sale recorded successfully!",
            id: result.insertId,
          });

        }
      );

    }
  );

};

// ======================================
// Delete sale
// ======================================

exports.deleteSale = (req, res) => {

  db.query(
    "DELETE FROM egg_sales WHERE id=?",
    [req.params.id],
    (err) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Egg sale deleted successfully!",
      });

    }
  );

};