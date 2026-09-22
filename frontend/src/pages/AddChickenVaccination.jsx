import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddChickenVaccination() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [chickens, setChickens] = useState([]);

  const [formData, setFormData] = useState({
    chicken_id: "",
    vaccination_date: "",
    vaccine_name: "",
    dosage: "",
    next_due_date: "",
    administered_by: "",
    notes: "",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarField, setCalendarField] = useState("");
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

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  function openCalendar(field) {
    const currentValue = formData[field];

    const baseDate = currentValue
      ? new Date(currentValue + "T00:00:00")
      : new Date();

    setCalendarField(field);

    setCalendarMonth(
      new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        1
      )
    );

    setCalendarOpen(true);
  }

  function goPreviousMonth() {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() - 1,
        1
      )
    );
  }

  function goNextMonth() {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + 1,
        1
      )
    );
  }

  function handleDateSelect(day) {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const value =
      year +
      "-" +
      String(month + 1).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0");

    setFormData((prev) => ({
      ...prev,
      [calendarField]: value,
    }));

    setCalendarOpen(false);
    setCalendarField("");
  }

  function formatDate(value) {
    if (!value) return "";

    const parts = value.split("-");

    if (parts.length !== 3) return value;

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
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

  const selectedValue = calendarField
    ? formData[calendarField]
    : "";

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/chicken-vaccinations`,
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
        navigate("/chicken-vaccinations");
      }
    } catch (err) {
      console.error(err);
      alert(t("failedSaveVaccination"));
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
    color: "#222",
    WebkitTextFillColor: "#222",
  };

  const inputStyle = {
    width: "100%",
    minWidth: 0,
    height: "44px",
    padding: "9px 12px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    color: "#222",
    WebkitTextFillColor: "#222",
    boxSizing: "border-box",
    fontSize: "15px",
  };

  const textareaStyle = {
    width: "100%",
    minWidth: 0,
    padding: "10px 12px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    color: "#222",
    WebkitTextFillColor: "#222",
    boxSizing: "border-box",
    fontSize: "15px",
    resize: "vertical",
    minHeight: "120px",
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
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(30px, 4vw, 44px)",
              lineHeight: 1.15,
              color: "#222",
              WebkitTextFillColor: "#222",
            }}
          >
            💉 {t("recordChickenVaccination")}
          </h1>
        </div>

        <Link
          className="button"
          to="/chicken-vaccinations"
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
          padding: "clamp(18px, 3vw, 32px)",
          boxSizing: "border-box",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* VACCINATION DETAILS */}
          <section>
            <h2
              style={{
                margin: "0 0 20px",
                fontSize: "22px",
                lineHeight: 1.3,
                color: "#222",
                WebkitTextFillColor: "#222",
              }}
            >
              💉 {t("recordChickenVaccination")}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
                gap: "20px",
                width: "100%",
              }}
            >
              {/* CHICKEN */}
              <div style={fieldStyle}>
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
                      {chicken.tag_number} - {chicken.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* VACCINATION DATE */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("vaccinationDate")}
                </label>

                <div style={{ position: "relative", width: "100%" }}>
                  <div
                    style={{
                      ...inputStyle,
                      width: "100%",
                      color: formData.vaccination_date ? "#222" : "#777",
                      pointerEvents: "none",
                    }}
                  >
                    {formData.vaccination_date
                      ? new Date(formData.vaccination_date + "T00:00:00").toLocaleDateString("nl-NL", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "DD-MM-JJJJ"}
                  </div>
                  <input
                    type="date"
                    name="vaccination_date"
                    value={formData.vaccination_date || ""}
                    onChange={handleChange}
                    required
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0,
                    cursor: "pointer",
                    }}
                  />
                </div>
              </div>

              {/* VACCINE NAME */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("vaccineName")}
                </label>

                <input
                  type="text"
                  name="vaccine_name"
                  value={formData.vaccine_name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              {/* DOSAGE */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("dosage")}
                </label>

                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* NEXT DUE DATE */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("nextDueDate")}
                </label>

                <div style={{ position: "relative", width: "100%" }}>
                  <div
                    style={{
                      ...inputStyle,
                      width: "100%",
                      color: formData.next_due_date ? "#222" : "#777",
                      pointerEvents: "none",
                    }}
                  >
                    {formData.next_due_date
                      ? new Date(formData.next_due_date + "T00:00:00").toLocaleDateString("nl-NL", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "DD-MM-JJJJ"}
                  </div>
                  <input
                    type="date"
                    name="next_due_date"
                    value={formData.next_due_date || ""}
                    onChange={handleChange}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0,
                    cursor: "pointer",
                    }}
                  />
                </div>
              </div>

              {/* ADMINISTERED BY */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("administeredBy")}
                </label>

                <input
                  type="text"
                  name="administered_by"
                  value={formData.administered_by}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>
          </section>

          {/* NOTES */}
          <div
            style={{
              marginTop: "24px",
            }}
          >
            <label style={labelStyle}>
              {t("notes")}
            </label>

            <textarea
              rows="5"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              style={{
                ...textareaStyle,
                marginTop: "7px",
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
              to="/chicken-vaccinations"
            >
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>

      {/* PROFESSIONAL CALENDAR */}
      {calendarOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setCalendarOpen(false);
              setCalendarField("");
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
            style={{
              width: "min(92vw, 360px)",
              background: "#fff",
              borderRadius: "14px",
              padding: "18px",
              boxSizing: "border-box",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
            }}
          >
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
                onClick={goPreviousMonth}
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
                onClick={goNextMonth}
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
                    fontWeight: 600,
                    fontSize: "13px",
                    padding: "6px 0",
                    color: "#222",
                    WebkitTextFillColor: "#222",
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
                const dateValue =
                  year +
                  "-" +
                  String(month + 1).padStart(2, "0") +
                  "-" +
                  String(day).padStart(2, "0");

                const isToday = dateValue === todayValue;
                const isSelected = dateValue === selectedValue;

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
                      background:
                        isSelected
                          ? "#2e7d32"
                          : isToday
                          ? "#e8f5e9"
                          : "#fff",
                      color:
                        isSelected
                          ? "#fff"
                          : "#222",
                      WebkitTextFillColor:
                        isSelected
                          ? "#fff"
                          : "#222",
                      fontSize: "15px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
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
              onClick={() => {
                setCalendarOpen(false);
                setCalendarField("");
              }}
              style={{
                width: "100%",
                marginTop: "14px",
                minHeight: "44px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: "#fff",
                color: "#222",
                WebkitTextFillColor: "#222",
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

export default AddChickenVaccination;
