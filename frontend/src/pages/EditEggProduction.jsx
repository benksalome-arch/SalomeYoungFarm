import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditEggProduction() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

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
    loadRecord();
  }, []);

  async function loadChickens() {
    try {
      const response = await fetch(`${API_URL}/api/chickens`);
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

  async function loadRecord() {
    try {
      const response = await fetch(
        `${API_URL}/api/egg-production/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load egg production.");
        navigate("/egg-production");
        return;
      }

      setFormData({
        chicken_id: data.chicken_id || "",
        production_date: data.production_date
          ? data.production_date.split("T")[0]
          : "",
        eggs_collected: data.eggs_collected ?? "",
        broken_eggs: data.broken_eggs ?? data.cracked_eggs ?? 0,
        notes: data.notes || "",
      });
    } catch (err) {
      console.error("Failed to load egg production:", err);
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
        `${API_URL}/api/egg-production/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update egg production.");
        return;
      }

      alert(data.message);
      navigate("/egg-production");
    } catch (err) {
      console.error("Update egg production error:", err);
      alert("Failed to update egg production.");
    }
  }

  function openCalendar() {
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
  }

  return (
    <div className="page">
      <style>{`
        .edit-egg-production-form {
          width: 100%;
          max-width: 620px;
          margin: 0 auto;
        }

        .edit-egg-production-field {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .edit-egg-production-label {
          font-weight: 600;
          font-size: 15px;
          text-align: right;
          color: #222;
          overflow-wrap: anywhere;
          line-height: 1.25;
        }

        .edit-egg-production-input {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 12px;
          min-height: 44px;
          border: 1px solid #cfd6cf;
          border-radius: 7px;
          background: #fff;
          color: #222;
          -webkit-text-fill-color: #222;
          font-size: 15px;
        }

        .edit-egg-production-notes {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: start;
          gap: 14px;
          margin-bottom: 20px;
        }

        .edit-egg-production-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 700px) {
          .edit-egg-production-field,
          .edit-egg-production-notes {
            grid-template-columns: 105px minmax(0, 1fr);
            gap: 10px;
          }
        }
      `}</style>

      <div className="page-header">
        <h1
          style={{
            margin: 0,
            color: "#222",
            WebkitTextFillColor: "#222",
          }}
        >
          ✏ {t("updateProduction")}
        </h1>
      </div>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "620px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#222",
            WebkitTextFillColor: "#222",
          }}
        >
          ✏ {t("updateProduction")}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="edit-egg-production-form"
        >
          <div className="edit-egg-production-field">
            <label className="edit-egg-production-label">
              {t("chicken")}
            </label>

            <select
              className="edit-egg-production-input"
              name="chicken_id"
              value={formData.chicken_id}
              onChange={handleChange}
              required
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

          <div className="edit-egg-production-field">
            <label className="edit-egg-production-label">
              {t("date")}
            </label>

            <input
              type="text"
              name="production_date"
              value={
                formData.production_date
                  ? formData.production_date
                      .split("-")
                      .reverse()
                      .join("-")
                  : ""
              }
              placeholder="DD-MM-JJJJ"
              readOnly
              required
              onClick={openCalendar}
              className="edit-egg-production-input"
              style={{ cursor: "pointer" }}
            />
          </div>

          <div className="edit-egg-production-field">
            <label className="edit-egg-production-label">
              {t("eggs")}
            </label>

            <input
              className="edit-egg-production-input"
              type="number"
              min="0"
              step="1"
              name="eggs_collected"
              value={formData.eggs_collected}
              onChange={handleChange}
              required
            />
          </div>

          <div className="edit-egg-production-field">
            <label className="edit-egg-production-label">
              {t("broken")}
            </label>

            <input
              className="edit-egg-production-input"
              type="number"
              min="0"
              step="1"
              name="broken_eggs"
              value={formData.broken_eggs}
              onChange={handleChange}
            />
          </div>

          <div className="edit-egg-production-notes">
            <label className="edit-egg-production-label">
              {t("notes")}
            </label>

            <textarea
              className="edit-egg-production-input"
              name="notes"
              rows="5"
              value={formData.notes}
              onChange={handleChange}
              style={{
                minHeight: "100px",
                resize: "vertical",
              }}
            />
          </div>

          <div className="edit-egg-production-buttons">
            <button className="button" type="submit">
              💾 {t("save")}
            </button>

            <Link className="button" to="/egg-production">
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEggProduction;
