import API_URL from "../api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function RabbitProfile() {
  const { t } = useLanguage();
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
        `${API_URL}/api/rabbits/${id}`
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
        <p>{t("rabbitNotFound")}</p>

        <Link
          className="button"
          to="/rabbits"
        >
          ← {t("back")}
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
            🐇 {rabbit.name || t("rabbit")}
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
              <th>{t("tagNumber")}</th>
              <td>
                {rabbit.tag_number || "-"}
              </td>
            </tr>

            <tr>
              <th>{t("name")}</th>
              <td>
                {rabbit.name || "-"}
              </td>
            </tr>

            <tr>
              <th>{t("breed")}</th>
              <td>
                {rabbit.breed || "-"}
              </td>
            </tr>

            <tr>
              <th>{t("sex")}</th>
              <td>
                {rabbit.sex || "-"}
              </td>
            </tr>

            <tr>
              <th>{t("birthDate")}</th>
              <td>
                {formatDate(
                  rabbit.birth_date
                )}
              </td>
            </tr>

            <tr>
              <th>{t("source")}</th>
              <td>
                {rabbit.source || "-"}
              </td>
            </tr>

            <tr>
              <th>{t("quantity")}</th>
              <td>
                {rabbit.quantity ?? 0}
              </td>
            </tr>

            <tr>
              <th>{t("status")}</th>
              <td>
                {rabbit.status || "-"}
              </td>
            </tr>

            <tr>
              <th>{t("purchasePriceKES")}</th>
              <td>
                KES{" "}
                {Number(
                  rabbit.purchase_price || 0
                ).toLocaleString()}
              </td>
            </tr>

            <tr>
              <th>{t("notes")}</th>
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
          ← {t("back")}
        </Link>
      </div>
    </div>
  );
}

export default RabbitProfile;
