import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function RabbitProfile() {
  const { id } = useParams();

  const [rabbit, setRabbit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRabbit();
  }, [id]);

  async function loadRabbit() {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/rabbits/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        setRabbit(null);
        return;
      }

      setRabbit(data);
    } catch (err) {
      console.error(err);
      setRabbit(null);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "-";
    }

    const dateOnly = String(dateValue).split("T")[0];
    const parts = dateOnly.split("-");

    if (parts.length !== 3) {
      return dateValue;
    }

    const [year, month, day] = parts;

    return `${day}-${month}-${year}`;
  }

  if (loading) {
    return (
      <div
        style={{
          padding: "30px",
        }}
      >
        Loading rabbit...
      </div>
    );
  }

  if (!rabbit) {
    return (
      <div
        style={{
          padding: "30px",
        }}
      >
        <p>Rabbit not found.</p>

        <Link
          className="button"
          to="/rabbits"
        >
          ← Back to Rabbits
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* =====================================
          HEADER
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
          <h1>
            🐇 {rabbit.name || "Rabbit"}
          </h1>

          <p>
            {rabbit.tag_number || "-"}
          </p>
        </div>

        <Link
          className="button"
          to={`/rabbits/edit/${rabbit.id}`}
        >
          ✏ Edit
        </Link>
      </div>

      {/* =====================================
          RABBIT INFORMATION
      ===================================== */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <table
          className="table"
          style={{
            width: "100%",
            maxWidth: "100%",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: "40%" }} />
            <col style={{ width: "60%" }} />
          </colgroup>

          <tbody>
            <tr>
              <th>Tag Number</th>
              <td>
                {rabbit.tag_number || "-"}
              </td>
            </tr>

            <tr>
              <th>Name</th>
              <td>
                {rabbit.name || "-"}
              </td>
            </tr>

            <tr>
              <th>Breed</th>
              <td>
                {rabbit.breed || "-"}
              </td>
            </tr>

            <tr>
              <th>Sex</th>
              <td>
                {rabbit.sex || "-"}
              </td>
            </tr>

            <tr>
              <th>Birth Date</th>
              <td>
                {formatDate(
                  rabbit.birth_date
                )}
              </td>
            </tr>

            <tr>
              <th>Source</th>
              <td>
                {rabbit.source || "-"}
              </td>
            </tr>

            <tr>
              <th>Quantity</th>
              <td>
                {rabbit.quantity ?? 0}
              </td>
            </tr>

            <tr>
              <th>Status</th>
              <td>
                {rabbit.status || "-"}
              </td>
            </tr>

            <tr>
              <th>Purchase Price</th>
              <td>
                KES{" "}
                {Number(
                  rabbit.purchase_price || 0
                ).toLocaleString()}
              </td>
            </tr>

            <tr>
              <th>Notes</th>
              <td>
                {rabbit.notes || "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* =====================================
          RABBIT MODULE BUTTONS
      ===================================== */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {/* Health */}

        <Link
          className="button"
          to={`/rabbits/${rabbit.id}/health`}
        >
          🏥 Health
        </Link>

        {/* Vaccinations */}

        <Link
          className="button"
          to="/rabbit-vaccinations"
        >
          💉 Vaccinations
        </Link>

        {/* Weight */}

        <Link
          className="button"
          to={`/rabbits/${rabbit.id}/weight`}
        >
          ⚖ Weight
        </Link>

        {/* Breeding */}

        <Link
          className="button"
          to={`/rabbits/${rabbit.id}/breeding`}
        >
          ❤️ Breeding
        </Link>

        {/* Litters - not implemented yet */}

        <button
          className="button"
          type="button"
          disabled
          style={{
            opacity: 0.6,
            cursor: "not-allowed",
          }}
        >
          🐇 Litters
        </button>
      </div>

      {/* =====================================
          BACK TO RABBITS
      ===================================== */}

      <div
        style={{
          marginTop: "20px",
        }}
      >
        <Link
          className="button"
          to="/rabbits"
        >
          ← Back to Rabbits
        </Link>
      </div>
    </div>
  );
}

export default RabbitProfile;