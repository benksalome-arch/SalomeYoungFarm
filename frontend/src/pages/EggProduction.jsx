import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EggProduction() {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      const response = await fetch(
        `${API_URL}/api/egg-production`
      );

      const data = await response.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteRecord(id) {
    if (!window.confirm(t("deleteRecordConfirm"))) return;

    try {
      const response = await fetch(
        `${API_URL}/api/egg-production/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      alert(data.message);

      loadRecords();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1>🥚 {t("eggProduction")}</h1>
          <p>{t("dailyEggCollection")}</p>
        </div>

        <Link className="button" to="/egg-production/add">
          ➕ {t("recordProduction")}
        </Link>
      </div>

      <div className="card">
        <table
          className="table"
          style={{
            tableLayout: "fixed",
            width: "100%",
          }}
        >
          <colgroup>
            <col style={{ width: "18%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "30%" }} />
          </colgroup>

          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>{t("date")}</th>
              <th style={{ textAlign: "center" }}>{t("chicken")}</th>
              <th style={{ textAlign: "center" }}>{t("eggs")}</th>
              <th style={{ textAlign: "center" }}>{t("broken")}</th>
              <th style={{ textAlign: "center" }}>{t("actions")}</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  {t("noEggProductionRecords")}
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td style={{ textAlign: "center" }}>
                    {record.production_date?.split("T")[0]}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {record.name || record.tag_number}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {record.eggs_collected}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {record.cracked_eggs ?? 0}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Link
                      to={`/egg-production/${record.id}/edit`}
                      className="button"
                      style={{
                        textDecoration: "none",
                        marginRight: "8px",
                      }}
                    >
                      ✏️ {t("edit")}
                    </Link>

                    <button
                      className="button"
                      onClick={() => deleteRecord(record.id)}
                    >
                      🗑 {t("delete")}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EggProduction;
