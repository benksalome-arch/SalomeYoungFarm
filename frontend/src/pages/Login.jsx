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
        alert(
          data.message ||
            "Login failed."
        );
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login successful!");

      window.location.href = "/";
    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      alert(
        "Unable to connect to server."
      );
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        className="card"
        style={{
          width: "400px",
          maxWidth: "90%",
          padding: "30px",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          🔐 Login
        </h1>

        <form onSubmit={handleLogin}>
          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
            />
          </div>

          <button
            type="submit"
            className="button"
            style={{
              width: "100%",
            }}
          >
            🔐 Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;