import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function EggProduction() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      const response = await fetch(
        "${API_URL}/api/egg-production"
      );

      const data = await response.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteRecord(id) {
    if (!window.confirm("Delete this record?")) return;

    try {
      const response = await fetch(
        `${API_URL}/api/egg-production/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      alert(data.message);

      loadRecords();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1>ðŸ¥š Egg Production</h1>
          <p>Daily egg collection records.</p>
        </div>

        <Link className="button" to="/egg-production/add">
          âž• Record Production
        </Link>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Chicken</th>
              <th>Eggs</th>
              <th>Broken</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No egg production records found.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td>{record.production_date?.split("T")[0]}</td>
                  <td>{record.name || record.tag_number}</td>
                  <td>{record.eggs_collected}</td>
                  <td>{record.broken_eggs}</td>
                  <td>
                    <button
                      className="button"
                      onClick={() => deleteRecord(record.id)}
                    >
                      ðŸ—‘ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EggProduction;
