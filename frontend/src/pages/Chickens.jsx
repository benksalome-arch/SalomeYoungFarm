import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Chickens() {
  const { t } = useLanguage();
  const [chickens, setChickens] = useState([]);

  useEffect(() => {
    loadChickens();
  }, []);

  async function loadChickens() {
    try {
      const response = await fetch(
        `${API_URL}/api/chickens`
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
        t("deleteChickenConfirm")
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/chickens/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            t("failedDeleteChicken")
        );
        return;
      }

      alert(
        data.message ||
          t("chickenDeletedSuccessfully")
      );

      loadChickens();
    } catch (err) {
      console.error(err);
      alert(t("failedDeleteChicken"));
    }
  }

  const headerStyle = {
    boxSizing: "border-box",
    minWidth: 0,
    padding: "12px 7px",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    textAlign: "center",
  };

  const cellStyle = {
    boxSizing: "border-box",
    minWidth: 0,
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
            🐔 {t("chickens")}
          </h1>

          <p
            style={{
              margin: "8px 0 0",
            }}
          >
            {t("managePoultryFlock")}
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
          ➕ {t("addChicken")}
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
            <col style={{ width: "17%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "22%" }} />
          </colgroup>

          <thead>
            <tr>
              <th style={headerStyle}>{t("tag")}</th>
              <th style={headerStyle}>{t("name")}</th>
              <th style={headerStyle}>{t("breed")}</th>
              <th style={headerStyle}>{t("type")}</th>
              <th style={headerStyle}>{t("quantity")}</th>
              <th style={headerStyle}>{t("status")}</th>
              <th style={headerStyle}>{t("actions")}</th>
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
                  {t("noChickensFound")}
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
                      textAlign: "center",
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
                      textAlign: "center",
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
                          String(chicken.status || "").toLowerCase() === "healthy"
                            ? "#4CAF50"
                            : String(chicken.status || "").toLowerCase() === "sick"
                            ? "#E53935"
                            : String(chicken.status || "").toLowerCase() === "sold"
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
                      {String(chicken.status || "").toLowerCase() === "healthy"
                        ? t("healthy")
                        : String(chicken.status || "").toLowerCase() === "sick"
                        ? t("sick")
                        : String(chicken.status || "").toLowerCase() === "sold"
                        ? t("sold")
                        : String(chicken.status || "").toLowerCase() === "active"
                        ? t("active")
                        : chicken.status || t("unknown")}
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
                        👁 {t("view")}
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
                        ✏ {t("edit")}
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

export default Chickens;
