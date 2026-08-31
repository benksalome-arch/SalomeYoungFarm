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

  return (
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

    </div>
  );
}
export default ChickenMortality;
