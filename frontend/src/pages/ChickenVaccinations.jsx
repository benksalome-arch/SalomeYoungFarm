import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ChickenVaccinations() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadVaccinations();
  }, []);

  async function loadVaccinations() {
    try {
      const response = await fetch(
        "${API_URL}/api/chicken-vaccinations"
      );

      const data = await response.json();
      setRecords(data);

    } catch (err) {
      console.error(err);
    }
  }

  async function deleteRecord(id) {

    if (!window.confirm("Delete this vaccination record?")) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/api/chicken-vaccinations/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        loadVaccinations();
      }

    } catch (err) {
      console.error(err);
      alert("Failed to delete vaccination.");
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
          <h1>ðŸ’‰ Chicken Vaccinations</h1>
          <p>Manage vaccination records.</p>
        </div>

        <Link
          className="button"
          to="/chicken-vaccinations/add"
        >
          âž• Record Vaccination
        </Link>

      </div>

      <div className="card">

        <table className="table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Tag</th>
              <th>Name</th>
              <th>Vaccine</th>
              <th>Next Due</th>
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
                  No vaccination records found.
                </td>
              </tr>

            ) : (

              records.map((record) => (

                <tr key={record.id}>

                  <td>{record.vaccination_date?.split("T")[0]}</td>

                  <td>{record.tag_number}</td>

                  <td>{record.name}</td>

                  <td>{record.vaccine_name}</td>

                  <td>
                    {record.next_due_date
                      ? record.next_due_date.split("T")[0]
                      : "-"}
                  </td>

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

export default ChickenVaccinations;
