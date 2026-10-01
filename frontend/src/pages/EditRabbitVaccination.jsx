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
  const [calendarField, setCalendarField] = useState(null);
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

  function openCalendar(field) {
    const value = form[field];

    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) {
        setCalendarMonth(
          new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
          )
        );
      }
    } else {
      setCalendarMonth(new Date());
    }

    setCalendarField(field);
    setCalendarOpen(true);
  }

  function selectCalendarDate(day) {
    const year = calendarMonth.getFullYear();
    const month = String(
      calendarMonth.getMonth() + 1
    ).padStart(2, "0");
    const date = String(day).padStart(2, "0");

    setForm((previous) => ({
      ...previous,
      [calendarField]: `${year}-${month}-${date}`,
    }));

    setCalendarOpen(false);
    setCalendarField(null);
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
      setError(err.message || "Could not update vaccination.");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1px solid #d6d6d6",
    borderRadius: "7px",
    fontSize: "14px",
    background: "#fff",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#333",
  };

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
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
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

          <div>
            <label style={labelStyle}>
              {t("date")}
            </label>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => openCalendar("vaccination_date")}
                style={{
                  ...inputStyle,
                  textAlign: "left",
                  cursor: "pointer",
                  color: form.vaccination_date ? "#222" : "#777",
                }}
              >
                {form.vaccination_date
                  ? form.vaccination_date.split("-").reverse().join("-")
                  : "Selecteer datum"}
              </button>

              {calendarOpen &&
                calendarField === "vaccination_date" && (
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 1000,
                      top: "calc(100% + 6px)",
                      left: 0,
                      width: "320px",
                      maxWidth: "100%",
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                      padding: "16px",
                      boxSizing: "border-box",
                    }}
                  >
                    <div
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
                          fontSize: "22px",
                          cursor: "pointer",
                        }}
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
                        style={{
                          border: "none",
                          background: "transparent",
                          fontSize: "22px",
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
                          form.vaccination_date === dateValue;

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
                            onMouseDown={(e) => e.preventDefault()}
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
                              color: selected ? "#fff" : "#222",
                              fontWeight:
                                selected || isToday ? 700 : 400,
                              cursor: "pointer",
                              padding: 0,
                              justifySelf: "center",
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
                )}
            </div>
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

          <div>
            <label style={labelStyle}>
              {t("nextDueDate")}
            </label>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => openCalendar("next_due_date")}
                style={{
                  ...inputStyle,
                  textAlign: "left",
                  cursor: "pointer",
                  color: form.next_due_date ? "#222" : "#777",
                }}
              >
                {form.next_due_date
                  ? form.next_due_date.split("-").reverse().join("-")
                  : "Selecteer datum"}
              </button>

              {calendarOpen &&
                calendarField === "next_due_date" && (
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 1000,
                      top: "calc(100% + 6px)",
                      left: 0,
                      width: "320px",
                      maxWidth: "100%",
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                      padding: "16px",
                      boxSizing: "border-box",
                    }}
                  >
                    <div
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
                          fontSize: "22px",
                          cursor: "pointer",
                        }}
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
                        style={{
                          border: "none",
                          background: "transparent",
                          fontSize: "22px",
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
                        <div key={`empty-next-${index}`} />
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
                          form.next_due_date === dateValue;

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
                            onMouseDown={(e) => e.preventDefault()}
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
                              color: selected ? "#fff" : "#222",
                              fontWeight:
                                selected || isToday ? 700 : 400,
                              cursor: "pointer",
                              padding: 0,
                              justifySelf: "center",
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
                )}
            </div>
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
