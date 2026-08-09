import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddInventory() {
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
        "http://localhost:5000/api/inventory",
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
        <h1>📦 Add Inventory Item</h1>
        <p>Add feed, medicine, equipment or supplies.</p>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit}>

          <label>Item Name</label>
          <input
            type="text"
            name="item_name"
            value={formData.item_name}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option>Feed</option>
            <option>Medicine</option>
            <option>Vaccine</option>
            <option>Equipment</option>
            <option>Fuel</option>
            <option>Building Material</option>
            <option>Other</option>
          </select>

          <br /><br />

          <label>Quantity</label>
          <input
            type="number"
            step="0.01"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>Unit</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
          >
            <option>kg</option>
            <option>bags</option>
            <option>litres</option>
            <option>pieces</option>
            <option>bottles</option>
            <option>packets</option>
          </select>

          <br /><br />

          <label>Minimum Stock</label>
          <input
            type="number"
            step="0.01"
            name="minimum_stock"
            value={formData.minimum_stock}
            onChange={handleChange}
          />

          <br /><br />

          <label>Purchase Price (KES)</label>
          <input
            type="number"
            step="0.01"
            name="purchase_price"
            value={formData.purchase_price}
            onChange={handleChange}
          />

          <br /><br />

          <label>Supplier</label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
          />

          <br /><br />

          <label>Purchase Date</label>
          <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
          />

          <br /><br />

          <label>Notes</label>
          <textarea
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
          />

          <br /><br />

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="button" type="submit">
              💾 Save Item
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