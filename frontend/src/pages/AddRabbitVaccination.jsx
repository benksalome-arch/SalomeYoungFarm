import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddRabbitVaccination() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [rabbits, setRabbits] = useState([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarField, setCalendarField] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
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

  function openCalendar(field) {
    const selected = formData[field]
      ? new Date(formData[field] + "T00:00:00")
      : new Date();

    setCalendarMonth(selected);
    setCalendarField(field);
    setCalendarOpen(true);
  }

  function handleDateSelect(day) {
    const value =
      calendarMonth.getFullYear() +
      "-" +
      String(calendarMonth.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0");

    setFormData((prev) => ({
      ...prev,
      [calendarField]: value,
    }));

    setCalendarOpen(false);
  }


  const [formData, setFormData] = useState({
    rabbit_id: "",
    vaccination_date: "",
    vaccine_name: "",
    dosage: "",
    next_due_date: "",
    administered_by: "",
    notes: "",
  });

  useEffect(() => {
    loadRabbits();
  }, []);

  async function loadRabbits() {
    try {
      const response = await fetch(`${API_URL}/api/rabbits`);
      const data = await response.json();

      setRabbits(
        data.filter(
          (rabbit) =>
            rabbit.status === "Active" ||
            rabbit.status === undefined
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

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/rabbit-vaccinations`,
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
        navigate("/rabbit-vaccinations");
      }
    } catch (err) {
      console.error(err);
      alert(t("failedToSaveVaccination"));
    }
  }

  const inputStyle = {
    width: "100%",
    height: "44px",
    padding: "0 12px",
    border: "1px solid #d5d5d5",
    borderRadius: "7px",
    background: "#fff",
    color: "#222",
    fontSize: "15px",
    boxSizing: "border-box",
  };

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "clamp(105px, 30vw, 180px) minmax(0, 420px)",
    alignItems: "center",
    gap: "18px",
  };

  const labelStyle = {
    fontWeight: "600",
    color: "#333",
    fontSize: "15px",
  };

  return (
    <div className="page">
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          margin: "0 auto 24px",
          position: "relative",
          minHeight: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            margin: 0,
            textAlign: "center",
            color: "#222",
            WebkitTextFillColor: "#222",
            fontSize: "34px",
            lineHeight: "1.2",
            whiteSpace: "normal",
            overflow: "visible",
          }}
        >
          💉 {t("recordRabbitVaccination")}
        </h1>

        <Link
          className="button"
          to="/rabbit-vaccinations"
          style={{
            position: "static",
          }}
        >
          ← {t("back")}
        </Link>
      </div>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "760px",
          margin: "0 auto",
          padding: "30px",
          boxSizing: "border-box",
          background: "#fff",
          borderRadius: "14px",
          boxShadow: "0 3px 14px rgba(0,0,0,0.08)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div style={rowStyle}>
              <label style={labelStyle}>{t("rabbit")}</label>
              <select
                name="rabbit_id"
                value={formData.rabbit_id}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">{t("selectRabbit")}</option>
                {rabbits.map((rabbit) => (
                  <option key={rabbit.id} value={rabbit.id}>
                    {rabbit.tag_number} - {rabbit.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={rowStyle}>
              <label style={labelStyle}>
                {t("vaccinationDate")}
              </label>
              <div style={{ position: "relative", width: "100%", minWidth: 0 }}>
                <div
                  style={{
                    ...inputStyle,
                    width: "100%",
                    color: formData.vaccination_date ? "#222" : "#777",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
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
                  onClick={(e) => e.currentTarget.showPicker?.()}
                  onFocus={(e) => e.currentTarget.showPicker?.()}
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

            {calendarOpen && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
                  zIndex: 99999,
                }}
                onClick={() => setCalendarOpen(false)}
              >
                <div
                  style={{
                    width: "min(92vw, 360px)",
                    background: "#fff",
                    borderRadius: "14px",
                    padding: "18px",
                    boxSizing: "border-box",
                    boxShadow: "0 8px 30px rgba(0,0,0,.25)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "14px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={goPreviousMonth}
                      style={{
                        border: "1px solid #ddd",
                        background: "#fff",
                        borderRadius: "8px",
                        width: "38px",
                        height: "38px",
                        fontSize: "22px",
                        cursor: "pointer",
                      }}
                    >
                      ‹
                    </button>

                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#222",
                        WebkitTextFillColor: "#222",
                      }}
                    >
                      {t(
                        [
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
                        ][calendarMonth.getMonth()]
                      )}{" "}
                      {calendarMonth.getFullYear()}
                    </div>

                    <button
                      type="button"
                      onClick={goNextMonth}
                      style={{
                        border: "1px solid #ddd",
                        background: "#fff",
                        borderRadius: "8px",
                        width: "38px",
                        height: "38px",
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
                      gap: "6px",
                    }}
                  >
                    {[
                      t("sun"),
                      t("mon"),
                      t("tue"),
                      t("wed"),
                      t("thu"),
                      t("fri"),
                      t("sat"),
                    ].map((day) => (
                      <div
                        key={day}
                        style={{
                          textAlign: "center",
                          fontWeight: "600",
                          fontSize: "13px",
                          padding: "6px 0",
                          color: "#222",
                        }}
                      >
                        {day}
                      </div>
                    ))}

                    {Array.from({
                      length: getFirstDayOfMonth(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth()
                      ),
                    }).map((_, i) => (
                      <div key={"empty-" + i} />
                    ))}

                    {Array.from({
                      length: getDaysInMonth(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth()
                      ),
                    }).map((_, i) => {
                      const day = i + 1;
                      const today = new Date();

                      const isToday =
                        day === today.getDate() &&
                        calendarMonth.getMonth() === today.getMonth() &&
                        calendarMonth.getFullYear() === today.getFullYear();

                      const dateValue =
                        `${calendarMonth.getFullYear()}-${String(
                          calendarMonth.getMonth() + 1
                        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                      const isSelected =
                        formData[calendarField] === dateValue;

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
                            background: isSelected
                              ? "#2e7d32"
                              : isToday
                              ? "#e8f5e9"
                              : "#fff",
                            color: isSelected ? "#fff" : "#222",
                            WebkitTextFillColor:
                              isSelected ? "#fff" : "#222",
                            fontSize: "15px",
                            fontWeight:
                              isSelected || isToday ? "700" : "500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
                            cursor: "pointer",
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
                      marginTop: "14px",
                      padding: "10px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#2e7d32",
                      color: "#fff",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            )}

            <div style={rowStyle}>
              <label style={labelStyle}>{t("vaccineName")}</label>
              <input
                type="text"
                name="vaccine_name"
                value={formData.vaccine_name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={rowStyle}>
              <label style={labelStyle}>{t("dosage")}</label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={rowStyle}>
              <label style={labelStyle}>{t("nextDueDate")}</label>
              <div style={{ position: "relative", width: "100%", minWidth: 0 }}>
                <div
                  style={{
                    ...inputStyle,
                    width: "100%",
                    color: formData.next_due_date ? "#222" : "#777",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
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
                  onClick={(e) => e.currentTarget.showPicker?.()}
                  onFocus={(e) => e.currentTarget.showPicker?.()}
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

            <div style={rowStyle}>
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

            <div
              style={{
                ...rowStyle,
                alignItems: "start",
              }}
            >
              <label
                style={{
                  ...labelStyle,
                  paddingTop: "11px",
                }}
              >
                {t("notes")}
              </label>

              <textarea
                rows="4"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  height: "110px",
                  padding: "10px 12px",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
              gap: "12px",
              marginTop: "28px",
              flexWrap: "wrap",
            }}
          >
            <Link
              className="button"
              to="/rabbit-vaccinations"
              style={{
                minWidth: "120px",
                textAlign: "center",
              }}
            >
              {t("cancel")}
            </Link>

            <button
              className="button"
              type="submit"
              style={{
                minWidth: "120px",
              }}
            >
              💾 {t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRabbitVaccination;
