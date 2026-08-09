import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Chickens() {
  const [chickens, setChickens] = useState([]);

  useEffect(() => {
    loadChickens();
  }, []);

  async function loadChickens() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/chickens"
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        setChickens([]);
        return;
      }

      setChickens(data);
    } catch (err) {
      console.error(err);
      setChickens([]);
    }
  }

  async function deleteChicken(id) {
    if (
      !window.confirm(
        "Are you sure you want to delete this chicken?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/chickens/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete chicken."
        );
        return;
      }

      alert(
        data.message ||
          "Chicken deleted successfully."
      );

      loadChickens();
    } catch (err) {
      console.error(err);
      alert("Failed to delete chicken.");
    }
  }

  const headerStyle = {
    padding: "12px 7px",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    textAlign: "left",
  };

  const cellStyle = {
    padding: "12px 7px",
    fontSize: "12px",
    verticalAlign: "middle",
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* PAGE HEADER */}

      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "25px",
          flexWrap: "wrap",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            minWidth: 0,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              lineHeight: 1.2,
            }}
          >
            🐔 Chickens
          </h1>

          <p
            style={{
              margin: "8px 0 0",
            }}
          >
            Manage your poultry flock.
          </p>
        </div>

        <Link
          className="button"
          to="/chickens/add"
          style={{
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          ➕ Add Chicken
        </Link>
      </div>

      {/* CHICKEN TABLE */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <table
          className="table"
          style={{
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            tableLayout: "fixed",
            borderCollapse: "collapse",
            boxSizing: "border-box",
          }}
        >
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>

          <thead>
            <tr>
              <th style={headerStyle}>Tag</th>
              <th style={headerStyle}>Name</th>
              <th style={headerStyle}>Breed</th>
              <th style={headerStyle}>Type</th>
              <th style={headerStyle}>Quantity</th>
              <th style={headerStyle}>Status</th>
              <th style={headerStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {chickens.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "30px 10px",
                    fontSize: "14px",
                  }}
                >
                  No chickens found.
                </td>
              </tr>
            ) : (
              chickens.map((chicken) => (
                <tr key={chicken.id}>
                  {/* TAG */}

                  <td
                    style={{
                      ...cellStyle,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chicken.tag_number || "-"}
                  </td>

                  {/* NAME */}

                  <td
                    style={{
                      ...cellStyle,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={
                      chicken.name ||
                      chicken.tag_number ||
                      ""
                    }
                  >
                    <Link
                      to={`/chickens/${chicken.id}`}
                    >
                      <strong>
                        {chicken.name ||
                          chicken.tag_number ||
                          "-"}
                      </strong>
                    </Link>
                  </td>

                  {/* BREED */}

                  <td
                    style={{
                      ...cellStyle,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={chicken.breed || ""}
                  >
                    {chicken.breed || "-"}
                  </td>

                  {/* TYPE */}

                  <td
                    style={{
                      ...cellStyle,
                      textAlign: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={chicken.type || ""}
                  >
                    {chicken.type || "-"}
                  </td>

                  {/* QUANTITY */}

                  <td
                    style={{
                      ...cellStyle,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chicken.quantity ?? 0}
                  </td>

                  {/* STATUS */}

                  <td
                    style={{
                      ...cellStyle,
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        background:
                          chicken.status ===
                          "Healthy"
                            ? "#4CAF50"
                            : chicken.status ===
                              "Sick"
                            ? "#E53935"
                            : chicken.status ===
                              "Sold"
                            ? "#1565C0"
                            : "#FB8C00",
                        color: "white",
                        padding: "6px 8px",
                        borderRadius: "20px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {chicken.status ||
                        "Unknown"}
                    </span>
                  </td>

                  {/* ACTIONS */}

                  <td
                    style={{
                      padding: "8px 4px",
                      verticalAlign: "middle",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "4px",
                        flexWrap: "wrap",
                      }}
                    >
                      <Link
                        className="button"
                        to={`/chickens/${chicken.id}`}
                        style={{
                          padding: "6px 7px",
                          fontSize: "10px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        👁 View
                      </Link>

                      <Link
                        className="button"
                        to={`/chickens/edit/${chicken.id}`}
                        style={{
                          padding: "6px 7px",
                          fontSize: "10px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ✏ Edit
                      </Link>

                      <button
                        type="button"
                        className="button"
                        onClick={() =>
                          deleteChicken(
                            chicken.id
                          )
                        }
                        style={{
                          padding: "6px 7px",
                          fontSize: "10px",
                          background: "#D32F2F",
                          color: "white",
                          border: "none",
                          whiteSpace: "nowrap",
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
    </div>
  );
}

export default Chickens;