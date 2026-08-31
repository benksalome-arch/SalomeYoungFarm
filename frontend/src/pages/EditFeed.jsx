import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function EditFeed() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    feed_name: "",
    category: "Goat",
    quantity: "",
    unit: "kg",
    minimum_stock: "",
    cost_per_unit: "",
    supplier: "",
    purchase_date: "",
    notes: "",
  });

  useEffect(() => {
    loadFeed();
  }, []);

  async function loadFeed() {
    try {
      const response = await fetch(
        `${API_URL}/api/feed/${id}`
      );

      const data = await response.json();

      setFormData({
        feed_name: data.feed_name || "",
        category: data.category || "Goat",
        quantity: data.quantity || "",
        unit: data.unit || "kg",
        minimum_stock: data.minimum_stock || "",
        cost_per_unit: data.cost_per_unit || "",
        supplier: data.supplier || "",
        purchase_date: data.purchase_date
          ? data.purchase_date.split("T")[0]
          : "",
        notes: data.notes || "",
      });
    } catch (err) {
      console.error(err);
    }
  }

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
        `${API_URL}/api/feed/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      alert(data.message);

      navigate("/feed");
    } catch (err) {
      console.error(err);
      alert("Failed to update feed.");
    }
  }

  return (
    <div className="page">

      <div className="page-header">
        <h1>✏ {t("editFeed")}</h1>
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
              💾 Update Feed
            </button>

            <Link className="button" to="/feed">
              Cancel
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}

export default EditFeed;
