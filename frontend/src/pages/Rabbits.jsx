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
        `${API_URL}/api/rabbits`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
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
    if (!window.confirm(t("deleteRabbitConfirm"))) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/rabbits/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            t("failedToDeleteRabbit")
        );
        return;
      }

      alert(
        data.message ||
          t("rabbitDeletedSuccessfully")
      );

      loadRabbits();
    } catch (err) {
      console.error(err);
      alert(t("failedToDeleteRabbit"));
    }
  }

  const rabbitMobileStyles = `
    .rabbit-mobile-list {
      display: none;
    }

    @media (max-width: 700px) {
      .rabbit-desktop-table {
        width: 100% !important;
        max-width: 100% !important;
        border-collapse: separate !important;
        border-spacing: 0 !important;
        table-layout: auto !important;
        font-size: 16px !important;
      }

      .rabbit-desktop-table th {
        padding: 14px 12px !important;
        font-size: 15px !important;
        font-weight: 700 !important;
        line-height: 1.3 !important;
        text-align: left !important;
        vertical-align: middle !important;
        white-space: nowrap !important;
      }

      .rabbit-desktop-table td {
        padding: 15px 12px !important;
        font-size: 16px !important;
        line-height: 1.4 !important;
        vertical-align: middle !important;
      }

      .rabbit-desktop-table tbody tr {
        min-height: 58px;
      }

      .rabbit-desktop-table td:last-child {
        min-width: 230px !important;
      }

      .rabbit-desktop-table td:last-child > div {
        display: flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
        gap: 8px !important;
        flex-wrap: nowrap !important;
        min-width: 0 !important;
      }

      .rabbit-desktop-table td:last-child button,
      .rabbit-desktop-table td:last-child a {
        min-height: 38px !important;
        padding: 8px 12px !important;
        font-size: 14px !important;
        white-space: nowrap !important;
        cursor: pointer !important;
      }

      .rabbit-desktop-table td:nth-child(1),
      .rabbit-desktop-table td:nth-child(4),
      .rabbit-desktop-table td:nth-child(5),
      .rabbit-desktop-table td:nth-child(6) {
        text-align: center !important;
      }

      .rabbit-desktop-table .rabbit-status {
        font-size: 13px !important;
        padding: 6px 10px !important;
      }


      .rabbit-desktop-table th {
        font-size: 15px !important;
        font-weight: 700 !important;
        padding: 13px 12px !important;
        text-align: left !important;
        vertical-align: middle !important;
        white-space: nowrap;
      }

      .rabbit-desktop-table td {
        font-size: 16px !important;
        padding: 14px 12px !important;
        text-align: left !important;
        vertical-align: middle !important;
        line-height: 1.35 !important;
        white-space: normal !important;
      }

      .rabbit-desktop-table th:nth-child(1),
      .rabbit-desktop-table td:nth-child(1) {
        width: 11%;
      }

      .rabbit-desktop-table th:nth-child(2),
      .rabbit-desktop-table td:nth-child(2) {
        width: 17%;
      }

      .rabbit-desktop-table th:nth-child(3),
      .rabbit-desktop-table td:nth-child(3) {
        width: 16%;
      }

      .rabbit-desktop-table th:nth-child(4),
      .rabbit-desktop-table td:nth-child(4) {
        width: 11%;
      }

      .rabbit-desktop-table th:nth-child(5),
      .rabbit-desktop-table td:nth-child(5) {
        width: 10%;
      }

      .rabbit-desktop-table th:nth-child(6),
      .rabbit-desktop-table td:nth-child(6) {
        width: 12%;
      }

      .rabbit-desktop-table th:nth-child(7),
      .rabbit-desktop-table td:nth-child(7) {
        width: 23%;
      }

      .rabbit-mobile-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .rabbit-mobile-card {
        background: #fff;
        border-radius: 14px;
        padding: 18px;
        box-sizing: border-box;
        width: 100%;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
        border-left: 4px solid #4CAF50;
      }

      .rabbit-mobile-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
      }

      .rabbit-mobile-info {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        margin-bottom: 16px;
      }

      .rabbit-mobile-info > div {
        background: #f6f8f6;
        border-radius: 10px;
        padding: 12px 8px;
        text-align: center;
        min-width: 0;
        box-sizing: border-box;
      }

      .rabbit-mobile-info span {
        display: block;
        font-size: 12px;
        color: #777;
        margin-bottom: 5px;
      }

      .rabbit-mobile-info strong {
        display: block;
        font-size: 15px;
        color: #555;
        overflow-wrap: anywhere;
      }

      .rabbit-mobile-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .rabbit-mobile-actions .button {
        flex: 1 1 0;
        min-width: 0;
        text-align: center;
        padding: 9px 7px;
        box-sizing: border-box;
        white-space: nowrap;
      }
    }
  `;

  return (
    <>
      <style>{rabbitMobileStyles}</style>
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
              color: "#222",
              WebkitTextFillColor: "#222",
            }}
          >
            🐇 {t("rabbits")}
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#222",
              WebkitTextFillColor: "#222",
            }}
          >
            {t("rabbitManagementDescription")}
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
          className="table rabbit-desktop-table"
          style={{
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          <colgroup>
            <col style={{ width: "11%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "26%" }} />
          </colgroup>

          <thead>
            <tr>
              <th
                style={{
                  padding: "10px 5px",

                  whiteSpace: "nowrap",
                }}
              >
                {t("tag")}
              </th>

              <th
                style={{
                  padding: "10px 5px",

                  whiteSpace: "nowrap",
                }}
              >
                {t("name")}
              </th>

              <th
                style={{
                  padding: "10px 5px",

                  whiteSpace: "nowrap",
                }}
              >
                {t("breed")}
              </th>

              <th
                style={{
                  padding: "10px 5px",

                  whiteSpace: "nowrap",
                }}
              >
                {t("sex")}
              </th>

              <th
                style={{
                  padding: "10px 5px",

                  whiteSpace: "nowrap",
                }}
              >
                {t("quantity")}
              </th>

              <th
                style={{
                  padding: "10px 5px",

                  whiteSpace: "nowrap",
                }}
              >
                {t("status")}
              </th>

              <th
                style={{
                  padding: "10px 5px",

                  whiteSpace: "nowrap",
                }}
              >
                {t("actions")}
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
                      boxSizing: "border-box",
                      textAlign: "center",

                      whiteSpace: "nowrap",
                    }}
                  >
                    {rabbit.tag_number || "-"}
                  </td>

                  <td
                    style={{
                      padding: "10px 5px",

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
                      boxSizing: "border-box",
                      textAlign: "center",

                      whiteSpace: "nowrap",
                    }}
                  >
                    {rabbit.sex || "-"}
                  </td>

                  <td
                    style={{
                      padding: "10px 5px",
                      boxSizing: "border-box",
                      textAlign: "center",

                      whiteSpace: "nowrap",
                    }}
                  >
                    {rabbit.quantity ?? 0}
                  </td>

                  <td
                    style={{
                      padding: "10px 5px",
                      boxSizing: "border-box",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        background:
                          rabbit.status === "Healthy" || rabbit.status === "Active"
                            ? "#4CAF50"
                            : rabbit.status === "Sick"
                              ? "#E53935"
                              : rabbit.status === "Sold"
                                ? "#1565C0"
                                : "#FB8C00",
                        color: "white",
                        padding: "5px 7px",
                        borderRadius: "20px",

                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {rabbit.status === "Healthy"
                        ? t("healthy")
                        : rabbit.status === "Sick"
                          ? t("sick")
                          : rabbit.status === "Sold"
                            ? t("sold")
                            : rabbit.status || t("unknown")}
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
                        gap: "6px",
                        flexWrap: "nowrap",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      <Link
                        className="button"
                        to={`/rabbits/${rabbit.id}`}
                        style={{
                          padding: "5px 7px",

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

                          background: "#D32F2F",
                          color: "white",
                          border: "none",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                      padding: "8px 18px",
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

        <div className="rabbit-mobile-list">
          {rabbits.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "30px 10px",
                color: "#222",
                WebkitTextFillColor: "#222",
              }}
            >
              {t("noRabbitsFound")}
            </div>
          ) : (
            rabbits.map((rabbit) => (
              <div
                key={rabbit.id}
                className="rabbit-mobile-card"
              >
                <div className="rabbit-mobile-header">
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "21px",
                        fontWeight: 600,
                        color: "#222",
                        WebkitTextFillColor: "#222",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {rabbit.name || "-"}
                    </div>
                  </div>

                  <span
                    style={{
                      display: "inline-block",
                      background:
                        rabbit.status === "Healthy" || rabbit.status === "Active"
                          ? "#4CAF50"
                          : rabbit.status === "Sick"
                            ? "#E53935"
                            : rabbit.status === "Sold"
                              ? "#1565C0"
                              : "#FB8C00",
                      color: "#fff",
                      padding: "7px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {rabbit.status === "Healthy"
                      ? t("healthy")
                      : rabbit.status === "Sick"
                        ? t("sick")
                        : rabbit.status === "Sold"
                          ? t("sold")
                          : rabbit.status || t("unknown")}
                  </span>
                </div>

                <div className="rabbit-mobile-info">
                  <div>
                    <span>{t("breed")}</span>
                    <strong>{rabbit.breed || "-"}</strong>
                  </div>

                  <div>
                    <span>{t("sex")}</span>
                    <strong>{rabbit.sex || "-"}</strong>
                  </div>

                  <div>
                    <span>{t("quantity")}</span>
                    <strong>{rabbit.quantity ?? 0}</strong>
                  </div>

                  <div>
                    <span>{t("tagNumber")}</span>
                    <strong>{rabbit.tag_number || "-"}</strong>
                  </div>
                </div>

                <div className="rabbit-mobile-actions">
                  <Link
                    className="button"
                    to={`/rabbits/${rabbit.id}`}
                  >
                    👁 {t("view")}
                  </Link>

                  <Link
                    className="button"
                    to={`/rabbits/edit/${rabbit.id}`}
                  >
                    ✏ {t("edit")}
                  </Link>

                  <button
                    type="button"
                    className="button"
                    onClick={() => deleteRabbit(rabbit.id)}
                    style={{
                      background: "#D32F2F",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px 18px",
                      letterSpacing: "normal",
                      wordSpacing: "normal",
                      whiteSpace: "nowrap",
                    }}
                  >
                    🗑 {t("delete")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default Rabbits;
