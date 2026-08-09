const db = require("../db");

// ==============================
// Get all inventory items
// ==============================
exports.getItems = (req, res) => {
  db.query(
    "SELECT * FROM inventory ORDER BY item_name ASC",
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

// ==============================
// Get one inventory item
// ==============================
exports.getItem = (req, res) => {
  db.query(
    "SELECT * FROM inventory WHERE id=?",
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
          message: "Item not found",
        });
      }

      res.json(results[0]);
    }
  );
};

// ==============================
// Create inventory item
// ==============================
exports.createItem = (req, res) => {
  const {
    item_name,
    category,
    quantity,
    unit,
    minimum_stock,
    purchase_price,
    supplier,
    purchase_date,
    notes,
  } = req.body;

  db.query(
    `INSERT INTO inventory
    (
      item_name,
      category,
      quantity,
      unit,
      minimum_stock,
      purchase_price,
      supplier,
      purchase_date,
      notes
    )
    VALUES (?,?,?,?,?,?,?,?,?)`,
    [
      item_name,
      category,
      quantity,
      unit,
      minimum_stock,
      purchase_price,
      supplier,
      purchase_date,
      notes,
    ],
    (err, result) => {
      if (err) {
        console.error("INVENTORY ERROR:", err);

        return res.status(500).json({
          message: "Inventory insert failed",
          error: err.sqlMessage,
        });
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
          purchase_date,
          "Expense",
          "Inventory",
          `Purchased ${item_name}`,
          purchase_price,
          "Cash",
          null,
        ],
        (financeErr) => {
          if (financeErr) {
            console.error("FINANCE ERROR:", financeErr);

            return res.status(500).json({
              message: "Finance insert failed",
              error: financeErr.sqlMessage,
            });
          }

          res.json({
            message: "Inventory item and finance transaction saved successfully!",
            id: result.insertId,
          });
        }
      );
    }
  );
};

// ==============================
// Update inventory item
// ==============================
exports.updateItem = (req, res) => {
  const {
    item_name,
    category,
    quantity,
    unit,
    minimum_stock,
    purchase_price,
    supplier,
    purchase_date,
    notes,
  } = req.body;

  db.query(
    `UPDATE inventory
     SET
       item_name=?,
       category=?,
       quantity=?,
       unit=?,
       minimum_stock=?,
       purchase_price=?,
       supplier=?,
       purchase_date=?,
       notes=?
     WHERE id=?`,
    [
      item_name,
      category,
      quantity,
      unit,
      minimum_stock,
      purchase_price,
      supplier,
      purchase_date,
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
        message: "Inventory updated successfully!",
      });
    }
  );
};

// ==============================
// Delete inventory item
// ==============================
exports.deleteItem = (req, res) => {
  db.query(
    "DELETE FROM inventory WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Inventory deleted successfully!",
      });
    }
  );
};