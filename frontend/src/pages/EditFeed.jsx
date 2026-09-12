import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditFeed() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    feed_name: "",
    category: "Goat",
    quantity: "",
    unit: "kg",
    minimum_stock: "",
    cost_per_unit: "",
    supplier: "",
    purchase_date: "",
    notes: "",
  });

  useEffect(() => {
    loadFeed();
  }, []);

  async function loadFeed() {
    try {
      const response = await fetch(
        `${API_URL}/api/feed/${id}`
      );

      const data = await response.json();

      setFormData({
        feed_name: data.feed_name || "",
        category: data.category || "Goat",
        quantity: data.quantity || "",
        unit: data.unit || "kg",
        minimum_stock: data.minimum_stock || "",
        cost_per_unit: data.cost_per_unit || "",
        supplier: data.supplier || "",
        purchase_date: data.purchase_date
          ? data.purchase_date.split("T")[0]
          : "",
        notes: data.notes || "",
      });
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
        `${API_URL}/api/feed/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      alert(data.message);

      navigate("/feed");
    } catch (err) {
      console.error(err);
      alert("Failed to update feed.");
    }
  }

  return (
    <div className="page">
      <style>{`
        .edit-feed-form {
          width: 100%;
          max-width: 620px;
          margin: 0 auto;
        }

        .edit-feed-field {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .edit-feed-label {
          font-weight: 600;
          font-size: 15px;
          text-align: right;
          color: #222;
          overflow-wrap: anywhere;
          line-height: 1.25;
        }

        .edit-feed-input {
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

        .edit-feed-notes {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: start;
          gap: 14px;
          margin-bottom: 20px;
        }

        .edit-feed-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 700px) {
          .edit-feed-field,
          .edit-feed-notes {
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
          ✏ {t("updateFeed")}
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
          ✏ {t("updateFeed")}
        </h2>

        <form onSubmit={handleSubmit} className="edit-feed-form">

          <div className="edit-feed-field">
            <label className="edit-feed-label">{t("feedName")}</label>
            <input
              className="edit-feed-input"
              type="text"
              name="feed_name"
              value={formData.feed_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="edit-feed-field">
            <label className="edit-feed-label">{t("category")}</label>
            <select
              className="edit-feed-input"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Goat">{t("goat")}</option>
              <option value="Chicken">{t("chicken")}</option>
              <option value="Rabbit">{t("rabbit")}</option>
              <option value="General">{t("general")}</option>
            </select>
          </div>

          <div className="edit-feed-field">
            <label className="edit-feed-label">{t("quantity")}</label>
            <input
              className="edit-feed-input"
              type="number"
              step="0.01"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="edit-feed-field">
            <label className="edit-feed-label">{t("unit")}</label>
            <select
              className="edit-feed-input"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            >
              <option value="kg">{t("kg")}</option>
              <option value="bags">{t("bags")}</option>
              <option value="litres">{t("litres")}</option>
              <option value="pieces">{t("pieces")}</option>
            </select>
          </div>

          <div className="edit-feed-field">
            <label className="edit-feed-label">{t("minimumStock")}</label>
            <input
              className="edit-feed-input"
              type="number"
              step="0.01"
              name="minimum_stock"
              value={formData.minimum_stock}
              onChange={handleChange}
            />
          </div>

          <div className="edit-feed-field">
            <label className="edit-feed-label">{t("costPerUnitKES")}</label>
            <input
              className="edit-feed-input"
              type="number"
              step="0.01"
              name="cost_per_unit"
              value={formData.cost_per_unit}
              onChange={handleChange}
            />
          </div>

          <div className="edit-feed-field">
            <label className="edit-feed-label">{t("supplier")}</label>
            <input
              className="edit-feed-input"
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
            />
          </div>

          <div className="edit-feed-field">
            <label
              htmlFor="purchase_date"
              className="edit-feed-label"
            >
              {t("purchaseDate")}
            </label>

            <input
              id="purchase_date"
              className="edit-feed-input"
              type="text"
              name="purchase_date"
              value={
                formData.purchase_date
                  ? formData.purchase_date.split("-").reverse().join("-")
                  : ""
              }
              placeholder="DD-MM-JJJJ"
              readOnly
              required
              onClick={() => {
                const today = new Date();

                const selected = formData.purchase_date
                  ? new Date(formData.purchase_date + "T00:00:00")
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
                      purchase_date: value,
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
                cursor: "pointer",
              }}
            />
          </div>

          <div className="edit-feed-notes">
            <label className="edit-feed-label">{t("notes")}</label>
            <textarea
              className="edit-feed-input"
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              style={{
                minHeight: "100px",
                resize: "vertical",
              }}
            />
          </div>

          <div className="edit-feed-buttons">
            <button className="button" type="submit">
              💾 {t("updateFeed")}
            </button>

            <Link className="button" to="/feed">
              {t("cancel")}
            </Link>
          </div>

        </form>
      </div>
    </div>
  )

}

export default EditFeed;
