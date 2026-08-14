import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../api";

function AddGoat() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tag: "",
    name: "",
    breed: "",
    sex: "Female",
    date_of_birth: "",
    weight: "",
    color: "",
    status: "Healthy",
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
        `${API_URL}/api/goats`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to save goat."
        );
        return;
      }

      alert(
        data.message ||
          "Goat saved successfully!"
      );

      navigate("/goats");
    } catch (error) {
      console.error(error);
      alert("Failed to save goat.");
    }
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      {/* PAGE HEADER */}

      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "42px",
            lineHeight: 1.2,
          }}
        >
          🐐 Add New Goat
        </h1>

        <p
          style={{
            margin: "8px 0 0",
          }}
        >
          Register a goat in Salome Young Farm.
        </p>
      </div>

      {/* FORM */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* BASIC INFORMATION */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
              width: "100%",
              minWidth: 0,
              boxSizing: "border-box",
            }}
          >
            <div>
              <label>Ear Tag</label>

              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Breed</label>

              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Sex</label>

              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
              >
                <option value="Female">
                  Female
                </option>

                <option value="Male">
                  Male
                </option>
              </select>
            </div>

            <div>
              <label>Date of Birth</label>

              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Weight (kg)</label>

              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label>Color</label>

              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Healthy">
                  Healthy
                </option>

                <option value="Sick">
                  Sick
                </option>

                <option value="Treated">
                  Treated
                </option>

                <option value="Sold">
                  Sold
                </option>

                <option value="Dead">
                  Dead
                </option>
              </select>
            </div>
          </div>

          {/* NOTES */}

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <label>Notes</label>

            <textarea
              name="notes"
              rows="5"
              value={formData.notes}
              onChange={handleChange}
              style={{
                width: "100%",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          {/* BUTTONS */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "25px",
            }}
          >
            <button
              className="button"
              type="submit"
            >
              💾 Save Goat
            </button>

            <Link
              className="button"
              to="/goats"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddGoat;