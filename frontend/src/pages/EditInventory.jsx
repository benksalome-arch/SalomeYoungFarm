import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function EditInventory() {
  const { id } = useParams();
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

  useEffect(() => {
    loadItem();
  }, []);

  async function loadItem() {
    try {
      const response = await fetch(
        `${API_URL}/api/inventory/${id}`
      );

      const data = await response.json();

      setFormData({
        item_name: data.item_name || "",
        category: data.category || "Feed",
        quantity: data.quantity || "",
        unit: data.unit || "kg",
        minimum_stock: data.minimum_stock || "",
        purchase_price: data.purchase_price || "",
        supplier: data.supplier || "",
        purchase_date: data.purchase_date
          ? data.purchase_date.split("T")[0]
          : "",
        notes: data.notes || "",
      });
    } catch (error) {
      console.error(error);
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
        `${API_URL}/api/inventory/${id}`,
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

      navigate("/inventory");
    } catch (error) {
      console.error(error);
      alert("Failed to update inventory item.");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>✏ {t("editInventoryItem")}</h1>
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
            <option value="Feed">{t("feed")}</option>
            <option value="Medicine">{t("medicine")}</option>
            <option value="Vaccine">{t("vaccine")}</option>
            <option value="Equipment">{t("equipment")}</option>
            <option value="Fuel">{t("fuel")}</option>
            <option value="Building Material">{t("buildingMaterial")}</option>
            <option value="Other">{t("other")}</option>
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
            <option value="bottles">{t("bottles")}</option>
            <option value="packets">{t("packets")}</option>
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
              💾 Update Item
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

export default EditInventory;
