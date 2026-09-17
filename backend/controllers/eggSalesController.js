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
// Get one egg sale
// ======================================

exports.getSale = (req, res) => {

  db.query(
    "SELECT * FROM egg_sales WHERE id=?",
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
          message: "Egg sale not found",
        });
      }

      res.json(results[0]);

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
// Update sale
// ======================================

exports.updateSale = (req, res) => {

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
    `UPDATE egg_sales
     SET sale_date=?,
         customer=?,
         quantity=?,
         price_per_egg=?,
         total_amount=?,
         payment_method=?,
         notes=?
     WHERE id=?`,
    [
      sale_date,
      customer,
      quantity,
      price_per_egg,
      total_amount,
      payment_method,
      notes,
      req.params.id,
    ],
    (err, result) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Egg sale not found",
        });
      }

      res.json({
        message: "Egg sale updated successfully!",
      });

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