import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function EditWorker() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "Worker",
    active: true,
  });

  useEffect(() => {
    loadWorker();
  }, []);

  async function loadWorker() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/workers/${id}`
      );

      const data = await response.json();

      setFormData({
        full_name: data.full_name,
        email: data.email,
        role: data.role,
        active: Boolean(data.active),
      });

    } catch (error) {
      console.error(error);
      alert("Failed to load worker.");
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/workers/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      alert(data.message);

      navigate("/workers");

    } catch (error) {
      console.error(error);
      alert("Failed to update worker.");
    }
  }

  return (
    <div className="page">

      <div className="page-header">
        <h1>✏ Edit Worker</h1>
        <p>Update worker information.</p>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>

          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          <br />
          <br />

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <br />
          <br />

          <label>Role</label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Worker">Worker</option>
            <option value="Admin">Admin</option>
          </select>

          <br />
          <br />

          <label>
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />{" "}
            Active
          </label>

          <br />
          <br />

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button className="button" type="submit">
              💾 Save Changes
            </button>

            <Link className="button" to="/workers">
              Cancel
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}

export default EditWorker;