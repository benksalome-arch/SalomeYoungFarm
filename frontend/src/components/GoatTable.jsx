import { Link } from "react-router-dom";
import API_URL from "../api";

function GoatTable({ goats }) {
  async function deleteGoat(id) {
    if (!window.confirm("Delete this goat?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/goats/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Failed to delete goat."
        );
        return;
      }

      alert(
        data.message ||
          "Goat deleted successfully."
      );

      window.location.reload();
    } catch (err) {
      console.error(
        "Delete goat error:",
        err
      );

      alert("Failed to delete goat.");
    }
  }

  return (
    <>
      <style>
        {`
          .goat-table-card {
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            overflow: hidden;
          }

          .goat-table {
            width: 100%;
            max-width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }

          .goat-table th,
          .goat-table td {
            box-sizing: border-box;
            overflow-wrap: anywhere;
          }

          .goat-action-buttons {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5px;
            flex-wrap: wrap;
            width: 100%;
            box-sizing: border-box;
          }

          .goat-action-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            min-width: 0;
            padding: 6px 7px;
            font-size: 11px;
            line-height: 1.1;
            white-space: normal;
            text-decoration: none;
          }

          @media (max-width: 900px) {
            .goat-table th,
            .goat-table td {
              font-size: 11px !important;
              padding: 8px 3px !important;
            }

            .goat-action-buttons {
              flex-direction: column;
              gap: 4px;
            }

            .goat-action-button {
              width: 100%;
              font-size: 10px;
              padding: 6px 3px;
            }
          }

          @media (max-width: 650px) {
            .goat-table th,
            .goat-table td {
              font-size: 10px !important;
              padding: 7px 2px !important;
            }

            .goat-action-button {
              font-size: 9px;
              padding: 5px 2px;
            }
          }
        `}
      </style>

      <div className="card goat-table-card">
        <table className="goat-table">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "21%" }} />
          </colgroup>

          <thead>
            <tr>
              <th
                style={{
                  fontSize: "13px",
                  padding: "11px 5px",
                }}
              >
                Tag
              </th>

              <th
                style={{
                  fontSize: "13px",
                  padding: "11px 5px",
                }}
              >
                Name
              </th>

              <th
                style={{
                  fontSize: "13px",
                  padding: "11px 5px",
                }}
              >
                Breed
              </th>

              <th
                style={{
                  fontSize: "13px",
                  padding: "11px 5px",
                }}
              >
                Sex
              </th>

              <th
                style={{
                  fontSize: "13px",
                  padding: "11px 5px",
                }}
              >
                Birth Date
              </th>

              <th
                style={{
                  fontSize: "13px",
                  padding: "11px 5px",
                }}
              >
                Weight
              </th>

              <th
                style={{
                  fontSize: "13px",
                  padding: "11px 5px",
                }}
              >
                Status
              </th>

              <th
                style={{
                  fontSize: "13px",
                  padding: "11px 5px",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {goats.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "30px 10px",
                    fontSize: "14px",
                  }}
                >
                  No goats found.
                </td>
              </tr>
            ) : (
              goats.map((goat) => (
                <tr key={goat.id}>
                  <td
                    style={{
                      padding: "11px 5px",
                      textAlign: "center",
                      fontSize: "13px",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {goat.tag ||
                      goat.tag_number ||
                      "-"}
                  </td>

                  <td
                    style={{
                      padding: "11px 5px",
                      fontSize: "13px",
                      overflowWrap: "anywhere",
                    }}
                  >
                    <strong>
                      {goat.name || "-"}
                    </strong>
                  </td>

                  <td
                    style={{
                      padding: "11px 5px",
                      fontSize: "13px",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {goat.breed || "-"}
                  </td>

                  <td
                    style={{
                      padding: "11px 5px",
                      textAlign: "center",
                      fontSize: "13px",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {goat.sex || "-"}
                  </td>

                  <td
                    style={{
                      padding: "11px 5px",
                      textAlign: "center",
                      fontSize: "12px",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {goat.date_of_birth
                      ? String(
                          goat.date_of_birth
                        ).split("T")[0]
                      : "-"}
                  </td>

                  <td
                    style={{
                      padding: "11px 5px",
                      textAlign: "center",
                      fontSize: "12px",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {goat.weight
                      ? `${goat.weight} kg`
                      : "-"}
                  </td>

                  <td
                    style={{
                      padding: "11px 5px",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        maxWidth: "100%",
                        boxSizing: "border-box",
                        background:
                          goat.status === "Healthy"
                            ? "#4CAF50"
                            : goat.status === "Sick"
                            ? "#E53935"
                            : goat.status ===
                              "Sold"
                            ? "#1565C0"
                            : "#FB8C00",
                        color: "white",
                        padding: "6px 7px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {goat.status ||
                        "Unknown"}
                    </span>
                  </td>

                  <td
                    style={{
                      padding: "8px 4px",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <div className="goat-action-buttons">
                      <Link
                        className="button goat-action-button"
                        to={`/goats/${goat.id}`}
                      >
                        👁 View
                      </Link>

                      <Link
                        className="button goat-action-button"
                        to={`/goats/edit/${goat.id}`}
                      >
                        ✏ Edit
                      </Link>

                      <button
                        type="button"
                        className="button goat-action-button"
                        onClick={() =>
                          deleteGoat(goat.id)
                        }
                        style={{
                          background: "#D32F2F",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default GoatTable;