import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function AddKidding() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    breeding_id: id,
    kidding_date: "",
    male_kids: 0,
    female_kids: 0,
    stillborn: 0,
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
      const response = await fetch("http://localhost:5000/api/kidding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      alert(data.message);

      navigate("/kidding");

    } catch (err) {
      console.error(err);
      alert("Failed to save kidding record.");
    }
  }

  return (
    <div className="page">
      <div className="card">

        <h1>🍼 Register Kidding</h1>

        <form onSubmit={handleSubmit}>

          <p>Kidding Date</p>

          <input
            type="date"
            name="kidding_date"
            value={formData.kidding_date}
            onChange={handleChange}
            required
          />

          <p>Male Kids</p>

          <input
            type="number"
            name="male_kids"
            min="0"
            value={formData.male_kids}
            onChange={handleChange}
          />

          <p>Female Kids</p>

          <input
            type="number"
            name="female_kids"
            min="0"
            value={formData.female_kids}
            onChange={handleChange}
          />

          <p>Stillborn</p>

          <input
            type="number"
            name="stillborn"
            min="0"
            value={formData.stillborn}
            onChange={handleChange}
          />

          <p>Notes</p>

          <textarea
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
          />

          <br />
          <br />

          <button className="button" type="submit">
            💾 Save
          </button>

          {" "}

          <Link className="button" to="/kidding">
            Cancel
          </Link>

        </form>

      </div>
    </div>
  );
}

export default AddKidding;