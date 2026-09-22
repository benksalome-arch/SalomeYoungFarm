const db = require("../db");

function checkGoatAlive(goatId, callback) {
  db.query(
    "SELECT id, name, status FROM goats WHERE id = ? LIMIT 1",
    [goatId],
    (err, rows) => {
      if (err) {
        return callback(err, null);
      }

      if (!rows.length) {
        return callback(null, {
          exists: false,
          alive: false,
          goat: null,
        });
      }

      const goat = rows[0];

      callback(null, {
        exists: true,
        alive: String(goat.status).toLowerCase() !== "dead",
        goat,
      });
    }
  );
}

module.exports = {
  checkGoatAlive,
};
