import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddFeed() {
  const navigate = useNavigate();
  const { t } = useLanguage();

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

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/feed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/feed");
      }
    } catch (err) {
      console.error(err);
      alert(t("serverConnectionFailed"));
    }
  }

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

  const responsiveStyles = `
    .add-feed-field {
      display: grid;
      grid-template-columns: 150px minmax(0, 260px);
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }

    .add-feed-field > label,
    .add-feed-notes > label {
      margin: 0 !important;
      font-weight: 600 !important;
      font-size: 15px !important;
      text-align: right !important;
      color: #222 !important;
      -webkit-text-fill-color: #222 !important;
    }

    .add-feed-field input,
    .add-feed-field select,
    .add-feed-notes textarea {
      width: 100% !important;
      box-sizing: border-box !important;
      padding: 10px 12px !important;
      min-height: 44px !important;
      border: 1px solid #cfd6cf !important;
      border-radius: 7px !important;
      background: #fff !important;
      color: #222 !important;
      -webkit-text-fill-color: #222 !important;
      font-size: 15px !important;
    }

    .add-feed-field > div {
      min-width: 0;
    }

    .add-feed-field > div {
      display: flex;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 8px;
      background: #fff;
      overflow: hidden;
    }

    .add-feed-field > div input {
      flex: 1 1 auto !important;
      min-width: 0 !important;
      width: auto !important;
      border: none !important;
      outline: none !important;
      border-radius: 0 !important;
      margin: 0 !important;
    }

    .add-feed-field > div select {
      flex: 0 0 105px !important;
      width: 105px !important;
      min-width: 105px !important;
      border: none !important;
      border-left: 1px solid #ddd !important;
      outline: none !important;
      border-radius: 0 !important;
      margin: 0 !important;
    }

    .add-feed-notes {
      display: grid;
      grid-template-columns: 150px minmax(0, 260px);
      align-items: start;
      gap: 14px;
      margin-bottom: 20px;
    }

    .add-feed-notes textarea {
      min-height: 100px !important;
      resize: vertical;
    }

    @media (max-width: 700px) {
      .add-feed-field,
      .add-feed-notes {
        grid-template-columns: 105px minmax(0, 1fr);
        gap: 10px;
      }
    }
  `;

  return (
    <div className="page">
      <style>{responsiveStyles}</style>
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 6px 0",
              color: "#222",
              WebkitTextFillColor: "#222",
            }}
          >
            🌾 {t("addFeed")}
          </h1>

          <p style={{ margin: 0 }}>
            {t("addFeedDescription")}
          </p>
        </div>

        <Link
          className="button"
          to="/feed"
          style={{
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          ← {t("back")}
        </Link>
      </div>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "620px",
          margin: "0 auto",
          padding: "30px",
          boxSizing: "border-box",
          borderRadius: "14px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginTop: 0,
            marginBottom: "30px",
            color: "#222",
            WebkitTextFillColor: "#222",
          }}
        >
          🌾 {t("feedManagement")}
        </h2>

        <form onSubmit={handleSubmit} className="add-feed-form">
          <div
            style={{
              display: "block",
            }}
          >
            <div className="add-feed-field">
              <label
                htmlFor="feed_name"
                style={labelStyle}
              >
                {t("feedName")}
              </label>

              <input
                id="feed_name"
                type="text"
                name="feed_name"
                value={formData.feed_name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div className="add-feed-field">
              <label
                htmlFor="category"
                style={labelStyle}
              >
                {t("category")}
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Goat">
                  {t("goat")}
                </option>

                <option value="Chicken">
                  {t("chicken")}
                </option>

                <option value="Rabbit">
                  {t("rabbit")}
                </option>

                <option value="General">
                  {t("general")}
                </option>
              </select>
            </div>

            <div className="add-feed-field">
              <label
                htmlFor="quantity"
                style={labelStyle}
              >
                {t("quantity")}
              </label>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  background: "white",
                  overflow: "hidden",
                }}
              >
                <input
                  id="quantity"
                  type="number"
                  step="0.01"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  style={{
                    ...inputStyle,
                    flex: 1,
                    minWidth: 0,
                    border: "none",
                    outline: "none",
                    borderRadius: 0,
                    margin: 0,
                  }}
                />

                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  aria-label={t("unit")}
                  style={{
                    width: "105px",
                    flexShrink: 0,
                    padding: "10px 8px",
                    border: "none",
                    borderLeft: "1px solid #ddd",
                    outline: "none",
                    background: "white",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  <option value="kg">
                    {t("kg")}
                  </option>
                  <option value="bags">
                    {t("bags")}
                  </option>
                  <option value="litres">
                    {t("litres")}
                  </option>
                  <option value="pieces">
                    {t("pieces")}
                  </option>
                </select>
              </div>
            </div>

            <div className="add-feed-field">
              <label
                htmlFor="minimum_stock"
                style={labelStyle}
              >
                {t("minimumStock")}
              </label>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  background: "white",
                  overflow: "hidden",
                }}
              >
                <input
                  id="minimum_stock"
                  type="number"
                  step="0.01"
                  name="minimum_stock"
                  value={formData.minimum_stock}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    flex: 1,
                    minWidth: 0,
                    border: "none",
                    outline: "none",
                    borderRadius: 0,
                    margin: 0,
                  }}
                />

                <select
                  value={formData.unit}
                  onChange={handleChange}
                  name="unit"
                  aria-label={t("unit")}
                  style={{
                    width: "105px",
                    flexShrink: 0,
                    padding: "10px 8px",
                    border: "none",
                    borderLeft: "1px solid #ddd",
                    outline: "none",
                    background: "white",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  <option value="kg">
                    {t("kg")}
                  </option>
                  <option value="bags">
                    {t("bags")}
                  </option>
                  <option value="litres">
                    {t("litres")}
                  </option>
                  <option value="pieces">
                    {t("pieces")}
                  </option>
                </select>
              </div>
            </div>

            <div className="add-feed-field">
              <label
                htmlFor="cost_per_unit"
                style={labelStyle}
              >
                {t("costPerUnitKES")}
              </label>

              <input
                id="cost_per_unit"
                type="number"
                step="0.01"
                name="cost_per_unit"
                value={formData.cost_per_unit}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div className="add-feed-field">
              <label
                htmlFor="supplier"
                style={labelStyle}
              >
                {t("supplier")}
              </label>

              <input
                id="supplier"
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div className="add-feed-field">
              <label
                htmlFor="purchase_date"
                style={labelStyle}
              >
                {t("purchaseDate")}
              </label>

              <input
                id="purchase_date"
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
                  ...inputStyle,
                  cursor: "pointer",
                }}
              />
            </div>

            <div className="add-feed-notes">
              <label
                htmlFor="notes"
                style={{
                  ...labelStyle,
                  textAlign: "center",
                }}
              >
                {t("notes")}
              </label>

              <textarea
                id="notes"
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
                placeholder={t("notesPlaceholder")}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "28px",
            }}
          >
            <button
              className="button"
              type="submit"
            >
              💾 {t("saveFeed")}
            </button>

            <Link
              className="button"
              to="/feed"
              style={{
                textDecoration: "none",
              }}
            >
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFeed;
