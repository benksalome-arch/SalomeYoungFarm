import API_URL from "../api";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditRabbitLitter() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [breedingRecords, setBreedingRecords] = useState([]);
  const [form, setForm] = useState({
    breeding_id: "",
    birth_date: "",
    total_kits: "",
    live_kits: "",
    dead_kits: "",
    notes: "",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [calendarPosition, setCalendarPosition] = useState({
    top: 0,
    left: 0,
  });

  const birthDateFieldRef = useRef(null);
  const calendarRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);

      const [littersResponse, breedingResponse] = await Promise.all([
        fetch(`${API_URL}/api/rabbit-litters`),
        fetch(`${API_URL}/api/rabbit-breeding`),
      ]);

      const litters = await littersResponse.json();
      const breedings = await breedingResponse.json();

      if (!littersResponse.ok) {
        throw new Error("Failed to load litter record.");
      }

      const litter = litters.find(
        (item) => String(item.id) === String(id)
      );

      if (!litter) {
        throw new Error("Rabbit litter record not found.");
      }

      setBreedingRecords(
        Array.isArray(breedings) ? breedings : []
      );

      setForm({
        breeding_id: litter.breeding_id || "",
        birth_date: litter.birth_date
          ? litter.birth_date.split("T")[0]
          : "",
        total_kits: litter.total_kits ?? "",
        live_kits: litter.live_kits ?? "",
        dead_kits: litter.dead_kits ?? "",
        notes: litter.notes || "",
      });

      if (litter.birth_date) {
        setCalendarMonth(
          new Date(`${litter.birth_date.split("T")[0]}T00:00:00`)
        );
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load litter record.");
    } finally {
      setLoading(false);
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

      // Open the calendar above the date field when there is enough space.
      // This keeps it from pushing the fields below it off-screen.
      let top = fieldRect.top - calendarRect.height - gap;

      // If there is not enough room above, open it below the field.
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

      // Keep the calendar inside the horizontal viewport.
      if (left + calendarRect.width > window.innerWidth - viewportPadding) {
        left = window.innerWidth - calendarRect.width - viewportPadding;
      }

      if (left < viewportPadding) {
        left = viewportPadding;
      }

      // Keep the calendar close to the date field.
      // Prefer above; if there is not enough room, place it directly below.
      if (top < viewportPadding) {
        top = fieldRect.bottom + gap;
      }

      // Final viewport protection.
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
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  }

  function formatDateDisplay(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}-${month}-${year}`;
  }

  function selectCalendarDate(day) {
    const year = calendarMonth.getFullYear();
    const month = String(calendarMonth.getMonth() + 1).padStart(2, "0");
    const selectedDay = String(day).padStart(2, "0");

    setForm((previous) => ({
      ...previous,
      birth_date: `${year}-${month}-${selectedDay}`,
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

  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const currentYear = new Date().getFullYear();
  const calendarYears = Array.from(
    { length: 101 },
    (_, index) => currentYear - index
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const total = Number(form.total_kits || 0);
    const live = Number(form.live_kits || 0);
    const dead = Number(form.dead_kits || 0);

    if (!form.breeding_id || !form.birth_date) {
      setError("Breeding record and birth date are required.");
      return;
    }

    if (total <= 0) {
      setError(
        t("rabbitLitterMustHaveKits") ||
          "Total kits must be greater than 0."
      );
      return;
    }

    if (live + dead !== total) {
      setError(
        t("rabbitLitterLiveDeadMustEqualTotal") ||
          "Live kits plus dead kits must equal total kits."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/rabbit-litters/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            breeding_id: Number(form.breeding_id),
            birth_date: form.birth_date,
            total_kits: total,
            live_kits: live,
            dead_kits: dead,
            notes: form.notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to update litter record."
        );
        return;
      }

      alert(
        data.message ||
          t("rabbitLitterUpdatedSuccessfully") ||
          "Rabbit litter record updated successfully!"
      );

      navigate("/rabbit-litters");
    } catch (err) {
      console.error(err);
      setError("Failed to update litter record.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="card rabbit-litter-form-card">
        <p>{t("loading") || "Loading..."}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="rabbit-litters-header">
        <div>
          <h1>🐇 {t("editRabbitLitter") || "Edit Rabbit Litters"}</h1>
          <p>{t("rabbitLitterDescription")}</p>
        </div>

        <button
          type="button"
          className="button"
          onClick={() => navigate("/rabbit-litters")}
        >
          ← {t("back") || "Terug"}
        </button>
      </div>

      <div className="card rabbit-litter-form-card">
        <form onSubmit={handleSubmit} className="rabbit-litter-edit-form">

          {error && (
            <div
              style={{
                color: "#C62828",
                marginBottom: "15px",
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>{t("breedingRecord")}</strong>
            </label>

            <select
              name="breeding_id"
              value={form.breeding_id}
              onChange={handleChange}
              disabled={saving}
            >
              <option value="">
                {t("selectBreedingRecord") || "Select breeding record"}
              </option>

              {breedingRecords.map((breeding) => (
                <option
                  key={breeding.id}
                  value={breeding.id}
                >
                  {breeding.female_tag_number || "-"} -{" "}
                  {breeding.female_name || t("rabbit")}{" "}
                  ×{" "}
                  {breeding.male_tag_number || "-"} -{" "}
                  {breeding.male_name || t("rabbit")}{" "}
                  —{" "}
                  {breeding.breeding_date
                    ? breeding.breeding_date.split("T")[0]
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <div
            className="rabbit-litter-date-field"
            style={{
              marginBottom: "15px",
              position: "relative",
            }}
          >
            <label>
              <strong>{t("birthDate")}</strong>
            </label>

            <div style={{ position: "relative" }}>
              <div style={{ position: "relative", width: "100%" }}>
                <div
                  ref={birthDateFieldRef}
                  onClick={(e) => {
                    const selected = form.birth_date
                      ? new Date(form.birth_date + "T00:00:00")
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
                    width: "100%",
                    height: "42px",
                    minHeight: "42px",
                    boxSizing: "border-box",
                    padding: "0 12px",
                    border: "1px solid #cfd6cf",
                    borderRadius: "7px",
                    background: "#fff",
                    color: form.birth_date ? "#222" : "#777",
                    WebkitTextFillColor: form.birth_date ? "#222" : "#777",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  {form.birth_date
                    ? new Date(form.birth_date + "T00:00:00").toLocaleDateString("nl-NL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "DD-MM-JJJJ"}
                </div>


              </div>

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

                          const selected = form.birth_date === dateValue;

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

          <div>
            <label>
              <strong>{t("totalKits")}</strong>
            </label>
            <input
              type="number"
              name="total_kits"
              min="0"
              value={form.total_kits}
              onChange={handleChange}
              disabled={saving}
            />
          </div>

          <div>
            <label>
              <strong>{t("liveKits")}</strong>
            </label>
            <input
              type="number"
              name="live_kits"
              min="0"
              value={form.live_kits}
              onChange={handleChange}
              disabled={saving}
            />
          </div>

          <div>
            <label>
              <strong>{t("deadKits")}</strong>
            </label>
            <input
              type="number"
              name="dead_kits"
              min="0"
              value={form.dead_kits}
              onChange={handleChange}
              disabled={saving}
            />
          </div>

          <div>
            <label>
              <strong>{t("notes")}</strong>
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              disabled={saving}
              rows="4"
            />
          </div>

          <div
            className="rabbit-litter-form-actions"
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              className="button"
              disabled={saving}
            >
              💾 {saving ? "Saving..." : t("update")}
            </button>

            <button
              type="button"
              className="button"
              onClick={() => navigate("/rabbit-litters")}
              disabled={saving}
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRabbitLitter;
