import API_URL from "../api";
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddKidding() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    breeding_id: id,
    kidding_date: "",
    male_kids: 0,
    female_kids: 0,
    stillborn: 0,
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

    try {
      const response = await fetch(`${API_URL}/api/kidding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      alert(data.message);

      navigate("/kidding");
    } catch (err) {
      console.error(err);
      alert("Failed to save kidding record.");
    }
  }

  const formStyle = {
    width: "100%",
    maxWidth: "620px",
    margin: "0 auto",
  };

  const fieldStyle = {
    display: "grid",
    gridTemplateColumns: "150px minmax(0, 260px)",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px",
  };

  const labelStyle = {
    fontWeight: 600,
    fontSize: "15px",
    textAlign: "right",
    color: "#222",
  };

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

  return (
    <div className="page">
      <style>{`
        .add-kidding-form {
          width: 100%;
          max-width: 620px;
          margin: 0 auto;
        }

        .add-kidding-field {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .add-kidding-label {
          font-weight: 600;
          font-size: 15px;
          text-align: right;
          color: #222;
        }

        .add-kidding-notes {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: start;
          gap: 14px;
          margin-bottom: 20px;
        }

        .add-kidding-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 700px) {
          .add-kidding-form {
            max-width: 100%;
          }

          .add-kidding-field {
            grid-template-columns: 105px minmax(0, 1fr);
            gap: 10px;
          }

          .add-kidding-notes {
            grid-template-columns: 105px minmax(0, 1fr);
            gap: 10px;
          }

          .add-kidding-label {
            font-size: 14px;
          }
        }
      `}</style>

      <div className="page-header">
        <h1>🍼 {t("newKidding")}</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="add-kidding-form">

          {/* Kidding date */}
          <div className="add-kidding-field">
            <label className="add-kidding-label">
              {t("kiddingDate")}
            </label>

            <input
              type="text"
              value={
                formData.kidding_date
                  ? formData.kidding_date.split("-").reverse().join("-")
                  : ""
              }
              placeholder="DD-MM-JJJJ"
              readOnly
              onClick={() => {
                const today = new Date();

                const selected = formData.kidding_date
                  ? new Date(formData.kidding_date + "T00:00:00")
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
                      kidding_date: value,
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

          {/* Male kids */}
          <div className="add-kidding-field">
            <label className="add-kidding-label">
              {t("maleKids")}
            </label>

            <input
              type="number"
              name="male_kids"
              min="0"
              value={formData.male_kids}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Female kids */}
          <div className="add-kidding-field">
            <label className="add-kidding-label">
              {t("femaleKids")}
            </label>

            <input
              type="number"
              name="female_kids"
              min="0"
              value={formData.female_kids}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Stillborn */}
          <div className="add-kidding-field">
            <label className="add-kidding-label">
              {t("stillborn")}
            </label>

            <input
              type="number"
              name="stillborn"
              min="0"
              value={formData.stillborn}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Notes */}
          <div className="add-kidding-notes">
            <label className="add-kidding-label">
              {t("notes")}
            </label>

            <textarea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              style={{
                ...inputStyle,
                minHeight: "100px",
                resize: "vertical",
              }}
            />
          </div>

          {/* Buttons */}
          <div className="add-kidding-buttons">
            <button className="button" type="submit">
              💾 {t("save")}
            </button>

            <Link className="button" to="/kidding">
              {t("cancel")}
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddKidding;
