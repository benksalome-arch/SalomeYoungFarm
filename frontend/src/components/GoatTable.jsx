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
          data.message ||
            "Failed to delete goat."
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
    <div
      className="card"
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflowX: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
          minWidth: "850px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                width: "9%",
                fontSize: "13px",
                padding: "11px 5px",
              }}
            >
              Tag
            </th>

            <th
              style={{
                width: "15%",
                fontSize: "13px",
                padding: "11px 5px",
              }}
            >
              Name
            </th>

            <th
              style={{
                width: "13%",
                fontSize: "13px",
                padding: "11px 5px",
              }}
            >
              Breed
            </th>

            <th
              style={{
                width: "10%",
                fontSize: "13px",
                padding: "11px 5px",
              }}
            >
              Sex
            </th>

            <th
              style={{
                width: "12%",
                fontSize: "13px",
                padding: "11px 5px",
              }}
            >
              Birth Date
            </th>

            <th
              style={{
                width: "10%",
                fontSize: "13px",
                padding: "11px 5px",
              }}
            >
              Weight
            </th>

            <th
              style={{
                width: "12%",
                fontSize: "13px",
                padding: "11px 5px",
              }}
            >
              Status
            </th>

            <th
              style={{
                width: "20%",
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
                    whiteSpace: "nowrap",
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
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
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
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {goat.breed || "-"}
                </td>

                <td
                  style={{
                    padding: "11px 5px",
                    textAlign: "center",
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {goat.sex || "-"}
                </td>

                <td
                  style={{
                    padding: "11px 5px",
                    textAlign: "center",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
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
                    whiteSpace: "nowrap",
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
                      background:
                        goat.status ===
                        "Healthy"
                          ? "#4CAF50"
                          : goat.status ===
                            "Sick"
                          ? "#E53935"
                          : goat.status ===
                            "Sold"
                          ? "#1565C0"
                          : "#FB8C00",
                      color: "white",
                      padding: "6px 8px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {goat.status ||
                      "Unknown"}
                  </span>
                </td>

                <td
                  style={{
                    padding: "9px 4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "center",
                      alignItems: "center",
                      gap: "4px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Link
                      className="button"
                      to={`/goats/${goat.id}`}
                      style={{
                        padding:
                          "6px 8px",
                        fontSize: "11px",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      👁 View
                    </Link>

                    <Link
                      className="button"
                      to={`/goats/edit/${goat.id}`}
                      style={{
                        padding:
                          "6px 8px",
                        fontSize: "11px",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      ✏ Edit
                    </Link>

                    <button
                      type="button"
                      className="button"
                      onClick={() =>
                        deleteGoat(
                          goat.id
                        )
                      }
                      style={{
                        padding:
                          "6px 8px",
                        fontSize: "11px",
                        background:
                          "#D32F2F",
                        color: "white",
                        border: "none",
                        whiteSpace:
                          "nowrap",
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
  );
}

export default GoatTable;