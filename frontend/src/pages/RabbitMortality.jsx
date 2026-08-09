import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RabbitMortality() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/rabbit-mortality"
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        setRecords([]);
        return;
      }

      setRecords(data);
    } catch (err) {
      console.error(err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteRecord(id) {
    if (!window.confirm("Delete this rabbit mortality record?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/rabbit-mortality/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        loadRecords();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete mortality record.");
    }
  }

  const totalDeaths = records.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "20px",
        }}
      >
        <div>
          <h1>☠️ Rabbit Mortality</h1>
          <p>Track rabbit deaths and flock losses.</p>
        </div>

        <Link
          className="button"
          to="/rabbit-mortality/add"
        >
          ➕ Record Mortality
        </Link>
      </div>

      {/* Total Deaths */}
      <div
        className="card"
        style={{ marginBottom: "20px" }}
      >
        <h3>Total Rabbit Deaths</h3>

        <h2>{totalDeaths}</h2>
      </div>

      {/* Records */}
      <div className="card">
        <table className="table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Tag</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Cause</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center" }}
                >
                  Loading mortality records...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center" }}
                >
                  No rabbit mortality records found.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>

                  <td>
                    {record.mortality_date
                      ? record.mortality_date.split("T")[0]
                      : ""}
                  </td>

                  <td>
                    {record.tag_number || "-"}
                  </td>

                  <td>
                    {record.name || "-"}
                  </td>

                  <td>
                    {record.quantity}
                  </td>

                  <td>
                    {record.cause || "-"}
                  </td>

                  <td>
                    {record.notes || "-"}
                  </td>

                  <td>
                    <button
                      className="button"
                      type="button"
                      onClick={() =>
                        deleteRecord(record.id)
                      }
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

export default RabbitMortality;