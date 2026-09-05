import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddInventory() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    item_name: "",
    category: "Feed",
    quantity: "",
    unit: "kg",
    minimum_stock: "",
    purchase_price: "",
    supplier: "",
    purchase_date: "",
    notes: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/inventory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      alert(data.message);

      navigate("/inventory");

    } catch (error) {
      console.error(error);
      alert(t("failedToSaveInventory"));
    }
  }

  return (
    <div className="page">

      <div className="page-header">
        <h1>📦 {t("addInventoryItem")}</h1>
        <p>{t("addInventoryDescription")}</p>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "22px 28px",
              alignItems: "start",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("itemName")}
              </label>
              <input
                type="text"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                required
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("category")}
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ width: "100%", boxSizing: "border-box" }}
              >
                <option>{t("feed")}</option>
                <option>{t("medicine")}</option>
                <option>{t("vaccine")}</option>
                <option>{t("equipment")}</option>
                <option>{t("fuel")}</option>
                <option>{t("buildingMaterial")}</option>
                <option>{t("other")}</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("quantity")}
              </label>
              <input
                type="number"
                step="0.01"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("unit")}
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                style={{ width: "100%", boxSizing: "border-box" }}
              >
                <option>{t("kg")}</option>
                <option>{t("bags")}</option>
                <option>{t("litres")}</option>
                <option>{t("pieces")}</option>
                <option>{t("bottles")}</option>
                <option>{t("packets")}</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("minimumStock")}
              </label>
              <input
                type="number"
                step="0.01"
                name="minimum_stock"
                value={formData.minimum_stock}
                onChange={handleChange}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("purchasePriceKES")}
              </label>
              <input
                type="number"
                step="0.01"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleChange}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("supplier")}
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("purchaseDate")}
              </label>
              <input
                type="date"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleChange}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("notes")}
              </label>
              <textarea
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
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
            <button className="button" type="submit">
              💾 {t("save")} {t("item")}
            </button>

            <Link
              className="button"
              to="/inventory"
              style={{ textDecoration: "none" }}
            >
              {t("cancel")}
            </Link>
          </div>
        </form>

      </div>

    </div>
  );
}

export default AddInventory;
