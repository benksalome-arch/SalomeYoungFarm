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
      const response = await fetch(
        `${API_URL}/api/chicken-vaccinations/${id}`,
        {
          method: "DELETE",
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

      {/* TABLE CARD */}
      <div
        className="card"
        style={{
          width: "100%",
          padding: "0",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <table
            className="table"
            style={{
              width: "100%",
              minWidth: "760px",
              borderCollapse: "collapse",
              tableLayout: "auto",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    ...cellStyle,
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("date")}
                </th>

                <th
                  style={{
                    ...cellStyle,
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("tag")}
                </th>

                <th
                  style={{
                    ...cellStyle,
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("name")}
                </th>

                <th
                  style={{
                    ...cellStyle,
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("vaccine")}
                </th>

                <th
                  style={{
                    ...cellStyle,
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("nextDueDate")}
                </th>

                <th
                  style={{
                    ...cellStyle,
                    textAlign: "center",
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
                      padding: "40px 15px",
                      textAlign: "center",
                    }}
                  >
                    {t("noVaccinationRecords")}
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id}>
                    <td style={cellStyle}>
                      {record.vaccination_date
                        ? record.vaccination_date.split("T")[0]
                        : "-"}
                    </td>

                    <td style={cellStyle}>
                      {record.tag_number || "-"}
                    </td>

                    <td style={cellStyle}>
                      {record.name || "-"}
                    </td>

                    <td style={cellStyle}>
                      {record.vaccine_name || "-"}
                    </td>

                    <td style={cellStyle}>
                      {record.next_due_date
                        ? record.next_due_date.split("T")[0]
                        : "-"}
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        textAlign: "center",
                      }}
                    >
                      <button
                        className="button"
                        type="button"
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
    </div>
  );
}

export default ChickenVaccinations;