import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditFeed() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [calendarOpen, setCalendarOpen] = useState(false);

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: 600,
    fontSize: "14px",
  };

  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const calendarYears = Array.from(
    { length: 21 },
    (_, i) => new Date().getFullYear() - 10 + i
  );

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
              style={labelStyle}
            >
              Aankoopdatum
            </label>

            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => {
                  const selected = formData.purchase_date
                    ? new Date(formData.purchase_date + "T00:00:00")
                    : new Date();

                  setCalendarMonth(selected);
                  setCalendarOpen(true);
                }}
                style={{
                  ...inputStyle,
                  width: "100%",
                  textAlign: "left",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                {formData.purchase_date
                  ? formData.purchase_date.split("-").reverse().join("-")
                  : "Select date"}
              </button>

              {calendarOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    zIndex: 1000,
                    width: "320px",
                    maxWidth: "calc(100vw - 40px)",
                    background: "#fff",
                    borderRadius: "16px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
                    padding: "18px",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "8px",
                      marginBottom: "15px",
                    }}
                  >
                    <select
                      value={calendarMonth.getMonth()}
                      onChange={(e) =>
                        setCalendarMonth(
                          new Date(
                            calendarMonth.getFullYear(),
                            Number(e.target.value),
                            1
                          )
                        )
                      }
                      style={{ flex: 1, padding: "8px" }}
                    >
                      {monthNames.map((month, index) => (
                        <option key={month} value={index}>
                          {month}
                        </option>
                      ))}
                    </select>

                    <select
                      value={calendarMonth.getFullYear()}
                      onChange={(e) =>
                        setCalendarMonth(
                          new Date(
                            Number(e.target.value),
                            calendarMonth.getMonth(),
                            1
                          )
                        )
                      }
                      style={{ flex: 1, padding: "8px" }}
                    >
                      {calendarYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: "6px",
                      textAlign: "center",
                      marginBottom: "8px",
                      fontWeight: 700,
                      fontSize: "12px",
                    }}
                  >
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                      <div key={day}>{day}</div>
                    ))}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: "6px",
                      justifyItems: "center",
                    }}
                  >
                    {(() => {
                      const year = calendarMonth.getFullYear();
                      const month = calendarMonth.getMonth();
                      const firstDay = new Date(year, month, 1);
                      const daysInMonth = new Date(year, month + 1, 0).getDate();
                      const startDay = (firstDay.getDay() + 6) % 7;
                      const today = new Date();
                      const cells = [];

                      for (let i = 0; i < startDay; i++) {
                        cells.push(
                          <div
                            key={"empty-" + i}
                            style={{ width: 40, height: 40 }}
                          />
                        );
                      }

                      for (let day = 1; day <= daysInMonth; day++) {
                        const value =
                          `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                        const selected =
                          formData.purchase_date === value;

                        const isToday =
                          today.getDate() === day &&
                          today.getMonth() === month &&
                          today.getFullYear() === year;

                        cells.push(
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                purchase_date: value,
                              }));
                              setCalendarOpen(false);
                            }}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              border: "none",
                              cursor: "pointer",
                              background: selected
                                ? "#2e7d32"
                                : isToday
                                ? "#e8f5e9"
                                : "transparent",
                              color: selected ? "#fff" : "#222",
                              fontWeight: selected || isToday ? 700 : 400,
                            }}
                          >
                            {day}
                          </button>
                        );
                      }

                      return cells;
                    })()}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCalendarOpen(false)}
                    style={{
                      marginTop: "15px",
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Annuleren
                  </button>
                </div>
              )}
            </div>

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
