import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditEggSale() {
  const { t } = useLanguage();
  const { id } = useParams();
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

  useEffect(() => {
    loadSale();
  }, [id]);

  async function loadSale() {
    try {
      const response = await fetch(`${API_URL}/api/egg-sales/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load egg sale.");
      }

      const saleDate = data.sale_date
        ? data.sale_date.split("T")[0]
        : "";

      setFormData({
        sale_date: saleDate,
        customer: data.customer || "",
        quantity: data.quantity ?? "",
        price_per_egg: data.price_per_egg ?? "",
        payment_method: data.payment_method || "Cash",
        notes: data.notes || "",
      });
    } catch (error) {
      console.error("Failed to load egg sale:", error);
    }
  }

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
      const response = await fetch(`${API_URL}/api/egg-sales/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

              <div style={{ position: "relative", width: "100%" }}>
                <div
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "10px 12px",
                    minHeight: "44px",
                    border: "1px solid #cfd6cf",
                    borderRadius: "7px",
                    background: "#fff",
                    color: formData.sale_date ? "#222" : "#777",
                    WebkitTextFillColor: formData.sale_date ? "#222" : "#777",
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    pointerEvents: "none",
                  }}
                >
                  {formData.sale_date
                    ? new Date(formData.sale_date + "T00:00:00").toLocaleDateString("nl-NL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "DD-MM-JJJJ"}
                </div>

                <input
                  type="date"
                  name="sale_date"
                  value={formData.sale_date || ""}
                  onChange={handleChange}
                  required
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
              </div>
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

export default EditEggSale;
