import API_URL from "../api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function RabbitBreeding() {
  const { t } = useLanguage();
  const { id } = useParams();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, [id]);

  async function loadRecords() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/rabbit-breeding/rabbit/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        setRecords([]);
        return;
      }

      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(recordId) {
    if (!window.confirm("Weet je zeker dat je deze fokregistratie wilt verwijderen?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/rabbit-breeding/${recordId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Verwijderen mislukt.");
        return;
      }

      setRecords((previous) =>
        previous.filter((record) => record.id !== recordId)
      );
    } catch (err) {
      console.error("Delete breeding error:", err);
      alert("Verwijderen mislukt.");
    }
  }

  return (
    <div>
      {/* =====================================
          Header
      ===================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1>❤️ {t("rabbitBreeding")}</h1>

          <p>
            {t("breedingHistoryFemaleRabbit")}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <Link
            className="button"
            to={`/rabbits/${id}/breeding/add`}
          >
            ➕ {t("addBreeding")}
          </Link>

          <Link
            className="button"
            to={`/rabbits/${id}`}
          >
            ← {t("backToProfile")}
          </Link>
        </div>
      </div>

      {/* =====================================
          Breeding Records
      ===================================== */}

      <div className="card">
        <table
          className="table rabbit-breeding-table"
          style={{
            width: "100%",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr>
              <th>{t("date")}</th>

              <th>{t("femaleRabbit")}</th>

              <th>{t("maleRabbit")}</th>

              <th>{t("type")}</th>

              <th>{t("expectedBirth")}</th>

              <th>{t("status")}</th>

              <th>{t("notes")}</th>
              <th>Actie</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  {t("loadingBreedingRecords")}
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  {t("noBreedingRecordsFound")}
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  {/* Date */}

                  <td data-label={t("date")}>
                    {record.breeding_date
                      ? record.breeding_date.split("T")[0]
                      : "-"}
                  </td>

                  {/* Female */}

                  <td data-label={t("femaleRabbit")}>
                    <strong>
                      {record.female_tag_number || "-"}
                    </strong>

                    {record.female_name
                      ? ` - ${record.female_name}`
                      : ""}
                  </td>

                  {/* Male */}

                  <td data-label={t("maleRabbit")}>
                    <strong>
                      {record.male_tag_number || "-"}
                    </strong>

                    {record.male_name
                      ? ` - ${record.male_name}`
                      : ""}
                  </td>

                  {/* Type */}

                  <td data-label={t("type")}>
                    {record.breeding_type || "-"}
                  </td>

                  {/* Expected Birth */}

                  <td data-label={t("expectedBirth")}>
                    {record.expected_birth_date
                      ? record.expected_birth_date.split("T")[0]
                      : "-"}
                  </td>

                  {/* Status */}

                  <td
                    data-label={t("status")}
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {record.status || "-"}
                  </td>

                  {/* Notes */}

                  <td
                    data-label={t("notes")}
                    style={{
                      wordBreak: "break-word",
                    }}
                  >
                    {record.notes || "-"}
                  </td>

                  <td data-label="Actie" style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleDelete(record.id)}
                      style={{
                        background: "#D32F2F",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        padding: "7px 10px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      🗑️ Verwijderen
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

export default RabbitBreeding;
