import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Kidding() {
  const { t } = useLanguage();

  const [records, setRecords] = useState([]);
  const [breedingRecords, setBreedingRecords] = useState([]);
  const [showBreedingSelection, setShowBreedingSelection] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      const response = await fetch(`${API_URL}/api/kidding`);
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function openBirthRegistration() {
    try {
      const response = await fetch(`${API_URL}/api/breeding`);
      const data = await response.json();
      setBreedingRecords(data);
      setShowBreedingSelection(true);
    } catch (error) {
      console.error(error);
    }
  }

  function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  }

  async function deleteRecord(id) {
    if (!window.confirm("Weet je zeker dat je deze geboorteregistratie wilt verwijderen?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/kidding/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Verwijderen mislukt.");
        return;
      }

      loadRecords();
    } catch (error) {
      console.error(error);
      alert("Verwijderen mislukt.");
    }
  }

  return (
    <div className="page">
      <style>{`
        .kidding-mobile-list {
          display: none;
        }

        .kidding-mobile-card {
          background: #fff;
          border: 1px solid #e1e5e1;
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 12px;
          box-sizing: border-box;
        }

        .kidding-mobile-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 7px 0;
          border-bottom: 1px solid #eeeeee;
        }

        .kidding-mobile-row:last-child {
          border-bottom: none;
        }

        .kidding-mobile-label {
          font-weight: 600;
          color: #222;
          flex: 0 0 auto;
        }

        .kidding-mobile-value {
          color: #555;
          text-align: right;
          overflow-wrap: anywhere;
        }

        @media (max-width: 700px) {
          .kidding-table-wrapper {
            display: none !important;
          }

          .kidding-mobile-list {
            display: block;
          }
        }
      `}</style>

      <div className="page-header">
        <h1>🍼 {t("kiddingRecords")}</h1>
        <p>{t("allGoatBirths")}</p>
      </div>

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className="button"
            onClick={openBirthRegistration}
          >
            ➕ {t("newKidding")}
          </button>
        </div>

        {showBreedingSelection && (
          <div
            className="card"
            style={{
              marginBottom: "20px",
              background: "#fff",
            }}
          >
            <h3 style={{ color: "#222", WebkitTextFillColor: "#222" }}>
              {t("newKidding")}
            </h3>

            <p style={{ color: "#222", WebkitTextFillColor: "#222" }}>
              {t("selectBreedingRecordForBirth")}
            </p>

            {breedingRecords.length === 0 ? (
              <p style={{ color: "#222", WebkitTextFillColor: "#222" }}>
                {t("noBreedingRecordsFound")}
              </p>
            ) : (
              <div style={{ display: "grid", gap: "10px" }}>
                {breedingRecords.map((breeding) => (
                  <a
                    key={breeding.id}
                    href={`/breeding/${breeding.id}/kidding`}
                    className="button"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: "#2e7d32",
                      color: "#fff",
                      WebkitTextFillColor: "#fff",
                      border: "none",
                      textDecoration: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                      boxSizing: "border-box",
                    }}
                  >
                    {breeding.doe_name || "-"} × {breeding.buck_name || "-"}
                    {" — "}
                    {formatDate(breeding.mating_date)}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Desktop table */}
        <div
          className="kidding-table-wrapper"
          style={{ overflowX: "auto", width: "100%" }}
        >
          <table
            className="table kidding-table"
            style={{
              width: "100%",
              minWidth: "700px",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "12px 16px", textAlign: "center" }}>
                  {t("date")}
                </th>
                <th style={{ padding: "12px 16px", textAlign: "center" }}>
                  {t("doe")}
                </th>
                <th style={{ padding: "12px 16px", textAlign: "center" }}>
                  {t("buck")}
                </th>
                <th style={{ padding: "12px 16px", textAlign: "center" }}>
                  {t("male")}
                </th>
                <th style={{ padding: "12px 16px", textAlign: "center" }}>
                  {t("female")}
                </th>
                <th style={{ padding: "12px 16px", textAlign: "center" }}>
                  {t("stillborn")}
                </th>
                <th style={{ padding: "12px 16px", textAlign: "center" }}>
                  Actie
                </th>
              </tr>
            </thead>

            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "24px",
                    }}
                  >
                    {t("noKiddingRecordsFound")}
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id}>
                    <td style={{ padding: "12px 16px" }}>
                      {formatDate(record.kidding_date)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {record.doe_name || "-"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {record.buck_name || "-"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {record.male_kids ?? 0}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {record.female_kids ?? 0}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {record.stillborn ?? 0}
                    </td>
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                      <div className="kidding-action-buttons">
                        <Link
                          className="button kidding-edit-button"
                          to={`/kidding/${record.id}/edit`}
                        >
                          ✏️ {t("edit")}
                        </Link>
                        <button
                          className="button kidding-delete-button"
                          onClick={() => deleteRecord(record.id)}
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

        {/* Mobile cards */}
        <div className="kidding-mobile-list">
          {records.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px",
                color: "#222",
              }}
            >
              {t("noKiddingRecordsFound")}
            </div>
          ) : (
            records.map((record) => (
              <div className="kidding-mobile-card" key={record.id}>
                <div className="kidding-mobile-row">
                  <span className="kidding-mobile-label">
                    {t("date")}
                  </span>
                  <span className="kidding-mobile-value">
                    {formatDate(record.kidding_date)}
                  </span>
                </div>

                <div className="kidding-mobile-row">
                  <span className="kidding-mobile-label">
                    {t("doe")}
                  </span>
                  <span className="kidding-mobile-value">
                    {record.doe_name || "-"}
                  </span>
                </div>

                <div className="kidding-mobile-row">
                  <span className="kidding-mobile-label">
                    {t("buck")}
                  </span>
                  <span className="kidding-mobile-value">
                    {record.buck_name || "-"}
                  </span>
                </div>

                <div className="kidding-mobile-row">
                  <span className="kidding-mobile-label">
                    {t("male")}
                  </span>
                  <span className="kidding-mobile-value">
                    {record.male_kids ?? 0}
                  </span>
                </div>

                <div className="kidding-mobile-row">
                  <span className="kidding-mobile-label">
                    {t("female")}
                  </span>
                  <span className="kidding-mobile-value">
                    {record.female_kids ?? 0}
                  </span>
                </div>

                <div className="kidding-mobile-row">
                  <span className="kidding-mobile-label">
                    {t("stillborn")}
                  </span>
                  <span className="kidding-mobile-value">
                    {record.stillborn ?? 0}
                  </span>
                </div>

                <div className="kidding-mobile-row kidding-mobile-action-row">
                  <span className="kidding-mobile-label">
                    Actie
                  </span>
                  <span className="kidding-mobile-value kidding-mobile-actions">
                    <Link
                      className="button kidding-edit-button"
                      to={`/kidding/${record.id}/edit`}
                    >
                      ✏️ {t("edit")}
                    </Link>
                    <button
                      className="button kidding-delete-button"
                      onClick={() => deleteRecord(record.id)}
                    >
                      🗑 {t("delete")}
                    </button>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Kidding;
