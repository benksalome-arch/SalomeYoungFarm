import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Kidding() {
  const { t } = useLanguage();
  const navigate = useNavigate();

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

  return (
    <div className="page">
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
          <Link className="button" to="/kidding/add">
            ➕ {t("newKidding")}
          </Link>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Kidding;
