const db = require("../db");

// ======================================
// Get all feed
// ======================================

exports.getFeeds = (req, res) => {
  db.query(
    "SELECT * FROM feed ORDER BY feed_name ASC",
    (err, results) => {
      if (err) {
        console.error("Get feed error:", err);

        return res.status(500).json({
          message: "Database error while loading feed.",
        });
      }

      res.json(results);
    }
  );
};

// ======================================
// Get one feed
// ======================================

exports.getFeed = (req, res) => {
  db.query(
    "SELECT * FROM feed WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error("Get feed error:", err);

        return res.status(500).json({
          message: "Database error while loading feed.",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Feed not found.",
        });
      }

      res.json(results[0]);
    }
  );
};

// ======================================
// Create feed
// ======================================

exports.createFeed = (req, res) => {
  const {
    feed_name,
    category,
    quantity,
    unit,
    minimum_stock,
    cost_per_unit,
    supplier,
    purchase_date,
    notes,
  } = req.body;

  // Required field
  if (!feed_name || !String(feed_name).trim()) {
    return res.status(400).json({
      message: "Feed name is required.",
    });
  }

  if (!unit || !String(unit).trim()) {
    return res.status(400).json({
      message: "Unit is required.",
    });
  }

  // Convert blank values to NULL
  const cleanQuantity =
    quantity === "" || quantity === undefined
      ? null
      : Number(quantity);

  const cleanMinimumStock =
    minimum_stock === "" ||
    minimum_stock === undefined
      ? null
      : Number(minimum_stock);

  const cleanCost =
    cost_per_unit === "" ||
    cost_per_unit === undefined
      ? null
      : Number(cost_per_unit);

  const cleanPurchaseDate =
    purchase_date === "" ||
    purchase_date === undefined
      ? null
      : purchase_date;

  // Validate numbers
  if (
    cleanQuantity !== null &&
    Number.isNaN(cleanQuantity)
  ) {
    return res.status(400).json({
      message: "Quantity must be a valid number.",
    });
  }

  if (
    cleanMinimumStock !== null &&
    Number.isNaN(cleanMinimumStock)
  ) {
    return res.status(400).json({
      message:
        "Minimum stock must be a valid number.",
    });
  }

  if (
    cleanCost !== null &&
    Number.isNaN(cleanCost)
  ) {
    return res.status(400).json({
      message:
        "Cost per unit must be a valid number.",
    });
  }

  db.query(
    `INSERT INTO feed
    (
      feed_name,
      category,
      quantity,
      unit,
      minimum_stock,
      cost_per_unit,
      supplier,
      purchase_date,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      feed_name.trim(),
      category || null,
      cleanQuantity,
      unit.trim(),
      cleanMinimumStock,
      cleanCost,
      supplier || null,
      cleanPurchaseDate,
      notes || null,
    ],
    (err, result) => {
      if (err) {
        console.error("Create feed error:", err);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            message:
              "A feed record with these details already exists.",
          });
        }

        return res.status(500).json({
          message:
            "Database error while saving feed.",
        });
      }

      res.status(201).json({
        message: "Feed added successfully!",
        id: result.insertId,
      });
    }
  );
};

// ======================================
// Update feed
// ======================================

exports.updateFeed = (req, res) => {
  const {
    feed_name,
    category,
    quantity,
    unit,
    minimum_stock,
    cost_per_unit,
    supplier,
    purchase_date,
    notes,
  } = req.body;

  if (!feed_name || !String(feed_name).trim()) {
    return res.status(400).json({
      message: "Feed name is required.",
    });
  }

  if (!unit || !String(unit).trim()) {
    return res.status(400).json({
      message: "Unit is required.",
    });
  }

  const cleanQuantity =
    quantity === "" || quantity === undefined
      ? null
      : Number(quantity);

  const cleanMinimumStock =
    minimum_stock === "" ||
    minimum_stock === undefined
      ? null
      : Number(minimum_stock);

  const cleanCost =
    cost_per_unit === "" ||
    cost_per_unit === undefined
      ? null
      : Number(cost_per_unit);

  const cleanPurchaseDate =
    purchase_date === "" ||
    purchase_date === undefined
      ? null
      : purchase_date;

  if (
    cleanQuantity !== null &&
    Number.isNaN(cleanQuantity)
  ) {
    return res.status(400).json({
      message: "Quantity must be a valid number.",
    });
  }

  if (
    cleanMinimumStock !== null &&
    Number.isNaN(cleanMinimumStock)
  ) {
    return res.status(400).json({
      message:
        "Minimum stock must be a valid number.",
    });
  }

  if (
    cleanCost !== null &&
    Number.isNaN(cleanCost)
  ) {
    return res.status(400).json({
      message:
        "Cost per unit must be a valid number.",
    });
  }

  db.query(
    `UPDATE feed
     SET
       feed_name = ?,
       category = ?,
       quantity = ?,
       unit = ?,
       minimum_stock = ?,
       cost_per_unit = ?,
       supplier = ?,
       purchase_date = ?,
       notes = ?
     WHERE id = ?`,
    [
      feed_name.trim(),
      category || null,
      cleanQuantity,
      unit.trim(),
      cleanMinimumStock,
      cleanCost,
      supplier || null,
      cleanPurchaseDate,
      notes || null,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        console.error("Update feed error:", err);

        return res.status(500).json({
          message:
            "Database error while updating feed.",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Feed not found.",
        });
      }

      res.json({
        message: "Feed updated successfully!",
      });
    }
  );
};

// ======================================
// Delete feed
// ======================================

exports.deleteFeed = (req, res) => {
  db.query(
    "DELETE FROM feed WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.error("Delete feed error:", err);

        return res.status(500).json({
          message:
            "Database error while deleting feed.",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Feed not found.",
        });
      }

      res.json({
        message: "Feed deleted successfully!",
      });
    }
  );
};