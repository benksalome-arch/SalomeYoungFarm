import { useLanguage } from "../context/LanguageContext";
import API_URL from "../api";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function getTodayLocalDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function calculateExpectedKidding(value) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + 150);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateDisplay(value) {
  if (!value) {
    return "";
  }

  const parts = String(value).slice(0, 10).split("-");

  if (parts.length !== 3) {
    return "";
  }

  const [year, month, day] = parts;

  if (
    year.length !== 4 ||
    month.length !== 2 ||
    day.length !== 2
  ) {
    return "";
  }

  return `${day}-${month}-${year}`;
}

function AddBreeding() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const today = getTodayLocalDate();

  const [goats, setGoats] = useState([]);

  const [formData, setFormData] = useState({
    doe_id: "",
    buck_id: "",
    mating_date: today,
    expected_kidding: calculateExpectedKidding(today),
    veterinarian: "",
    notes: "",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const initialDate = new Date(`${today}T00:00:00`);

    return new Date(
      initialDate.getFullYear(),
      initialDate.getMonth(),
      1
    );
  });

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

  const weekdays = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];

  useEffect(() => {
    fetch(`${API_URL}/api/goats`)
      .then((res) => res.json())
      .then((data) => setGoats(data))
      .catch(console.error);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    const updated = {
      ...formData,
      [name]: value,
    };

    if (name === "mating_date" && value) {
      updated.expected_kidding = calculateExpectedKidding(value);
    }

    setFormData(updated);
  }

  function selectCalendarDate(day) {
    const year = calendarMonth.getFullYear();
    const month = String(calendarMonth.getMonth() + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");

    const selectedDate = `${year}-${month}-${date}`;

    setFormData((prev) => ({
      ...prev,
      mating_date: selectedDate,
      expected_kidding: calculateExpectedKidding(selectedDate),
    }));

    setCalendarOpen(false);
  }

  function changeCalendarMonth(amount) {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + amount,
        1
      )
    );
  }

  function openCalendar() {
    if (formData.mating_date) {
      const selectedDate = new Date(
        `${formData.mating_date}T00:00:00`
      );

      setCalendarMonth(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1
        )
      );
    }

    setCalendarOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch(`${API_URL}/api/breeding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    alert(data.message);
    navigate("/breeding");
  }

  const fieldStyle = {
    width: "100%",
    height: "44px",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    color: "#222",
    WebkitTextFillColor: "#222",
    fontSize: "15px",
    lineHeight: "22px",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    minHeight: "44px",
    margin: "0 0 14px 0",
    padding: 0,
    fontWeight: 600,
    fontSize: "15px",
    lineHeight: "20px",
    color: "#222",
    WebkitTextFillColor: "#222",
    textAlign: "right",
  };

  const calendarFieldStyle = {
    ...fieldStyle,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    textAlign: "left",
  };

  return (
    <div className="page">
      <div className="card">
        <h1
          style={{
            color: "#222",
            WebkitTextFillColor: "#222",
            opacity: 1,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          🧬 {t("newBreedingRecord")}
        </h1>

        <form onSubmit={handleSubmit} className="breeding-add-form">
          <p style={labelStyle}>{t("doe")}</p>

          <select
            name="doe_id"
            value={formData.doe_id}
            onChange={handleChange}
            required
            style={fieldStyle}
          >
            <option value="">{t("selectDoe")}</option>

            {goats
              .filter(
                (g) =>
                  String(g.sex || "").trim().toLowerCase() ===
                  "female"
              )
              .map((g) => (
                <option key={g.id} value={g.id}>
                  {g.tag} - {g.name}
                </option>
              ))}
          </select>

          <p style={labelStyle}>{t("buck")}</p>

          <select
            name="buck_id"
            value={formData.buck_id}
            onChange={handleChange}
            required
            style={fieldStyle}
          >
            <option value="">{t("selectBuck")}</option>

            {goats
              .filter(
                (g) =>
                  String(g.sex || "").trim().toLowerCase() ===
                  "male"
              )
              .map((g) => (
                <option key={g.id} value={g.id}>
                  {g.tag} - {g.name}
                </option>
              ))}
          </select>

          <p style={labelStyle}>{t("matingDate")}</p>

          <div
            className="kidding-edit-calendar-wrap"
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            <div
              role="button"
              tabIndex={0}
              onClick={openCalendar}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openCalendar();
                }
              }}
              style={calendarFieldStyle}
            >
              {formatDateDisplay(formData.mating_date)}
            </div>

            {calendarOpen && (
              <div className="kidding-edit-calendar">
                <div className="kidding-edit-calendar-header">
                  <button
                    type="button"
                    onClick={() => changeCalendarMonth(-1)}
                  >
                    ‹
                  </button>

                  <strong>
                    {monthNames[calendarMonth.getMonth()]}{" "}
                    {calendarMonth.getFullYear()}
                  </strong>

                  <button
                    type="button"
                    onClick={() => changeCalendarMonth(1)}
                  >
                    ›
                  </button>
                </div>

                <div className="kidding-edit-calendar-weekdays">
                  {weekdays.map((day) => (
                    <div key={day}>{day}</div>
                  ))}
                </div>

                <div className="kidding-edit-calendar-grid">
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

                    const dateValue = `${calendarMonth.getFullYear()}-${String(
                      calendarMonth.getMonth() + 1
                    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                    const selected =
                      formData.mating_date === dateValue;

                    const now = new Date();

                    const today =
                      now.getFullYear() ===
                        calendarMonth.getFullYear() &&
                      now.getMonth() === calendarMonth.getMonth() &&
                      now.getDate() === day;

                    return (
                      <button
                        key={day}
                        type="button"
                        className={
                          selected
                            ? "kidding-edit-calendar-day selected"
                            : today
                            ? "kidding-edit-calendar-day today"
                            : "kidding-edit-calendar-day"
                        }
                        onClick={() => selectCalendarDate(day)}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="kidding-edit-calendar-cancel"
                  onClick={() => setCalendarOpen(false)}
                >
                  Annuleren
                </button>
              </div>
            )}
          </div>

          <p style={labelStyle}>{t("expectedKidding")}</p>

          <input
            type="text"
            value={formatDateDisplay(formData.expected_kidding)}
            readOnly
            style={fieldStyle}
          />

          <p style={labelStyle}>{t("veterinarian")}</p>

          <input
            type="text"
            name="veterinarian"
            value={formData.veterinarian}
            onChange={handleChange}
            style={fieldStyle}
          />

          <p style={labelStyle}>{t("notes")}</p>

          <textarea
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            style={{
              ...fieldStyle,
              minHeight: "100px",
              resize: "vertical",
            }}
          />

          <div className="breeding-add-actions">
            <button className="button" type="submit">
              💾 {t("save")}
            </button>

            <Link className="button" to="/breeding">
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBreeding;
