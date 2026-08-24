import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
      alert("Failed to save inventory item.");
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

          <label>{t("itemName")}</label>
          <input
            type="text"
            name="item_name"
            value={formData.item_name}
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
            <option>{t("feed")}</option>
            <option>{t("medicine")}</option>
            <option>{t("vaccine")}</option>
            <option>{t("equipment")}</option>
            <option>{t("fuel")}</option>
            <option>{t("buildingMaterial")}</option>
            <option>{t("other")}</option>
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
            <option>{t("kg")}</option>
            <option>{t("bags")}</option>
            <option>{t("litres")}</option>
            <option>{t("pieces")}</option>
            <option>{t("bottles")}</option>
            <option>{t("packets")}</option>
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

          <label>{t("purchasePriceKES")}</label>
          <input
            type="number"
            step="0.01"
            name="purchase_price"
            value={formData.purchase_price}
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
              💾 {t("save")} Item
            </button>

            <Link className="button" to="/inventory">
              Cancel
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}

export default AddInventory;
