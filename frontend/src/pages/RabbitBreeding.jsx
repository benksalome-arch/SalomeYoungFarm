import API_URL from "../api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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
          className="table"
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
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="7"
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
                  colSpan="7"
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

                  <td>
                    {record.breeding_date
                      ? record.breeding_date.split("T")[0]
                      : "-"}
                  </td>

                  {/* Female */}

                  <td>
                    <strong>
                      {record.female_tag_number || "-"}
                    </strong>

                    {record.female_name
                      ? ` - ${record.female_name}`
                      : ""}
                  </td>

                  {/* Male */}

                  <td>
                    <strong>
                      {record.male_tag_number || "-"}
                    </strong>

                    {record.male_name
                      ? ` - ${record.male_name}`
                      : ""}
                  </td>

                  {/* Type */}

                  <td>
                    {record.breeding_type || "-"}
                  </td>

                  {/* Expected Birth */}

                  <td>
                    {record.expected_birth_date
                      ? record.expected_birth_date.split("T")[0]
                      : "-"}
                  </td>

                  {/* Status */}

                  <td
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {record.status || "-"}
                  </td>

                  {/* Notes */}

                  <td
                    style={{
                      wordBreak: "break-word",
                    }}
                  >
                    {record.notes || "-"}
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
