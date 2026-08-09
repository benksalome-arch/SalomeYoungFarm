const db = require("../db");

// Get all transactions
exports.getTransactions = (req, res) => {
  db.query(
    `SELECT
        finance.*,
        users.full_name AS created_by_name
     FROM finance
     LEFT JOIN users
       ON finance.created_by = users.id
     ORDER BY transaction_date DESC, id DESC`,
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

// Get one transaction
exports.getTransaction = (req, res) => {
  db.query(
    "SELECT * FROM finance WHERE id=?",
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
          message: "Transaction not found",
        });
      }

      res.json(results[0]);

    }
  );
};

// Create transaction
exports.createTransaction = (req, res) => {

  const {
    transaction_date,
    type,
    category,
    description,
    amount,
    payment_method,
    created_by,
  } = req.body;

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
      transaction_date,
      type,
      category,
      description,
      amount,
      payment_method,
      created_by,
    ],
    (err, result) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Transaction saved successfully!",
        id: result.insertId,
      });

    }
  );
};

// Update transaction
exports.updateTransaction = (req, res) => {

  const {
    transaction_date,
    type,
    category,
    description,
    amount,
    payment_method,
  } = req.body;

  db.query(
    `UPDATE finance
     SET
       transaction_date=?,
       type=?,
       category=?,
       description=?,
       amount=?,
       payment_method=?
     WHERE id=?`,
    [
      transaction_date,
      type,
      category,
      description,
      amount,
      payment_method,
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
        message: "Transaction updated successfully!",
      });

    }
  );
};

// Delete transaction
exports.deleteTransaction = (req, res) => {

  db.query(
    "DELETE FROM finance WHERE id=?",
    [req.params.id],
    (err) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Transaction deleted successfully!",
      });

    }
  );
};