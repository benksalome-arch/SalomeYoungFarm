import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditGoat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tag: "",
    name: "",
    breed: "",
    sex: "Female",
    date_of_birth: "",
    weight: "",
    status: "Healthy",
    color: "",
    notes: "",
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/goats/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          tag: data.tag || "",
          name: data.name || "",
          breed: data.breed || "",
          sex: data.sex || "Female",
          date_of_birth: data.date_of_birth
            ? String(data.date_of_birth).split("T")[0]
            : "",
          weight: data.weight ?? "",
          status: data.status || "Healthy",
          color: data.color || "",
          notes: data.notes || "",
        });
      })
      .catch((err) => {
        console.error("Failed to load goat:", err);
      });
  }, [id]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const dataToSend = {
        ...formData,
        date_of_birth: formData.date_of_birth
          ? String(formData.date_of_birth).split("T")[0]
          : null,
      };

      const response = await fetch(
        `http://localhost:5000/api/goats/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Update goat error:", data);
        alert(data.message || "Failed to update goat.");
        return;
      }

      alert(data.message || "Goat updated successfully.");

      navigate("/goats");
    } catch (err) {
      console.error("Update goat error:", err);
      alert("Database error.");
    }
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <h1>✏️ Edit Goat</h1>

      <form onSubmit={handleSubmit}>
        <p>Tag</p>
        <input
          name="tag"
          value={formData.tag}
          onChange={handleChange}
        />

        <p>Name</p>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <p>Breed</p>
        <input
          name="breed"
          value={formData.breed}
          onChange={handleChange}
        />

        <p>Sex</p>
        <select
          name="sex"
          value={formData.sex}
          onChange={handleChange}
        >
          <option>Female</option>
          <option>Male</option>
        </select>

        <p>Date of Birth</p>
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
        />

        <p>Weight</p>
        <input
          name="weight"
          value={formData.weight}
          onChange={handleChange}
        />

        <p>Status</p>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option>Healthy</option>
          <option>Sick</option>
          <option>Treated</option>
          <option>Sold</option>
        </select>

        <p>Color</p>
        <input
          name="color"
          value={formData.color}
          onChange={handleChange}
        />

        <p>Notes</p>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
        />

        <br />
        <br />

        <button
          type="submit"
          className="button"
        >
          Update Goat
        </button>
      </form>
    </div>
  );
}

export default EditGoat;