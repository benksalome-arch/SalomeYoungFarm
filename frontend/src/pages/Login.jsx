import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function Login() {
  const navigate = useNavigate();

  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "en", flag: "🇬🇧", name: "English" },
    { code: "nl", flag: "🇳🇱", name: "Nederlands" },
    { code: "sw", flag: "🇰🇪", name: "Swahili" },
  ];

  function chooseLanguage(code) {
    setLanguage(code);
    localStorage.setItem("syf_language", code);
  }

  const text = {
    en: {
      title: "Login",
      subtitle: "Sign in to Salome Young Farm",
      language: "Choose your language",
      email: "Email Address",
      emailPlaceholder: "Enter your email address",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      forgot: "Forgot password?",
      login: "Login",
      noAccount: "Don't have an account?",
      register: "Register",
      error: "Invalid email or password.",
    },
    nl: {
      title: "Inloggen",
      subtitle: "Log in bij Salome Young Farm",
      language: "Kies je taal",
      email: "E-mailadres",
      emailPlaceholder: "Voer je e-mailadres in",
      password: "Wachtwoord",
      passwordPlaceholder: "Voer je wachtwoord in",
      forgot: "Wachtwoord vergeten?",
      login: "Inloggen",
      noAccount: "Heb je geen account?",
      register: "Registreren",
      error: "Ongeldig e-mailadres of wachtwoord.",
    },
    sw: {
      title: "Ingia",
      subtitle: "Ingia kwenye Salome Young Farm",
      language: "Chagua lugha yako",
      email: "Barua pepe",
      emailPlaceholder: "Weka barua pepe yako",
      password: "Nenosiri",
      passwordPlaceholder: "Weka nenosiri lako",
      forgot: "Umesahau nenosiri?",
      login: "Ingia",
      noAccount: "Huna akaunti?",
      register: "Jisajili",
      error: "Barua pepe au nenosiri si sahihi.",
    },
  };

  const t = text[language];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || t.error);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }

  function goToForgotPassword() {
    navigate("/forgot-password");
  }

  function goToRegister() {
    navigate("/register");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
        background: "#f4f6f8",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#ffffff",
          borderRadius: "14px",
          padding: "30px",
          boxSizing: "border-box",
          boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
        }}
      >
        {/* LANGUAGE */}

        <div
          style={{
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "12px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#26332a",
            }}
          >
            {t.language}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
            }}
          >
            {languages.map((item) => {
              const selected = language === item.code;

              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => chooseLanguage(item.code)}
                  style={{
                    minWidth: 0,
                    padding: "10px 5px",
                    borderRadius: "9px",
                    border: selected
                      ? "2px solid #087f23"
                      : "1px solid #d8ddd9",
                    background: selected
                      ? "#eef8f0"
                      : "#ffffff",
                    cursor: "pointer",
                    color: "#26332a",
                    fontWeight: selected ? "700" : "500",
                    fontSize: "13px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "25px",
                      lineHeight: 1,
                      marginBottom: "5px",
                    }}
                  >
                    {item.flag}
                  </div>

                  {item.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* LOGO */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
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
            {t.title}
          </h1>

          <p
            style={{
              margin: "9px 0 0",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#707770",
            }}
          >
            {t.subtitle}
          </p>
        </div>

        <form onSubmit={handleLogin}>
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
              {t.email}
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
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
              {t.password}
            </label>

            <div
              style={{
                position: "relative",
                width: "100%",
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                autoComplete="current-password"
                required
                style={{
                  width: "100%",
                  height: "46px",
                  padding: "0 48px 0 13px",
                  boxSizing: "border-box",
                  border: "1px solid #d4d9d5",
                  borderRadius: "7px",
                  background: "#ffffff",
                  fontSize: "15px",
                  color: "#222",
                  outline: "none",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "20px",
                  padding: "4px",
                  color: "#555",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                marginTop: "15px",
                marginBottom: "15px",
                padding: "10px",
                borderRadius: "7px",
                background: "#ffebee",
                color: "#c62828",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              textAlign: "right",
              marginBottom: "22px",
            }}
          >
            <button
              type="button"
              onClick={goToForgotPassword}
              style={{
                border: "none",
                background: "none",
                padding: 0,
                color: "#087f23",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {t.forgot}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "48px",
              border: "none",
              borderRadius: "7px",
              background: loading ? "#6aa875" : "#087f23",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "..." : t.login}
          </button>
        </form>

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
            {t.noAccount}
          </p>

          <button
            type="button"
            onClick={goToRegister}
            style={{
              width: "100%",
              height: "44px",
              border: "1px solid #087f23",
              borderRadius: "7px",
              background: "#ffffff",
              color: "#087f23",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {t.register}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
