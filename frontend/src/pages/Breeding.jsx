import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Breeding() {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      const response = await fetch("http://localhost:5000/api/breeding");
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteRecord(id) {
    if (!window.confirm("Delete this breeding record?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/breeding/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      alert(data.message);
      loadRecords();
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
        <h1>🧬 Breeding Management</h1>
        <p>Manage breeding records.</p>
      </div>

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Breeding Records</h2>

          <div style={{ display: "flex", gap: "10px" }}>
            <Link className="button" to="/kidding">
              🍼 Kidding Records
            </Link>

            <Link className="button" to="/breeding/add">
              ➕ New Breeding
            </Link>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Doe</th>
              <th>Buck</th>
              <th>Mating Date</th>
              <th>Expected Kidding</th>
              <th>Days</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No breeding records found.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td>{record.doe_name}</td>

                  <td>{record.buck_name}</td>

                  <td>{formatDate(record.mating_date)}</td>

                  <td>{formatDate(record.expected_kidding)}</td>

                  <td>{record.pregnancy_days}</td>

                  <td>{record.pregnancy_status}</td>

                  <td
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      className="button"
                      onClick={() =>
                        navigate(`/breeding/${record.id}/kidding`)
                      }
                    >
                      🍼 Register Birth
                    </button>

                    <button
                      className="button"
                      onClick={() => deleteRecord(record.id)}
                    >
                      🗑 Delete
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

export default Breeding;