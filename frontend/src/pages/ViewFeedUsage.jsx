import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function ViewFeedUsage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const location = useLocation();

  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsage();
  }, [id]);

  async function loadUsage() {
    try {
      const response = await fetch(`${API_URL}/api/feed-usage/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load feed usage.");
      }

      setUsage(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="card" style={{ padding: 30, textAlign: "center" }}>
          {t("loading")}
        </div>
      </div>
    );
  }

  if (!usage) {
    return (
      <div className="page">
        <div className="card" style={{ padding: 30, textAlign: "center" }}>
          <h2>{t("error")}</h2>
          <Link className="button" to="/feed/usage">
            ← {t("back")}
          </Link>
        </div>
      </div>
    );
  }

  const animalType =
    usage.animal_type === "Goat"
      ? "Geit"
      : usage.animal_type === "Chicken"
      ? "Kip"
      : usage.animal_type === "Rabbit"
      ? "Konijn"
      : usage.animal_type || "-";

  const fieldStyle = {
    padding: "18px 20px",
    border: "1px solid #e0e0e0",
    borderRadius: 10,
    background: "#fafafa",
  };

  const labelStyle = {
    display: "block",
    fontSize: 14,
    fontWeight: 700,
    color: "#666",
    marginBottom: 7,
  };

  const valueStyle = {
    fontSize: 17,
    fontWeight: 600,
    color: "#222",
  };

  return (
    <div className="page">
      {location.state?.success && (
        <div
          style={{
            marginBottom: 20,
            padding: "12px 16px",
            borderRadius: 8,
            background: "#e8f5e9",
            border: "1px solid #a5d6a7",
            color: "#1b5e20",
            fontWeight: 600,
          }}
        >
          ✓ {location.state.success}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 15,
          marginBottom: 25,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0 }}>
          🌾 {t("view")} {t("feedUsage")}
        </h1>

        <Link className="button" to="/feed/usage">
          ← {t("back")}
        </Link>
      </div>

      <div
        className="card"
        style={{
          padding: 25,
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          <div style={fieldStyle}>
            <span style={labelStyle}>{t("date")}</span>
            <div style={valueStyle}>
              {usage.usage_date
                ? usage.usage_date.split("T")[0]
                : "-"}
            </div>
          </div>

          <div style={fieldStyle}>
            <span style={labelStyle}>{t("feed")}</span>
            <div style={valueStyle}>{usage.feed_name || "-"}</div>
          </div>

          <div style={fieldStyle}>
            <span style={labelStyle}>{t("animalType")}</span>
            <div style={valueStyle}>{animalType}</div>
          </div>

          <div style={fieldStyle}>
            <span style={labelStyle}>{t("quantity")}</span>
            <div style={valueStyle}>
              {usage.quantity_used} kg
            </div>
          </div>

          <div
            style={{
              ...fieldStyle,
              gridColumn: "1 / -1",
            }}
          >
            <span style={labelStyle}>{t("notes")}</span>
            <div style={valueStyle}>
              {usage.notes || "-"}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 25,
            flexWrap: "wrap",
          }}
        >
          <Link
            className="button"
            to={`/feed/usage/${usage.id}/edit`}
          >
            ✏️ {t("update")}
          </Link>

          <Link className="button" to="/feed/usage">
            ← {t("back")}
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .card > div:first-child {
            grid-template-columns: 1fr !important;
          }

          .card > div:first-child > div {
            grid-column: auto !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ViewFeedUsage;
