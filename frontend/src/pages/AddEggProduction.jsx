import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddEggProduction() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [chickens, setChickens] = useState([]);

  const [formData, setFormData] = useState({
    chicken_id: "",
    production_date: "",
    eggs_collected: "",
    broken_eggs: 0,
    notes: "",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  useEffect(() => {
    loadChickens();
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
      const response = await fetch(`${API_URL}/api/egg-production`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save egg production.");
        return;
      }

      alert(data.message);
      navigate("/egg-production");
    } catch (err) {
      console.error("Save egg production error:", err);
      alert("Failed to save egg production.");
    }
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  function openCalendar() {
    if (formData.production_date) {
      const selectedDate = new Date(
        formData.production_date + "T00:00:00"
      );

      setCalendarMonth(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1
        )
      );
    } else {
      const today = new Date();

      setCalendarMonth(
        new Date(today.getFullYear(), today.getMonth(), 1)
      );
    }

    setCalendarOpen(true);
  }

  function handleDateSelect(day) {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const value = `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    setFormData((prev) => ({
      ...prev,
      production_date: value,
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

  const monthKeys = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const weekdayKeys = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const currentYear = new Date().getFullYear();

  const calendarYears = Array.from(
    { length: 101 },
    (_, index) => currentYear - index
  );

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minWidth: 0,
  };

  const labelStyle = {
    fontWeight: 600,
    fontSize: "15px",
    lineHeight: 1.3,
    margin: 0,
  };

  const inputStyle = {
    width: "100%",
    minWidth: 0,
    height: "46px",
    padding: "10px 12px",
    boxSizing: "border-box",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    fontSize: "15px",
  };

  const textareaStyle = {
    width: "100%",
    minWidth: 0,
    minHeight: "120px",
    padding: "10px 12px",
    boxSizing: "border-box",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "inherit",
  };

  return (
    <div
      className="page"
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* PAGE HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(30px, 4vw, 44px)",
              lineHeight: 1.15,
            }}
          >
            🥚 {t("recordProduction")}
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: "16px",
              opacity: 0.75,
            }}
          >
            {t("dailyEggCollection")}
          </p>
        </div>

        <Link
          className="button"
          to="/egg-production"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          ← {t("back")}
        </Link>
      </div>

      {/* FORM CARD */}
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "clamp(20px, 4vw, 35px)",
          boxSizing: "border-box",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* PRODUCTION DETAILS */}
          <h2
            style={{
              margin: "0 0 25px",
              fontSize: "22px",
              lineHeight: 1.3,
            }}
          >
            🥚 {t("recordProduction")}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "22px",
              width: "100%",
            }}
          >
            {/* CHICKEN */}
            <div style={fieldStyle}>
              <label style={labelStyle}>{t("chicken")}</label>

              <select
                name="chicken_id"
                value={formData.chicken_id}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">
                  {t("selectChicken")}
                </option>

                {chickens.map((chicken) => (
                  <option key={chicken.id} value={chicken.id}>
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

            {/* DATE */}
            <div style={fieldStyle}>
              <label style={labelStyle}>{t("date")}</label>

              <div style={{ position: "relative", width: "100%" }}>
                <div
                  onClick={openCalendar}
                  style={{
                    ...inputStyle,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    color: formData.production_date ? "#222" : "#777",
                    cursor: "pointer",
                  }}
                >
                  {formData.production_date
                    ? new Date(
                        formData.production_date + "T00:00:00"
                      ).toLocaleDateString("nl-NL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "DD-MM-JJJJ"}
                </div>
              </div>
            </div>

            {/* EGGS COLLECTED */}
            <div style={fieldStyle}>
              <label style={labelStyle}>{t("eggs")}</label>

              <input
                type="number"
                min="0"
                step="1"
                name="eggs_collected"
                value={formData.eggs_collected}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            {/* BROKEN EGGS */}
            <div style={fieldStyle}>
              <label style={labelStyle}>{t("broken")}</label>

              <input
                type="number"
                min="0"
                step="1"
                name="broken_eggs"
                value={formData.broken_eggs}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          {/* NOTES */}
          <div
            style={{
              marginTop: "24px",
            }}
          >
            <label style={labelStyle}>{t("notes")}</label>

            <textarea
              name="notes"
              rows="5"
              value={formData.notes}
              onChange={handleChange}
              style={{
                ...textareaStyle,
                marginTop: "8px",
              }}
            />
          </div>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "28px",
            }}
          >
            <button className="button" type="submit">
              💾 {t("save")}
            </button>

            <Link className="button" to="/egg-production">
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>

      {/* CALENDAR */}
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
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
            }}
          >
            {/* MONTH / YEAR SELECTORS */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "14px",
              }}
            >
              <select
                value={month}
                onChange={(e) =>
                  setCalendarMonth(
                    new Date(year, Number(e.target.value), 1)
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
                {monthKeys.map((key, index) => (
                  <option key={key} value={index}>
                    {t(key)}
                  </option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) =>
                  setCalendarMonth(
                    new Date(Number(e.target.value), month, 1)
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
                {calendarYears.map((calendarYear) => (
                  <option key={calendarYear} value={calendarYear}>
                    {calendarYear}
                  </option>
                ))}
              </select>
            </div>

            {/* CALENDAR HEADER */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                marginBottom: "14px",
              }}
            >
              <button
                type="button"
                onClick={() => changeCalendarMonth(-1)}
                aria-label="Previous month"
                style={{
                  width: "38px",
                  height: "38px",
                  border: "1px solid #cfd6cf",
                  borderRadius: "8px",
                  background: "#fff",
                  color: "#222",
                  fontSize: "20px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ‹
              </button>

              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: "19px",
                  fontWeight: 700,
                  color: "#222",
                  WebkitTextFillColor: "#222",
                }}
              >
                {t(monthKeys[month])} {year}
              </div>

              <button
                type="button"
                onClick={() => changeCalendarMonth(1)}
                aria-label="Next month"
                style={{
                  width: "38px",
                  height: "38px",
                  border: "1px solid #cfd6cf",
                  borderRadius: "8px",
                  background: "#fff",
                  color: "#222",
                  fontSize: "20px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ›
              </button>
            </div>

            {/* WEEKDAYS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "6px",
                marginBottom: "4px",
              }}
            >
              {weekdayKeys.map((key) => (
                <div
                  key={key}
                  style={{
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#666",
                    padding: "4px 0",
                  }}
                >
                  {t(key)}
                </div>
              ))}
            </div>

            {/* DAYS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "6px",
              }}
            >
              {Array.from({ length: firstDay }).map((_, index) => (
                <div key={`empty-${index}`} />
              ))}

              {Array.from(
                { length: daysInMonth },
                (_, index) => index + 1
              ).map((day) => {
                const isToday =
                  day === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear();

                const selectedDate = formData.production_date
                  ? new Date(
                      formData.production_date + "T00:00:00"
                    )
                  : null;

                const isSelected =
                  selectedDate &&
                  day === selectedDate.getDate() &&
                  month === selectedDate.getMonth() &&
                  year === selectedDate.getFullYear();

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    style={{
                      width: "40px",
                      height: "40px",
                      minHeight: "40px",
                      padding: 0,
                      border:
                        isSelected || isToday
                          ? "2px solid #2e7d32"
                          : "1px solid #ddd",
                      borderRadius: "50%",
                      background: isSelected
                        ? "#2e7d32"
                        : isToday
                        ? "#e8f5e9"
                        : "#fff",
                      color: isSelected ? "#fff" : "#222",
                      WebkitTextFillColor: isSelected ? "#fff" : "#222",
                      fontSize: "15px",
                      fontWeight:
                        isSelected || isToday ? "700" : "500",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      justifySelf: "center",
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* CANCEL */}
            <button
              type="button"
              onClick={() => setCalendarOpen(false)}
              style={{
                width: "100%",
                marginTop: "16px",
                height: "40px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: "#fff",
                color: "#333",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default AddEggProduction;
