import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddRabbitVaccination() {
  const navigate = useNavigate();

  const [rabbits, setRabbits] = useState([]);

  const [formData, setFormData] = useState({
    rabbit_id: "",
    vaccination_date: new Date().toISOString().split("T")[0],
    vaccine_name: "",
    dosage: "",
    next_due_date: "",
    administered_by: "",
    notes: "",
  });

  useEffect(() => {
    loadRabbits();
  }, []);

  async function loadRabbits() {
    try {
      const response = await fetch(
        "${API_URL}/api/rabbits"
      );

      const data = await response.json();

      setRabbits(
        data.filter(
          (rabbit) =>
            rabbit.status === "Active" ||
            rabbit.status === undefined
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
        "${API_URL}/api/rabbit-vaccinations",
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
        navigate("/rabbit-vaccinations");
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
          <h1>ðŸ’‰ Record Rabbit Vaccination</h1>
        </div>

        <Link
          className="button"
          to="/rabbit-vaccinations"
        >
          â† Back
        </Link>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit}>

          <label>Rabbit</label>

          <select
            name="rabbit_id"
            value={formData.rabbit_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Rabbit</option>

            {rabbits.map((rabbit) => (
              <option
                key={rabbit.id}
                value={rabbit.id}
              >
                {rabbit.tag_number} - {rabbit.name}
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

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              className="button"
              type="submit"
            >
              ðŸ’¾ Save
            </button>

            <Link
              className="button"
              to="/rabbit-vaccinations"
            >
              Cancel
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}

export default AddRabbitVaccination;
