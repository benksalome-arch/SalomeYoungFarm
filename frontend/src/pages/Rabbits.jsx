import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Rabbits() {
  const { t } = useLanguage();
  const [rabbits, setRabbits] = useState([]);

  useEffect(() => {
    loadRabbits();
  }, []);

  async function loadRabbits() {
    try {
      const response = await fetch(
        `${API_URL}/api/rabbits`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        setRabbits([]);
        return;
      }

      setRabbits(data);
    } catch (err) {
      console.error(err);
      setRabbits([]);
    }
  }

  async function deleteRabbit(id) {
    if (!window.confirm("Delete this rabbit?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/rabbits/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete rabbit."
        );
        return;
      }

      alert(
        data.message ||
          "Rabbit deleted successfully!"
      );

      loadRabbits();
    } catch (err) {
      console.error(err);
      alert("Failed to delete rabbit.");
    }
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      {/* PAGE HEADER */}

      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              lineHeight: 1.2,
            }}
          >
            🐇 {t("rabbits")}
          </h1>

          <p
            style={{
              margin: "8px 0 0",
            }}
          >
            Manage your rabbit farm.
          </p>
        </div>

        <Link
          className="button"
          to="/rabbits/add"
          style={{
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          ➕ {t("addRabbit")}
        </Link>
      </div>

      {/* RABBIT TABLE */}

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
            boxSizing: "border-box",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: "11%",
                  padding: "10px 5px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                Tag
              </th>

              <th
                style={{
                  width: "16%",
                  padding: "10px 5px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                Name
              </th>

              <th
                style={{
                  width: "15%",
                  padding: "10px 5px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                {t("breed")}
              </th>

              <th
                style={{
                  width: "9%",
                  padding: "10px 5px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                {t("sex")}
              </th>

              <th
                style={{
                  width: "11%",
                  padding: "10px 5px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                Quantity
              </th>

              <th
                style={{
                  width: "12%",
                  padding: "10px 5px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                Status
              </th>

              <th
                style={{
                  width: "26%",
                  padding: "10px 5px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {rabbits.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "30px 10px",
                  }}
                >
                  {t("noRabbitsFound")}
                </td>
              </tr>
            ) : (
              rabbits.map((rabbit) => (
                <tr key={rabbit.id}>
                  <td
                    style={{
                      padding: "10px 5px",
                      textAlign: "center",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {rabbit.tag_number || "-"}
                  </td>

                  <td
                    style={{
                      padding: "10px 5px",
                      fontSize: "12px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={
                      rabbit.name ||
                      rabbit.tag_number ||
                      ""
                    }
                  >
                    <Link
                      to={`/rabbits/${rabbit.id}`}
                    >
                      {rabbit.name ||
                        rabbit.tag_number ||
                        "-"}
                    </Link>
                  </td>

                  <td
                    style={{
                      padding: "10px 5px",
                      fontSize: "12px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={rabbit.breed || ""}
                  >
                    {rabbit.breed || "-"}
                  </td>

                  <td
                    style={{
                      padding: "10px 5px",
                      textAlign: "center",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {rabbit.sex || "-"}
                  </td>

                  <td
                    style={{
                      padding: "10px 5px",
                      textAlign: "center",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {rabbit.quantity ?? 0}
                  </td>

                  <td
                    style={{
                      padding: "10px 5px",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        background:
                          rabbit.status ===
                          "Healthy"
                            ? "#4CAF50"
                            : rabbit.status ===
                              "Sick"
                            ? "#E53935"
                            : rabbit.status ===
                              "Sold"
                            ? "#1565C0"
                            : "#FB8C00",
                        color: "white",
                        padding: "5px 7px",
                        borderRadius: "20px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {rabbit.status ||
                        "Unknown"}
                    </span>
                  </td>

                  <td
                    style={{
                      padding: "8px 4px",
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
                        to={`/rabbits/${rabbit.id}`}
                        style={{
                          padding: "5px 7px",
                          fontSize: "10px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        👁 {t("view")}
                      </Link>

                      <Link
                        className="button"
                        to={`/rabbits/edit/${rabbit.id}`}
                        style={{
                          padding: "5px 7px",
                          fontSize: "10px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ✏ {t("edit")}
                      </Link>

                      <button
                        type="button"
                        className="button"
                        onClick={() =>
                          deleteRabbit(
                            rabbit.id
                          )
                        }
                        style={{
                          padding: "5px 7px",
                          fontSize: "10px",
                          background: "#D32F2F",
                          color: "white",
                          border: "none",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                        }}
                      >
                        🗑 {t("delete")}
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

export default Rabbits;
