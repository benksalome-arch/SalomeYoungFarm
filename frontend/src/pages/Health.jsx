import API_URL from "../api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function Health() {
  const { id } = useParams();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/health/${id}`)
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch(console.error);
  }, [id]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>ðŸ’‰ Health Records</h1>
        <p>Vaccinations, deworming and treatment history.</p>
      </div>

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Link className="button" to={`/goats/${id}`}>
            â† Back to Goat
          </Link>

          <Link className="button" to={`/goats/${id}/health/add`}>
            âž• Add Health Record
          </Link>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Veterinarian</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No health records found.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td>{record.record_date}</td>
                  <td>{record.record_type}</td>
                  <td>{record.medicine}</td>
                  <td>{record.dosage}</td>
                  <td>{record.veterinarian}</td>
                  <td>{record.notes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Health;
