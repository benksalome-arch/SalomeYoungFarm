import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function ChickenVaccinations() {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadVaccinations();
  }, []);

  async function loadVaccinations() {
    try {
      const response = await fetch(
        `${API_URL}/api/chicken-vaccinations`
      );

      const data = await response.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteRecord(id) {
    if (!window.confirm(t("deleteVaccinationConfirm"))) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/chicken-vaccinations/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        loadVaccinations();
      }
    } catch (err) {
      console.error(err);
      alert(t("failedDeleteVaccination"));
    }
  }

  // Handles both MySQL DATE values (YYYY-MM-DD)
  // and full ISO datetime values returned by the API.
  function formatDate(value) {
    if (!value) return "-";

    const valueString = String(value);

    // MySQL DATE or ISO date beginning with YYYY-MM-DD
    const match = valueString.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (match) {
      return `${match[3]}-${match[2]}-${match[1]}`;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("nl-NL");
  }

  const cellStyle = {
    padding: "16px 14px",
    verticalAlign: "middle",
  };

  return (
    <div
      className="page"
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            minWidth: 0,
            flex: "1 1 400px",
          }}
        >
          <h1
            style={{
              margin: 0,
              lineHeight: 1.2,
              fontSize: "clamp(28px, 4vw, 40px)",
            }}
          >
            💉 {t("chickenVaccinations")}
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#666",
              lineHeight: 1.5,
            }}
          >
            {t("chickenVaccinations")}
          </p>
        </div>

        <Link
          className="button"
          to="/chicken-vaccinations/add"
          style={{
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          ➕ {t("recordVaccination")}
        </Link>
      </div>

      {/* DESKTOP TABLE */}
      <div className="vaccination-desktop-table card">
        <table
          className="table"
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: "15%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>

          <thead>
            <tr>
              <th
                style={{
                  ...cellStyle,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {t("date")}
              </th>

              <th
                style={{
                  ...cellStyle,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {t("tag")}
              </th>

              <th
                style={{
                  ...cellStyle,
                  textAlign: "left",
                  whiteSpace: "nowrap",
                }}
              >
                {t("name")}
              </th>

              <th
                style={{
                  ...cellStyle,
                  textAlign: "left",
                  whiteSpace: "nowrap",
                }}
              >
                {t("vaccine")}
              </th>

              <th
                style={{
                  ...cellStyle,
                  textAlign: "center",
                  whiteSpace: "normal",
                  lineHeight: 1.3,
                }}
              >
                {t("nextDueDate")}
              </th>

              <th
                style={{
                  ...cellStyle,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {t("actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: "40px 15px",
                    textAlign: "center",
                  }}
                >
                  {t("noVaccinationRecords")}
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td
                    style={{
                      ...cellStyle,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(record.vaccination_date)}
                  </td>

                  <td
                    style={{
                      ...cellStyle,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.tag_number || "-"}
                  </td>

                  <td
                    style={{
                      ...cellStyle,
                      textAlign: "left",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {record.name || "-"}
                  </td>

                  <td
                    style={{
                      ...cellStyle,
                      textAlign: "left",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {record.vaccine_name || "-"}
                  </td>

                  <td
                    style={{
                      ...cellStyle,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(record.next_due_date)}
                  </td>

                  <td
                    style={{
                      ...cellStyle,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <Link
                        className="button"
                        to={`/chicken-vaccinations/${record.id}/edit`}
                        style={{
                          whiteSpace: "nowrap",
                          textDecoration: "none",
                        }}
                      >
                        ✏️ {t("edit")}
                      </Link>

                      <button
                        className="button"
                        type="button"
                        onClick={() => deleteRecord(record.id)}
                        style={{
                          whiteSpace: "nowrap",
                          background: "#d32f2f",
                          color: "#fff",
                          borderColor: "#d32f2f",
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

      {/* MOBILE RECORD CARDS */}
      <div className="vaccination-mobile-list">
        {records.length === 0 ? (
          <div className="card vaccination-mobile-empty">
            {t("noVaccinationRecords")}
          </div>
        ) : (
          records.map((record) => (
            <div
              className="card vaccination-mobile-card"
              key={record.id}
            >
              <div className="vaccination-mobile-row">
                <strong>{t("date")}</strong>
                <span>{formatDate(record.vaccination_date)}</span>
              </div>

              <div className="vaccination-mobile-row">
                <strong>{t("tag")}</strong>
                <span>{record.tag_number || "-"}</span>
              </div>

              <div className="vaccination-mobile-row">
                <strong>{t("name")}</strong>
                <span>{record.name || "-"}</span>
              </div>

              <div className="vaccination-mobile-row">
                <strong>{t("vaccine")}</strong>
                <span>{record.vaccine_name || "-"}</span>
              </div>

              <div className="vaccination-mobile-row">
                <strong>{t("nextDueDate")}</strong>
                <span>{formatDate(record.next_due_date)}</span>
              </div>

              <div className="vaccination-mobile-actions">
                <Link
                  className="button"
                  to={`/chicken-vaccinations/${record.id}/edit`}
                  style={{
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                  }}
                >
                  ✏️ {t("edit")}
                </Link>

                <button
                  className="button"
                  type="button"
                  onClick={() => deleteRecord(record.id)}
                  style={{
                    background: "#d32f2f",
                    color: "#fff",
                    borderColor: "#d32f2f",
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

      <style>{`
        .vaccination-mobile-list {
          display: none;
        }

        .vaccination-desktop-table {
          width: 100%;
          padding: 0;
          overflow-x: auto;
          box-sizing: border-box;
          border-radius: 12px;
        }

        .vaccination-desktop-table table {
          min-width: 900px;
        }

        .vaccination-desktop-table th {
          background: #2e7d32;
          color: white;
          font-weight: 700;
          border-bottom: none;
        }

        .vaccination-desktop-table td {
          border-bottom: 1px solid #e5e5e5;
        }

        .vaccination-desktop-table tbody tr:last-child td {
          border-bottom: none;
        }

        .vaccination-desktop-table .button {
          min-width: 105px;
          box-sizing: border-box;
        }

        @media (max-width: 700px) {
          .vaccination-desktop-table {
            display: none;
          }

          .vaccination-mobile-list {
            display: flex;
            flex-direction: column;
            gap: 14px;
            width: 100%;
          }

          .vaccination-mobile-card {
            width: 100%;
            padding: 16px;
            box-sizing: border-box;
          }

          .vaccination-mobile-row {
            display: grid;
            grid-template-columns: 125px minmax(0, 1fr);
            gap: 10px;
            align-items: start;
            margin-bottom: 11px;
            min-width: 0;
          }

          .vaccination-mobile-row strong {
            font-size: 14px;
            color: #222;
          }

          .vaccination-mobile-row span {
            min-width: 0;
            overflow-wrap: anywhere;
            font-size: 15px;
            color: #555;
          }

          .vaccination-mobile-actions {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 16px;
            padding-top: 14px;
            border-top: 1px solid #e5e5e5;
          }

          .vaccination-mobile-empty {
            padding: 30px 15px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default ChickenVaccinations;
