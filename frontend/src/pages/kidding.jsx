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
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }

  async function openBirthRegistration() {
    try {
      const response = await fetch(`${API_URL}/api/breeding`);
      const data = await response.json();
      setBreedingRecords(Array.isArray(data) ? data : []);
      setShowBreedingSelection(true);
    } catch (error) {
      console.error(error);
    }
  }

  function formatDate(date) {
    if (!date) return "-";

    const value = String(date).slice(0, 10);
    const parts = value.split("-");

    if (parts.length === 3) {
      const [year, month, day] = parts;

      if (
        year.length === 4 &&
        month.length === 2 &&
        day.length === 2
      ) {
        return `${day}-${month}-${year}`;
      }
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  async function deleteRecord(id) {
    if (
      !window.confirm(
        "Weet je zeker dat je deze geboorteregistratie wilt verwijderen?"
      )
    ) {
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
        .kidding-selection {
          margin-top: 18px;
          padding: 20px;
          background: #f8faf8;
          border: 1px solid #dfe6df;
          border-radius: 12px;
        }

        .kidding-selection-title {
          margin: 0 0 6px;
          color: #222;
          font-size: 20px;
        }

        .kidding-selection-text {
          margin: 0 0 18px;
          color: #555;
        }

        .kidding-breeding-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .kidding-breeding-option {
          display: block;
          position: relative;
          padding: 18px 20px;
          background: #fff;
          color: #222 !important;
          -webkit-text-fill-color: #222;
          border: 1px solid #dfe5df;
          border-left: 5px solid #2e7d32;
          border-radius: 10px;
          text-decoration: none;
          box-sizing: border-box;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease,
            border-color 0.15s ease;
        }

        .kidding-breeding-option:hover {
          transform: translateY(-2px);
          border-color: #2e7d32;
          box-shadow: 0 5px 14px rgba(0, 0, 0, 0.10);
        }

        .kidding-breeding-option::after {
          content: "›";
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #2e7d32;
          font-size: 26px;
          font-weight: 400;
        }

        .kidding-breeding-parents {
          display: block;
          padding-right: 30px;
          color: #222;
          font-size: 17px;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 8px;
        }

        .kidding-breeding-date {
          display: block;
          color: #666;
          font-size: 14px;
          line-height: 1.4;
        }

        .kidding-breeding-date::before {
          content: "Datum dekking: ";
          color: #888;
        }

        .kidding-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .kidding-table {
          width: 100%;
          min-width: 760px;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .kidding-table th,
        .kidding-table td {
          padding: 12px 10px;
          vertical-align: middle;
        }

        .kidding-table th {
          text-align: center;
        }

        .kidding-table td {
          text-align: center;
        }

        .kidding-table th:nth-child(1),
        .kidding-table td:nth-child(1) {
          width: 14%;
        }

        .kidding-table th:nth-child(2),
        .kidding-table td:nth-child(2) {
          width: 15%;
        }

        .kidding-table th:nth-child(3),
        .kidding-table td:nth-child(3) {
          width: 15%;
        }

        .kidding-table th:nth-child(4),
        .kidding-table td:nth-child(4),
        .kidding-table th:nth-child(5),
        .kidding-table td:nth-child(5),
        .kidding-table th:nth-child(6),
        .kidding-table td:nth-child(6) {
          width: 10%;
        }

        .kidding-table th:nth-child(7),
        .kidding-table td:nth-child(7) {
          width: 26%;
        }

        .kidding-empty {
          padding: 28px 16px !important;
          color: #666;
          text-align: center !important;
        }

        .kidding-action-buttons {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .kidding-edit-button {
          white-space: nowrap;
          text-decoration: none;
        }

        .kidding-delete-button {
          white-space: nowrap;
          background: #d32f2f !important;
          color: #fff !important;
          border-color: #d32f2f !important;
        }

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
          padding: 8px 0;
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

        .kidding-mobile-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        @media (max-width: 700px) {
          .kidding-table-wrapper {
            display: none !important;
          }

          .kidding-mobile-list {
            display: block;
          }

          .kidding-selection {
            padding: 16px;
          }

          .kidding-breeding-list {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .kidding-breeding-option {
            padding: 16px 18px;
          }

          .kidding-mobile-actions .button {
            font-size: 13px;
          }
        }
      `}</style>

      <div className="page-header">
        <h1>🍼 {t("kiddingRecords")}</h1>
        <p>{t("allGoatBirths")}</p>

        <Link
          to="/breeding"
          className="button"
          style={{
            display: "inline-block",
            marginTop: "10px",
          }}
        >
          ← {t("backToBreeding")}
        </Link>
      </div>

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "4px",
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
          <div className="kidding-selection">
            <h3 className="kidding-selection-title">
              {t("newKidding")}
            </h3>

            <p className="kidding-selection-text">
              {t("selectBreedingRecordForBirth")}
            </p>

            {breedingRecords.length === 0 ? (
              <p style={{ color: "#555", margin: 0 }}>
                {t("noBreedingRecordsFound")}
              </p>
            ) : (
              <div className="kidding-breeding-list">
                {breedingRecords.map((breeding) => (
                  <Link
                    key={breeding.id}
                    to={`/breeding/${breeding.id}/kidding`}
                    className="kidding-breeding-option"
                  >
                    <span className="kidding-breeding-parents">
                      {breeding.doe_name || "-"} ×{" "}
                      {breeding.buck_name || "-"}
                    </span>

                    <span className="kidding-breeding-date">
                      {formatDate(breeding.mating_date)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        <div
          className="kidding-table-wrapper"
          style={{
            marginTop: showBreedingSelection ? "20px" : "0",
          }}
        >
          <table className="table kidding-table">
            <thead>
              <tr>
                <th>{t("date")}</th>
                <th>{t("doe")}</th>
                <th>{t("buck")}</th>
                <th>{t("male")}</th>
                <th>{t("female")}</th>
                <th>{t("stillborn")}</th>
                <th>Actie</th>
              </tr>
            </thead>

            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="7" className="kidding-empty">
                    {t("noKiddingRecordsFound")}
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id}>
                    <td>{formatDate(record.kidding_date)}</td>

                    <td>{record.doe_name || "-"}</td>

                    <td>{record.buck_name || "-"}</td>

                    <td>{record.male_kids ?? 0}</td>

                    <td>{record.female_kids ?? 0}</td>

                    <td>{record.stillborn ?? 0}</td>

                    <td>
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

        <div className="kidding-mobile-list">
          {records.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px",
                color: "#666",
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

                <div className="kidding-mobile-row">
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