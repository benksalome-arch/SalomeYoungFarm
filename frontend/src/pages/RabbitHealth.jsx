import API_URL from "../api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function RabbitHealth() {
  const { id } = useParams();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, [id]);

  async function loadRecords() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/rabbit-health/rabbit/${id}`
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

  async function deleteRecord(recordId) {
    if (
      !window.confirm(
        "Delete this rabbit health record?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/rabbit-health/${recordId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete health record."
        );
        return;
      }

      alert(
        data.message ||
          "Health record deleted successfully!"
      );

      loadRecords();
    } catch (err) {
      console.error(err);

      alert(
        "Failed to delete health record."
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
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1>ðŸ¥ Rabbit Health Records</h1>

          <p>
            Medical history for this rabbit.
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
            to={`/rabbits/${id}/health/add`}
          >
            âž• Add Health Record
          </Link>

          <Link
            className="button"
            to={`/rabbits/${id}`}
          >
            â† Back to Profile
          </Link>
        </div>
      </div>

      {/* Health Records */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
          padding: "12px",
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
            <col style={{ width: "9%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "13%" }} />
          </colgroup>

          <thead>
            <tr>
              <th
                style={{
                  padding: "9px 7px",
                  fontSize: "13px",
                }}
              >
                Date
              </th>

              <th
                style={{
                  padding: "9px 7px",
                  fontSize: "13px",
                }}
              >
                Treatment
                <br />
                Type
              </th>

              <th
                style={{
                  padding: "9px 7px",
                  fontSize: "13px",
                }}
              >
                Diagnosis
              </th>

              <th
                style={{
                  padding: "9px 7px",
                  fontSize: "13px",
                }}
              >
                Medication
              </th>

              <th
                style={{
                  padding: "9px 7px",
                  fontSize: "13px",
                }}
              >
                Veterinarian
              </th>

              <th
                style={{
                  padding: "9px 7px",
                  fontSize: "13px",
                }}
              >
                Cost
              </th>

              <th
                style={{
                  padding: "9px 7px",
                  fontSize: "13px",
                }}
              >
                Notes
              </th>

              <th
                style={{
                  padding: "9px 7px",
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
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  Loading health records...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No health records found.
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
                      record.treatment_date
                    )}
                  </td>

                  <td
                    style={{
                      padding: "10px 7px",
                      verticalAlign: "middle",
                      overflowWrap: "break-word",
                    }}
                  >
                    {record.treatment_type ||
                      "-"}
                  </td>

                  <td
                    style={{
                      padding: "10px 7px",
                      verticalAlign: "middle",
                      overflowWrap: "break-word",
                    }}
                  >
                    {record.diagnosis || "-"}
                  </td>

                  <td
                    style={{
                      padding: "10px 7px",
                      verticalAlign: "middle",
                      overflowWrap: "break-word",
                    }}
                  >
                    {record.medication || "-"}
                  </td>

                  <td
                    style={{
                      padding: "10px 7px",
                      verticalAlign: "middle",
                      overflowWrap: "break-word",
                    }}
                  >
                    {record.veterinarian ||
                      "-"}
                  </td>

                  <td
                    style={{
                      padding: "10px 7px",
                      fontSize: "12px",
                      verticalAlign: "middle",
                      whiteSpace: "nowrap",
                    }}
                  >
                    KES{" "}
                    {Number(
                      record.cost || 0
                    ).toLocaleString()}
                  </td>

                  <td
                    style={{
                      padding: "10px 7px",
                      verticalAlign: "middle",
                      overflowWrap: "break-word",
                    }}
                  >
                    {record.notes || "-"}
                  </td>

                  <td
                    style={{
                      padding: "10px 5px",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        deleteRecord(
                          record.id
                        )
                      }
                      style={{
                        background: "#d32f2f",
                        color: "white",
                        border: "none",
                        padding: "7px 8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontSize: "12px",
                      }}
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

export default RabbitHealth;
