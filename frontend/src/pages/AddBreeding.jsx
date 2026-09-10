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

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    minHeight: "44px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    color: "#222",
    WebkitTextFillColor: "#222",
    fontSize: "15px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontWeight: 600,
    fontSize: "15px",
    color: "#222",
    textAlign: "left",
  };

  function handleChange(e) {
    const { name, value } = e.target;

    const updated = {
      ...formData,
      [name]: value,
    };

    if (name === "mating_date") {
      const date = new Date(value);
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

  return (
    <div className="page">
      <div className="card">
        <h1>🧬 {t("newBreedingRecord")}</h1>

        <form onSubmit={handleSubmit} style={{ maxWidth: "520px", margin: "0 auto" }}>

          <p style={{ labelStyle }}>{t("doe")}</p>
          <select
            name="doe_id"
            value={formData.doe_id}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">{t("selectDoe")}</option>

            {goats
              .filter((g) => String(g.sex || "").trim().toLowerCase() === "female")
              .map((g) => (
                <option key={g.id} value={g.id}>
                  {g.tag} - {g.name}
                </option>
              ))}
          </select>

          <p style={{ labelStyle }}>{t("buck")}</p>
          <select
            name="buck_id"
            value={formData.buck_id}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">{t("selectBuck")}</option>

            {goats
              .filter((g) => String(g.sex || "").trim().toLowerCase() === "male")
              .map((g) => (
                <option key={g.id} value={g.id}>
                  {g.tag} - {g.name}
                </option>
              ))}
          </select>

          <p style={{ labelStyle }}>{t("matingDate")}</p>
          <input
            type="text"
            name="mating_date"
            value={formData.mating_date ? formData.mating_date.split("-").reverse().join("-") : ""}
            placeholder="DD-MM-JJJJ"
            readOnly
            required
            onClick={() => {
              const today = new Date();
              const selected = formData.mating_date
                ? new Date(formData.mating_date + "T00:00:00")
                : today;
              const year = selected.getFullYear();
              const month = selected.getMonth();
              const firstDay = new Date(year, month, 1).getDay();
              const daysInMonth = new Date(year, month + 1, 0).getDate();

              const overlay = document.createElement("div");
              overlay.style.cssText =
                "position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:99999;";

              const box = document.createElement("div");
              box.style.cssText =
                "width:min(92vw,360px);background:#fff;border-radius:14px;padding:18px;box-sizing:border-box;box-shadow:0 8px 30px rgba(0,0,0,.25);";

              const title = document.createElement("div");
              title.textContent = selected
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                .replaceAll("/", "-");
              title.style.cssText =
                "text-align:center;font-size:20px;font-weight:700;margin-bottom:14px;";

              const grid = document.createElement("div");
              grid.style.cssText =
                "display:grid;grid-template-columns:repeat(7,1fr);gap:6px;";

              [t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")].forEach(
                (day) => {
                  const el = document.createElement("div");
                  el.textContent = day;
                  el.style.cssText =
                    "text-align:center;font-weight:600;font-size:13px;padding:6px 0;";
                  grid.appendChild(el);
                }
              );

              for (let i = 0; i < firstDay; i++) {
                grid.appendChild(document.createElement("div"));
              }

              for (let day = 1; day <= daysInMonth; day++) {
                const el = document.createElement("button");
                el.type = "button";
                el.textContent = day;

                const isToday =
                  day === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear();

                el.style.cssText =
                  `min-height:40px;border:${isToday ? "2px solid #2e7d32" : "1px solid #ddd"};border-radius:8px;background:${isToday ? "#e8f5e9" : "#fff"};color:#222;-webkit-text-fill-color:#222;font-size:15px;font-weight:600;display:flex;align-items:center;justify-content:center;`;

                el.onclick = () => {
                  const value =
                    year +
                    "-" +
                    String(month + 1).padStart(2, "0") +
                    "-" +
                    String(day).padStart(2, "0");

                  handleChange({
                    target: {
                      name: "mating_date",
                      value,
                    },
                  });

                  document.body.removeChild(overlay);
                };

                grid.appendChild(el);
              }

              const cancel = document.createElement("button");
              cancel.type = "button";
              cancel.textContent = t("cancel");
              cancel.style.cssText =
                "width:100%;margin-top:14px;min-height:44px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#222;-webkit-text-fill-color:#222;font-size:15px;font-weight:600;";
              cancel.onclick = () => document.body.removeChild(overlay);

              box.appendChild(title);
              box.appendChild(grid);
              box.appendChild(cancel);
              overlay.appendChild(box);
              document.body.appendChild(overlay);
            }}
            style={{ ...inputStyle, cursor: "pointer" }}
          />

          <p style={{ labelStyle }}>{t("expectedKidding")}</p>
          <input
            type="text"
            value={
              formData.expected_kidding
                ? formData.expected_kidding.split("-").reverse().join("-")
                : ""
            }
            readOnly
            style={inputStyle}
          />

          <p style={{ labelStyle }}>{t("veterinarian")}</p>
          <input
            type="text"
            name="veterinarian"
            value={formData.veterinarian}
            onChange={handleChange}
            style={inputStyle}
          />

          <p style={{ labelStyle }}>{t("notes")}</p>
          <textarea
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
          />

          <br />
          <br />

          <button className="button" type="submit">
            💾 {t("save")}
          </button>

          {" "}

          <Link className="button" to="/breeding">
            {t("cancel")}
          </Link>

        </form>
      </div>
    </div>
  );
}

export default AddBreeding;
