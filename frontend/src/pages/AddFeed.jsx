import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddFeed() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    feed_name: "",
    category: "Goat",
    quantity: "",
    unit: "kg",
    minimum_stock: "",
    cost_per_unit: "",
    supplier: "",
    purchase_date: new Date().toISOString().split("T")[0],
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
      const response = await fetch(`${API_URL}/api/feed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      alert(data.message);

      navigate("/feed");
    } catch (err) {
      console.error(err);
      alert("Failed to save feed.");
    }
  }

  return (
    <div className="page">

      <div className="page-header">
        <h1>🌾 {t("addFeed")}</h1>
        <p>{t("addFeedDescription")}</p>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit}>

          <label>{t("feedName")}</label>
          <input
            type="text"
            name="feed_name"
            value={formData.feed_name}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>{t("category")}</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Goat">{t("goat")}</option>
            <option value="Chicken">{t("chicken")}</option>
            <option value="Rabbit">{t("rabbit")}</option>
            <option value="General">{t("general")}</option>
          </select>

          <br /><br />

          <label>{t("quantity")}</label>
          <input
            type="number"
            step="0.01"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>{t("unit")}</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
          >
            <option value="kg">{t("kg")}</option>
            <option value="bags">{t("bags")}</option>
            <option value="litres">{t("litres")}</option>
            <option value="pieces">{t("pieces")}</option>
          </select>

          <br /><br />

          <label>{t("minimumStock")}</label>
          <input
            type="number"
            step="0.01"
            name="minimum_stock"
            value={formData.minimum_stock}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("costPerUnitKES")}</label>
          <input
            type="number"
            step="0.01"
            name="cost_per_unit"
            value={formData.cost_per_unit}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("supplier")}</label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("purchaseDate")}</label>
          <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("notes")}</label>
          <textarea
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
          />

          <br /><br />

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="button" type="submit">
              💾 {t("saveFeed")}
            </button>

            <Link className="button" to="/feed">
              {t("cancel")}
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}

export default AddFeed;
