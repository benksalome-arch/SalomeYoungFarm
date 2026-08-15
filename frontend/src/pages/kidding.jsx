import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Kidding() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      const response = await fetch(`${API_URL}/api/kidding`);
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error(error);
    }
  }

  function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  }

  return (
    <div className="page">

      <div className="page-header">
        <h1>🍼 Kidding Records</h1>
        <p>All goat births.</p>
      </div>

      <div className="card">

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <Link className="button" to="/breeding">
            ← Back to Breeding
          </Link>
        </div>

        <table className="table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Doe</th>
              <th>Buck</th>
              <th>Male</th>
              <th>Female</th>
              <th>Stillborn</th>
            </tr>
          </thead>

          <tbody>

            {records.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No kidding records found.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td>{formatDate(record.kidding_date)}</td>
                  <td>{record.doe_name}</td>
                  <td>{record.buck_name}</td>
                  <td>{record.male_kids}</td>
                  <td>{record.female_kids}</td>
                  <td>{record.stillborn}</td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Kidding;
