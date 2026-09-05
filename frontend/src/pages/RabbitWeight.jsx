import API_URL from "../api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function RabbitWeight() {
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
        `${API_URL}/api/rabbit-weight/rabbit/${id}`
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
        }}
      >
        <div>
          <h1>⚖ {t("rabbitWeightHistory")}</h1>

          <p>
            Track weight changes for this rabbit.
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
            to={`/rabbits/${id}/weight/add`}
          >
            ➕ Add Weight
          </Link>

          <Link
            className="button"
            to={`/rabbits/${id}`}
          >
            ← {t("back")}
          </Link>
        </div>
      </div>

      {/* =====================================
          Weight Records
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
              <th
                style={{
                  width: "25%",
                  textAlign: "left",
                }}
              >
                Date
              </th>

              <th
                style={{
                  width: "20%",
                  textAlign: "center",
                }}
              >
                Weight
              </th>

              <th
                style={{
                  width: "20%",
                  textAlign: "center",
                }}
              >
                Unit
              </th>

              <th
                style={{
                  width: "35%",
                  textAlign: "left",
                }}
              >
                Notes
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  Loading weight records...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No weight records found.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  {/* Date */}

                  <td
                    style={{
                      textAlign: "left",
                      verticalAlign: "middle",
                    }}
                  >
                    {record.weight_date
                      ? record.weight_date.split("T")[0]
                      : "-"}
                  </td>

                  {/* Weight */}

                  <td
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      fontWeight: "600",
                    }}
                  >
                    {Number(
                      record.weight
                    ).toLocaleString()}
                  </td>

                  {/* Unit */}

                  <td
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    {record.unit || "kg"}
                  </td>

                  {/* Notes */}

                  <td
                    style={{
                      textAlign: "left",
                      verticalAlign: "middle",
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

export default RabbitWeight;
