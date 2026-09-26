import API_URL from "../api";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddRabbitLitter() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const birthDateRef = useRef(null);

  const [breedings, setBreedings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [form, setForm] = useState({
    breeding_id: "",
    birth_date: "",
    total_kits: "",
    live_kits: "",
    dead_kits: "",
    notes: "",
  });

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontWeight: 600,
    fontSize: "15px",
    lineHeight: 1.3,
    color: "#222",
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


  useEffect(() => {
    loadBreedings();
  }, []);

  async function loadBreedings() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/rabbit-breeding`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to load breeding records."
        );
        return;
      }

      setBreedings(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load breeding records.");
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

  const currentYear = new Date().getFullYear();

  const calendarYears = Array.from(
    { length: 101 },
    (_, index) => currentYear - index
  );

  const monthNames = [
    "Januari", "Februari", "Maart", "April", "Mei", "Juni",
    "Juli", "Augustus", "September", "Oktober", "November", "December"
  ];

  const weekDays = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];

  function formatDateDisplay(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return year && month && day ? `${day}-${month}-${year}` : "";
  }

  function selectCalendarDate(day) {
    const year = calendarMonth.getFullYear();
    const month = String(calendarMonth.getMonth() + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");

    setForm((previous) => ({
      ...previous,
      birth_date: `${year}-${month}-${date}`,
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

  const today = new Date();

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    const total = Number(form.total_kits || 0);
    const live = Number(form.live_kits || 0);
    const dead = Number(form.dead_kits || 0);

    if (!form.breeding_id) {
      setError("Please select a breeding record.");
      return;
    }

    if (!form.birth_date) {
      setError("Please enter the birth date.");
      return;
    }

    if (total < 0 || live < 0 || dead < 0) {
      setError("Kit quantities cannot be negative.");
      return;
    }

    if (live + dead !== total) {
      setError(
        "Live kits plus dead kits must equal total kits."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/rabbit-litters`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
          data.message || "Failed to save litter record."
        );
        return;
      }

      alert(
        data.message ||
          "Rabbit litter recorded successfully!"
      );

      navigate("/rabbit-litters");
    } catch (err) {
      console.error(err);
      setError("Failed to save litter record.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="page add-rabbit-litter-page"
      style={{
        width: "100%",
        maxWidth: "700px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "20px",
        }}
      >
        <div>
          <h1>🐇 {t("recordRabbitLitter")}</h1>

          <p>
            {t("litterDescription")}
          </p>
        </div>

        <Link
          className="button"
          to="/rabbit-litters"
        >
          ← {t("back")}
        </Link>
      </div>

      {/* Error */}

      {error && (
        <div
          style={{
            background: "#FFEBEE",
            color: "#C62828",
            padding: "12px 15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}


      <style>{`
        .rabbit-litter-page {
          width: 100%;
        }

        .rabbit-litter-header {
          text-align: center;
        }

        .rabbit-litter-header > div:first-child {
          width: 100%;
        }

        .rabbit-litter-header h1 {
          margin: 0 0 8px 0;
          color: #222 !important;
          -webkit-text-fill-color: #222 !important;
          font-size: 28px;
          line-height: 1.25;
          font-weight: 700;
          letter-spacing: 0;
          text-align: center;
        }

        .rabbit-litter-header p {
          margin: 0;
          color: #555 !important;
          font-size: 16px;
        }

        .rabbit-litter-header > a {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }

        .rabbit-litter-form-card {
          width: min(100%, 620px);
          margin: 0 auto;
          padding: 30px;
          box-sizing: border-box;
          border-radius: 14px;
        }

        .rabbit-litter-form-card form {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .rabbit-litter-form-card form > div {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px); justify-content: center;
          gap: 14px;
          align-items: center;
          width: 100%;
          margin-bottom: 15px !important;
        }

        .rabbit-litter-form-card form > div > label {
          text-align: right;
          color: #222;
          font-weight: 600;
          margin: 0;
        }

        .rabbit-litter-form-card input,
        .rabbit-litter-form-card select,
        .rabbit-litter-form-card textarea {
          width: 100% !important;
          box-sizing: border-box;
          min-height: 44px;
          padding: 9px 11px !important;
          margin: 0 !important;
          border: 1px solid #cfd6cf !important;
          border-radius: 7px;
          background: #fff !important;
          color: #222 !important;
          -webkit-text-fill-color: #222 !important;
        }

        .rabbit-litter-form-card textarea {
          min-height: 96px;
        }

          width: 100%;
        }

        .rabbit-litter-form-card .rabbit-litter-date-field > div { width: 100%; min-width: 0; }

        .rabbit-litter-form-card .rabbit-litter-date-field > div > div { width: 100%; min-width: 0; }

        .rabbit-litter-form-card form > div:last-child {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
          margin-bottom: 0 !important;
          width: 100%;
        }

        .rabbit-litter-form-card form > div:last-child .button {
          min-height: 44px;
          padding: 10px 20px;
          border-radius: 8px;
        }

        @media (min-width: 701px) {
          .rabbit-litter-form-card .rabbit-litter-date-field > div {
            width: 100% !important;
            height: 44px !important;
            min-height: 44px !important;
          }

          .rabbit-litter-form-card .rabbit-litter-date-field input {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            opacity: 0 !important;
            pointer-events: none !important;
            border: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }

        @media (max-width: 700px) {
          .rabbit-litter-header {
            flex-direction: column;
            margin-bottom: 20px !important;
          }

          .rabbit-litter-header h1 {
            font-size: 26px;
          }

          .rabbit-litter-header > a {
            position: static;
            transform: none;
            margin-top: 10px;
          }

          .rabbit-litter-form-card {
            width: 100%;
            padding: 20px 14px;
          }

          .rabbit-litter-form-card form > div {
            grid-template-columns: 105px minmax(0, 1fr); width: min(100%, 375px); margin-left: auto; margin-right: auto;
            gap: 12px;
          }

          .rabbit-litter-form-card form > div > label {
            text-align: right;
            font-size: 13px;
          }
        }
      `}</style>

      {/* Form */}

      <div className="card">
        <form onSubmit={handleSubmit}>

          {/* Breeding */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>{t("breedingRecord")}</strong>
            </label>

            <select
              name="breeding_id"
              value={form.breeding_id}
              onChange={handleChange}
              disabled={loading || saving}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
              }}
            >
              <option value="">
                {loading
                  ? "Loading breeding records..."
                  : t("selectBreedingRecord")}
              </option>

              {breedings.map((breeding) => (
                <option
                  key={breeding.id}
                  value={breeding.id}
                >
                  {breeding.female_tag_number} -{" "}
                  {breeding.female_name || t("female")}{" "}
                  ×{" "}
                  {breeding.male_tag_number || "Unknown"} -{" "}
                  {breeding.male_name || t("male")}{" "}
                  —{" "}
                  {breeding.breeding_date
                    ? breeding.breeding_date.split("T")[0]
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Birth Date */}
          <p style={{ margin: "0 0 16px" }}>
            <label style={labelStyle}>{t("birthDate")}</label>

            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="text"
                value={
                  form.birth_date
                    ? form.birth_date.split("-").reverse().join("-")
                    : ""
                }
                placeholder="DD-MM-JJJJ"
                readOnly
                onClick={() => {
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
                  ...inputStyle,
                  width: "100%",
                  cursor: "pointer",
                  color: "#222",
                  WebkitTextFillColor: "#222",
                  backgroundColor: "#fff",
                }}
              />

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
                        justifyContent: "space-between",
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

                        const selected =
                          form.birth_date === dateValue;

                        const today = new Date();

                        const isToday =
                          day === today.getDate() &&
                          calendarMonth.getMonth() === today.getMonth() &&
                          calendarMonth.getFullYear() === today.getFullYear();

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => selectCalendarDate(day)}
                            style={{
                              height: "38px",
                              border: selected
                                ? "2px solid #1b5e20"
                                : isToday
                                ? "2px solid #2e7d32"
                                : "1px solid #ddd",
                              borderRadius: "50%",
                              background: selected
                                ? "#2e7d32"
                                : isToday
                                ? "#4caf50"
                                : "#fff",
                              color: selected || isToday ? "#fff" : "#222",
                              fontWeight:
                                selected || isToday ? 800 : 400,
                              cursor: "pointer",
                              fontSize: "14px",
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
                        width: "100%",
                        marginTop: "16px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        background: "#fff",
                        color: "#222",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Annuleren
                    </button>
                  </div>
                </div>
              )}
            </div>
          </p>


          {/* Total Kits */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>{t("totalKits")}</strong>
            </label>

            <input
              type="number"
              min="0"
              name="total_kits"
              value={form.total_kits}
              onChange={handleChange}
              disabled={saving}
              placeholder={t("totalKitsExample")}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
              }}
            />
          </div>

          {/* Live Kits */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>{t("liveKits")}</strong>
            </label>

            <input
              type="number"
              min="0"
              name="live_kits"
              value={form.live_kits}
              onChange={handleChange}
              disabled={saving}
              placeholder={t("livingKitsExample")}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
              }}
            />
          </div>

          {/* Dead Kits */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>{t("deadKits")}</strong>
            </label>

            <input
              type="number"
              min="0"
              name="dead_kits"
              value={form.dead_kits}
              onChange={handleChange}
              disabled={saving}
              placeholder={t("deadKitsExample")}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
              }}
            />
          </div>

          {/* Notes */}

          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>{t("notes")}</strong>
            </label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              disabled={saving}
              rows="4"
              placeholder={t("litterNotesExample")}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                resize: "vertical",
              }}
            />
          </div>

          {/* Buttons */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              className="button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : `💾 ${t("saveLitterRecord")}`}
            </button>

            <Link
              className="button"
              to="/rabbit-litters"
            >
              {t("cancel")}
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddRabbitLitter;
