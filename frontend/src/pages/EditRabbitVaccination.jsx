import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditRabbitVaccination() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    rabbit_id: "",
    vaccination_date: "",
    vaccine_name: "",
    dosage: "",
    next_due_date: "",
    administered_by: "",
    notes: "",
  });

  const [rabbits, setRabbits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarField, setCalendarField] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [vaccinationResponse, rabbitsResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/rabbit-vaccinations`),
          fetch(`${API_URL}/api/rabbits`),
        ]);

      const vaccinations = await vaccinationResponse.json();
      const rabbitsData = await rabbitsResponse.json();

      if (!vaccinationResponse.ok) {
        throw new Error("Could not load vaccination record.");
      }

      const found = vaccinations.find(
        (item) => String(item.id) === String(id)
      );

      if (!found) {
        throw new Error("Vaccination record not found.");
      }

      setForm({
        rabbit_id: found.rabbit_id || "",
        vaccination_date: found.vaccination_date
          ? String(found.vaccination_date).split("T")[0]
          : "",
        vaccine_name: found.vaccine_name || "",
        dosage: found.dosage || "",
        next_due_date: found.next_due_date
          ? String(found.next_due_date).split("T")[0]
          : "",
        administered_by: found.administered_by || "",
        notes: found.notes || "",
      });

      setRabbits(
        Array.isArray(rabbitsData)
          ? rabbitsData
          : rabbitsData.rabbits || []
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load vaccination record.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/rabbit-vaccinations/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not update vaccination."
        );
      }

      navigate(`/rabbit-vaccinations/${id}`);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Could not update vaccination."
      );
    } finally {
      setSaving(false);
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) return "";

    const parts = String(dateValue).split("-");

    if (parts.length !== 3) return dateValue;

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  function openCalendar(fieldName) {
    const currentValue = form[fieldName];

    let initialDate = new Date();

    if (currentValue) {
      const parts = currentValue.split("-");

      if (parts.length === 3) {
        initialDate = new Date(
          Number(parts[0]),
          Number(parts[1]) - 1,
          Number(parts[2])
        );
      }
    }

    setCalendarField(fieldName);
    setCalendarMonth(initialDate);
    setCalendarOpen(true);
  }

  function selectCalendarDate(day) {
    const year = calendarMonth.getFullYear();
    const month = String(calendarMonth.getMonth() + 1).padStart(2, "0");
    const selectedDay = String(day).padStart(2, "0");

    const dateValue = `${year}-${month}-${selectedDay}`;

    setForm((previous) => ({
      ...previous,
      [calendarField]: dateValue,
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

  function renderCalendar(fieldName) {
    if (!calendarOpen || calendarField !== fieldName) {
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

    const selectedDate = form[fieldName];

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

  if (loading) {
    return (
      <div className="card">
        <p style={{ textAlign: "center", padding: "30px" }}>
          {t("loadingVaccinationRecords")}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        paddingBottom: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "22px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            ✏️ {t("edit")} {t("rabbitVaccinations")}
          </h1>
        </div>

        <Link
          className="button"
          to={`/rabbit-vaccinations/${id}`}
        >
          ← {t("back")}
        </Link>
      </div>

      {error && (
        <div
          style={{
            marginBottom: "18px",
            padding: "12px 14px",
            borderRadius: "7px",
            background: "#ffebee",
            color: "#b71c1c",
            border: "1px solid #ffcdd2",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="card"
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "18px",
          }}
        >
          <div>
            <label style={labelStyle}>Konijn</label>

            <select
              name="rabbit_id"
              value={form.rabbit_id}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="">Selecteer konijn</option>

              {rabbits.map((rabbit) => (
                <option key={rabbit.id} value={rabbit.id}>
                  {rabbit.name || "-"}{" "}
                  {rabbit.tag ? `(${rabbit.tag})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div style={{ position: "relative" }}>
            <label style={labelStyle}>
              {t("date")}
            </label>

            <button
              type="button"
              onClick={() => openCalendar("vaccination_date")}
              style={{
                ...inputStyle,
                textAlign: "left",
                cursor: "pointer",
                minHeight: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>
                {formatDate(form.vaccination_date) || "-"}
              </span>

              <span style={{ fontSize: "16px" }}>▣</span>
            </button>

            {renderCalendar("vaccination_date")}
          </div>

          <div>
            <label style={labelStyle}>
              {t("vaccine")}
            </label>

            <input
              type="text"
              name="vaccine_name"
              value={form.vaccine_name}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>
              {t("dosage")}
            </label>

            <input
              type="text"
              name="dosage"
              value={form.dosage}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ position: "relative" }}>
            <label style={labelStyle}>
              {t("nextDueDate")}
            </label>

            <button
              type="button"
              onClick={() => openCalendar("next_due_date")}
              style={{
                ...inputStyle,
                textAlign: "left",
                cursor: "pointer",
                minHeight: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>
                {formatDate(form.next_due_date) || "-"}
              </span>

              <span style={{ fontSize: "16px" }}>▣</span>
            </button>

            {renderCalendar("next_due_date")}
          </div>

          <div>
            <label style={labelStyle}>
              {t("administeredBy")}
            </label>

            <input
              type="text"
              name="administered_by"
              value={form.administered_by}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginTop: "18px" }}>
          <label style={labelStyle}>
            {t("notes")}
          </label>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="5"
            style={{
              ...inputStyle,
              resize: "vertical",
              lineHeight: "1.5",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "22px",
          }}
        >
          <Link
            className="button"
            to={`/rabbit-vaccinations/${id}`}
          >
            {t("cancel")}
          </Link>

          <button
            type="submit"
            className="button"
            disabled={saving}
            style={{
              background: "#2e7d32",
              color: "#fff",
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Opslaan..." : "💾 Opslaan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRabbitVaccination;
