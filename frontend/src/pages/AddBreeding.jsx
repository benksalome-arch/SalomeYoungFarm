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

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontWeight: 600,
    fontSize: "15px",
    color: "#222",
    textAlign: "left",
  };

  function handleChange(e) {
    const { name, value } = e.target;

    const updated = {
      ...formData,
      [name]: value,
    };

    if (name === "mating_date") {
      const date = new Date(value);
      date.setDate(date.getDate() + 150);

      updated.expected_kidding = date.toISOString().split("T")[0];
    }

    setFormData(updated);
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

  return (
    <div className="page">
      <div className="card">
        <h1
          style={{
            color: "#222",
            WebkitTextFillColor: "#222",
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
            style={inputStyle}
          >
            <option value="">{t("selectDoe")}</option>

            {goats
              .filter(
                (g) =>
                  String(g.sex || "").trim().toLowerCase() === "female"
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
            style={inputStyle}
          >
            <option value="">{t("selectBuck")}</option>

            {goats
              .filter(
                (g) =>
                  String(g.sex || "").trim().toLowerCase() === "male"
              )
              .map((g) => (
                <option key={g.id} value={g.id}>
                  {g.tag} - {g.name}
                </option>
              ))}
          </select>

          <p style={labelStyle}>{t("matingDate")}</p>

          <div style={{ position: "relative" }}>
            <div style={{ position: "relative", width: "100%" }}>
              <div
                style={{
                  ...inputStyle,
                  width: "100%",
                  color: formData.mating_date ? "#222" : "#777",
                  WebkitTextFillColor: formData.mating_date
                    ? "#222"
                    : "#777",
                  textAlign: "left",
                  pointerEvents: "none",
                }}
              >
                {formData.mating_date
                  ? new Date(
                      formData.mating_date + "T00:00:00"
                    ).toLocaleDateString("nl-NL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "DD-MM-JJJJ"}
              </div>

              <input
                type="date"
                name="mating_date"
                value={formData.mating_date || ""}
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
                    width: "min(92vw,360px)",
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
                        color: "#222",
                        WebkitTextFillColor: "#222",
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
                        color: "#222",
                        WebkitTextFillColor: "#222",
                        cursor: "pointer",
                      }}
                    >
                      ›
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7,1fr)",
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

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDateSelect(day)}
                          style={{
                            minHeight: "40px",
                            border: isToday
                              ? "2px solid #2e7d32"
                              : "1px solid #ddd",
                            borderRadius: "8px",
                            background: isToday ? "#e8f5e9" : "#fff",
                            color: "#222",
                            WebkitTextFillColor: "#222",
                            fontSize: "15px",
                            fontWeight: isToday ? "700" : "500",
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

          <p style={labelStyle}>{t("expectedKidding")}</p>

          <input
            type="text"
            value={
              formData.expected_kidding
                ? formData.expected_kidding
                    .split("-")
                    .reverse()
                    .join("-")
                : ""
            }
            readOnly
            style={inputStyle}
          />

          <p style={labelStyle}>{t("veterinarian")}</p>

          <input
            type="text"
            name="veterinarian"
            value={formData.veterinarian}
            onChange={handleChange}
            style={inputStyle}
          />

          <p style={labelStyle}>{t("notes")}</p>

          <textarea
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            style={{
              ...inputStyle,
              minHeight: "100px",
              resize: "vertical",
            }}
          />

          <br />
          <br />

          <button className="button" type="submit">
            💾 {t("save")}
          </button>

          {" "}

          <Link className="button" to="/breeding">
            {t("cancel")}
          </Link>
        </form>
      </div>
    </div>
  );
}

export default AddBreeding;