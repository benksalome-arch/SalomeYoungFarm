import { useLanguage } from "../context/LanguageContext";
import API_URL from "../api";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddBreeding() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [goats, setGoats] = useState([]);
  const [formData, setFormData] = useState({
    doe_id: "",
    buck_id: "",
    mating_date: "",
    expected_kidding: "",
    veterinarian: "",
    notes: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/api/goats`)
      .then((res) => res.json())
      .then((data) => setGoats(data))
      .catch(console.error);
  }, []);

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

  function handleChange(e) {
    const { name, value } = e.target;

    const updated = {
      ...formData,
      [name]: value,
    };

    if (name === "mating_date" && value) {
      const date = new Date(`${value}T00:00:00`);
      date.setDate(date.getDate() + 150);

      updated.expected_kidding = date.toISOString().split("T")[0];
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

  const dateFieldStyle = {
    ...fieldStyle,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left",
    cursor: "pointer",
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

          <div style={{ position: "relative", width: "100%", marginBottom: "14px" }}>
            <div
              style={{
                ...dateFieldStyle,
                width: "100%",
                color: formData.mating_date ? "#222" : "#777",
                WebkitTextFillColor: formData.mating_date ? "#222" : "#777",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              {formData.mating_date
                ? new Date(
                    formData.mating_date + "T00:00:00"
                  ).toLocaleDateString("nl-NL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "DD-MM-JJJJ"}
            </div>

            <input
              type="date"
              name="mating_date"
              value={formData.mating_date}
              onChange={handleChange}
              onClick={(e) => e.currentTarget.showPicker?.()}
              onFocus={(e) => e.currentTarget.showPicker?.()}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBreeding;