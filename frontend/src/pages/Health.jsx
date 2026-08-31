import API_URL from "../api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Health() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/health/${id}`)
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch(console.error);
  }, [id]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>💉 {t("healthRecords")}</h1>
        <p>{t("vaccinationsDewormingTreatmentHistory")}</p>
      </div>

      <div className="card">
        {/* ACTIONS */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <Link className="button" to={`/goats/${id}`}>
            ← {t("back")} to Goat
          </Link>

          <Link className="button" to={`/goats/${id}/health/add`}>
            ➕ Add Health Record
          </Link>
        </div>

        {/* MOBILE-FRIENDLY RECORDS */}
        {records.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "30px 15px",
              color: "#666",
            }}
          >
            No health records found.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {records.map((record) => (
              <div
                key={record.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "16px",
                  background: "#fff",
                  boxSizing: "border-box",
                  width: "100%",
                }}
              >
                {/* DATE + TYPE */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "10px",
                    marginBottom: "14px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#777",
                        marginBottom: "4px",
                      }}
                    >
                      DATE
                    </div>

                    <strong style={{ fontSize: "16px" }}>
                      {record.record_date || "-"}
                    </strong>
                  </div>

                  <div
                    style={{
                      background: "#e8f5e9",
                      color: "#2e7d32",
                      padding: "6px 10px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    {record.record_type || "-"}
                  </div>
                </div>

                {/* DETAILS */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "12px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#777",
                        marginBottom: "3px",
                      }}
                    >
                      MEDICINE
                    </div>
                    <div>{record.medicine || "-"}</div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#777",
                        marginBottom: "3px",
                      }}
                    >
                      DOSAGE
                    </div>
                    <div>{record.dosage || "-"}</div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#777",
                        marginBottom: "3px",
                      }}
                    >
                      VETERINARIAN
                    </div>
                    <div>{record.veterinarian || "-"}</div>
                  </div>
                </div>

                {/* NOTES */}
                {record.notes && (
                  <div
                    style={{
                      marginTop: "14px",
                      paddingTop: "12px",
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#777",
                        marginBottom: "4px",
                      }}
                    >
                      NOTES
                    </div>

                    <div
                      style={{
                        lineHeight: "1.5",
                        color: "#444",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {record.notes}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Health;
