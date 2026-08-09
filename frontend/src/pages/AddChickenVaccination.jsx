import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddChickenVaccination() {
  const navigate = useNavigate();

  const [chickens, setChickens] = useState([]);

  const [formData, setFormData] = useState({
    chicken_id: "",
    vaccination_date: new Date().toISOString().split("T")[0],
    vaccine_name: "",
    dosage: "",
    next_due_date: "",
    administered_by: "",
    notes: "",
  });

  useEffect(() => {
    loadChickens();
  }, []);

  async function loadChickens() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/chickens"
      );

      const data = await response.json();

      setChickens(
        data.filter(
          (c) =>
            c.status === "Active" &&
            Number(c.quantity) > 0
        )
      );

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
        "http://localhost:5000/api/chicken-vaccinations",
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

      if (response.ok) {
        navigate("/chicken-vaccinations");
      }

    } catch (err) {
      console.error(err);
      alert("Failed to save vaccination.");
    }
  }

  return (
    <div className="page">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1>💉 Record Chicken Vaccination</h1>
        </div>

        <Link
          className="button"
          to="/chicken-vaccinations"
        >
          ← Back
        </Link>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit}>

          <label>Chicken</label>

          <select
            name="chicken_id"
            value={formData.chicken_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Chicken</option>

            {chickens.map((chicken) => (
              <option
                key={chicken.id}
                value={chicken.id}
              >
                {chicken.tag_number} - {chicken.name}
              </option>
            ))}
          </select>

          <br /><br />

          <label>Vaccination Date</label>

          <input
            type="date"
            name="vaccination_date"
            value={formData.vaccination_date}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>Vaccine Name</label>

          <input
            type="text"
            name="vaccine_name"
            value={formData.vaccine_name}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>Dosage</label>

          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
          />

          <br /><br />

          <label>Next Due Date</label>

          <input
            type="date"
            name="next_due_date"
            value={formData.next_due_date}
            onChange={handleChange}
          />

          <br /><br />

          <label>Administered By</label>

          <input
            type="text"
            name="administered_by"
            value={formData.administered_by}
            onChange={handleChange}
          />

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
            <button
              className="button"
              type="submit"
            >
              💾 Save
            </button>

            <Link
              className="button"
              to="/chicken-vaccinations"
            >
              Cancel
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}

export default AddChickenVaccination;