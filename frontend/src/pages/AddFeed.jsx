import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddFeed() {
  const navigate = useNavigate();

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
      const response = await fetch("${API_URL}/api/feed", {
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
        <h1>ðŸŒ¾ Add Feed</h1>
        <p>Add feed to stock.</p>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit}>

          <label>Feed Name</label>
          <input
            type="text"
            name="feed_name"
            value={formData.feed_name}
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
            <option>Goat</option>
            <option>Chicken</option>
            <option>Rabbit</option>
            <option>General</option>
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

          <label>Cost Per Unit (KES)</label>
          <input
            type="number"
            step="0.01"
            name="cost_per_unit"
            value={formData.cost_per_unit}
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
              ðŸ’¾ Save Feed
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

export default AddFeed;
