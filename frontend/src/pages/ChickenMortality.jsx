import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ChickenMortality() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      const response = await fetch(
        `${API_URL}/api/chicken-mortality`
      );

      const data = await response.json();
      setRecords(data);

    } catch (err) {
      console.error(err);
    }
  }

  async function deleteRecord(id) {

    if (!window.confirm("Delete this mortality record?")) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/api/chicken-mortality/${id}`,
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
      alert("Failed to delete record.");
    }

  }

  const totalDeaths = records.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

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
          <h1>â˜ ï¸ Chicken Mortality</h1>
          <p>Track chicken deaths and flock losses.</p>
        </div>

        <Link
          className="button"
          to="/chicken-mortality/add"
        >
          ➕ Record Mortality
        </Link>

      </div>

      <div
        className="card"
        style={{ marginBottom: "20px" }}
      >
        <h3>Total Deaths</h3>
        <h2>{totalDeaths}</h2>
      </div>

      <div className="card">

        <table className="table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Tag</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Cause</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {records.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center" }}
                >
                  No mortality records found.
                </td>
              </tr>

            ) : (

              records.map((record) => (

                <tr key={record.id}>

                  <td>
                    {record.mortality_date?.split("T")[0]}
                  </td>

                  <td>{record.tag_number}</td>

                  <td>{record.name}</td>

                  <td>{record.quantity}</td>

                  <td>{record.cause}</td>

                  <td>

                    <button
                      className="button"
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

export default ChickenMortality;
