import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function EditWorker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "worker",
    active: true,
  });

  useEffect(() => {
    loadWorker();
  }, [id]);

  async function loadWorker() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Your session has expired. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/workers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load worker.");
        return;
      }

      setFormData({
        full_name: data.full_name,
        email: data.email,
        role: data.role,
        active: Boolean(data.active),
      });

    } catch (error) {
      console.error(error);
      alert("Failed to connect to the server.");
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
        `${API_URL}/api/workers/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update worker.");
        return;
      }

      alert(data.message || "Worker updated successfully!");

      navigate("/workers");

    } catch (error) {
      console.error(error);
      alert("Failed to connect to the server.");
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
            <option value="worker">Worker</option>
            <option value="admin">Administrator</option>
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