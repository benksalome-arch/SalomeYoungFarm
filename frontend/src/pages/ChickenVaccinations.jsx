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

  const cellStyle = {
    padding: "14px 12px",
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
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: "16%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "19%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "23%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ ...cellStyle, textAlign: "center", whiteSpace: "nowrap" }}>
                {t("date")}
              </th>
              <th style={{ ...cellStyle, textAlign: "center", whiteSpace: "nowrap" }}>
                {t("tag")}
              </th>
              <th style={{ ...cellStyle, textAlign: "left", whiteSpace: "nowrap" }}>
                {t("name")}
              </th>
              <th style={{ ...cellStyle, textAlign: "left", whiteSpace: "nowrap" }}>
                {t("vaccine")}
              </th>
              <th style={{ ...cellStyle, textAlign: "center", whiteSpace: "nowrap" }}>
                {t("nextDueDate")}
              </th>
              <th style={{ ...cellStyle, textAlign: "center", whiteSpace: "nowrap" }}>
                {t("actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: "40px 15px", textAlign: "center" }}>
                  {t("noVaccinationRecords")}
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td style={{ ...cellStyle, textAlign: "center", whiteSpace: "nowrap" }}>
                    {record.vaccination_date
                      ? new Date(record.vaccination_date + "T00:00:00").toLocaleDateString("nl-NL")
                      : "-"}
                  </td>
                  <td style={{ ...cellStyle, textAlign: "center", whiteSpace: "nowrap" }}>
                    {record.tag_number || "-"}
                  </td>
                  <td style={{ ...cellStyle, textAlign: "left" }}>
                    {record.name || "-"}
                  </td>
                  <td style={{ ...cellStyle, textAlign: "left" }}>
                    {record.vaccine_name || "-"}
                  </td>
                  <td style={{ ...cellStyle, textAlign: "center", whiteSpace: "nowrap" }}>
                    {record.next_due_date
                      ? new Date(record.next_due_date + "T00:00:00").toLocaleDateString("nl-NL")
                      : "-"}
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
            <div className="card vaccination-mobile-card" key={record.id}>
              <div className="vaccination-mobile-row">
                <strong>{t("date")}</strong>
                <span>
                  {record.vaccination_date
                    ? new Date(
                        record.vaccination_date + "T00:00:00"
                      ).toLocaleDateString("nl-NL")
                    : "-"}
                </span>
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
                <span>
                  {record.next_due_date
                    ? new Date(
                        record.next_due_date + "T00:00:00"
                      ).toLocaleDateString("nl-NL")
                    : "-"}
                </span>
              </div>

              <div
                className="vaccination-mobile-actions"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  className="button"
                  to={`/chicken-vaccinations/${record.id}/edit`}
                  style={{
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
          overflow: hidden;
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
            grid-template-columns: 105px minmax(0, 1fr);
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
            margin-top: 14px;
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