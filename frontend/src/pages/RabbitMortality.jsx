import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function RabbitMortality() {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/rabbit-mortality`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        setRecords([]);
        return;
      }

      setRecords(data);
    } catch (err) {
      console.error(err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteRecord(id) {
    if (!window.confirm(t("deleteRabbitMortalityRecord"))) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/rabbit-mortality/${id}`,
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
      alert(t("failedToDeleteMortality"));
    }
  }

  const totalDeaths = records.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "20px",
        }}
      >
        <div>
          <h1>☠️ {t("rabbitMortality")}</h1>
          <p>{t("rabbitMortalityDescription")}</p>
        </div>

        <Link
          className="button"
          to="/rabbit-mortality/add"
        >
          ➕ {t("recordMortality")}
        </Link>
      </div>

      {/* Total Deaths */}
      <div
        className="card"
        style={{ marginBottom: "20px" }}
      >
        <h3>{t("totalRabbitDeaths")}</h3>

        <h2>{totalDeaths}</h2>
      </div>

      {/* Records */}
      <div className="card">
        <table className="table">

          <thead>
            <tr>
              <th>{t("date")}</th>
              <th>{t("tag")}</th>
              <th>{t("name")}</th>
              <th>{t("quantity")}</th>
              <th>{t("cause")}</th>
              <th>{t("notes")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center" }}
                >
                  {t("loadingMortalityRecords")}
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center" }}
                >
                  {t("noRabbitMortalityRecordsFound")}
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>

                  <td>
                    {record.mortality_date
                      ? record.mortality_date.split("T")[0]
                      : ""}
                  </td>

                  <td>
                    {record.tag_number || "-"}
                  </td>

                  <td>
                    {record.name || "-"}
                  </td>

                  <td>
                    {record.quantity}
                  </td>

                  <td>
                    {record.cause || "-"}
                  </td>

                  <td>
                    {record.notes || "-"}
                  </td>

                  <td>
                    <button
                      className="button"
                      type="button"
                      onClick={() =>
                        deleteRecord(record.id)
                      }
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

export default RabbitMortality;
