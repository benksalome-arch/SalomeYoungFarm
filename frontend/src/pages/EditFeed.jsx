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

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    boxSizing: "border-box",
    background: "#fff",
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
          max-width: 760px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 20px 24px;
        }

        .edit-feed-field {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
          margin: 0;
        }

        .edit-feed-label {
          display: block;
          width: 100%;
          margin: 0 0 7px;
          padding: 0;
          font-weight: 600;
          font-size: 14px;
          line-height: 1.3;
          text-align: left;
          color: #222;
        }

        .edit-feed-input {
          display: block !important;
          width: 100% !important;
          max-width: none !important;
          min-width: 0 !important;
          height: 48px !important;
          min-height: 48px !important;
          box-sizing: border-box !important;
          margin: 0 !important;
          padding: 11px 14px !important;
          border: 1px solid #c5cdc6 !important;
          border-radius: 9px !important;
          background: #fff !important;
          color: #222 !important;
          -webkit-text-fill-color: #222 !important;
          font-family: inherit !important;
          font-size: 16px !important;
          line-height: 1.3 !important;
          outline: none !important;
          cursor: text !important;
        }

        .edit-feed-input:hover {
          border-color: #8d998f !important;
        }

        .edit-feed-input:focus {
          border-color: #2e7d32 !important;
          box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.14) !important;
          outline: none !important;
        }

        .edit-feed-input[type="number"] {
          cursor: text !important;
          text-align: left !important;
        }

        select.edit-feed-input {
          cursor: pointer !important;
        }

        /* Feed name and purchase date use the complete form width */
        .edit-feed-field:first-child,
        .edit-feed-date {
          grid-column: 1 / -1;
        }

        /* Category sits beside Supplier */
        .edit-feed-category {
          grid-column: 2;
        }

        .edit-feed-date > div {
          width: 100% !important;
          min-width: 0 !important;
        }

        .edit-feed-date button {
          display: block !important;
          width: 100% !important;
          min-height: 48px !important;
          box-sizing: border-box !important;
        }

        .edit-feed-notes {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
          margin: 0;
        }

        .edit-feed-notes .edit-feed-label {
          margin-bottom: 7px;
        }

        .edit-feed-notes .edit-feed-input {
          width: 100% !important;
          height: 120px !important;
          min-height: 120px !important;
          resize: vertical;
        }

        .edit-feed-buttons {
          grid-column: 1 / -1;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 2px;
        }

        .edit-feed-buttons .button {
          min-height: 48px;
          padding: 10px 24px;
          cursor: pointer;
        }

        @media (max-width: 700px) {
          .edit-feed-form {
            width: 100%;
            max-width: 100%;
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .edit-feed-field,
          .edit-feed-field:first-child,
          .edit-feed-date,
          .edit-feed-category,
          .edit-feed-notes,
          .edit-feed-buttons {
            grid-column: 1;
          }

          .edit-feed-label {
            font-size: 14px;
            margin-bottom: 6px;
          }

          .edit-feed-input {
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            height: 50px !important;
            min-height: 50px !important;
            padding: 12px 14px !important;
            font-size: 16px !important;
          }

          .edit-feed-date button {
            width: 100% !important;
            height: 50px !important;
            min-height: 50px !important;
          }

          .edit-feed-notes .edit-feed-input {
            height: 120px !important;
            min-height: 120px !important;
          }

          .edit-feed-buttons {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
            margin-top: 4px;
          }

          .edit-feed-buttons .button {
            width: 100%;
            min-height: 50px;
          }
        }
      `}</style>

      <div
        className="page-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#222",
            WebkitTextFillColor: "#222",
          }}
        >
          ✏ {t("updateFeed")}
        </h1>

        <button
          type="button"
          className="button"
          onClick={() => navigate("/feed")}
          style={{
            marginLeft: "auto",
            whiteSpace: "nowrap",
            minHeight: "44px",
          }}
        >
          ← Terug
        </button>
      </div>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "820px",
          margin: "0 auto",
        }}
      >


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

          <div className="edit-feed-field edit-feed-date">
            <label
              htmlFor="purchase_date"
              className="edit-feed-label"
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
                className="edit-feed-input"
                style={{
                  display: "block",
                  width: "100%",
                  height: "50px",
                  minHeight: "50px",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  textAlign: "left",
                  background: "#fff",
                  color: "#222",
                  WebkitTextFillColor: "#222",
                  cursor: "pointer",
                }}
              >
                {formData.purchase_date
                  ? formData.purchase_date.split("-").reverse().join("-")
                  : "DD-MM-YYYY"}
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

          <div className="edit-feed-field edit-feed-category">
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
