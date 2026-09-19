import API_URL from "../api";
import { useEffect, useState } from "react";
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

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

    if (live + dead !== total) {
      setError("Live kits plus dead kits must equal total kits.");
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
          <h1>🐇 {t("rabbitLitters")}</h1>
          <p>{t("rabbitLitterDescription")}</p>
        </div>

        <button
          type="button"
          className="button"
          onClick={() => navigate("/rabbit-litters")}
        >
          ← {t("cancel")}
        </button>
      </div>

      <div className="card rabbit-litter-form-card">
        <form onSubmit={handleSubmit}>

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
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    minHeight: "44px",
                    padding: "10px 12px",
                    border: "1px solid #cfd6cf",
                    borderRadius: "7px",
                    background: "#fff",
                    color: form.birth_date ? "#222" : "#777",
                    WebkitTextFillColor: form.birth_date ? "#222" : "#777",
                    display: "flex",
                    alignItems: "center",
                    pointerEvents: "none",
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

                <input
                  type="date"
                  name="birth_date"
                  value={form.birth_date || ""}
                  onChange={handleChange}
                  onClick={(e) => e.currentTarget.showPicker?.()}
                  onFocus={(e) => e.currentTarget.showPicker?.()}
                  disabled={saving}
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

              {calendarOpen && (
                <div
                  className="rabbit-litter-calendar"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 9999,
                    width: "min(92vw, 320px)",
                    padding: "14px",
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    className="rabbit-litter-calendar-header"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => changeCalendarMonth(-1)}
                      style={{
                        border: "none",
                        background: "transparent",
                        fontSize: "28px",
                        color: "#222",
                        cursor: "pointer",
                      }}
                    >
                      ‹
                    </button>

                    <strong style={{ color: "#222" }}>
                      {monthNames[calendarMonth.getMonth()]}{" "}
                      {calendarMonth.getFullYear()}
                    </strong>

                    <button
                      type="button"
                      onClick={() => changeCalendarMonth(1)}
                      style={{
                        border: "none",
                        background: "transparent",
                        fontSize: "28px",
                        color: "#222",
                        cursor: "pointer",
                      }}
                    >
                      ›
                    </button>
                  </div>

                  <div
                    className="rabbit-litter-calendar-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                      gap: "3px",
                      textAlign: "center",
                    }}
                  >
                    {weekdays.map((day) => (
                      <div
                        key={day}
                        style={{
                          fontWeight: 700,
                          fontSize: "12px",
                          color: "#555",
                          padding: "4px 0",
                        }}
                      >
                        {day}
                      </div>
                    ))}

                    {Array.from({ length: firstDay }).map(
                      (_, index) => (
                        <div key={`empty-${index}`} />
                      )
                    )}

                    {Array.from(
                      { length: daysInMonth },
                      (_, index) => index + 1
                    ).map((day) => {
                      const dateValue =
                        `${calendarMonth.getFullYear()}-` +
                        `${String(
                          calendarMonth.getMonth() + 1
                        ).padStart(2, "0")}-` +
                        `${String(day).padStart(2, "0")}`;

                      const today = new Date();

                      const selected =
                        form.birth_date === dateValue;

                      const isToday =
                        day === today.getDate() &&
                        calendarMonth.getMonth() ===
                          today.getMonth() &&
                        calendarMonth.getFullYear() ===
                          today.getFullYear();

                      return (
                        <button
                          className={`rabbit-litter-calendar-day${
                            selected || isToday
                              ? " rabbit-litter-calendar-selected"
                              : ""
                          }`}
                          key={day}
                          type="button"
                          onClick={() =>
                            selectCalendarDate(day)
                          }
                          style={{
                            border: "none",
                            borderRadius: "6px",
                            padding: "7px 2px",
                            cursor: "pointer",
                            background:
                              selected || isToday
                                ? "#1976d2"
                                : "transparent",
                            color:
                              selected || isToday
                                ? "#fff"
                                : "#222",
                            fontWeight:
                              selected || isToday
                                ? 700
                                : 400,
                          }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
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
