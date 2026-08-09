import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RabbitVaccinations() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVaccinations();
  }, []);

  async function loadVaccinations() {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/rabbit-vaccinations"
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

  function formatDate(dateValue) {
    if (!dateValue) {
      return "-";
    }

    const dateOnly = String(dateValue).split("T")[0];
    const parts = dateOnly.split("-");

    if (parts.length !== 3) {
      return dateValue;
    }

    const [year, month, day] = parts;

    return `${day}-${month}-${year}`;
  }

  async function deleteRecord(id) {
    if (
      !window.confirm(
        "Delete this rabbit vaccination record?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/rabbit-vaccinations/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete vaccination."
        );
        return;
      }

      alert(
        data.message ||
          "Rabbit vaccination deleted successfully!"
      );

      loadVaccinations();
    } catch (err) {
      console.error(err);

      alert(
        "Failed to delete vaccination."
      );
    }
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "20px",
          width: "100%",
          boxSizing: "border-box",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1>💉 Rabbit Vaccinations</h1>

          <p>
            Manage rabbit vaccination records.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <Link
            className="button"
            to="/rabbit-vaccinations/add"
          >
            ➕ Record Vaccination
          </Link>

          <Link
            className="button"
            to="/rabbits"
          >
            ← Back to Rabbits
          </Link>
        </div>
      </div>

      {/* Vaccination Records */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <table
          className="table"
          style={{
            width: "100%",
            maxWidth: "100%",
            tableLayout: "fixed",
            fontSize: "13px",
          }}
        >
          <colgroup>
            <col style={{ width: "16%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "19%" }} />
            <col style={{ width: "21%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
          </colgroup>

          <thead>
            <tr>
              <th
                style={{
                  padding: "10px 7px",
                  fontSize: "13px",
                }}
              >
                Date
              </th>

              <th
                style={{
                  padding: "10px 7px",
                  fontSize: "13px",
                }}
              >
                Tag
              </th>

              <th
                style={{
                  padding: "10px 7px",
                  fontSize: "13px",
                }}
              >
                Name
              </th>

              <th
                style={{
                  padding: "10px 7px",
                  fontSize: "13px",
                }}
              >
                Vaccine
              </th>

              <th
                style={{
                  padding: "10px 7px",
                  fontSize: "13px",
                }}
              >
                Next Due
              </th>

              <th
                style={{
                  padding: "10px 7px",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  Loading vaccination records...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No vaccination records found.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td
                    style={{
                      padding: "10px 7px",
                      fontSize: "12px",
                      verticalAlign: "middle",
                    }}
                  >
                    {formatDate(
                      record.vaccination_date
                    )}
                  </td>

                  <td
                    style={{
                      padding: "10px 7px",
                      verticalAlign: "middle",
                      overflowWrap: "break-word",
                    }}
                  >
                    {record.tag_number || "-"}
                  </td>

                  <td
                    style={{
                      padding: "10px 7px",
                      verticalAlign: "middle",
                      overflowWrap: "break-word",
                    }}
                  >
                    {record.name || "-"}
                  </td>

                  <td
                    style={{
                      padding: "10px 7px",
                      verticalAlign: "middle",
                      overflowWrap: "break-word",
                    }}
                  >
                    {record.vaccine_name || "-"}
                  </td>

                  <td
                    style={{
                      padding: "10px 7px",
                      fontSize: "12px",
                      verticalAlign: "middle",
                    }}
                  >
                    {formatDate(
                      record.next_due_date
                    )}
                  </td>

                  <td
                    style={{
                      padding: "8px 5px",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        deleteRecord(record.id)
                      }
                      style={{
                        background: "#d32f2f",
                        color: "white",
                        border: "none",
                        padding: "7px 9px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontSize: "12px",
                      }}
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

export default RabbitVaccinations;