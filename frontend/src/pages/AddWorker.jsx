import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddWorker() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "Worker",
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
        "http://localhost:5000/api/workers",
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

      navigate("/workers");

    } catch (error) {
      console.error(error);
      alert("Failed to create worker.");
    }
  }

  return (
    <div className="page">

      <div className="page-header">
        <h1>➕ Add Worker</h1>
        <p>Create a new user account.</p>
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

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
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

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button className="button" type="submit">
              💾 Save Worker
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

export default AddWorker;