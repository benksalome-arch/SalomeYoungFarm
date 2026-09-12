import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddEggProduction() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [chickens, setChickens] = useState([]);

  const [formData, setFormData] = useState({
    chicken_id: "",
    production_date: "",
    eggs_collected: "",
    broken_eggs: 0,
    notes: "",
  });

  useEffect(() => {
    loadChickens();
  }, []);

  async function loadChickens() {
    try {
      const response = await fetch(
        `${API_URL}/api/chickens`
      );

      const data = await response.json();

      setChickens(
        Array.isArray(data)
          ? data.filter(
              (chicken) =>
                chicken.status === "Active" &&
                Number(chicken.quantity) > 0
            )
          : []
      );
    } catch (err) {
      console.error("Failed to load chickens:", err);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...formData,
      chicken_id: Number(formData.chicken_id),
      eggs_collected: Number(formData.eggs_collected),
      broken_eggs: Number(formData.broken_eggs),
    };

    try {
      const response = await fetch(
        `${API_URL}/api/egg-production`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to save egg production."
        );
        return;
      }

      alert(data.message);

      navigate("/egg-production");
    } catch (err) {
      console.error("Save egg production error:", err);

      alert(
        "Failed to save egg production."
      );
    }
  }

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minWidth: 0,
  };

  const labelStyle = {
    fontWeight: 600,
    fontSize: "15px",
    lineHeight: 1.3,
    margin: 0,
  };

  const inputStyle = {
    width: "100%",
    minWidth: 0,
    height: "46px",
    padding: "10px 12px",
    boxSizing: "border-box",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    fontSize: "15px",
  };

  const textareaStyle = {
    width: "100%",
    minWidth: 0,
    minHeight: "120px",
    padding: "10px 12px",
    boxSizing: "border-box",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "inherit",
  };

  return (
    <div
      className="page"
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* PAGE HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(30px, 4vw, 44px)",
              lineHeight: 1.15,
            }}
          >
            🥚 {t("recordProduction")}
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: "16px",
              opacity: 0.75,
            }}
          >
            {t("dailyEggCollection")}
          </p>
        </div>

        <Link
          className="button"
          to="/egg-production"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          ← {t("back")}
        </Link>
      </div>

      {/* FORM CARD */}
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "clamp(20px, 4vw, 35px)",
          boxSizing: "border-box",
        }}
      >
        <form onSubmit={handleSubmit}>

          {/* PRODUCTION DETAILS */}
          <h2
            style={{
              margin: "0 0 25px",
              fontSize: "22px",
              lineHeight: 1.3,
            }}
          >
            🥚 {t("recordProduction")}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "22px",
              width: "100%",
            }}
          >
            {/* CHICKEN */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                {t("chicken")}
              </label>

              <select
                name="chicken_id"
                value={formData.chicken_id}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">
                  {t("selectChicken")}
                </option>

                {chickens.map((chicken) => (
                  <option
                    key={chicken.id}
                    value={chicken.id}
                  >
                    {chicken.tag_number
                      ? `${chicken.tag_number}${
                          chicken.name
                            ? ` - ${chicken.name}`
                            : ""
                        }`
                      : chicken.name ||
                        `Chicken ${chicken.id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                {t("date")}
              </label>

              <input
                type="text"
                name="production_date"
                value={
                  formData.production_date
                    ? formData.production_date.split("-").reverse().join("-")
                    : ""
                }
                placeholder="DD-MM-JJJJ"
                readOnly
                required
                onClick={() => {
                  const today = new Date();

                  const selected = formData.production_date
                    ? new Date(formData.production_date + "T00:00:00")
                    : today;

                  const year = selected.getFullYear();
                  const month = selected.getMonth();
                  const firstDay = new Date(year, month, 1).getDay();
                  const daysInMonth = new Date(
                    year,
                    month + 1,
                    0
                  ).getDate();

                  const overlay = document.createElement("div");

                  overlay.style.cssText =
                    "position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:99999;";

                  const box = document.createElement("div");

                  box.style.cssText =
                    "width:min(92vw,320px);background:#fff;border-radius:14px;padding:18px;box-sizing:border-box;box-shadow:0 8px 30px rgba(0,0,0,.25);";

                  const title = document.createElement("div");

                  title.textContent = selected
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    .replaceAll("/", "-");

                  title.style.cssText =
                    "text-align:center;font-size:20px;font-weight:700;margin-bottom:14px;color:#222;-webkit-text-fill-color:#222;";

                  const grid = document.createElement("div");

                  grid.style.cssText =
                    "display:grid;grid-template-columns:repeat(7,1fr);gap:6px;";

                  [
                    t("sun"),
                    t("mon"),
                    t("tue"),
                    t("wed"),
                    t("thu"),
                    t("fri"),
                    t("sat"),
                  ].forEach((day) => {
                    const el = document.createElement("div");

                    el.textContent = day;

                    el.style.cssText =
                      "text-align:center;font-weight:600;font-size:13px;padding:6px 0;color:#222;-webkit-text-fill-color:#222;";

                    grid.appendChild(el);
                  });

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

                    el.style.cssText = `min-height:40px;border:${
                      isToday ? "2px solid #2e7d32" : "1px solid #ddd"
                    };border-radius:8px;background:${
                      isToday ? "#e8f5e9" : "#fff"
                    };color:#222;-webkit-text-fill-color:#222;font-size:15px;font-weight:600;display:flex;align-items:center;justify-content:center;`;

                    el.onclick = () => {
                      const value =
                        year +
                        "-" +
                        String(month + 1).padStart(2, "0") +
                        "-" +
                        String(day).padStart(2, "0");

                      setFormData((prev) => ({
                        ...prev,
                        production_date: value,
                      }));

                      document.body.removeChild(overlay);
                    };

                    grid.appendChild(el);
                  }

                  const cancel = document.createElement("button");

                  cancel.type = "button";
                  cancel.textContent = t("cancel");

                  cancel.style.cssText =
                    "width:100%;margin-top:14px;min-height:44px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#222;-webkit-text-fill-color:#222;font-size:15px;font-weight:600;";

                  cancel.onclick = () =>
                    document.body.removeChild(overlay);

                  box.appendChild(title);
                  box.appendChild(grid);
                  box.appendChild(cancel);

                  overlay.appendChild(box);
                  document.body.appendChild(overlay);
                }}
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                }}
              />
            </div>

            {/* EGGS COLLECTED */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                {t("eggs")}
              </label>

              <input
                type="number"
                min="0"
                step="1"
                name="eggs_collected"
                value={formData.eggs_collected}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            {/* BROKEN EGGS */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                {t("broken")}
              </label>

              <input
                type="number"
                min="0"
                step="1"
                name="broken_eggs"
                value={formData.broken_eggs}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          {/* NOTES */}
          <div
            style={{
              marginTop: "24px",
            }}
          >
            <label style={labelStyle}>
              {t("notes")}
            </label>

            <textarea
              name="notes"
              rows="5"
              value={formData.notes}
              onChange={handleChange}
              style={{
                ...textareaStyle,
                marginTop: "8px",
              }}
            />
          </div>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "28px",
            }}
          >
            <button
              className="button"
              type="submit"
            >
              💾 {t("save")}
            </button>

            <Link
              className="button"
              to="/egg-production"
            >
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEggProduction;