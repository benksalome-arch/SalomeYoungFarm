import API_URL from "../api";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditRabbit() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tag_number: "",
    name: "",
    breed: "",
    sex: "Female",
    birth_date: "",
    source: "",
    quantity: 1,
    status: "Active",
    purchase_price: "",
    notes: "",
  });

  useEffect(() => {
    loadRabbit();
  }, []);

  async function loadRabbit() {
    try {
      const response = await fetch(
        `${API_URL}/api/rabbits/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      const birthDate = data.birth_date
        ? data.birth_date.split("T")[0]
        : "";

      setFormData({
        tag_number: data.tag_number || "",
        name: data.name || "",
        breed: data.breed || "",
        sex: data.sex || "Female",
        birth_date: birthDate,
        source: data.source || "",
        quantity: data.quantity || 1,
        status: data.status || "Active",
        purchase_price: data.purchase_price || "",
        notes: data.notes || "",
      });

      // Keep the calendar on the rabbit's saved birth-date month.
      // If there is no saved birth date, leave it on the current month.
      const savedBirthDate = data.birth_date
        ? data.birth_date.split("T")[0]
        : "";

      if (savedBirthDate) {
        const [year, month] = savedBirthDate.split("-").map(Number);
        setCalendarMonth(new Date(year, month - 1, 1));
      }

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!calendarOpen) return;

    const positionCalendar = () => {
      const field = birthDateFieldRef.current;
      const calendar = calendarRef.current;

      if (!field || !calendar) return;

      const fieldRect = field.getBoundingClientRect();
      const calendarRect = calendar.getBoundingClientRect();

      const gap = 8;
      const viewportPadding = 12;

      let left = fieldRect.left;
      let top = fieldRect.top - calendarRect.height - gap;

      if (top < viewportPadding) {
        top = fieldRect.bottom + gap;
      }

      if (window.innerWidth <= 500) {
        left = Math.max(
          viewportPadding,
          Math.min(
            left,
            window.innerWidth - calendarRect.width - viewportPadding
          )
        );
      }

      if (left + calendarRect.width > window.innerWidth - viewportPadding) {
        left = window.innerWidth - calendarRect.width - viewportPadding;
      }

      if (left < viewportPadding) {
        left = viewportPadding;
      }

      if (top + calendarRect.height > window.innerHeight - viewportPadding) {
        top = Math.max(
          viewportPadding,
          window.innerHeight - calendarRect.height - viewportPadding
        );
      }

      setCalendarPosition({
        top: Math.round(top),
        left: Math.round(left),
      });
    };

    const frame = requestAnimationFrame(positionCalendar);

    window.addEventListener("resize", positionCalendar);
    window.addEventListener("scroll", positionCalendar, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", positionCalendar);
      window.removeEventListener("scroll", positionCalendar, true);
    };
  }, [calendarOpen, calendarMonth]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [calendarPosition, setCalendarPosition] = useState({
    top: 0,
    left: 0,
  });

  const birthDateFieldRef = useRef(null);
  const calendarRef = useRef(null);

  const monthNames = [
    "Januari",
    "Februari",
    "Maart",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Augustus",
    "September",
    "Oktober",
    "November",
    "December",
  ];

  const weekDays = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];

  const calendarYears = Array.from(
    { length: 101 },
    (_, index) => new Date().getFullYear() - 100 + index
  );

  function formatDisplayDate(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}-${month}-${year}`;
  }

  function selectCalendarDate(day) {
    const year = calendarMonth.getFullYear();
    const month = String(calendarMonth.getMonth() + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");

    setFormData({
      ...formData,
      birth_date: `${year}-${month}-${date}`,
    });
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

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...formData,
      birth_date: formData.birth_date || null,
      quantity: Number(formData.quantity),
      purchase_price:
        formData.purchase_price === ""
          ? 0
          : Number(formData.purchase_price),
    };

    try {
      const response = await fetch(
        `${API_URL}/api/rabbits/${id}`,
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

      if (response.ok) {
        alert(t("rabbitUpdatedSuccessfully"));
      } else {
        alert(data.message);
      }

      if (response.ok) {
        navigate("/rabbits");
      }

    } catch (err) {
      console.error(err);
      alert(t("failedToUpdateRabbit"));
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
  };

  const inputStyle = {
    width: "100%",
    minWidth: 0,
    height: "44px",
    padding: "9px 12px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    boxSizing: "border-box",
    fontSize: "15px",
  };

  const textareaStyle = {
    width: "100%",
    minWidth: 0,
    minHeight: "120px",
    padding: "10px 12px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    boxSizing: "border-box",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "inherit",
  };

  return (
    <div className="page">
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <h1 style={{ margin: 0, lineHeight: 1.15 }}>
          🐇 {t("editRabbit")}
        </h1>
      </div>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "clamp(20px, 4vw, 32px)",
          boxSizing: "border-box",
          borderRadius: "14px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div
            className="rabbit-edit-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "20px 24px",
              width: "100%",
              alignItems: "start",
            }}
          >
            <div style={fieldStyle}>
              <label style={labelStyle}>{t("tagNumber")}</label>
              <input
                type="text"
                name="tag_number"
                value={formData.tag_number}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("name")}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("breed")}</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("sex")}</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Female">{t("female")}</option>
                <option value="Male">{t("male")}</option>
              </select>
            </div>

            <div
              className="add-rabbit-field"
              style={{ ...fieldStyle, position: "relative" }}
            >
              <label className="add-rabbit-label" style={labelStyle}>
                {t("birthDate")}
              </label>

              <div
                ref={birthDateFieldRef}
                style={{ position: "relative", width: "100%" }}
              >
                <input
                  type="text"
                  value={
                    formData.birth_date
                      ? formData.birth_date.split("-").reverse().join("-")
                      : ""
                  }
                  placeholder="DD-MM-JJJJ"
                  readOnly
                  onClick={() => {
                    const selected = formData.birth_date
                      ? new Date(formData.birth_date + "T00:00:00")
                      : new Date();

                    setCalendarMonth(
                      new Date(
                        selected.getFullYear(),
                        selected.getMonth(),
                        1
                      )
                    );

                    setCalendarOpen(true);
                  }}
                  style={{
                    ...inputStyle,
                    width: "100%",
                    cursor: "pointer",
                    color: "#222",
                    WebkitTextFillColor: "#222",
                    backgroundColor: "#fff",
                  }}
                />

                {calendarOpen && (
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
                      background: #e8f5e9 !important;
                      border-color: #a5d6a7 !important;
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
                          style={{
                            color: "#222",
                            WebkitTextFillColor: "#222",
                            fontSize: "28px",
                            fontWeight: "700",
                            lineHeight: "1",
                            opacity: 1,
                            visibility: "visible",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
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
                          style={{
                            color: "#222",
                            WebkitTextFillColor: "#222",
                            fontSize: "28px",
                            fontWeight: "700",
                            lineHeight: "1",
                            opacity: 1,
                            visibility: "visible",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
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
                        {Array.from({
                          length: new Date(
                            calendarMonth.getFullYear(),
                            calendarMonth.getMonth(),
                            1
                          ).getDay(),
                        }).map((_, index) => (
                          <div
                            key={`empty-${index}`}
                            className="calendar-empty"
                          />
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

                          const selected = formData.birth_date === dateValue;

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
                        style={{
                          color: "#222",
                          WebkitTextFillColor: "#222",
                          opacity: 1,
                          visibility: "visible",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
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
                          Annuleren
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("source")}</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("quantity")}</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("status")}</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Active">{t("active")}</option>
                <option value="Sold">{t("sold")}</option>
                <option value="Dead">{t("dead")}</option>
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("purchasePrice")}</label>
              <input
                type="number"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: "22px" }}>
            <label style={labelStyle}>{t("notes")}</label>
            <textarea
              name="notes"
              rows="5"
              value={formData.notes}
              onChange={handleChange}
              style={{
                ...textareaStyle,
                marginTop: "7px",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "25px",
            }}
          >
            <button className="button" type="submit">
              💾 {t("update")}
            </button>

            <Link className="button" to="/rabbits">
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );

}

export default EditRabbit;
