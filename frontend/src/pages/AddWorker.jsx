import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

function AddWorker() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
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
        <h1>➕ {t("addWorker")}</h1>
        <p>{t("createAccountDescription")}</p>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit} autoComplete="off">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "20px 30px",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                {t("fullName")}
              </label>

              <input
                type="text"
                name="full_name"
                autoComplete="off"
                value={formData.full_name}
                onChange={handleChange}
                placeholder={t("fullName")}
                required
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                {t("email")}
              </label>

              <input
                type="email"
                name="email"
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("email")}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                {t("phone")}
              </label>

              <input
                type="tel"
                name="phone"
                autoComplete="off"
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder={t("phoneNumber")}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                {t("password")}
              </label>

              <input
                type="password"
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("password")}
                required
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                {t("role")}
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{ width: "100%", boxSizing: "border-box" }}
              >
                <option value="worker">{t("worker")}</option>
                <option value="manager">{t("manager")}</option>
                <option value="admin">{t("administrator")}</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginTop: "30px",
            }}
          >
            <button className="button" type="submit">
              💾 {t("saveWorker")}
            </button>

            <Link className="button" to="/workers">
              {t("cancel")}
            </Link>
          </div>
        </form>

      </div>

    </div>
  );
}

export default AddWorker;