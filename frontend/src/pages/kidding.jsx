import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Kidding() {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);

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
          <Link className="button" to="/breeding">
            ← {t("backToBreeding")}
          </Link>

          <Link className="button" to="/breeding">
            ➕ {t("newKidding")}
          </Link>
        </div>

        <div style={{ overflowX: "auto", width: "100%" }}>
          <table
            className="table"
            style={{
              width: "100%",
              minWidth: "700px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>
                  {t("date")}
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>
                  {t("doe")}
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>
                  {t("buck")}
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>
                  {t("male")}
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>
                  {t("female")}
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>
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
