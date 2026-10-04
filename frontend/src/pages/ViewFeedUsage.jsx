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

      <div className="card" style={{ padding: 25 }}>
        <div style={{ display: "grid", gap: 18 }}>
          <div>
            <strong>{t("date")}</strong>
            <div>
              {usage.usage_date
                ? usage.usage_date.split("T")[0]
                : "-"}
            </div>
          </div>

          <div>
            <strong>{t("feed")}</strong>
            <div>{usage.feed_name || "-"}</div>
          </div>

          <div>
            <strong>{t("animalType")}</strong>
            <div>
              {usage.animal_type === "Goat"
                ? "Geit"
                : usage.animal_type === "Chicken"
                ? "Kip"
                : usage.animal_type === "Rabbit"
                ? "Konijn"
                : usage.animal_type || "-"}
            </div>
          </div>

          <div>
            <strong>{t("quantity")}</strong>
            <div>{usage.quantity_used} kg</div>
          </div>

          <div>
            <strong>{t("notes")}</strong>
            <div>{usage.notes || "-"}</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 30,
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
    </div>
  );
}

export default ViewFeedUsage;
