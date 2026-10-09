import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditFeed() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backTo =
    typeof location.state?.from === "string" &&
    location.state.from.startsWith("/")
      ? location.state.from
      : "/feed";

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
    async function fetchFeed() {
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

    fetchFeed();
  }, [id]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function selectCalendarDate(day) {
    const year = calendarMonth.getFullYear();
    const month = String(calendarMonth.getMonth() + 1).padStart(2, "0");
    const selectedDay = String(day).padStart(2, "0");

    const dateValue = `${year}-${month}-${selectedDay}`;

    setFormData((previous) => ({
      ...previous,
      purchase_date: dateValue,
    }));

    setCalendarOpen(false);
  }

  function changeCalendarMonth(offset) {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + offset,
        1
      )
    );
  }

  const weekDays = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];




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
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .edit-feed-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
    min-width: 0;
  }

  .edit-feed-label {
    font-weight: 600;
    font-size: 15px;
    line-height: 1.25;
    color: #222;
    overflow-wrap: anywhere;
  }

  .edit-feed-input {
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: none !important;
    height: 48px !important;
    min-height: 48px !important;
    box-sizing: border-box !important;
    padding: 11px 14px !important;
    margin: 0 !important;
    border: 1px solid #bfc7c0 !important;
    border-radius: 8px !important;
    background: #fff !important;
    color: #222 !important;
    -webkit-text-fill-color: #222 !important;
    font-size: 16px !important;
    font-family: inherit !important;
    line-height: 1.3 !important;
    outline: none;
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
    text-align: left;
  }

  select.edit-feed-input {
    cursor: pointer !important;
  }

  .edit-feed-date {
    position: relative;
  }

  .edit-feed-notes {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .edit-feed-notes .edit-feed-input {
    min-height: 110px;
    height: auto !important;
    resize: vertical;
  }

  .edit-feed-category {
    order: initial;
  }

  .edit-feed-buttons {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 2px;
  }

  .edit-feed-buttons .button {
    min-height: 44px;
  }

  @media (max-width: 700px) {
    .edit-feed-form {
      max-width: 100%;
      grid-template-columns: 1fr;
      gap: 15px;
    }

    .edit-feed-field,
    .edit-feed-notes {
      grid-column: 1 / -1;
    }

    .edit-feed-input {
      width: 100% !important;
      height: 48px !important;
      min-height: 48px !important;
      font-size: 16px !important;
    }

    .edit-feed-buttons {
      grid-column: 1 / -1;
      width: 100%;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .edit-feed-buttons .button {
      flex: 1 1 140px;
      min-height: 44px;
    }
  }

`}</style>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "620px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "24px",
            paddingBottom: "16px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Link
            className="button"
            to={backTo}
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: "44px",
              marginBottom: "14px",
              textDecoration: "none",
            }}
          >
            ← {t("back", "Terug")}
          </Link>
          <h1
            style={{
              margin: 0,
              color: "#222",
              WebkitTextFillColor: "#222",
              fontSize: "30px",
              lineHeight: 1.2,
            }}
          >
            ✏️ {t("updateFeed")}
          </h1>
        </div>

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
              style={labelStyle}
            >
              Aankoopdatum
            </label>

            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="edit-feed-date-button"
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
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      setCalendarOpen(false);
                    }
                  }}
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 99999,
                    padding: "16px",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: "min(92vw, 360px)",
                      background: "#fff",
                      borderRadius: "14px",
                      padding: "18px",
                      boxSizing: "border-box",
                      boxShadow:
                        "0 12px 35px rgba(0,0,0,0.25)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        marginBottom: "14px",
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
                        style={{
                          height: "38px",
                          padding: "0 30px 0 10px",
                          border: "1px solid #cfd6cf",
                          borderRadius: "8px",
                          background: "#fff",
                          color: "#222",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
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
                        style={{
                          height: "38px",
                          padding: "0 30px 0 10px",
                          border: "1px solid #cfd6cf",
                          borderRadius: "8px",
                          background: "#fff",
                          color: "#222",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => changeCalendarMonth(-1)}
                        style={{
                          width: "38px",
                          height: "38px",
                          border: "1px solid #cfd6cf",
                          borderRadius: "8px",
                          background: "#fff",
                          fontSize: "20px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        ‹
                      </button>

                      <div
                        style={{
                          fontSize: "19px",
                          fontWeight: "700",
                        }}
                      >
                        {monthNames[calendarMonth.getMonth()]}{" "}
                        {calendarMonth.getFullYear()}
                      </div>

                      <button
                        type="button"
                        onClick={() => changeCalendarMonth(1)}
                        style={{
                          width: "38px",
                          height: "38px",
                          border: "1px solid #cfd6cf",
                          borderRadius: "8px",
                          background: "#fff",
                          fontSize: "20px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        ›
                      </button>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        gap: "4px",
                        marginBottom: "6px",
                      }}
                    >
                      {weekDays.map((day) => (
                        <div
                          key={day}
                          style={{
                            textAlign: "center",
                            fontWeight: 700,
                            fontSize: "13px",
                            color: "#555",
                            padding: "5px 0",
                          }}
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        gap: "4px",
                      }}
                    >
                      {Array.from({
                        length: new Date(
                          calendarMonth.getFullYear(),
                          calendarMonth.getMonth(),
                          1
                        ).getDay(),
                      }).map((_, index) => (
                        <div key={`empty-${index}`} />
                      ))}

                      {Array.from({
                        length: new Date(
                          calendarMonth.getFullYear(),
                          calendarMonth.getMonth() + 1,
                          0
                        ).getDate(),
                      }).map((_, index) => {
                        const day = index + 1;

                        const dateValue =
                          `${calendarMonth.getFullYear()}-` +
                          `${String(calendarMonth.getMonth() + 1).padStart(2, "0")}-` +
                          `${String(day).padStart(2, "0")}`;

                        const selected =
                          formData.purchase_date === dateValue;

                        const today = new Date();

                        const isToday =
                          day === today.getDate() &&
                          calendarMonth.getMonth() === today.getMonth() &&
                          calendarMonth.getFullYear() === today.getFullYear();

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => selectCalendarDate(day)}
                            style={{
                              width: "40px",
                              height: "40px",
                              minWidth: "40px",
                              border: "none",
                              borderRadius: "50%",
                              background: selected
                                ? "#2e7d32"
                                : isToday
                                ? "#e8f5e9"
                                : "#fff",
                              color: selected
                                ? "#fff"
                                : "#222",
                              fontWeight:
                                selected || isToday ? 700 : 400,
                              cursor: "pointer",
                              padding: 0,
                              justifySelf: "center",
                              boxSizing: "border-box",
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCalendarOpen(false)}
                      style={{
                        width: "100%",
                        marginTop: "16px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        background: "#fff",
                        color: "#222",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Annuleren
                    </button>
                  </div>
                </div>
              )}
            </div>
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

          <div className="edit-feed-field edit-feed-notes">
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
