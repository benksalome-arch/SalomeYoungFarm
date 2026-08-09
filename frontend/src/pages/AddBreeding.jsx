import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddBreeding() {
  const navigate = useNavigate();

  const [goats, setGoats] = useState([]);

  const [formData, setFormData] = useState({
    doe_id: "",
    buck_id: "",
    mating_date: "",
    expected_kidding: "",
    veterinarian: "",
    notes: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/goats")
      .then((res) => res.json())
      .then((data) => setGoats(data))
      .catch(console.error);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    const updated = {
      ...formData,
      [name]: value,
    };

    if (name === "mating_date") {
      const date = new Date(value);
      date.setDate(date.getDate() + 150);

      updated.expected_kidding = date.toISOString().split("T")[0];
    }

    setFormData(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/breeding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    alert(data.message);
    navigate("/breeding");
  }

  return (
    <div className="page">
      <div className="card">
        <h1>🧬 New Breeding Record</h1>

        <form onSubmit={handleSubmit}>

          <p>Doe</p>
          <select
            name="doe_id"
            value={formData.doe_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Doe</option>

            {goats
              .filter((g) => g.sex === "Female")
              .map((g) => (
                <option key={g.id} value={g.id}>
                  {g.tag} - {g.name}
                </option>
              ))}
          </select>

          <p>Buck</p>
          <select
            name="buck_id"
            value={formData.buck_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Buck</option>

            {goats
              .filter((g) => g.sex === "Male")
              .map((g) => (
                <option key={g.id} value={g.id}>
                  {g.tag} - {g.name}
                </option>
              ))}
          </select>

          <p>Mating Date</p>
          <input
            type="date"
            name="mating_date"
            value={formData.mating_date}
            onChange={handleChange}
            required
          />

          <p>Expected Kidding</p>
          <input
            type="date"
            value={formData.expected_kidding}
            readOnly
          />

          <p>Veterinarian</p>
          <input
            type="text"
            name="veterinarian"
            value={formData.veterinarian}
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

          <Link className="button" to="/breeding">
            Cancel
          </Link>

        </form>
      </div>
    </div>
  );
}

export default AddBreeding;