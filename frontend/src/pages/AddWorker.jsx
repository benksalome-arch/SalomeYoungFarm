import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AddWorker() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "worker",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Your session has expired. Please log in again.");
      return;
    }

    if (!user || user.role !== "admin") {
      alert("Administrator access required.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/workers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create worker.");
        return;
      }

      alert(data.message || "Worker created successfully!");

      navigate("/workers");

    } catch (error) {
      console.error(error);
      alert("Failed to connect to the server.");
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
            <option value="worker">Worker</option>
            <option value="admin">Administrator</option>
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