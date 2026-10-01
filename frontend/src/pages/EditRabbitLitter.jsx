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

  const [formData, setFormData] = useState({
    rabbit_id: "",
    mortality_date: "",
    quantity: 1,
    cause: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);

      const [rabbitsResponse, mortalityResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/rabbits`),
          fetch(`${API_URL}/api/rabbit-mortality`),
        ]);

      const rabbitsData = await rabbitsResponse.json();
      const mortalityData = await mortalityResponse.json();

      if (!rabbitsResponse.ok) {
        throw new Error(
          rabbitsData.message || "Failed to load rabbits."
        );
      }

      if (!mortalityResponse.ok) {
        throw new Error(
          mortalityData.message ||
            "Failed to load mortality record."
        );
      }

      const record = mortalityData.find(
        (item) => Number(item.id) === Number(id)
      );

      if (!record) {
        alert(t("noRabbitMortalityRecordsFound"));
        navigate("/rabbit-mortality");
        return;
      }

      setRabbits(rabbitsData);

      const date = record.mortality_date
        ? String(record.mortality_date).split("T")[0]
        : "";

      setFormData({
        rabbit_id: record.rabbit_id || "",
        mortality_date: date,
        quantity: record.quantity || 1,
        cause: record.cause || "",
        notes: record.notes || "",
      });

      if (date) {
        const [year, month] = date.split("-").map(Number);
        setCalendarMonth(new Date(year, month - 1, 1));
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to load mortality record.");
      navigate("/rabbit-mortality");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function formatDisplayDate(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return year && month && day ? `${day}-${month}-${year}` : "";
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

    setFormData((previous) => ({
      ...previous,
      mortality_date: `${year}-${month}-${date}`,
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

  const selectedRabbit = rabbits.find(
    (rabbit) =>
      Number(rabbit.id) ===
      Number(formData.rabbit_id)
  );

  const mortalityQuantity = Number(
    formData.quantity || 0
  );

  /*
   * When editing an existing mortality record, the current
   * rabbit quantity already excludes the old mortality.
   * Therefore the old mortality quantity must be added back
   * when checking the maximum allowed quantity.
   */
  const oldRecord = selectedRabbit
    ? rabbits.find(
        (rabbit) =>
          Number(rabbit.id) ===
          Number(formData.rabbit_id)
      )
    : null;

  const availableQuantity = selectedRabbit
    ? Number(selectedRabbit.quantity || 0)
    : 0;

  const noRabbitSelected = !formData.rabbit_id;

  const invalidQuantity =
    mortalityQuantity <= 0;

  const canSave =
    !noRabbitSelected &&
    !invalidQuantity &&
    Boolean(formData.mortality_date);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.rabbit_id) {
      alert(t("pleaseSelectRabbit"));
      return;
    }

    if (!formData.mortality_date) {
      alert(t("dateRequired") || "Mortality date is required.");
      return;
    }

    if (mortalityQuantity <= 0) {
      alert(t("mortalityQuantityPositive"));
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/rabbit-mortality/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...formData,
            quantity: mortalityQuantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update mortality record."
        );
        return;
      }

      alert(t("rabbitMortalityUpdatedSuccessfully"));
      navigate("/rabbit-mortality");
    } catch (err) {
      console.error(err);
      alert(
        t("failedToUpdateRabbitMortality") ||
          "Failed to update rabbit mortality."
      );
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
                  width: "100%",
                  height: "42px",
                  minHeight: "42px",
                  boxSizing: "border-box",
                  padding: "0 12px",
                  border: "1px solid #cfd6cf",
                  borderRadius: "7px",
                  background: "#fff",
                  color: "#222",
                  WebkitTextFillColor: "#222",
                  cursor: "pointer",
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
                      boxShadow:
                        "0 12px 35px rgba(0,0,0,0.25)",
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
                        onClick={() => changeCalendarMonth(1)}
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
                        gap: "4px",
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
                          formData.mortality_date === dateValue;

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
                              width: "40px",
                              height: "40px",
                              minWidth: "40px",
                              border: "none",
                              borderRadius: "50%",
                              background: selected
                                ? "#2e7d32"
                                : isToday
                                ? "#e8f5e9"
                                : "#fff",
                              color: selected
                                ? "#fff"
                                : "#222",
                              fontWeight:
                                selected || isToday ? 700 : 400,
                              cursor: "pointer",
                              padding: 0,
                              justifySelf: "center",
                              boxSizing: "border-box",
                            }}
                            onMouseDown={(e) => e.preventDefault()}
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
