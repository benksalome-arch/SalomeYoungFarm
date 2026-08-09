import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddEggSale() {
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      price_per_egg: Number(formData.price_per_egg),
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/egg-sales",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/egg-sales");
      }

    } catch (err) {
      console.error(err);
      alert("Failed to save egg sale.");
    }
  }

  return (
    <div className="page">

      <div className="page-header">
        <h1>🥚 Record Egg Sale</h1>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit}>

          <label>Sale Date</label>
          <input
            type="date"
            name="sale_date"
            value={formData.sale_date}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>Customer</label>
          <input
            type="text"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            placeholder="Walk-in Customer"
          />

          <br /><br />

          <label>Quantity</label>
          <input
            type="number"
            min="1"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>Price Per Egg (KES)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="price_per_egg"
            value={formData.price_per_egg}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>Payment Method</label>
          <select
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
          >
            <option value="Cash">Cash</option>
            <option value="M-PESA">M-PESA</option>
            <option value="Bank">Bank</option>
          </select>

          <br /><br />

          <label>Notes</label>
          <textarea
            rows="4"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <br /><br />

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="button" type="submit">
              💾 Save
            </button>

            <Link className="button" to="/egg-sales">
              Cancel
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}

export default AddEggSale;