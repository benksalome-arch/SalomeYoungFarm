import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function ViewInventory() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadItem();
  }, [id]);

  async function loadItem() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/inventory/${id}`
      );

      if (!response.ok) {
        throw new Error(`Failed to load inventory item: ${response.status}`);
      }

      const data = await response.json();
      setItem(data);
    } catch (err) {
      console.error("Inventory view error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const labelStyle = {
    fontWeight: 600,
    fontSize: "15px",
    color: "#222",
    WebkitTextFillColor: "#222",
  };

  const valueStyle = {
    fontSize: "15px",
    color: "#222",
    WebkitTextFillColor: "#222",
    background: "#fff",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    padding: "10px 12px",
    minHeight: "44px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    width: "100%",
  };

  function formatDate(value) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString();
  }

  if (loading) {
    return (
      <div className="page">
        <div style={{ padding: "30px", textAlign: "center" }}>
          {t("loading")}...
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="page">
        <div
          style={{
            maxWidth: "680px",
            margin: "40px auto",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#D32F2F" }}>
            {error || t("noInventoryItemsFound")}
          </p>

          <button
            type="button"
            className="button"
            onClick={() => navigate("/inventory")}
          >
            ← {t("back")}
          </button>
        </div>
      </div>
    );
  }

  const isLow =
    Number(item.quantity || 0) <=
    Number(item.minimum_stock || 0);

  return (
    <div className="page">
      <style>{`
        .view-inventory-card {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          background: #fff;
          border: 1px solid #e1e5e1;
          border-radius: 10px;
          padding: 24px;
          box-sizing: border-box;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .view-inventory-grid {
          display: grid;
          grid-template-columns: 150px minmax(0, 1fr);
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .view-inventory-notes {
          align-items: start;
        }

        .view-inventory-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .view-inventory-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .view-inventory-actions .button {
          width: auto !important;
          min-width: 0 !important;
          flex: 0 0 auto !important;
          white-space: nowrap !important;
        }

        @media (max-width: 700px) {
          .view-inventory-card {
            padding: 16px;
          }

          .view-inventory-grid {
            grid-template-columns: 1fr;
            gap: 6px;
            margin-bottom: 14px;
          }

          .view-inventory-actions {
            justify-content: flex-start;
          }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0 }}>
          👁 {t("view")} {t("inventory")}
        </h1>

        <Link
          className="button"
          to="/inventory"
          style={{
            width: "auto",
            whiteSpace: "nowrap",
          }}
        >
          ← {t("back")}
        </Link>
      </div>

      <div className="view-inventory-card">
        <div className="view-inventory-grid">
          <div style={labelStyle}>{t("itemName")}</div>
          <div style={valueStyle}>{item.item_name || "-"}</div>
        </div>

        <div className="view-inventory-grid">
          <div style={labelStyle}>{t("category")}</div>
          <div style={valueStyle}>{item.category || "-"}</div>
        </div>

        <div className="view-inventory-grid">
          <div style={labelStyle}>{t("quantity")}</div>
          <div style={valueStyle}>
            {item.quantity ?? 0} {item.unit || ""}
          </div>
        </div>

        <div className="view-inventory-grid">
          <div style={labelStyle}>{t("minimumStock")}</div>
          <div style={valueStyle}>
            {item.minimum_stock ?? 0} {item.unit || ""}
          </div>
        </div>

        <div className="view-inventory-grid">
          <div style={labelStyle}>{t("status")}</div>
          <div style={{ ...valueStyle, justifyContent: "flex-start" }}>
            <span
              className="view-inventory-status"
              style={{
                background: isLow ? "#E53935" : "#4CAF50",
                color: "#fff",
              }}
            >
              {isLow
                ? `🔴 ${t("low")}`
                : `🟢 ${t("ok")}`}
            </span>
          </div>
        </div>

        <div className="view-inventory-grid">
          <div style={labelStyle}>{t("purchasePriceKES")}</div>
          <div style={valueStyle}>
            KES {Number(item.purchase_price || 0).toLocaleString()}
          </div>
        </div>

        <div className="view-inventory-grid">
          <div style={labelStyle}>{t("supplier")}</div>
          <div style={valueStyle}>{item.supplier || "-"}</div>
        </div>

        <div className="view-inventory-grid">
          <div style={labelStyle}>{t("purchaseDate")}</div>
          <div style={valueStyle}>
            {formatDate(item.purchase_date)}
          </div>
        </div>

        <div className="view-inventory-grid view-inventory-notes">
          <div style={labelStyle}>{t("notes")}</div>
          <div style={{ ...valueStyle, minHeight: "80px", alignItems: "flex-start" }}>
            {item.notes || "-"}
          </div>
        </div>

        <div className="view-inventory-actions">
          <Link
            className="button"
            to={`/inventory/edit/${item.id}`}
          >
            ✏ {t("edit")}
          </Link>

          <Link
            className="button"
            to="/inventory"
          >
            ← {t("back")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ViewInventory;
