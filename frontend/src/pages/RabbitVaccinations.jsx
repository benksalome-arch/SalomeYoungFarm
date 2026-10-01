import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function RabbitVaccinations() {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVaccinations();
  }, []);

  async function loadVaccinations() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/rabbit-vaccinations`
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

  function formatDate(value) {
    if (!value) return "-";

    const valueString = String(value);

    const match = valueString.match(
      /^(\d{4})-(\d{2})-(\d{2})/
    );

    if (match) {
      return `${match[3]}-${match[2]}-${match[1]}`;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("nl-NL");
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
        `${API_URL}/api/rabbit-vaccinations/${id}`,
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

      alert("Failed to delete vaccination.");
    }
  }

  const cellStyle = {
    padding: "16px 14px",
    verticalAlign: "middle",
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

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
          <h1>
            💉 {t("rabbitVaccinations")}
          </h1>

          <p>
            {t("rabbitVaccinationDescription")}
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
            ➕ {t("recordVaccination")}
          </Link>

          <Link
            className="button"
            to="/rabbits"
          >
            ← {t("back")}
          </Link>
        </div>
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
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: "40px 15px",
                    textAlign: "center",
                  }}
                >
                  {t("loadingVaccinationRecords")}
                </td>
              </tr>
            ) : records.length === 0 ? (
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
                    {formatDate(
                      record.vaccination_date
                    )}
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
                    {formatDate(
                      record.next_due_date
                    )}
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
                        to={`/rabbit-vaccinations/${record.id}/edit`}
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
                        onClick={() =>
                          deleteRecord(record.id)
                        }
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
        {loading ? (
          <div className="card vaccination-mobile-empty">
            {t("loadingVaccinationRecords")}
          </div>
        ) : records.length === 0 ? (
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
                <span>
                  {formatDate(
                    record.vaccination_date
                  )}
                </span>
              </div>

              <div className="vaccination-mobile-row">
                <strong>{t("tag")}</strong>
                <span>
                  {record.tag_number || "-"}
                </span>
              </div>

              <div className="vaccination-mobile-row">
                <strong>{t("name")}</strong>
                <span>
                  {record.name || "-"}
                </span>
              </div>

              <div className="vaccination-mobile-row">
                <strong>{t("vaccine")}</strong>
                <span>
                  {record.vaccine_name || "-"}
                </span>
              </div>

              <div className="vaccination-mobile-row">
                <strong>{t("nextDueDate")}</strong>
                <span>
                  {formatDate(
                    record.next_due_date
                  )}
                </span>
              </div>

              <div className="vaccination-mobile-actions">
                <Link
                  className="button"
                  to={`/rabbit-vaccinations/${record.id}/edit`}
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
                  onClick={() =>
                    deleteRecord(record.id)
                  }
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
            grid-template-columns: minmax(145px, 1fr) minmax(0, 1.2fr);
            gap: 14px;
            align-items: start;
            margin-bottom: 13px;
            min-width: 0;
          }

          .vaccination-mobile-row strong {
            font-size: 14px;
            color: #222;
            text-align: left;
            line-height: 1.35;
          }

          .vaccination-mobile-row span {
            min-width: 0;
            overflow-wrap: anywhere;
            font-size: 15px;
            color: #555;
            text-align: left;
            line-height: 1.35;
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

export default RabbitVaccinations;
