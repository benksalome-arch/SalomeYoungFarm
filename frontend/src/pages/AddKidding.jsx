import API_URL from "../api";
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddKidding() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [formData, setFormData] = useState({
    breeding_id: id ? Number(id) : "",
    kidding_date: "",
    male_kids: 0,
    female_kids: 0,
    stillborn: 0,
    notes: "",
  });

  const monthNames = [
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
  ];

  const currentYear = new Date().getFullYear();

  const calendarYears = Array.from(
    { length: 101 },
    (_, index) => currentYear - index
  );

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

  function openCalendar() {
    if (formData.kidding_date) {
      const selected = new Date(
        formData.kidding_date + "T00:00:00"
      );

      setCalendarMonth(
        new Date(
          selected.getFullYear(),
          selected.getMonth(),
          1
        )
      );
    } else {
      setCalendarMonth(new Date());
    }

    setCalendarOpen(true);
  }

  function handleDateSelect(day) {
    const value =
      `${calendarMonth.getFullYear()}-${String(
        calendarMonth.getMonth() + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    setFormData((prev) => ({
      ...prev,
      kidding_date: value,
    }));

    setCalendarOpen(false);
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!id || !Number.isInteger(Number(id))) {
      alert(
        "No breeding record was selected. Please select a breeding record first."
      );
      return;
    }

    if (!formData.kidding_date) {
      alert("Please select the kidding date.");
      return;
    }

    const payload = {
      ...formData,
      breeding_id: Number(id),
      male_kids: Number(formData.male_kids) || 0,
      female_kids: Number(formData.female_kids) || 0,
      stillborn: Number(formData.stillborn) || 0,
    };

    try {
      const response = await fetch(`${API_URL}/api/kidding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save kidding record.");
        return;
      }

      alert(data.message);
      navigate("/kidding");
    } catch (err) {
      console.error(err);
      alert("Failed to save kidding record.");
    }
  }

  const fieldStyle = {
    display: "grid",
    gridTemplateColumns: "150px minmax(0, 260px)",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px",
  };

  const labelStyle = {
    fontWeight: 600,
    fontSize: "15px",
    textAlign: "right",
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

  return (
    <div className="page">
      <style>{`
        .add-kidding-form {
          width: 100%;
          max-width: 620px;
          margin: 0 auto;
        }

        .add-kidding-field {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .add-kidding-label {
          font-weight: 600;
          font-size: 15px;
          text-align: right;
          color: #222;
        }

        .add-kidding-notes {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: start;
          gap: 14px;
          margin-bottom: 20px;
        }

        .add-kidding-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 700px) {
          .add-kidding-form {
            max-width: 100%;
          }

          .add-kidding-field {
            grid-template-columns: 105px minmax(0, 1fr);
            gap: 10px;
          }

          .add-kidding-notes {
            grid-template-columns: 105px minmax(0, 1fr);
            gap: 10px;
          }

          .add-kidding-label {
            font-size: 14px;
          }
        }
      `}</style>

      <div className="page-header">
        <h1>🍼 {t("newKidding")}</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="add-kidding-form">

          {/* Male kids */}
          <div className="add-kidding-field">
            <label className="add-kidding-label">
              {t("maleKids")}
            </label>

            <input
              type="number"
              name="male_kids"
              min="0"
              value={formData.male_kids}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Female kids */}
          <div className="add-kidding-field">
            <label className="add-kidding-label">
              {t("femaleKids")}
            </label>

            <input
              type="number"
              name="female_kids"
              min="0"
              value={formData.female_kids}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Stillborn */}
          <div className="add-kidding-field">
            <label className="add-kidding-label">
              {t("stillborn")}
            </label>

            <input
              type="number"
              name="stillborn"
              min="0"
              value={formData.stillborn}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Kidding date */}
          <div className="add-kidding-field">
            <label className="add-kidding-label">
              {t("kiddingDate")}
            </label>

            <div
              onClick={openCalendar}
              style={{
                ...inputStyle,
                width: "100%",
                cursor: "pointer",
                color: formData.kidding_date ? "#222" : "#777",
                WebkitTextFillColor: formData.kidding_date
                  ? "#222"
                  : "#777",
                display: "flex",
                alignItems: "center",
              }}
            >
              {formData.kidding_date
                ? new Date(
                    formData.kidding_date + "T00:00:00"
                  ).toLocaleDateString("nl-NL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "DD-MM-JJJJ"}
            </div>
          </div>

          {/* Notes */}
          <div className="add-kidding-notes">
            <label className="add-kidding-label">
              {t("notes")}
            </label>

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
          </div>

          {/* Buttons */}
          <div className="add-kidding-buttons">
            <button className="button" type="submit">
              💾 {t("save")}
            </button>

            <Link className="button" to="/kidding">
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>

      {/* Calendar */}
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
            {/* Month / year controls */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                marginBottom: "14px",
              }}
            >
              <button
                type="button"
                onClick={goPreviousMonth}
                style={{
                  width: "38px",
                  height: "38px",
                  border: "1px solid #cfd6cf",
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: "22px",
                  cursor: "pointer",
                }}
              >
                ‹
              </button>

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
                  flex: 1,
                  minWidth: 0,
                  height: "38px",
                  border: "1px solid #cfd6cf",
                  borderRadius: "8px",
                  background: "#fff",
                  color: "#222",
                  fontSize: "15px",
                  fontWeight: "600",
                  padding: "0 8px",
                  cursor: "pointer",
                }}
              >
                {monthNames.map((month, index) => (
                  <option key={month} value={index}>
                    {t(month)}
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
                  width: "92px",
                  height: "38px",
                  border: "1px solid #cfd6cf",
                  borderRadius: "8px",
                  background: "#fff",
                  color: "#222",
                  fontSize: "15px",
                  fontWeight: "600",
                  padding: "0 6px",
                  cursor: "pointer",
                }}
              >
                {calendarYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={goNextMonth}
                style={{
                  width: "38px",
                  height: "38px",
                  border: "1px solid #cfd6cf",
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: "22px",
                  cursor: "pointer",
                }}
              >
                ›
              </button>
            </div>

            {/* Weekdays */}
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

              {/* Empty cells */}
              {Array.from({
                length: getFirstDayOfMonth(
                  calendarMonth.getFullYear(),
                  calendarMonth.getMonth()
                ),
              }).map((_, index) => (
                <div key={`empty-${index}`} />
              ))}

              {/* Days */}
              {Array.from({
                length: getDaysInMonth(
                  calendarMonth.getFullYear(),
                  calendarMonth.getMonth()
                ),
              }).map((_, index) => {
                const day = index + 1;

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
                  formData.kidding_date === dateValue;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    style={{
                      width: "40px",
                      height: "40px",
                      minWidth: "40px",
                      minHeight: "40px",
                      justifySelf: "center",
                      border:
                        isSelected
                          ? "2px solid #1b5e20"
                          : isToday
                          ? "2px solid #4caf50"
                          : "1px solid transparent",
                      borderRadius: "50%",
                      background:
                        isSelected
                          ? "#2e7d32"
                          : isToday
                          ? "#4caf50"
                          : "#fff",
                      color:
                        isSelected || isToday
                          ? "#fff"
                          : "#222",
                      WebkitTextFillColor:
                        isSelected || isToday
                          ? "#fff"
                          : "#222",
                      fontSize: "15px",
                      fontWeight:
                        isSelected || isToday
                          ? "700"
                          : "500",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow:
                        isToday
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
                marginTop: "14px",
                padding: "10px",
                border: "none",
                borderRadius: "8px",
                background: "#fff",
                color: "#222",
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
  );
}

export default AddKidding;
