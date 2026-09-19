const db = require("../db");
const { put, del } = require("@vercel/blob");

function query(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

exports.getReceipts = async (req, res) => {
  try {
    const rows = await query(`SELECT r.*, f.description AS finance_description FROM receipts r LEFT JOIN finance f ON r.finance_id = f.id ORDER BY r.receipt_date DESC, r.id DESC`);
    res.json(rows);
  } catch (err) {
    console.error("Get receipts error:", err);
    res.status(500).json({ message: "Failed to load receipts." });
  }
};

exports.uploadReceipt = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No receipt selected." });

  try {
    const { finance_id, receipt_date, supplier, amount, description, created_by } = req.body;

    const blob = await put(
      `receipts/${Date.now()}-${req.file.originalname}`,
      req.file.buffer,
      {
        access: "public",
        contentType: req.file.mimetype,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }
    );

    const result = await query(
      `INSERT INTO receipts
       (finance_id, receipt_date, supplier, amount, description, file_url, file_name, file_type, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        finance_id || null,
        receipt_date,
        supplier || null,
        amount || null,
        description || null,
        blob.url,
        req.file.originalname,
        req.file.mimetype,
        created_by || null,
      ]
    );

    res.json({
      message: "Receipt uploaded successfully!",
      id: result.insertId,
      file_url: blob.url,
    });
  } catch (err) {
    console.error("Receipt upload error:", err);
    res.status(500).json({ message: "Failed to upload receipt." });
  }
};

exports.deleteReceipt = async (req, res) => {
  try {
    const rows = await query("SELECT file_url FROM receipts WHERE id=?", [req.params.id]);

    if (!rows.length) return res.status(404).json({ message: "Receipt not found." });

    if (rows[0].file_url) {
      try {
        await del(rows[0].file_url, { token: process.env.BLOB_READ_WRITE_TOKEN });
      } catch (blobErr) {
        console.error("Receipt blob delete error:", blobErr);
      }
    }

    await query("DELETE FROM receipts WHERE id=?", [req.params.id]);
    res.json({ message: "Receipt deleted successfully!" });
  } catch (err) {
    console.error("Delete receipt error:", err);
    res.status(500).json({ message: "Failed to delete receipt." });
  }
};
