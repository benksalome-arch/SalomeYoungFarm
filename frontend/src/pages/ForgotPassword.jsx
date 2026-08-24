import { useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";
import { useLanguage } from "../context/LanguageContext";

function ForgotPassword() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to process password reset request."
        );
      }

      setMessage(
        "If an account with that email exists, a password reset link has been sent."
      );
      setEmail("");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7f4",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#ffffff",
          borderRadius: "10px",
          padding: "32px",
          boxSizing: "border-box",
          boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            margin: "0 0 8px",
            textAlign: "center",
            color: "#26332a",
            fontSize: "26px",
          }}
        >
          {t("forgotPassword")}
        </h1>

        <p
          style={{
            margin: "0 0 25px",
            textAlign: "center",
            color: "#6b726c",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          {t("forgotPasswordDescription")}
        </p>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#26332a",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {t("emailAddress")}
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            required
            style={{
              width: "100%",
              height: "46px",
              padding: "0 13px",
              boxSizing: "border-box",
              border: "1px solid #d4d9d5",
              borderRadius: "7px",
              background: "#ffffff",
              fontSize: "15px",
              color: "#222",
              outline: "none",
              marginBottom: "18px",
            }}
          />

          {message && (
            <div
              style={{
                marginBottom: "18px",
                padding: "12px",
                borderRadius: "7px",
                background: "#eaf6ec",
                color: "#087f23",
                fontSize: "14px",
                lineHeight: "1.4",
              }}
            >
              {message}
            </div>
          )}

          {error && (
            <div
              style={{
                marginBottom: "18px",
                padding: "12px",
                borderRadius: "7px",
                background: "#fdecec",
                color: "#b42318",
                fontSize: "14px",
                lineHeight: "1.4",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "48px",
              border: "none",
              borderRadius: "7px",
              background: loading ? "#7aa783" : "#087f23",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading ? t("sending") : t("sendResetLink")}
          </button>
        </form>

        <div
          style={{
            marginTop: "22px",
            textAlign: "center",
          }}
        >
          <Link
            to="/login"
            style={{
              color: "#087f23",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
