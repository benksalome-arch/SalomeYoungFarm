import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddChicken() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tag_number: "",
    name: "",
    breed: "",
    type: "Layer",
    sex: "Female",
    hatch_date: "",
    source: "",
    quantity: 1,
    status: "Active",
    purchase_price: "",
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
      purchase_price:
        formData.purchase_price === ""
          ? 0
          : Number(formData.purchase_price),
    };

    try {
      const response = await fetch(
        "${API_URL}/api/chickens",
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
        navigate("/chickens");
      }

    } catch (err) {
      console.error(err);
      alert("Failed to save chicken.");
    }
  }

  return (
    <div className="page">

      <div className="page-header">
        <h1>ðŸ” Add Chicken</h1>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit}>

          <label>Tag Number</label>
          <input
            type="text"
            name="tag_number"
            value={formData.tag_number}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <br /><br />

          <label>Breed</label>
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="Layer">Layer</option>
            <option value="Broiler">Broiler</option>
            <option value="Cockerel">Cockerel</option>
            <option value="Cock">Cock</option>
            <option value="Hen">Hen</option>
            <option value="Chick">Chick</option>
          </select>

          <br /><br />

          <label>Sex</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>

          <br /><br />

          <label>Hatch Date</label>
          <input
            type="date"
            name="hatch_date"
            value={formData.hatch_date}
            onChange={handleChange}
          />

          <br /><br />

          <label>Source</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
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

          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Sold">Sold</option>
            <option value="Dead">Dead</option>
          </select>

          <br /><br />

          <label>Purchase Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="purchase_price"
            value={formData.purchase_price}
            onChange={handleChange}
            placeholder="0.00"
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
              ðŸ’¾ Save
            </button>

            <Link className="button" to="/chickens">
              Cancel
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}

export default AddChicken;
