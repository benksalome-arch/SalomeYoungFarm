import { useState } from "react";
import API_URL from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful!");

      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err);
      alert("Unable to connect to server.");
    }
  }

  function goToRegister() {
    window.location.href = "/register";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
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
          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.08)",
        }}
      >

        {/* LOGO + HEADER */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <img
            src="/salome_young_farm_logo.png"
            alt="Salome Young Farm"
            style={{
              width: "190px",
              maxWidth: "100%",
              height: "auto",
              display: "block",
              margin: "0 auto 20px",
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
            Login
          </h1>

          <p
            style={{
              margin: "9px 0 0",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#707770",
            }}
          >
            Sign in to Salome Young Farm
          </p>
        </div>

        {/* FORM */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#26332a",
              }}
            >
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
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
              }}
            />
          </div>

          {/* PASSWORD */}

          <div
            style={{
              marginBottom: "10px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#26332a",
              }}
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
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
              }}
            />
          </div>

          {/* FORGOT PASSWORD */}

          <div
            style={{
              textAlign: "right",
              marginBottom: "22px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                alert("Password reset will be added next.")
              }
              style={{
                border: "none",
                background: "none",
                padding: 0,
                color: "#087f23",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            style={{
              width: "100%",
              height: "48px",
              border: "none",
              borderRadius: "7px",
              background: "#087f23",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        {/* REGISTER */}

        <div
          style={{
            marginTop: "25px",
            paddingTop: "21px",
            borderTop: "1px solid #e5e8e5",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              fontSize: "14px",
              color: "#6b726c",
            }}
          >
            Don't have an account?
          </p>

          <button
            type="button"
            onClick={goToRegister}
            style={{
              width: "100%",
              height: "46px",
              border: "1px solid #087f23",
              borderRadius: "7px",
              background: "#ffffff",
              color: "#087f23",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Create New Account
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;