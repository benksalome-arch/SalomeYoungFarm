import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddChickenVaccination() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [chickens, setChickens] = useState([]);

  const [formData, setFormData] = useState({
    chicken_id: "",
    vaccination_date: "",
    vaccine_name: "",
    dosage: "",
    next_due_date: "",
    administered_by: "",
    notes: "",
  });

  useEffect(() => {
    loadChickens();
  }, []);

  async function loadChickens() {
    try {
      const response = await fetch(`${API_URL}/api/chickens`);
      const data = await response.json();

      setChickens(
        data.filter(
          (c) =>
            c.status === "Active" &&
            Number(c.quantity) > 0
        )
      );
    } catch (err) {
      console.error(err);
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

    try {
      const response = await fetch(
        `${API_URL}/api/chicken-vaccinations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/chicken-vaccinations");
      }
    } catch (err) {
      console.error(err);
      alert(t("failedSaveVaccination"));
    }
  }

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    minWidth: 0,
  };

  const labelStyle = {
    display: "block",
    fontWeight: 600,
    fontSize: "15px",
    lineHeight: 1.3,
    margin: 0,
    color: "#222",
  };

  const inputStyle = {
    width: "100%",
    minWidth: 0,
    height: "44px",
    padding: "9px 12px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    color: "#222",
    WebkitTextFillColor: "#222",
    boxSizing: "border-box",
    fontSize: "15px",
  };

  const textareaStyle = {
    width: "100%",
    minWidth: 0,
    padding: "10px 12px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    boxSizing: "border-box",
    fontSize: "15px",
    resize: "vertical",
    minHeight: "120px",
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
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(30px, 4vw, 44px)",
              lineHeight: 1.15,
              color: "#222",
              WebkitTextFillColor: "#222",
            }}
          >
            💉 {t("recordChickenVaccination")}
          </h1>
        </div>

        <Link
          className="button"
          to="/chicken-vaccinations"
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
          padding: "clamp(18px, 3vw, 32px)",
          boxSizing: "border-box",
        }}
      >
        <form onSubmit={handleSubmit}>

          {/* VACCINATION DETAILS */}
          <section>
            <h2
              style={{
                margin: "0 0 20px",
                fontSize: "22px",
                lineHeight: 1.3,
              }}
            >
              💉 {t("recordChickenVaccination")}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
                gap: "20px",
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
                      {chicken.tag_number} - {chicken.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* VACCINATION DATE */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("vaccinationDate")}
                </label>

                <input
                  type="text"
                  name="vaccination_date"
                  value={
                    formData.vaccination_date
                      ? formData.vaccination_date.split("-").reverse().join("-")
                      : ""
                  }
                  placeholder="DD-MM-JJJJ"
                  readOnly
                  required
                  onClick={() => {
                    const today = new Date();
                    const selected = formData.vaccination_date
                      ? new Date(formData.vaccination_date + "T00:00:00")
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
                      "text-align:center;font-size:20px;font-weight:700;margin-bottom:14px;color:#222;";

                    const grid = document.createElement("div");
                    grid.style.cssText =
                      "display:grid;grid-template-columns:repeat(7,1fr);gap:6px;";

                    [t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")].forEach(
                      (day) => {
                        const el = document.createElement("div");
                        el.textContent = day;
                        el.style.cssText =
                          "text-align:center;font-weight:600;font-size:13px;padding:6px 0;color:#222;";
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
                        "min-height:40px;border:" +
                        (isToday ? "2px solid #2e7d32" : "1px solid #ddd") +
                        ";border-radius:8px;background:" +
                        (isToday ? "#e8f5e9" : "#fff") +
                        ";color:#222;-webkit-text-fill-color:#222;font-size:15px;font-weight:600;display:flex;align-items:center;justify-content:center;";

                      el.onclick = () => {
                        const value =
                          year +
                          "-" +
                          String(month + 1).padStart(2, "0") +
                          "-" +
                          String(day).padStart(2, "0");

                        setFormData((prev) => ({
                          ...prev,
                          vaccination_date: value,
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

                    cancel.onclick = () => document.body.removeChild(overlay);

                    box.appendChild(title);
                    box.appendChild(grid);
                    box.appendChild(cancel);
                    overlay.appendChild(box);
                    document.body.appendChild(overlay);
                  }}
                  style={inputStyle}
                />
              </div>

              {/* VACCINE NAME */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("vaccineName")}
                </label>

                <input
                  type="text"
                  name="vaccine_name"
                  value={formData.vaccine_name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              {/* DOSAGE */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("dosage")}
                </label>

                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* NEXT DUE DATE */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("nextDueDate")}
                </label>

                <input
                  type="text"
                  name="next_due_date"
                  value={
                    formData.next_due_date
                      ? formData.next_due_date.split("-").reverse().join("-")
                      : ""
                  }
                  placeholder="DD-MM-JJJJ"
                  readOnly
                  onClick={() => {
                    const today = new Date();
                    const selected = formData.next_due_date
                      ? new Date(formData.next_due_date + "T00:00:00")
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
                      "text-align:center;font-size:20px;font-weight:700;margin-bottom:14px;color:#222;";

                    const grid = document.createElement("div");
                    grid.style.cssText =
                      "display:grid;grid-template-columns:repeat(7,1fr);gap:6px;";

                    [t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")].forEach(
                      (day) => {
                        const el = document.createElement("div");
                        el.textContent = day;
                        el.style.cssText =
                          "text-align:center;font-weight:600;font-size:13px;padding:6px 0;color:#222;";
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
                        "min-height:40px;border:" +
                        (isToday ? "2px solid #2e7d32" : "1px solid #ddd") +
                        ";border-radius:8px;background:" +
                        (isToday ? "#e8f5e9" : "#fff") +
                        ";color:#222;-webkit-text-fill-color:#222;font-size:15px;font-weight:600;display:flex;align-items:center;justify-content:center;";

                      el.onclick = () => {
                        const value =
                          year +
                          "-" +
                          String(month + 1).padStart(2, "0") +
                          "-" +
                          String(day).padStart(2, "0");

                        setFormData((prev) => ({
                          ...prev,
                          next_due_date: value,
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

                    cancel.onclick = () => document.body.removeChild(overlay);

                    box.appendChild(title);
                    box.appendChild(grid);
                    box.appendChild(cancel);
                    overlay.appendChild(box);
                    document.body.appendChild(overlay);
                  }}
                  style={inputStyle}
                />
              </div>

              {/* ADMINISTERED BY */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("administeredBy")}
                </label>

                <input
                  type="text"
                  name="administered_by"
                  value={formData.administered_by}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>
          </section>

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
              rows="5"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              style={{
                ...textareaStyle,
                marginTop: "7px",
              }}
            />
          </div>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "25px",
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
              to="/chicken-vaccinations"
            >
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddChickenVaccination;