import API_URL from "../api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function ChickenProfile() {
  const { t } = useLanguage();
  const { id } = useParams();

  const [chicken, setChicken] = useState(null);

  useEffect(() => {
    loadChicken();
  }, []);

  async function loadChicken() {
    try {
      const response = await fetch(`${API_URL}/api/chickens/${id}`);
      const data = await response.json();
      setChicken(data);
    } catch (err) {
      console.error(err);
    }
  }

  if (!chicken) {
    return <p>{t("loading")}</p>;
  }

  function formatDate(date) {
    if (!date) return "—";

    const value = String(date).split("T")[0];
    const parts = value.split("-");

    if (parts.length !== 3) return value;

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  function formatStatus(status) {
    const normalized = String(status || "").trim().toLowerCase();

    if (normalized === "active") return t("active");
    if (normalized === "sold") return t("sold");
    if (normalized === "dead") return t("dead");

    return status || "—";
  }

  const rows = [
    [t("tagNumber"), chicken.tag_number],
    [t("name"), chicken.name],
    [t("breed"), chicken.breed],
    [t("type"), chicken.type],
    [t("sex"), chicken.sex],
    [t("quantity"), chicken.quantity],
    [t("status"), formatStatus(chicken.status)],
    [t("purchasePrice"), chicken.purchase_price],
    [t("source"), chicken.source],
    [t("hatchDate"), formatDate(chicken.hatch_date)],
    [t("notes"), chicken.notes],
  ];

  return (
    <div className="page">
      <style>{`
        .chicken-profile-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 22px;
        }

        .chicken-profile-title {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: #222;
        }

        .chicken-profile-subtitle {
          margin: 5px 0 0;
          font-size: 15px;
          color: #666;
        }

        .chicken-profile-card {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }

        .chicken-profile-grid {
          display: grid;
          grid-template-columns: 210px minmax(0, 1fr);
          border: 1px solid #e1e5e1;
          border-radius: 8px;
          overflow: hidden;
        }

        .chicken-profile-label {
          padding: 14px 18px;
          background: #f3f6f3;
          border-bottom: 1px solid #e1e5e1;
          font-weight: 600;
          color: #333;
        }

        .chicken-profile-value {
          padding: 14px 18px;
          background: #fff;
          border-bottom: 1px solid #e1e5e1;
          color: #222;
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .chicken-profile-label:nth-last-child(2),
        .chicken-profile-value:last-child {
          border-bottom: none;
        }

        .chicken-profile-status {
          font-weight: 600;
        }

        @media (max-width: 700px) {
          .chicken-profile-header {
            align-items: center;
          }

          .chicken-profile-title {
            font-size: 23px;
          }

          .chicken-profile-card {
            padding: 14px;
          }

          .chicken-profile-grid {
            grid-template-columns: 115px minmax(0, 1fr);
          }

          .chicken-profile-label,
          .chicken-profile-value {
            padding: 12px 10px;
            font-size: 14px;
          }
        }
      `}</style>

      <div className="chicken-profile-header">
        <div>
          <h1 className="chicken-profile-title">
            🐔 {chicken.name || chicken.tag_number}
          </h1>
          <p className="chicken-profile-subtitle">
            {t("chickenProfile")}
          </p>
        </div>

        <Link
          className="button"
          to="/chickens"
          style={{
            textDecoration: "none",
            whiteSpace: "nowrap",
            padding: "10px 16px",
            height: "auto",
            minHeight: "auto",
            lineHeight: "1.2",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "fit-content",
            maxWidth: "fit-content",
            flexShrink: 0,
          }}
        >
          ← {t("back")}
        </Link>
      </div>

      <div className="chicken-profile-card">
        <div className="chicken-profile-grid">
          {rows.map(([label, value], index) => (
            <div key={index} style={{ display: "contents" }}>
              <div
                className="chicken-profile-label"
                style={{
                  borderBottom:
                    index === rows.length - 1
                      ? "none"
                      : "1px solid #e1e5e1",
                }}
              >
                {label}
              </div>

              <div
                className={`chicken-profile-value ${
                  label === t("status")
                    ? "chicken-profile-status"
                    : ""
                }`}
                style={{
                  borderBottom:
                    index === rows.length - 1
                      ? "none"
                      : "1px solid #e1e5e1",
                }}
              >
                {value !== null && value !== undefined && value !== ""
                  ? value
                  : "—"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChickenProfile;
