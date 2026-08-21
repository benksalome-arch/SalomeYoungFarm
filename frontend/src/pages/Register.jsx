import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: fullName,
            email,
            password,
            role: "admin",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Could not create account."
        );
        return;
      }

      alert(
        "Account created successfully. You can now log in."
      );

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  const fieldStyle = {
    marginBottom: "20px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#26332a",
  };

  const inputStyle = {
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
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f6f3",
        padding: "30px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "430px",
          maxWidth: "100%",
          background: "#ffffff",
          borderRadius: "12px",
          padding: "34px 38px 28px",
          boxSizing: "border-box",
          boxShadow:
            "0 6px 24px rgba(0, 0, 0, 0.08)",
        }}
      >

        {/* ======================
            HEADER
        ====================== */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          {/* Farm Logo */}

          <img
            src="/salome_young_farm_logo.png"
            alt="Salome Young Farm"
            style={{
              display: "block",
              width: "230px",
              maxWidth: "100%",
              height: "auto",
              margin: "0 auto 18px",
            }}
          />

          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              lineHeight: "1.2",
              fontWeight: "700",
              color: "#17221a",
            }}
          >
            Create Account
          </h1>

          <p
            style={{
              margin: "9px 0 0",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#707770",
            }}
          >
            Create your Salome Young Farm account
          </p>
        </div>

        {/* ======================
            FORM
        ====================== */}

        <form onSubmit={handleRegister}>

          {/* Full Name */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              placeholder="Enter your full name"
              required
              style={inputStyle}
            />
          </div>

          {/* Email */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email address"
              required
              style={inputStyle}
            />
          </div>

          {/* Password */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Minimum 6 characters"
              required
              style={inputStyle}
            />
          </div>

          {/* Confirm Password */}

          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <label style={labelStyle}>
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Enter your password again"
              required
              style={inputStyle}
            />
          </div>

          {/* Create Account Button */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "48px",
              border: "none",
              borderRadius: "7px",
              background: loading
                ? "#78a982"
                : "#087f23",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              transition:
                "background 0.2s ease",
            }}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {/* ======================
            LOGIN
        ====================== */}

        <div
          style={{
            marginTop: "25px",
            paddingTop: "21px",
            borderTop:
              "1px solid #e5e8e5",
            textAlign: "center",
            fontSize: "14px",
            color: "#6b726c",
          }}
        >
          <span>
            Already have an account?{" "}
          </span>

          <Link
            to="/login"
            style={{
              color: "#087f23",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;