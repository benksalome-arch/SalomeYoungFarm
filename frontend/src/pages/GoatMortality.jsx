import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const API_URL =
  import.meta.env.VITE_API_URL || "";

function formatDate(date) {
  if (!date) return "-";

  const parts = date.split("T")[0].split("-");

  if (parts.length !== 3) return date;

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

export default function GoatMortality() {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecords = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/goat-mortality`
      );

      if (!response.ok) {
        throw new Error("Failed to load goat mortality");
      }

      const data = await response.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Load goat mortality error:",
        error
      );
      alert(t("failedLoadGoatMortality"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t("confirmDelete"))) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/goat-mortality/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            t("failedDeleteGoatMortality")
        );
        return;
      }

      await loadRecords();
    } catch (error) {
      console.error(
        "Delete goat mortality error:",
        error
      );
      alert(t("failedDeleteGoatMortality"));
    }
  };

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "20px",
      }}
    >
      <style>{`
        .goat-mortality-desktop-table {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .goat-mortality-desktop-table table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .goat-mortality-desktop-table th,
        .goat-mortality-desktop-table td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          text-align: left;
          vertical-align: top;
          overflow-wrap: anywhere;
        }

        .goat-mortality-desktop-table th {
          font-weight: 600;
        }

        .goat-mortality-desktop-table th:nth-child(1),
        .goat-mortality-desktop-table td:nth-child(1) {
          width: 115px;
        }

        .goat-mortality-desktop-table th:nth-child(2),
        .goat-mortality-desktop-table td:nth-child(2) {
          width: 150px;
        }

        .goat-mortality-desktop-table th:nth-child(3),
        .goat-mortality-desktop-table td:nth-child(3) {
          width: 160px;
        }

        .goat-mortality-desktop-table th:nth-child(5),
        .goat-mortality-desktop-table td:nth-child(5) {
          width: 150px;
        }

        .goat-mortality-mobile-list {
          display: none;
        }

        .goat-mortality-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 14px;
          margin-bottom: 12px;
          background: #fff;
        }

        .goat-mortality-card-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
        }

        .goat-mortality-card-label {
          font-weight: 600;
          color: #222;
          flex: 0 0 auto;
        }

        .goat-mortality-card-value {
          color: #222;
          text-align: right;
          overflow-wrap: anywhere;
        }

        @media (max-width: 700px) {
          .goat-mortality-desktop-table {
            display: none;
          }

          .goat-mortality-mobile-list {
            display: block;
          }
        }
      `}</style>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#222",
              WebkitTextFillColor: "#222",
            }}
          >
            💀 {t("goatMortality")}
          </h1>

          <Link
            className="button"
            to="/goat-mortality/add"
          >
            ➕ {t("recordGoatMortality")}
          </Link>
        </div>

        <div className="card">
          {loading ? (
            <p>{t("loading")}</p>
          ) : records.length === 0 ? (
            <p
              style={{
                color: "#222",
                WebkitTextFillColor: "#222",
              }}
            >
              {t("noGoatMortalityRecords")}
            </p>
          ) : (
            <>
              <div className="goat-mortality-desktop-table">
                <table>
                  <thead>
                    <tr>
                      <th>{t("mortalityDate")}</th>
                      <th>{t("tag")}</th>
                      <th>{t("name")}</th>
                      <th>{t("cause")}</th>
                      <th>{t("actions")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id}>
                        <td>
                          {formatDate(
                            record.mortality_date
                          )}
                        </td>

                        <td>
                          {record.tag || "-"}
                        </td>

                        <td>
                          {record.name || "-"}
                        </td>

                        <td>
                          {record.cause || "-"}
                        </td>

                        <td>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link
                          className="button"
                          to={`/goat-mortality/${record.id}/edit`}
                          style={{
                            padding: "8px 10px",
                            fontSize: "13px",
                            background: "#2e7d32",
                            color: "#fff",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ✏️ {t("edit", "Edit")}
                        </Link>

                        <button
                          className="button"
                          type="button"
                          onClick={() => handleDelete(record.id)}
                          style={{
                            padding: "8px 10px",
                            fontSize: "13px",
                            background: "#d32f2f",
                            color: "#fff",
                            border: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          🗑️ {t("delete")}
                        </button>
                      </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="goat-mortality-mobile-list">
                {records.map((record) => (
                  <div
                    className="goat-mortality-card"
                    key={record.id}
                  >
                    <div className="goat-mortality-card-row">
                      <span className="goat-mortality-card-label">
                        {t("mortalityDate")}
                      </span>
                      <span className="goat-mortality-card-value">
                        {formatDate(
                          record.mortality_date
                        )}
                      </span>
                    </div>

                    <div className="goat-mortality-card-row">
                      <span className="goat-mortality-card-label">
                        {t("tag")}
                      </span>
                      <span className="goat-mortality-card-value">
                        {record.tag || "-"}
                      </span>
                    </div>

                    <div className="goat-mortality-card-row">
                      <span className="goat-mortality-card-label">
                        {t("name")}
                      </span>
                      <span className="goat-mortality-card-value">
                        {record.name || "-"}
                      </span>
                    </div>

                    <div className="goat-mortality-card-row">
                      <span className="goat-mortality-card-label">
                        {t("cause")}
                      </span>
                      <span className="goat-mortality-card-value">
                        {record.cause || "-"}
                      </span>
                    </div>

                    {record.notes && (
                      <div className="goat-mortality-card-row">
                        <span className="goat-mortality-card-label">
                          {t("notes")}
                        </span>
                        <span className="goat-mortality-card-value">
                          {record.notes}
                        </span>
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "12px",
                      }}
                    >
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link
                          className="button"
                          to={`/goat-mortality/${record.id}/edit`}
                          style={{
                            padding: "8px 10px",
                            fontSize: "13px",
                            background: "#2e7d32",
                            color: "#fff",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ✏️ {t("edit", "Edit")}
                        </Link>

                        <button
                          className="button"
                          type="button"
                          onClick={() => handleDelete(record.id)}
                          style={{
                            padding: "8px 10px",
                            fontSize: "13px",
                            background: "#d32f2f",
                            color: "#fff",
                            border: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          🗑️ {t("delete")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
