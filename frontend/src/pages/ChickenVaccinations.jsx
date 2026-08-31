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
      alert(t("failedDeleteVaccination"))
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
          <h1>💉 {t("chickenVaccinations")}</h1>
          <p>{t("manageVaccinationRecords")}</p>
        </div>

        <Link
          className="button"
          to="/chicken-vaccinations/add"
        >
          ➕ {t("recordVaccination")}
        </Link>

      </div>

      <div className="card">

        <table
          className="table"
          style={{
            width: "100%",
            tableLayout: "fixed",
            borderCollapse: "collapse",
          }}
        >
          <colgroup>
            <col style={{ width: "16%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>

          <thead>
            <tr>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                }}
              >
                {t("date")}
              </th>

              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {t("tag")}
              </th>

              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                }}
              >
                {t("name")}
              </th>

              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                }}
              >
                {t("vaccine")}
              </th>

              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  lineHeight: "1.2",
                }}
              >
                {t("nextDueDate")}
              </th>

              <th
                style={{
                  padding: "12px 8px",
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
                    textAlign: "center",
                    padding: "30px 10px",
                  }}
                >
                  {t("noVaccinationRecords")}
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>

                  <td
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.vaccination_date?.split("T")[0]}
                  </td>

                  <td
                    style={{
                      padding: "12px 8px",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.tag_number || "-"}
                  </td>

                  <td
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={record.name || ""}
                  >
                    {record.name || "-"}
                  </td>

                  <td
                    style={{
                      padding: "12px 8px",
                      textAlign: "left",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={record.vaccine_name || ""}
                  >
                    {record.vaccine_name || "-"}
                  </td>

                  <td
                    style={{
                      padding: "12px 8px",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.next_due_date
                      ? record.next_due_date.split("T")[0]
                      : "-"}
                  </td>

                  <td
                    style={{
                      padding: "8px 8px",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
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

export default ChickenVaccinations;
