import { useLanguage } from "../context/LanguageContext";
import API_URL from "../api";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function getTodayLocalDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function calculateExpectedKidding(value) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + 150);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateDisplay(value) {
  if (!value) {
    return "";
  }

  const parts = String(value).slice(0, 10).split("-");

  if (parts.length !== 3) {
    return "";
  }

  const [year, month, day] = parts;

  if (
    year.length !== 4 ||
    month.length !== 2 ||
    day.length !== 2
  ) {
    return "";
  }

  return `${day}-${month}-${year}`;
}

function AddBreeding() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const today = getTodayLocalDate();

  const [goats, setGoats] = useState([]);
  const [formData, setFormData] = useState({
    doe_id: "",
    buck_id: "",
    mating_date: today,
    expected_kidding: calculateExpectedKidding(today),
    veterinarian: "",
    notes: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/api/goats`)
      .then((res) => res.json())
      .then((data) => setGoats(data))
      .catch(console.error);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    const updated = {
      ...formData,
      [name]: value,
    };

    if (name === "mating_date" && value) {
      updated.expected_kidding = calculateExpectedKidding(value);
    }

    setFormData(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch(`${API_URL}/api/breeding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    alert(data.message);
    navigate("/breeding");
  }

  const fieldStyle = {
    width: "100%",
    height: "44px",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    color: "#222",
    WebkitTextFillColor: "#222",
    fontSize: "15px",
    lineHeight: "22px",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    minHeight: "44px",
    margin: "0 0 14px 0",
    padding: 0,
    fontWeight: 600,
    fontSize: "15px",
    lineHeight: "20px",
    color: "#222",
    WebkitTextFillColor: "#222",
    textAlign: "right",
  };

  const dateDisplayStyle = {
    ...fieldStyle,
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
    zIndex: 1,
  };

  const datePickerStyle = {
    ...fieldStyle,
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
    zIndex: 2,
  };

  return (
    <div className="page">
      <div className="card">
        <h1
          style={{
            color: "#222",
            WebkitTextFillColor: "#222",
            opacity: 1,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          🧬 {t("newBreedingRecord")}
        </h1>

        <form onSubmit={handleSubmit} className="breeding-add-form">
          <p style={labelStyle}>{t("doe")}</p>

          <select
            name="doe_id"
            value={formData.doe_id}
            onChange={handleChange}
            required
            style={fieldStyle}
          >
            <option value="">{t("selectDoe")}</option>

            {goats
              .filter(
                (g) =>
                  String(g.sex || "").trim().toLowerCase() ===
                  "female"
              )
              .map((g) => (
                <option key={g.id} value={g.id}>
                  {g.tag} - {g.name}
                </option>
              ))}
          </select>

          <p style={labelStyle}>{t("buck")}</p>

          <select
            name="buck_id"
            value={formData.buck_id}
            onChange={handleChange}
            required
            style={fieldStyle}
          >
            <option value="">{t("selectBuck")}</option>

            {goats
              .filter(
                (g) =>
                  String(g.sex || "").trim().toLowerCase() ===
                  "male"
              )
              .map((g) => (
                <option key={g.id} value={g.id}>
                  {g.tag} - {g.name}
                </option>
              ))}
          </select>

          <p style={labelStyle}>{t("matingDate")}</p>

          <div
            style={{
              position: "relative",
              width: "100%",
              height: "44px",
            }}
          >
            <div style={dateDisplayStyle}>
              {formatDateDisplay(formData.mating_date)}
            </div>

            <input
              type="date"
              name="mating_date"
              value={formData.mating_date}
              onChange={handleChange}
              required
              style={datePickerStyle}
            />
          </div>

          <p style={labelStyle}>{t("expectedKidding")}</p>

          <input
            type="text"
            value={formatDateDisplay(formData.expected_kidding)}
            readOnly
            style={fieldStyle}
          />

          <p style={labelStyle}>{t("veterinarian")}</p>

          <input
            type="text"
            name="veterinarian"
            value={formData.veterinarian}
            onChange={handleChange}
            style={fieldStyle}
          />

          <p style={labelStyle}>{t("notes")}</p>

          <textarea
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            style={{
              ...fieldStyle,
              minHeight: "100px",
              resize: "vertical",
            }}
          />

          <div className="breeding-add-actions">
            <button className="button" type="submit">
              💾 {t("save")}
            </button>

            <Link className="button" to="/breeding">
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBreeding;
