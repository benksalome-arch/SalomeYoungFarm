import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddChickenMortality() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [chickens, setChickens] = useState([]);

  const [formData, setFormData] = useState({
    chicken_id: "",
    mortality_date: "",
    quantity: 1,
    cause: "",
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
        data.filter(
          (c) =>
            c.status === "Active" &&
            Number(c.quantity) > 0
        )
      );
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

  const currentYear = new Date().getFullYear();

  const calendarYears = Array.from(
    { length: 101 },
    (_, index) => currentYear - index
  );

  function openCalendar() {
    const selected = formData.mortality_date
      ? new Date(formData.mortality_date + "T00:00:00")
      : new Date();

    setCalendarMonth(
      new Date(
        selected.getFullYear(),
        selected.getMonth(),
        1
      )
    );

    setCalendarOpen(true);
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

  function handleDateSelect(day) {
    const year = calendarMonth.getFullYear();
    const month = String(calendarMonth.getMonth() + 1).padStart(2, "0");
    const selectedDay = String(day).padStart(2, "0");

    setFormData((previous) => ({
      ...previous,
      mortality_date: `${year}-${month}-${selectedDay}`,
    }));

    setCalendarOpen(false);
  }

  function formatDate(value) {
    if (!value) return "";

    const parts = value.split("-");

    if (parts.length !== 3) return value;

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/chicken-mortality`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/chicken-mortality");
      }
    } catch (err) {
      console.error(err);
      alert(t("failedRecordMortality"));
    }
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
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
  ];

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const today = new Date();

  const todayValue =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

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
    WebkitTextFillColor: "#222",
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
      {/* PAGE HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#222",
              WebkitTextFillColor: "#222",
            }}
          >
            🐔 {t("recordChickenMortality")}
          </h1>
        </div>

        <Link
          className="button"
          to="/chicken-mortality"
        >
          ← {t("back")}
        </Link>
      </div>

      {/* FORM CARD */}
      <div className="card">
        <form
          onSubmit={handleSubmit}
          style={formStyle}
        >
          {/* CHICKEN */}
          <div
            className="mortality-field"
            style={fieldStyle}
          >
            <label style={labelStyle}>
              {t("chicken")}
            </label>

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
                <option
                  key={chicken.id}
                  value={chicken.id}
                >
                  {chicken.tag_number} - {chicken.name} (
                  {chicken.quantity})
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div
            className="mortality-field"
            style={fieldStyle}
          >
            <label style={labelStyle}>
              {t("date")}
            </label>

            <button
              type="button"
              onClick={openCalendar}
              style={{
                ...inputStyle,
                textAlign: "left",
                cursor: "pointer",
                color: formData.mortality_date
                  ? "#222"
                  : "#777",
                WebkitTextFillColor: formData.mortality_date
                  ? "#222"
                  : "#777",
              }}
            >
              {formData.mortality_date
                ? formatDate(formData.mortality_date)
                : "DD-MM-JJJJ"}
            </button>
          </div>

          {/* QUANTITY */}
          <div
            className="mortality-field"
            style={fieldStyle}
          >
            <label style={labelStyle}>
              {t("quantity")}
            </label>

            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* CAUSE */}
          <div
            className="mortality-field"
            style={fieldStyle}
          >
            <label style={labelStyle}>
              {t("cause")}
            </label>

            <input
              type="text"
              name="cause"
              value={formData.cause}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* NOTES */}
          <div
            style={{
              marginTop: "20px",
            }}
          >
            <label
              style={{
                ...labelStyle,
                display: "block",
                textAlign: "left",
                marginBottom: "7px",
              }}
            >
              {t("notes")}
            </label>

            <textarea
              rows="5"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #cfd6cf",
                borderRadius: "7px",
                background: "#fff",
                color: "#222",
                WebkitTextFillColor: "#222",
                fontSize: "15px",
                resize: "vertical",
                minHeight: "120px",
              }}
            />
          </div>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "25px",
            }}
          >
            <button
              className="button"
              type="submit"
            >
              💾 {t("save")}
            </button>

            <Link
              className="button"
              to="/chicken-mortality"
            >
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
                gap: "10px",
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
                  color: "#222",
                  fontSize: "20px",
                  fontWeight: 700,
                  cursor: "pointer",
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
                  color: "#222",
                  fontSize: "20px",
                  fontWeight: 700,
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
                gap: "5px",
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

              {Array.from(
                {
                  length: new Date(
                    calendarMonth.getFullYear(),
                    calendarMonth.getMonth() + 1,
                    0
                  ).getDate(),
                },
                (_, index) => index + 1
              ).map((day) => {
                const year = calendarMonth.getFullYear();
                const month = String(
                  calendarMonth.getMonth() + 1
                ).padStart(2, "0");
                const dateValue = `${year}-${month}-${String(day).padStart(
                  2,
                  "0"
                )}`;

                const isSelected =
                  dateValue === formData.mortality_date;

                const today = new Date();
                const todayValue =
                  `${today.getFullYear()}-${String(
                    today.getMonth() + 1
                  ).padStart(2, "0")}-${String(today.getDate()).padStart(
                    2,
                    "0"
                  )}`;

                const isToday = dateValue === todayValue;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    style={{
                      minHeight: "40px",
                      border:
                        isSelected || isToday
                          ? "2px solid #2e7d32"
                          : "1px solid #ddd",
                      borderRadius: "8px",
                      background: isSelected
                        ? "#2e7d32"
                        : isToday
                        ? "#e8f5e9"
                        : "#fff",
                      color: isSelected ? "#fff" : "#222",
                      fontSize: "15px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
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
                marginTop: "14px",
                minHeight: "44px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: "#fff",
                color: "#222",
                fontSize: "15px",
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

export default AddChickenMortality;
