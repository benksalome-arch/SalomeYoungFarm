import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function ChickenMortality() {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      const response = await fetch(
        `${API_URL}/api/chicken-mortality`
      );

      const data = await response.json();
      setRecords(data);

    } catch (err) {
      console.error(err);
    }
  }

  async function deleteRecord(id) {

    if (!window.confirm(t("deleteMortalityConfirm"))) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/api/chicken-mortality/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        loadRecords();
      }

    } catch (err) {
      console.error(err);
      alert(t("failedDeleteRecord"));
    }

  }

  const totalDeaths = records.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  const mobileStyles = `
    .mortality-mobile-list {
      display: none;
    }

    @media (max-width: 700px) {
      .mortality-desktop-table {
        display: none !important;
      }

      .mortality-mobile-list {
        display: block;
      }

      .mortality-mobile-card {
        border: 1px solid #e1e5e1;
        border-radius: 10px;
        padding: 14px;
        margin-bottom: 12px;
        background: #fff;
      }

      .mortality-mobile-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 8px;
        line-height: 1.35;
      }

      .mortality-mobile-label {
        font-weight: 600;
        color: #222;
        flex: 0 0 auto;
      }

      .mortality-mobile-value {
        color: #222;
        text-align: right;
        overflow-wrap: anywhere;
      }

      .mortality-mobile-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 12px;
      }
    }
  `;

  return (
    <>
      <style>{mobileStyles}</style>
      <div className="page">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              lineHeight: "1.2",
              display: "block",
            }}
          >
            🐔 {t("chickenMortality")}
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: "16px",
              lineHeight: "1.5",
              display: "block",
            }}
          >
            {t("chickenMortalityDescription")}
          </p>
        </div>

        <Link
          className="button"
          to="/chicken-mortality/add"
          style={{
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          ➕ {t("recordMortality")}
        </Link>
      </div>

      <div
        className="card"
        style={{
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <h3 style={{ margin: 0 }}>
          {t("totalDeaths")}
        </h3>

        <h2 style={{ margin: "8px 0 0" }}>
          {totalDeaths}
        </h2>
      </div>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <div className="mortality-desktop-table">
        <table
          className="table"
          style={{
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            tableLayout: "fixed",
            borderCollapse: "collapse",
            boxSizing: "border-box",
          }}
        >
          <colgroup>
            <col style={{ width: "17%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "21%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>

          <thead>
            <tr>
              <th
                style={{
                  padding: "12px 10px",
                  textAlign: "left",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                }}
              >
                {t("date")}
              </th>

              <th
                style={{
                  padding: "12px 10px",
                  textAlign: "center",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                }}
              >
                {t("tag")}
              </th>

              <th
                style={{
                  padding: "12px 10px",
                  textAlign: "left",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                }}
              >
                {t("name")}
              </th>

              <th
                style={{
                  padding: "12px 10px",
                  textAlign: "center",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                }}
              >
                {t("quantity")}
              </th>

              <th
                style={{
                  padding: "12px 10px",
                  textAlign: "left",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                }}
              >
                {t("cause")}
              </th>

              <th
                style={{
                  padding: "12px 10px",
                  textAlign: "center",
                  boxSizing: "border-box",
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
                    padding: "30px 10px",
                    textAlign: "center",
                    boxSizing: "border-box",
                  }}
                >
                  {t("noMortalityRecords")}
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>

                  <td
                    style={{
                      padding: "12px 10px",
                      textAlign: "left",
                      verticalAlign: "middle",
                      boxSizing: "border-box",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.mortality_date?.split("T")[0] || "-"}
                  </td>

                  <td
                    style={{
                      padding: "12px 10px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      boxSizing: "border-box",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.tag_number || "-"}
                  </td>

                  <td
                    style={{
                      padding: "12px 10px",
                      textAlign: "left",
                      verticalAlign: "middle",
                      boxSizing: "border-box",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.name || "-"}
                  </td>

                  <td
                    style={{
                      padding: "12px 10px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      boxSizing: "border-box",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.quantity ?? 0}
                  </td>

                  <td
                    style={{
                      padding: "12px 10px",
                      textAlign: "left",
                      verticalAlign: "middle",
                      boxSizing: "border-box",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.cause || "-"}
                  </td>

                  <td
                    style={{
                      padding: "8px 10px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      boxSizing: "border-box",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <button
                      className="button"
                      onClick={() => deleteRecord(record.id)}
                      style={{
                        whiteSpace: "nowrap",
                      }}
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

        <div className="mortality-mobile-list">
          {records.length === 0 ? (
            <div
              style={{
                padding: "30px 10px",
                textAlign: "center",
                color: "#666",
              }}
            >
              {t("noMortalityRecords")}
            </div>
          ) : (
            records.map((record) => (
              <div className="mortality-mobile-card" key={record.id}>
                <div className="mortality-mobile-row">
                  <span className="mortality-mobile-label">{t("date")}</span>
                  <span className="mortality-mobile-value">
                    {record.mortality_date?.split("T")[0] || "-"}
                  </span>
                </div>

                <div className="mortality-mobile-row">
                  <span className="mortality-mobile-label">{t("tag")}</span>
                  <span className="mortality-mobile-value">
                    {record.tag_number || "-"}
                  </span>
                </div>

                <div className="mortality-mobile-row">
                  <span className="mortality-mobile-label">{t("name")}</span>
                  <span className="mortality-mobile-value">
                    {record.name || "-"}
                  </span>
                </div>

                <div className="mortality-mobile-row">
                  <span className="mortality-mobile-label">{t("quantity")}</span>
                  <span className="mortality-mobile-value">
                    {record.quantity ?? 0}
                  </span>
                </div>

                <div className="mortality-mobile-row">
                  <span className="mortality-mobile-label">{t("cause")}</span>
                  <span className="mortality-mobile-value">
                    {record.cause || "-"}
                  </span>
                </div>

                <div className="mortality-mobile-actions">
                  <button
                    className="button"
                    onClick={() => deleteRecord(record.id)}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    🗑 {t("delete")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
    </>
  );
}
export default ChickenMortality;
