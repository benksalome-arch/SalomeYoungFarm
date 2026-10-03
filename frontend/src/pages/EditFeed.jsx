import API_URL from "../api";
import { useEffect, useRef, useState } from "react";
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
  const calendarRef = useRef(null);

  const [calendarPosition, setCalendarPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (!calendarOpen) return;

    const updateCalendarPosition = () => {
      const anchor = document.querySelector(".edit-feed-date-button");

      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();

      const calendarWidth = Math.min(
        360,
        window.innerWidth - 24
      );

      const calendarHeight = calendarRef.current
        ? calendarRef.current.getBoundingClientRect().height
        : 430;

      let left = rect.left;

      if (left + calendarWidth > window.innerWidth - 12) {
        left = window.innerWidth - calendarWidth - 12;
      }

      if (left < 12) {
        left = 12;
      }

      let top = rect.bottom + 6;

      if (top + calendarHeight > window.innerHeight - 12) {
        top = rect.top - calendarHeight - 6;
      }

      if (top < 12) {
        top = 12;
      }

      setCalendarPosition({
        top,
        left,
      });
    };

    const frame = requestAnimationFrame(updateCalendarPosition);

    window.addEventListener("resize", updateCalendarPosition);
    window.addEventListener("scroll", updateCalendarPosition, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateCalendarPosition);
      window.removeEventListener("scroll", updateCalendarPosition, true);
    };
  }, [calendarOpen]);


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

  function renderCalendar(fieldName) {
    if (!calendarOpen || "purchase_date" !== fieldName) {
      return null;
    }

    const firstDay = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      1
    ).getDay();

    const daysInMonth = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + 1,
      0
    ).getDate();

    const selectedDate = formData.purchase_date;

    return (
      <>
        <style>{`
          #syl-rabbit-clean-calendar-overlay {
            position: fixed !important;
            inset: 0 !important;
            z-index: 99999 !important;
            display: block !important;
            padding: 0 !important;
            background: transparent !important;
            box-sizing: border-box !important;
            pointer-events: none !important;
          }

          #syl-rabbit-clean-calendar {
            position: fixed !important;
            width: 320px !important;
            max-width: calc(100vw - 24px) !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 16px !important;
            display: block !important;
            box-sizing: border-box !important;
            background: #fff !important;
            border: 0 !important;
            border-radius: 20px !important;
            box-shadow: 0 12px 40px rgba(0,0,0,0.25) !important;
            overflow: visible !important;
          }

          #syl-rabbit-clean-calendar .calendar-pickers {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
            width: 100% !important;
            margin: 0 0 16px 0 !important;
          }

          #syl-rabbit-clean-calendar select {
            width: 100% !important;
            min-width: 0 !important;
            height: 48px !important;
            padding: 0 14px !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            border: 1px solid #d5d5d5 !important;
            border-radius: 12px !important;
            background: #fff !important;
            color: #222 !important;
            font-size: 16px !important;
            font-weight: 500 !important;
            appearance: auto !important;
          }

          #syl-rabbit-clean-calendar .calendar-navigation {
            display: grid !important;
            grid-template-columns: 42px 1fr 42px !important;
            align-items: center !important;
            gap: 6px !important;
            width: 100% !important;
            margin: 0 0 12px 0 !important;
          }

          #syl-rabbit-clean-calendar .calendar-nav {
            width: 42px !important;
            height: 40px !important;
            min-width: 42px !important;
            min-height: 40px !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border: 1px solid #d5d5d5 !important;
            border-radius: 10px !important;
            background: #fff !important;
            color: #222 !important;
            font-size: 22px !important;
            line-height: 1 !important;
            box-sizing: border-box !important;
            cursor: pointer !important;
          }

          #syl-rabbit-clean-calendar .calendar-title {
            text-align: center !important;
            font-size: 18px !important;
            font-weight: 600 !important;
            color: #222 !important;
            line-height: 1.2 !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          #syl-rabbit-clean-calendar .calendar-weekdays {
            display: grid !important;
            grid-template-columns: repeat(7, minmax(0, 1fr)) !important;
            gap: 6px !important;
            width: 100% !important;
            margin: 0 0 8px 0 !important;
          }

          #syl-rabbit-clean-calendar .calendar-weekday {
            height: 30px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin: 0 !important;
            padding: 0 !important;
            color: #444 !important;
            font-size: 13px !important;
            font-weight: 700 !important;
            box-sizing: border-box !important;
          }

          #syl-rabbit-clean-calendar .calendar-days {
            display: grid !important;
            grid-template-columns: repeat(7, minmax(0, 1fr)) !important;
            gap: 5px !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }

          #syl-rabbit-clean-calendar .calendar-empty {
            width: 34px !important;
            height: 34px !important;
            min-width: 34px !important;
            min-height: 34px !important;
            max-width: 34px !important;
            max-height: 34px !important;
            margin: 0 auto !important;
            padding: 0 !important;
            border: 0 !important;
            border-radius: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }

          #syl-rabbit-clean-calendar .calendar-day {
            width: 34px !important;
            height: 34px !important;
            min-width: 34px !important;
            min-height: 34px !important;
            max-width: 34px !important;
            max-height: 34px !important;
            justify-self: center !important;
            align-self: center !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border: 1px solid #ddd !important;
            border-radius: 50% !important;
            background: #fff !important;
            color: #222 !important;
            -webkit-text-fill-color: #222 !important;
            text-indent: 0 !important;
            text-align: center !important;
            font-size: 15px !important;
            font-weight: 500 !important;
            line-height: 1 !important;
            opacity: 1 !important;
            visibility: visible !important;
            box-sizing: border-box !important;
            cursor: pointer !important;
          }

          #syl-rabbit-clean-calendar .calendar-day.today {
            background: #e3f2fd !important;
            border-color: #2196f3 !important;
          }

          #syl-rabbit-clean-calendar .calendar-day.selected {
            background: #2e7d32 !important;
            border-color: #2e7d32 !important;
            color: #fff !important;
            -webkit-text-fill-color: #fff !important;
            opacity: 1 !important;
            visibility: visible !important;
            font-weight: 800 !important;
          }

          #syl-rabbit-clean-calendar .calendar-cancel {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 130px !important;
            height: 40px !important;
            margin: 16px auto 0 auto !important;
            padding: 0 !important;
            border: 1px solid #ccc !important;
            border-radius: 10px !important;
            background: #fff !important;
            color: #222 !important;
            font-size: 16px !important;
            font-weight: 500 !important;
            box-sizing: border-box !important;
            cursor: pointer !important;
          }

          @media (max-width: 500px) {
            #syl-rabbit-clean-calendar {
              width: 300px !important;
              max-width: calc(100vw - 24px) !important;
              padding: 12px !important;
              border-radius: 16px !important;
            }

            #syl-rabbit-clean-calendar .calendar-pickers {
              gap: 8px !important;
              margin-bottom: 10px !important;
            }

            #syl-rabbit-clean-calendar select {
              height: 40px !important;
              padding: 0 8px !important;
              font-size: 14px !important;
            }

            #syl-rabbit-clean-calendar .calendar-navigation {
              grid-template-columns: 36px 1fr 36px !important;
              gap: 4px !important;
              margin-bottom: 8px !important;
            }

            #syl-rabbit-clean-calendar .calendar-nav {
              width: 36px !important;
              height: 36px !important;
              min-width: 36px !important;
              min-height: 36px !important;
              font-size: 20px !important;
            }

            #syl-rabbit-clean-calendar .calendar-title {
              font-size: 16px !important;
            }

            #syl-rabbit-clean-calendar .calendar-weekdays {
              gap: 3px !important;
              margin-bottom: 5px !important;
            }

            #syl-rabbit-clean-calendar .calendar-weekday {
              height: 24px !important;
              font-size: 11px !important;
            }

            #syl-rabbit-clean-calendar .calendar-days {
              gap: 3px !important;
            }

            #syl-rabbit-clean-calendar .calendar-day {
              width: 30px !important;
              height: 30px !important;
              min-width: 30px !important;
              min-height: 30px !important;
              max-width: 30px !important;
              max-height: 30px !important;
              font-size: 13px !important;
            }

            #syl-rabbit-clean-calendar .calendar-cancel {
              width: 100px !important;
              height: 34px !important;
              margin-top: 10px !important;
              font-size: 14px !important;
            }
          }
        `}</style>

        <div
          id="syl-rabbit-clean-calendar-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setCalendarOpen(false);
            }
          }}
          style={{
            pointerEvents: "none",
          }}
        >
          <div
            ref={calendarRef}
            id="syl-rabbit-clean-calendar"
            onClick={(e) => e.stopPropagation()}
            style={{
                        width: "min(360px, calc(100vw - 24px))",
                        maxWidth: "calc(100vw - 24px)",
                        boxSizing: "border-box",
              pointerEvents: "auto",
              top: calendarPosition.top,
              left: calendarPosition.left,
            }}
          >
            <div className="calendar-pickers">
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
              >
                {calendarYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="calendar-navigation">
              <button
                type="button"
                className="calendar-nav"
                onClick={() => changeCalendarMonth(-1)}
              >
                <span
                  style={{
                    display: "block",
                    color: "#222",
                    WebkitTextFillColor: "#222",
                    opacity: 1,
                    visibility: "visible",
                  }}
                >
                  ‹
                </span>
              </button>

              <div className="calendar-title">
                {monthNames[calendarMonth.getMonth()]}{" "}
                {calendarMonth.getFullYear()}
              </div>

              <button
                type="button"
                className="calendar-nav"
                onClick={() => changeCalendarMonth(1)}
              >
                <span
                  style={{
                    display: "block",
                    color: "#222",
                    WebkitTextFillColor: "#222",
                    opacity: 1,
                    visibility: "visible",
                  }}
                >
                  ›
                </span>
              </button>
            </div>

            <div className="calendar-weekdays">
              {weekDays.map((day) => (
                <div key={day} className="calendar-weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-days">
              {Array.from({ length: firstDay }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="calendar-empty"
                />
              ))}

              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;

                const dateValue =
                  `${calendarMonth.getFullYear()}-` +
                  `${String(calendarMonth.getMonth() + 1).padStart(2, "0")}-` +
                  `${String(day).padStart(2, "0")}`;

                const selected = selectedDate === dateValue;

                const today = new Date();

                const isToday =
                  day === today.getDate() &&
                  calendarMonth.getMonth() === today.getMonth() &&
                  calendarMonth.getFullYear() === today.getFullYear();

                return (
                  <button
                    key={day}
                    type="button"
                    className={`calendar-day${
                      selected ? " selected" : ""
                    }${isToday ? " today" : ""}`}
                    onClick={() => selectCalendarDate(day)}
                  >
                    <span
                      style={{
                        display: "block",
                        color: selected ? "#fff" : "#222",
                        WebkitTextFillColor: selected ? "#fff" : "#222",
                        opacity: 1,
                        visibility: "visible",
                        fontSize: "15px",
                        fontWeight: selected ? 800 : 500,
                        lineHeight: "1",
                        textAlign: "center",
                      }}
                    >
                      {day}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="calendar-cancel"
              onClick={() => setCalendarOpen(false)}
            >
              Annuleren
            </button>
          </div>
        </div>
      </>
    );
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

              {calendarOpen && renderCalendar("purchase_date")}
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
