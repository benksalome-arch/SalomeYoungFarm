import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

function AddWorker() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

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
      const response = await fetch(`${API_URL}/api/workers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

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

  const labelStyle = {
    fontWeight: "600",
    color: "#222",
    fontSize: "15px",
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1px solid #d5d5d5",
    borderRadius: "7px",
    background: "#fff",
    color: "#222",
    fontSize: "15px",
    minHeight: "44px",
  };

  return (
    <div className="page">
      <div
        className="page-header"
        style={{
          textAlign: "center",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            margin: "0 0 6px 0",
            color: "#222",
            WebkitTextFillColor: "#222",
          }}
        >
          ➕ {t("addWorker")}
        </h1>
        <p style={{ margin: 0 }}>{t("createAccountDescription")}</p>
      </div>

      <div
        className="card"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "28px",
          borderRadius: "12px",
          boxSizing: "border-box",
        }}
      >
        <form onSubmit={handleSubmit} autoComplete="off">
          <div
            className="worker-form-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "180px minmax(0, 1fr)",
              gap: "18px 22px",
              alignItems: "center",
            }}
          >
            <label style={labelStyle}>{t("fullName")}</label>
            <input
              type="text"
              name="full_name"
              autoComplete="off"
              value={formData.full_name}
              onChange={handleChange}
              placeholder={t("fullName")}
              required
              style={inputStyle}
            />

            <label style={labelStyle}>{t("email")}</label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("email")}
              style={inputStyle}
            />

            <label style={labelStyle}>{t("phone")}</label>
            <input
              type="tel"
              name="phone"
              autoComplete="off"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t("phoneNumber")}
              style={inputStyle}
            />

            <label style={labelStyle}>{t("password")}</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("password")}
                required
                style={{
                  ...inputStyle,
                  paddingRight: "46px",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "18px",
                  padding: "4px",
                  lineHeight: 1,
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <label style={labelStyle}>{t("role")}</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="worker">{t("worker")}</option>
              <option value="manager">{t("manager")}</option>
              <option value="admin">{t("administrator")}</option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginTop: "30px",
              flexWrap: "wrap",
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

      <style>{`
        @media (max-width: 700px) {
          .worker-form-grid {
            grid-template-columns: 105px minmax(0, 1fr) !important;
            gap: 16px 12px !important;
          }

          .worker-form-grid input,
          .worker-form-grid select {
            min-width: 0;
          }
        }

        @media (max-width: 430px) {
          .worker-form-grid {
            grid-template-columns: 92px minmax(0, 1fr) !important;
            gap: 15px 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AddWorker;
