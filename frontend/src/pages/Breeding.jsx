import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Breeding() {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      const response = await fetch(`${API_URL}/api/breeding`);
      const data = await response.json();

      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading breeding records:", error);
      setRecords([]);
    }
  }

  async function deleteRecord(id) {
    if (!window.confirm(t("deleteBreedingRecord"))) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/breeding/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      alert(data.message || "Breeding record deleted.");

      if (response.ok) {
        loadRecords();
      }
    } catch (error) {
      console.error("Error deleting breeding record:", error);
      alert(t("failedToDeleteBreeding"));
    }
  }

  function formatDate(date) {
    if (!date) return "-";

    const value = String(date).split("T")[0];
    const parts = value.split("-");

    if (parts.length !== 3) {
      return value;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    return new Date(year, month - 1, day).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  function getStatusStyle(status) {
    if (status === "Kidded") {
      return {
        background: "#e3f2fd",
        color: "#1565c0",
      };
    }

    if (status === "Aborted") {
      return {
        background: "#ffebee",
        color: "#c62828",
      };
    }

    return {
      background: "#e8f5e9",
      color: "#176b2c",
    };
  }

  return (
    <div className="page breeding-page">

      {/* PAGE HEADER */}
      <div className="page-header">
        <h1>🧬 {t("breedingManagement")}</h1>

        <p>
          {t("breedingManagementDescription")}
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="card breeding-card">

        {/* CARD HEADER */}
        <div className="breeding-header">

          <div>
            <h2>{t("breedingRecords")}</h2>

            <p className="breeding-count">
              {records.length}{" "}
              {records.length === 1
                ? "breeding record"
                : "breeding records"}
            </p>
          </div>

          <div className="breeding-header-buttons">

            <Link
              className="button"
              to="/kidding"
            >
              🍼 {t("kiddingRecords")}
            </Link>

            <Link
              className="button"
              to="/breeding/add"
            >
              ➕ {t("newBreeding")}
            </Link>

          </div>
        </div>

        {/* EMPTY STATE */}
        {records.length === 0 ? (

          <div className="breeding-empty">
            <div className="breeding-empty-icon">
              🧬
            </div>

            <h3>{t("noBreedingRecordsFound")}</h3>

            <p>
              {t("addFirstBreedingRecord")}
            </p>

            <Link
              className="button"
              to="/breeding/add"
            >
              ➕ {t("newBreeding")}
            </Link>
          </div>

        ) : (

          /* BREEDING RECORDS */
          <div className="breeding-records">

            {records.map((record) => {

              const status =
                record.pregnancy_status || "Pregnant";

              const statusStyle =
                getStatusStyle(status);

              const translatedStatus =
                status === "Pregnant"
                  ? t("pregnant")
                  : status === "Kidded"
                  ? t("kidded")
                  : status === "Aborted"
                  ? t("aborted")
                  : status;

              return (
                <div
                  className="breeding-record"
                  key={record.id}
                >

                  {/* INFORMATION */}
                  <div className="breeding-information">

                    <div className="breeding-item">
                      <span>{t("doe")}</span>
                      <strong>
                        {record.doe_name || "-"}
                      </strong>
                    </div>

                    <div className="breeding-item">
                      <span>{t("buck")}</span>
                      <strong>
                        {record.buck_name || "-"}
                      </strong>
                    </div>

                    <div className="breeding-item">
                      <span>{t("matingDate")}</span>
                      <strong>
                        {formatDate(record.mating_date)}
                      </strong>
                    </div>

                    <div className="breeding-item">
                      <span>{t("expectedKidding")}</span>
                      <strong>
                        {formatDate(
                          record.expected_kidding
                        )}
                      </strong>
                    </div>

                    <div className="breeding-item days">
                      <span>{t("days")}</span>
                      <strong>
                        {record.pregnancy_days ?? 0}
                      </strong>
                    </div>

                    <div className="breeding-item">
                      <span>{t("status")}</span>

                      <strong>
                        <span
                          className="breeding-status"
                          style={{
                            background:
                              statusStyle.background,
                            color:
                              statusStyle.color,
                          }}
                        >
                          {translatedStatus}
                        </span>
                      </strong>
                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div className="breeding-actions">

                    <button
                      type="button"
                      className="button"
                      onClick={() =>
                        navigate(
                          `/breeding/${record.id}/kidding`
                        )
                      }
                    >
                      🍼 {t("registerKidding")}
                    </button>

                    <button
                      type="button"
                      className="button"
                      onClick={() =>
                        deleteRecord(record.id)
                      }
                    >
                      🗑 {t("delete")}
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}
      </div>

      {/* PAGE STYLES */}
      <style>{`

        .breeding-page {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          box-sizing: border-box;
        }

        .breeding-page * {
          box-sizing: border-box;
        }

        .breeding-card {
          width: 100%;
          max-width: 100%;
          overflow: hidden;
        }

        /* HEADER */

        .breeding-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
        }

        .breeding-header h2 {
          margin: 0 0 5px 0;
        }

        .breeding-count {
          margin: 0;
          color: #777;
          font-size: 14px;
        }

        .breeding-header-buttons {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .breeding-header-buttons .button {
          white-space: nowrap;
        }

        /* RECORD LIST */

        .breeding-records {
          width: 100%;
        }

        .breeding-record {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e3e3e3;
          border-radius: 12px;
          padding: 18px;
          margin-bottom: 14px;
        }

        .breeding-record:last-child {
          margin-bottom: 0;
        }

        /* INFORMATION */

        .breeding-information {
          width: 100%;
          display: grid;

          grid-template-columns:
            1fr
            1fr
            1.1fr
            1.3fr
            0.6fr
            0.9fr;

          gap: 18px;
          align-items: center;
        }

        .breeding-item {
          min-width: 0;
        }

        .breeding-item > span:first-child {
          display: block;
          color: #777;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .breeding-item strong {
          display: block;
          color: #333;
          font-size: 15px;
          font-weight: 600;
        }

        .breeding-status {
          display: inline-block;
          padding: 5px 11px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        /* ACTIONS */

        .breeding-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;

          margin-top: 18px;
          padding-top: 15px;

          border-top: 1px solid #eeeeee;
        }

        .breeding-actions .button {
          white-space: nowrap;
        }

        /* EMPTY */

        .breeding-empty {
          text-align: center;
          padding: 55px 20px;
        }

        .breeding-empty-icon {
          font-size: 45px;
          margin-bottom: 10px;
        }

        .breeding-empty h3 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .breeding-empty p {
          margin: 0 0 20px 0;
          color: #777;
        }

        /* TABLET */

        @media (max-width: 950px) {

          .breeding-information {
            grid-template-columns:
              1fr
              1fr
              1fr;
          }

        }

        /* MOBILE */

        @media (max-width: 650px) {

          .breeding-page {
            padding: 12px;
          }

          .breeding-header {
            flex-direction: column;
            align-items: stretch;
          }

          .breeding-header-buttons {
            width: 100%;
            display: flex;
            flex-direction: column;
          }

          .breeding-header-buttons .button {
            width: 100%;
            text-align: center;
          }

          .breeding-information {
            grid-template-columns:
              1fr 1fr;

            gap: 16px 12px;
          }

          .breeding-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .breeding-actions .button {
            width: 100%;
            text-align: center;
          }

        }

        @media (max-width: 420px) {

          .breeding-information {
            grid-template-columns: 1fr;
          }

        }

      `}</style>

    </div>
  );
}

export default Breeding;