import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function RegisterChickenFlock() {
  const { t } = useLanguage();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tag_number: "",
    name: "",
    breed: "",
    type: "",
    sex: "Female",
    hatch_date: "",
    source: "",
    quantity: "",
    status: "Active",
    purchase_price: "",
    notes: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const quantity = Number(formData.quantity);

    const payload = {
      ...formData,
      tag_number: formData.tag_number.trim() || null,
      name: formData.name.trim() || null,
      quantity,
      purchase_price:
        formData.purchase_price === ""
          ? 0
          : Number(formData.purchase_price),
    };

    try {
      const response = await fetch(`${API_URL}/api/chickens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/chickens");
      }
    } catch (err) {
      console.error(err);
      alert(t("failedSaveChicken"));
    }
  }

  return (
    <div className="page">

      <div className="page-header">
        <h1>🐔 {t("registerFlock")}</h1>
        <p>{t("registerFlockDescription")}</p>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit}>

          <label>{t("tagNumber")}</label>
          <input
            type="text"
            name="tag_number"
            value={formData.tag_number}
            onChange={handleChange}
          />

          <br />
          <br />

          <label>{t("name")}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <br />
          <br />

          <label>{t("breed")}</label>
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            placeholder={t("chickenBreedExample")}
          />

          <br />
          <br />

          <label>{t("type")}</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder={t("chickenTypeExample")}
          />

          <br />
          <br />

          <label>{t("sex")}</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
          >
            <option value="Female">{t("female")}</option>
            <option value="Male">{t("male")}</option>
          </select>

          <br />
          <br />

          <label>{t("hatchDate")}</label>

          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={formData.hatch_date ? formData.hatch_date.split("-").reverse().join("-") : ""}
              placeholder="DD-MM-JJJJ"
              readOnly
              onClick={() => {
                const today = new Date();
                const selected = formData.hatch_date
                  ? new Date(formData.hatch_date + "T00:00:00")
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
                  "width:min(92vw,320px);background:#fff;border-radius:14px;padding:14px;box-sizing:border-box;box-shadow:0 8px 30px rgba(0,0,0,.25);";

                const title = document.createElement("div");
                title.textContent = selected
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  })
                  .replaceAll("/", "-");
                title.style.cssText =
                  "text-align:center;font-size:20px;font-weight:700;margin-bottom:14px;";

                const grid = document.createElement("div");
                grid.style.cssText =
                  "display:grid;grid-template-columns:repeat(7,1fr);gap:6px;";

                [t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")].forEach(day => {
                  const el = document.createElement("div");
                  el.textContent = day;
                  el.style.cssText =
                    "text-align:center;font-weight:600;font-size:13px;padding:6px 0;";
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

                  el.style.cssText =
                    `min-height:40px;border:${isToday ? "2px solid #2e7d32" : "1px solid #ddd"};border-radius:8px;background:${isToday ? "#e8f5e9" : "#fff"};color:#222;-webkit-text-fill-color:#222;font-size:15px;font-weight:600;display:flex;align-items:center;justify-content:center;`;

                  el.onclick = () => {
                    const value =
                      year +
                      "-" +
                      String(month + 1).padStart(2, "0") +
                      "-" +
                      String(day).padStart(2, "0");

                    setFormData(prev => ({
                      ...prev,
                      hatch_date: value
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
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "16px",
                color: "#222",
                WebkitTextFillColor: "#222",
                backgroundColor: "#fff",
                cursor: "pointer"
              }}
            />
          </div>

          <br />
          <br />

          <label>{t("source")}</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder={t("sourcePlaceholder")}
          />

          <br />
          <br />

          <label>{t("quantity")}</label>
          <input
            type="number"
            min="1"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <br />
          <br />

          <label>{t("status")}</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">{t("active")}</option>
            <option value="Sold">{t("sold")}</option>
            <option value="Dead">{t("dead")}</option>
          </select>

          <br />
          <br />

          <label>{t("purchasePrice")}</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="purchase_price"
            value={formData.purchase_price}
            onChange={handleChange}
            placeholder="0.00"
          />

          <br />
          <br />

          <label>{t("notes")}</label>
          <textarea
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            placeholder={t("additionalInformation")}
          />

          <br />
          <br />

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="button" type="submit">
              💾 {t("save")}
            </button>

            <Link className="button" to="/chickens">
              {t("cancel")}
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}

export default RegisterChickenFlock;
