import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddEggSale() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sale_date: new Date().toISOString().split("T")[0],
    customer: "",
    quantity: "",
    price_per_egg: "",
    payment_method: "Cash",
    notes: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      price_per_egg: Number(formData.price_per_egg),
    };

    try {
      const response = await fetch(`${API_URL}/api/egg-sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || t("failedSaveEggSale"));
        return;
      }

      alert(data.message || t("eggSaleSaved"));
      navigate("/egg-sales");
    } catch (error) {
      console.error("Failed to save egg sale:", error);
      alert(t("failedSaveEggSale"));
    }
  }

  return (
    <div className="page">
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "6px" }}>
            🥚 {t("recordEggSale")}
          </h1>

          <p style={{ margin: 0 }}>
            {t("recordEggSaleDescription")}
          </p>
        </div>

        <Link
          className="button"
          to="/egg-sales"
          style={{
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          ← {t("back")}
        </Link>
      </div>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "30px",
          boxSizing: "border-box",
          borderRadius: "14px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginTop: 0,
            marginBottom: "30px",
          }}
        >
          🥚 {t("saleDetails")}
        </h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "24px 28px",
              alignItems: "start",
            }}
          >
            <div>
              <label
                htmlFor="sale_date"
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("saleDate")}
              </label>

              <input
                id="sale_date"
                type="date"
                name="sale_date"
                value={formData.sale_date}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="customer"
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("customer")}
              </label>

              <input
                id="customer"
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                placeholder={t("customerPlaceholder")}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="quantity"
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("quantity")}
              </label>

              <input
                id="quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                step="1"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="price_per_egg"
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("pricePerEgg")}
              </label>

              <input
                id="price_per_egg"
                type="number"
                name="price_per_egg"
                value={formData.price_per_egg}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="payment_method"
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("paymentMethod")}
              </label>

              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <option value="Cash">{t("cash")}</option>
                <option value="M-Pesa">M-Pesa</option>
                <option value="Bank">{t("bank")}</option>
              </select>
            </div>

            <div
              style={{
                gridColumn: "1 / -1",
              }}
            >
              <label
                htmlFor="notes"
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                  textAlign: "center",
                }}
              >
                {t("notes")}
              </label>

              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder={t("notesPlaceholder")}
                rows="4"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "28px",
              flexWrap: "wrap",
            }}
          >
            <button type="submit" className="button">
              💾 {t("save")}
            </button>

            <Link
              to="/egg-sales"
              className="button"
              style={{
                textDecoration: "none",
              }}
            >
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEggSale;
