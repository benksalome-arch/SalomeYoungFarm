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
          to={`/rabbits/edit/${rabbit.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            background: "#2e7d32",
            color: "#fff",
            textDecoration: "none",
            border: "none",
            padding: "9px 16px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          ✏️ {t("edit")}
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
          padding: "0",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            background: "#f1f8f2",
            borderBottom: "1px solid #d7e8d9",
            fontSize: "17px",
            fontWeight: "700",
            color: "#2e7d32",
          }}
        >
          {t("rabbitInformation")}
        </div>

        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {[
            [t("tagNumber"), rabbit.tag_number || "-"],
            [t("name"), rabbit.name || "-"],
            [t("breed"), rabbit.breed || "-"],
            [t("sex"), rabbit.sex || "-"],
            [
              t("birthDate"),
              formatDate(rabbit.birth_date),
            ],
            [t("source"), rabbit.source || "-"],
            [t("quantity"), rabbit.quantity ?? 0],
            [t("status"), rabbit.status || "-"],
            [
              t("purchasePriceKES"),
              `KES ${Number(
                rabbit.purchase_price || 0
              ).toLocaleString()}`,
            ],
            [t("notes"), rabbit.notes || "-"],
          ].map(([label, value], index) => (
            <div
              key={label}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(180px, 35%) minmax(0, 65%)",
                width: "100%",
                boxSizing: "border-box",
                borderBottom:
                  index < 9
                    ? "1px solid #e5e5e5"
                    : "none",
              }}
            >
              <div
                style={{
                  padding: "13px 18px",
                  background: "#f8fbf8",
                  color: "#2e7d32",
                  fontWeight: "600",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                {label}
              </div>

              <div
                style={{
                  padding: "13px 18px",
                  color: "#333",
                  fontSize: "14px",
                  background: "#fff",
                  overflowWrap: "break-word",
                  boxSizing: "border-box",
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
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

        {/* Litters */}

        <Link
          className="button"
          to="/rabbit-litters"
        >
          🐇 Litters
        </Link>
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
