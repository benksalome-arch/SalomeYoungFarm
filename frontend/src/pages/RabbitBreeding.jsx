import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function RabbitBreeding() {
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
        `http://localhost:5000/api/rabbit-breeding/rabbit/${id}`
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
          <h1>❤️ Rabbit Breeding</h1>

          <p>
            Breeding history for this female rabbit.
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
            ➕ Add Breeding
          </Link>

          <Link
            className="button"
            to={`/rabbits/${id}`}
          >
            ← Back to Profile
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
              <th>Date</th>

              <th>Female Rabbit</th>

              <th>Male Rabbit</th>

              <th>Type</th>

              <th>Expected Birth</th>

              <th>Status</th>

              <th>Notes</th>
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
                  Loading breeding records...
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
                  No breeding records found.
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