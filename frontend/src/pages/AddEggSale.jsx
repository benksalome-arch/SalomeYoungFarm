import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddEggSale() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const fieldStyle = {
    display: "grid",
    gridTemplateColumns: "150px minmax(0, 260px)",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px",
  };

  const labelStyle = {
    fontWeight: 600,
    fontSize: "15px",
    textAlign: "right",
    color: "#222",
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    minHeight: "44px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    color: "#222",
    WebkitTextFillColor: "#222",
    fontSize: "15px",
  };

  const [formData, setFormData] = useState({
    sale_date: "",
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

  const responsiveStyles = `
    .add-egg-sale-field {
      display: grid;
      grid-template-columns: 150px minmax(0, 260px);
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }

    .add-egg-sale-field label,
    .add-egg-sale-notes label {
      display: block !important;
      margin-bottom: 0 !important;
      font-weight: 600 !important;
      font-size: 15px !important;
      text-align: right !important;
      color: #222 !important;
      -webkit-text-fill-color: #222 !important;
    }

    .add-egg-sale-field input,
    .add-egg-sale-field select,
    .add-egg-sale-notes textarea {
      width: 100% !important;
      box-sizing: border-box !important;
      padding: 10px 12px !important;
      min-height: 44px !important;
      border: 1px solid #cfd6cf !important;
      border-radius: 7px !important;
      background: #fff !important;
      color: #222 !important;
      -webkit-text-fill-color: #222 !important;
      font-size: 15px !important;
    }

    .add-egg-sale-notes {
      display: grid;
      grid-template-columns: 150px minmax(0, 260px);
      align-items: start;
      gap: 14px;
      margin-bottom: 20px;
    }

    .add-egg-sale-notes textarea {
      min-height: 100px !important;
      resize: vertical;
    }

    @media (max-width: 700px) {
      .add-egg-sale-field,
      .add-egg-sale-notes {
        grid-template-columns: 105px minmax(0, 1fr);
        gap: 10px;
      }
    }
  `;

  return (
    <div className="page">
      <style>{responsiveStyles}</style>
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
          <h1
            style={{
              margin: "0 0 6px 0",
              color: "#222",
              WebkitTextFillColor: "#222",
            }}
          >
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
          maxWidth: "620px",
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
            color: "#222",
            WebkitTextFillColor: "#222",
          }}
        >
          🥚 {t("saleDetails")}
        </h2>

        <form onSubmit={handleSubmit} className="add-egg-sale-form">
          <div
            style={{
              display: "block",
            }}
          >
            <div className="add-egg-sale-field">
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
                type="text"
                name="sale_date"
                value={
                  formData.sale_date
                    ? formData.sale_date.split("-").reverse().join("-")
                    : ""
                }
                placeholder="DD-MM-JJJJ"
                readOnly
                required
                onClick={() => {
                  const today = new Date();

                  const selected = formData.sale_date
                    ? new Date(formData.sale_date + "T00:00:00")
                    : today;

                  const year = selected.getFullYear();
                  const month = selected.getMonth();
                  const firstDay = new Date(year, month, 1).getDay();
                  const daysInMonth = new Date(
                    year,
                    month + 1,
                    0
                  ).getDate();

                  const overlay = document.createElement("div");

                  overlay.style.cssText =
                    "position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:99999;";

                  const box = document.createElement("div");

                  box.style.cssText =
                    "width:min(92vw,320px);background:#fff;border-radius:14px;padding:18px;box-sizing:border-box;box-shadow:0 8px 30px rgba(0,0,0,.25);";

                  const title = document.createElement("div");

                  title.textContent = selected
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    .replaceAll("/", "-");

                  title.style.cssText =
                    "text-align:center;font-size:20px;font-weight:700;margin-bottom:14px;color:#222;-webkit-text-fill-color:#222;";

                  const grid = document.createElement("div");

                  grid.style.cssText =
                    "display:grid;grid-template-columns:repeat(7,1fr);gap:6px;";

                  [
                    t("sun"),
                    t("mon"),
                    t("tue"),
                    t("wed"),
                    t("thu"),
                    t("fri"),
                    t("sat"),
                  ].forEach((day) => {
                    const el = document.createElement("div");

                    el.textContent = day;

                    el.style.cssText =
                      "text-align:center;font-weight:600;font-size:13px;padding:6px 0;color:#222;-webkit-text-fill-color:#222;";

                    grid.appendChild(el);
                  });

                  for (let i = 0; i < firstDay; i++) {
                    grid.appendChild(document.createElement("div"));
                  }

                  for (let day = 1; day <= daysInMonth; day++) {
                    const el = document.createElement("button");

                    el.type = "button";
                    el.textContent = day;

                    const isToday =
                      day === today.getDate() &&
                      month === today.getMonth() &&
                      year === today.getFullYear();

                    el.style.cssText = `min-height:40px;border:${
                      isToday ? "2px solid #2e7d32" : "1px solid #ddd"
                    };border-radius:8px;background:${
                      isToday ? "#e8f5e9" : "#fff"
                    };color:#222;-webkit-text-fill-color:#222;font-size:15px;font-weight:600;display:flex;align-items:center;justify-content:center;`;

                    el.onclick = () => {
                      const value =
                        year +
                        "-" +
                        String(month + 1).padStart(2, "0") +
                        "-" +
                        String(day).padStart(2, "0");

                      setFormData((prev) => ({
                        ...prev,
                        sale_date: value,
                      }));

                      document.body.removeChild(overlay);
                    };

                    grid.appendChild(el);
                  }

                  const cancel = document.createElement("button");

                  cancel.type = "button";
                  cancel.textContent = t("cancel");

                  cancel.style.cssText =
                    "width:100%;margin-top:14px;min-height:44px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#222;-webkit-text-fill-color:#222;font-size:15px;font-weight:600;";

                  cancel.onclick = () =>
                    document.body.removeChild(overlay);

                  box.appendChild(title);
                  box.appendChild(grid);
                  box.appendChild(cancel);

                  overlay.appendChild(box);
                  document.body.appendChild(overlay);
                }}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  minHeight: "44px",
                  border: "1px solid #cfd6cf",
                  borderRadius: "7px",
                  background: "#fff",
                  color: "#222",
                  WebkitTextFillColor: "#222",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              />
            </div>

            <div className="add-egg-sale-field">
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

            <div className="add-egg-sale-field">
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

            <div className="add-egg-sale-field">
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

            <div className="add-egg-sale-field">
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

            <div className="add-egg-sale-notes">
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
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "28px",
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
