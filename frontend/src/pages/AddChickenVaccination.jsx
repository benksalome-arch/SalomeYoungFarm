import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useLanguage } from "../context/LanguageContext";

export default function AddChickenVaccination() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [chickens, setChickens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    chicken_id: "",
    vaccination_date: "",
    vaccine_name: "",
    next_due_date: "",
    notes: "",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarField, setCalendarField] = useState("");
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

  useEffect(() => {
    loadChickens();
  }, []);

  async function loadChickens() {
    try {
      const response = await fetch(`${api}/chickens`);

      if (!response.ok) {
        throw new Error("Failed to load chickens");
      }

      const data = await response.json();
      setChickens(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading chickens:", error);
      setChickens([]);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openCalendar(field) {
    setCalendarField(field);

    const existingDate = formData[field];

    if (existingDate) {
      const parts = existingDate.split("-");

      if (parts.length === 3) {
        setCalendarMonth(
          new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            1
          )
        );
      }
    } else {
      setCalendarMonth(new Date());
    }

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
      [calendarField]: `${year}-${month}-${selectedDay}`,
    }));

    setCalendarOpen(false);
  }

  function formatDate(value) {
    if (!value) return "DD-MM-JJJJ";

    const valueString = String(value);
    const match = valueString.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (match) {
      return `${match[3]}-${match[2]}-${match[1]}`;
    }

    return valueString;
  }

  function getCalendarDays() {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let index = 0; index < firstDay; index += 1) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(day);
    }

    return days;
  }

  function isSelectedDay(day) {
    if (!day || !formData[calendarField]) return false;

    const parts = formData[calendarField].split("-");

    if (parts.length !== 3) return false;

    return (
      Number(parts[0]) === calendarMonth.getFullYear() &&
      Number(parts[1]) === calendarMonth.getMonth() + 1 &&
      Number(parts[2]) === day
    );
  }

  function isToday(day) {
    if (!day) return false;

    const today = new Date();

    return (
      today.getFullYear() === calendarMonth.getFullYear() &&
      today.getMonth() === calendarMonth.getMonth() &&
      today.getDate() === day
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.chicken_id) {
      alert(t("selectChicken") || "Selecteer een kip.");
      return;
    }

    if (!formData.vaccination_date) {
      alert(
        t("vaccinationDateRequired") ||
          "Vul de vaccinatiedatum in."
      );
      return;
    }

    if (!formData.vaccine_name.trim()) {
      alert(
        t("vaccineNameRequired") ||
          "Vul de naam van het vaccin in."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${api}/chicken-vaccinations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save vaccination");
      }

      alert(
        t("chickenVaccinationSaved") ||
          "Kippenvaccinatie opgeslagen."
      );

      navigate("/chicken-vaccinations");
    } catch (error) {
      console.error("Error saving chicken vaccination:", error);

      alert(
        t("saveError") ||
          "Opslaan mislukt."
      );
    } finally {
      setSaving(false);
    }
  }

  const calendarDays = getCalendarDays();

  const inputStyle = {
    width: "100%",
    height: "46px",
    padding: "0 12px",
    border: "1px solid #cfd6cf",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
    background: "#fff",
    color: "#222",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#333",
  };

  const fieldStyle = {
    marginBottom: "18px",
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "15px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "26px",
            fontWeight: "700",
          }}
        >
          💉 Kippenvaccinatie registreren
        </h1>

        <button
          type="button"
          onClick={() => navigate("/chicken-vaccinations")}
          style={{
            height: "40px",
            padding: "0 16px",
            border: "1px solid #cfd6cf",
            borderRadius: "8px",
            background: "#fff",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          {t("back") || "Terug"}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "20px",
          }}
        >
          <div style={fieldStyle}>
            <label style={labelStyle}>
              {t("chicken") || "Kip"} *
            </label>

            <select
              name="chicken_id"
              value={formData.chicken_id}
              onChange={handleChange}
              style={inputStyle}
              disabled={loading}
            >
              <option value="">
                {loading
                  ? "Laden..."
                  : t("selectChicken") || "Selecteer kip"}
              </option>

              {chickens.map((chicken) => (
                <option
                  key={chicken.id}
                  value={chicken.id}
                >
                  {chicken.name ||
                    chicken.earTag ||
                    chicken.ear_tag ||
                    `Kip ${chicken.id}`}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              {t("vaccineName") || "Vaccin"} *
            </label>

            <input
              type="text"
              name="vaccine_name"
              value={formData.vaccine_name}
              onChange={handleChange}
              style={inputStyle}
              placeholder={
                t("vaccineNamePlaceholder") ||
                "Naam van vaccin"
              }
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              {t("vaccinationDate") || "Vaccinatiedatum"} *
            </label>

            <button
              type="button"
              onClick={() =>
                openCalendar("vaccination_date")
              }
              style={{
                ...inputStyle,
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>
                {formatDate(formData.vaccination_date)}
              </span>

              <span>📅</span>
            </button>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              {t("nextVaccinationDate") ||
                "Volgende vaccinatiedatum"}
            </label>

            <button
              type="button"
              onClick={() =>
                openCalendar("next_due_date")
              }
              style={{
                ...inputStyle,
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>
                {formatDate(formData.next_due_date)}
              </span>

              <span>📅</span>
            </button>
          </div>

          <div
            style={{
              ...fieldStyle,
              gridColumn: "1 / -1",
            }}
          >
            <label style={labelStyle}>
              {t("notes") || "Notities"}
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              style={{
                ...inputStyle,
                height: "auto",
                padding: "12px",
                resize: "vertical",
              }}
              placeholder={
                t("notesPlaceholder") ||
                "Eventuele opmerkingen"
              }
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button
            type="button"
            onClick={() =>
              navigate("/chicken-vaccinations")
            }
            style={{
              height: "44px",
              padding: "0 18px",
              border: "1px solid #cfd6cf",
              borderRadius: "8px",
              background: "#fff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            {t("cancel") || "Annuleren"}
          </button>

          <button
            type="submit"
            disabled={saving}
            style={{
              height: "44px",
              padding: "0 22px",
              border: "none",
              borderRadius: "8px",
              background: "#2e7d32",
              color: "#fff",
              cursor: saving
                ? "not-allowed"
                : "pointer",
              fontWeight: "700",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving
              ? "Opslaan..."
              : t("save") || "Opslaan"}
          </button>
        </div>
      </form>

      {calendarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "16px",
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setCalendarOpen(false);
            }
          }}
        >
          <div
            style={{
              width: "min(92vw, 360px)",
              background: "#fff",
              borderRadius: "14px",
              padding: "18px",
              boxShadow:
                "0 12px 35px rgba(0,0,0,0.25)",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                marginBottom: "14px",
              }}
            >
              <select
                value={calendarMonth.getMonth()}
                onChange={(event) =>
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      Number(event.target.value),
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
                  fontWeight: "600",
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
                onChange={(event) =>
                  setCalendarMonth(
                    new Date(
                      Number(event.target.value),
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
                  fontWeight: "600",
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
                onClick={() =>
                  changeCalendarMonth(-1)
                }
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
                onClick={() =>
                  changeCalendarMonth(1)
                }
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
                gridTemplateColumns:
                  "repeat(7, 1fr)",
                gap: "4px",
                marginBottom: "6px",
              }}
            >
              {weekDays.map((day) => (
                <div
                  key={day}
                  style={{
                    textAlign: "center",
                    fontWeight: "700",
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
                gridTemplateColumns:
                  "repeat(7, 1fr)",
                gap: "4px",
              }}
            >
              {calendarDays.map((day, index) => {
                const selected = isSelectedDay(day);
                const today = isToday(day);

                return (
                  <button
                    key={`${day}-${index}`}
                    type="button"
                    disabled={!day}
                    onClick={() =>
                      day && handleDateSelect(day)
                    }
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      borderRadius: "50%",
                      border: selected
                        ? "2px solid #2e7d32"
                        : "1px solid transparent",
                      background:
                        selected || today
                          ? "#dff1df"
                          : "#fff",
                      color:
                        selected || today
                          ? "#1b5e20"
                          : "#222",
                      fontWeight:
                        selected || today
                          ? "700"
                          : "500",
                      cursor: day
                        ? "pointer"
                        : "default",
                      boxShadow: today
                        ? "0 0 0 2px rgba(46,125,50,0.15)"
                        : "none",
                      opacity: day ? 1 : 0,
                      padding: 0,
                    }}
                  >
                    {day || ""}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                setCalendarOpen(false)
              }
              style={{
                width: "100%",
                height: "42px",
                marginTop: "16px",
                border: "1px solid #cfd6cf",
                borderRadius: "8px",
                background: "#fff",
                color: "#333",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Annuleren
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
