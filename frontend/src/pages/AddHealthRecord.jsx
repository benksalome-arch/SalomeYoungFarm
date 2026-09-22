import API_URL from "../api";
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddHealthRecord() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    goat_id: id,
    record_date: "",
    record_type: "Vaccination",
    medicine: "",
    dosage: "",
    veterinarian: "",
    notes: "",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

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

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    const date = String(day).padStart(2, "0");

    setFormData({
      ...formData,
      record_date: `${year}-${month}-${date}`,
    });

    setCalendarOpen(false);
  }

  function openCalendar() {
    const selected = formData.record_date
      ? new Date(formData.record_date + "T00:00:00")
      : new Date();

    setCalendarMonth(
      new Date(selected.getFullYear(), selected.getMonth(), 1)
    );
    setCalendarOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/health`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      alert(data.message);

      navigate(`/goats/${id}/health`);
    } catch (error) {
      console.error(error);
      alert(t("failedToSaveHealthRecord"));
    }
  }

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="page">
      <div className="card">
        <h1>💉 {t("addHealthRecord")}</h1>

        <form onSubmit={handleSubmit}>
          <p>{t("date")}</p>

          <div
            onClick={openCalendar}
            style={{
              width: "100%",
              minHeight: "44px",
              padding: "10px 12px",
              boxSizing: "border-box",
              border: "1px solid #cfd6cf",
              borderRadius: "7px",
              background: "#fff",
              color: formData.record_date ? "#222" : "#777",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            {formData.record_date
              ? new Date(
                  formData.record_date + "T00:00:00"
                ).toLocaleDateString("nl-NL", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "DD-MM-JJJJ"}
          </div>

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
                    justifyContent: "space-between",
                    gap: "8px",
                    marginBottom: "14px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => changeCalendarMonth(-1)}
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: "24px",
                      cursor: "pointer",
                      padding: "4px 10px",
                    }}
                  >
                    ‹
                  </button>

                  <select
                    value={month}
                    onChange={(e) =>
                      setCalendarMonth(
                        new Date(year, Number(e.target.value), 1)
                      )
                    }
                    style={{
                      flex: 1,
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "7px",
                      background: "#fff",
                      fontSize: "15px",
                    }}
                  >
                    {monthNames.map((name, index) => (
                      <option key={name} value={index}>
                        {name}
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
                      flex: 1,
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "7px",
                      background: "#fff",
                      fontSize: "15px",
                    }}
                  >
                    {calendarYears.map((calendarYear) => (
                      <option key={calendarYear} value={calendarYear}>
                        {calendarYear}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => changeCalendarMonth(1)}
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: "24px",
                      cursor: "pointer",
                      padding: "4px 10px",
                    }}
                  >
                    ›
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "5px",
                    marginBottom: "6px",
                  }}
                >
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      style={{
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: "12px",
                        color: "#555",
                        padding: "4px 0",
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
                  {calendarDays.map((day, index) => {
                    if (!day) {
                      return <div key={`empty-${index}`} />;
                    }

                    const dateString = `${year}-${String(month + 1).padStart(
                      2,
                      "0"
                    )}-${String(day).padStart(2, "0")}`;

                    const isSelected =
                      formData.record_date === dateString;
                    const isToday = todayString === dateString;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        style={{
                          width: "34px",
                          height: "34px",
                          justifySelf: "center",
                          borderRadius: "50%",
                          border: isSelected
                            ? "2px solid #1b5e20"
                            : "1px solid transparent",
                          background: isSelected
                            ? "#2e7d32"
                            : isToday
                            ? "#4caf50"
                            : "transparent",
                          color:
                            isSelected || isToday ? "#fff" : "#222",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: isSelected || isToday ? 600 : 400,
                          boxShadow: isToday
                            ? "0 0 0 2px #c8e6c9"
                            : "none",
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
                    display: "block",
                    margin: "16px auto 0",
                    padding: "8px 22px",
                    border: "none",
                    borderRadius: "7px",
                    background: "#eee",
                    color: "#222",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Annuleren
                </button>
              </div>
            </div>
          )}

          <p>{t("recordType")}</p>
          <select
            name="record_type"
            value={formData.record_type}
            onChange={handleChange}
          >
            <option>{t("vaccination")}</option>
            <option value="Deworming">{t("deworming")}</option>
            <option value="Treatment">{t("treatment")}</option>
            <option value="Check-up">{t("checkup")}</option>
          </select>

          <p>{t("medicine")}</p>
          <input
            type="text"
            name="medicine"
            value={formData.medicine}
            onChange={handleChange}
          />

          <p>{t("dosage")}</p>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
          />

          <p>{t("veterinarian")}</p>
          <input
            type="text"
            name="veterinarian"
            value={formData.veterinarian}
            onChange={handleChange}
          />

          <p>{t("notes")}</p>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <br />
          <br />

          <button className="button" type="submit">
            Save Health Record
          </button>{" "}

          <Link className="button" to={`/goats/${id}/health`}>
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
}

export default AddHealthRecord;
