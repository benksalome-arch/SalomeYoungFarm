import { useLanguage } from "../context/LanguageContext";
import API_URL from "../api";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddBreeding() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [goats, setGoats] = useState([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [formData, setFormData] = useState({
    doe_id: "",
    buck_id: "",
    mating_date: "",
    expected_kidding: "",
    veterinarian: "",
    notes: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/api/goats`)
      .then((res) => res.json())
      .then((data) => setGoats(data))
      .catch(console.error);
  }, []);

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

  function handleChange(e) {
    const { name, value } = e.target;

    const updated = {
      ...formData,
      [name]: value,
    };

    if (name === "mating_date" && value) {
      const date = new Date(`${value}T00:00:00`);
      date.setDate(date.getDate() + 150);

      updated.expected_kidding = date.toISOString().split("T")[0];
    }

    setFormData(updated);
  }

  function handleDateSelect(day) {
    const value =
      calendarMonth.getFullYear() +
      "-" +
      String(calendarMonth.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0");

    handleChange({
      target: {
        name: "mating_date",
        value,
      },
    });

    setCalendarOpen(false);
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

  const dateFieldStyle = {
    ...fieldStyle,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left",
    cursor: "pointer",
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
            style={{
              width: "100%",
              minWidth: 0,
              margin: "0 0 14px 0",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            <button
              type="button"
              onClick={() => setCalendarOpen(true)}
              style={dateFieldStyle}
            >
              <span
                style={{
                  color: formData.mating_date ? "#222" : "#777",
                  WebkitTextFillColor: formData.mating_date
                    ? "#222"
                    : "#777",
                }}
              >
                {formData.mating_date
                  ? formatDateDisplay(formData.mating_date)
                  : "DD-MM-JJJJ"}
              </span>
            </button>
          </div>

          <p style={labelStyle}>{t("expectedKidding")}</p>

          <div
            style={{
              ...dateFieldStyle,
              cursor: "default",
              marginBottom: "14px",
            }}
          >
            <span
              style={{
                color: formData.expected_kidding ? "#222" : "#777",
                WebkitTextFillColor: formData.expected_kidding
                  ? "#222"
                  : "#777",
              }}
            >
              {formData.expected_kidding
                ? formatDateDisplay(formData.expected_kidding)
                : "DD-MM-JJJJ"}
            </span>
          </div>

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
              height: "100px",
              minHeight: "100px",
              resize: "vertical",
              marginBottom: "14px",
            }}
          />

          <button className="button" type="submit">
            💾 {t("save")}
          </button>

          <Link className="button" to="/breeding">
            {t("cancel")}
          </Link>
        </form>

        {/* PROFESSIONAL CALENDAR */}
        {calendarOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
                    calendarMonth.getFullYear() ===
                      today.getFullYear();

                  const dateValue =
                    `${calendarMonth.getFullYear()}-${String(
                      calendarMonth.getMonth() + 1
                    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                  const isSelected =
                    formData.mating_date === dateValue;

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
                        WebkitTextFillColor: isSelected
                          ? "#fff"
                          : "#222",
                        fontSize: "15px",
                        fontWeight:
                          isSelected || isToday ? "700" : "500",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
      </div>
    </div>
  );
}

export default AddBreeding;