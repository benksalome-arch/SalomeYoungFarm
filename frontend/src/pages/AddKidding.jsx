import API_URL from "../api";
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddKidding() {
  const { t } = useLanguage();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    breeding_id: id,
    kidding_date: "",
    male_kids: 0,
    female_kids: 0,
    stillborn: 0,
    notes: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/kidding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      alert(data.message);

      navigate("/kidding");
    } catch (err) {
      console.error(err);
      alert("Failed to save kidding record.");
    }
  }

  const formStyle = {
    width: "100%",
    maxWidth: "620px",
    margin: "0 auto",
  };

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

          {/* Kidding date */}
          <div className="add-kidding-field">
            <label className="add-kidding-label">
              {t("kiddingDate")}
            </label>

            <input
              type="text"
              value={
                formData.kidding_date
                  ? formData.kidding_date.split("-").reverse().join("-")
                  : ""
              }
              placeholder="DD-MM-JJJJ"
              readOnly
              onClick={() => {
                const currentValue = formData.kidding_date;

                const baseDate = currentValue
                  ? new Date(currentValue + "T00:00:00")
                  : new Date();

                setCalendarMonth(
                  new Date(
                    baseDate.getFullYear(),
                    baseDate.getMonth(),
                    1
                  )
                );

                setCalendarOpen(true);
              }}
              style={inputStyle}
            />
          </div>

          {/* PROFESSIONAL CALENDAR */}
          {calendarOpen && (
                    <div
                      onClick={(e) => {
                        if (e.target === e.currentTarget) {
                          setCalendarOpen(false);
                          setCalendarField("");
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
                        style={{
                          width: "min(92vw, 360px)",
                          background: "#fff",
                          borderRadius: "14px",
                          padding: "18px",
                          boxSizing: "border-box",
                          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        {/* CALENDAR HEADER */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "10px",
                            marginBottom: "14px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => changeMonth(-1)}
                            aria-label="Previous month"
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
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
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
                              WebkitTextFillColor: "#222",
                            }}
                          >
                            {t(["january","february","march","april","may","june","july","august","september","october","november","december"][calendarMonth.getMonth()])} {calendarMonth.getFullYear()}
                          </div>
            
                          <button
                            type="button"
                            onClick={() => changeMonth(1)}
                            aria-label="Next month"
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
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            ›
                          </button>
                        </div>
            
                        {/* WEEKDAYS */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 1fr)",
                            gap: "6px",
                            marginBottom: "4px",
                          }}
                        >
                          {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((key) => (
                            <div
                              key={key}
                              style={{
                                textAlign: "center",
                                fontWeight: 600,
                                fontSize: "13px",
                                padding: "6px 0",
                                color: "#222",
                                WebkitTextFillColor: "#222",
                              }}
                            >
                              {t(key)}
                            </div>
                          ))}
                        </div>
            
                        {/* DAYS */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 1fr)",
                            gap: "6px",
                          }}
                        >
                          {Array.from({ length: firstDay }).map((_, index) => (
                            <div key={`empty-${index}`} />
                          ))}
            
                          {Array.from(
                            { length: daysInMonth },
                            (_, index) => index + 1
                          ).map((day) => {
                            const dateValue =
                              calendarMonth.getFullYear() +
                              "-" +
                              String(calendarMonth.getMonth() + 1).padStart(2, "0") +
                              "-" +
                              String(day).padStart(2, "0");
            
                            const now = new Date();
                            const currentToday =
                              now.getFullYear() +
                              "-" +
                              String(now.getMonth() + 1).padStart(2, "0") +
                              "-" +
                              String(now.getDate()).padStart(2, "0");
                            const isToday = dateValue === currentToday;
                            const isSelected = dateValue === formData.kidding_date;
            
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => selectDate(day)}
                                style={{
                                  minHeight: "40px",
                                  border:
                                    isSelected || isToday
                                      ? "2px solid #2e7d32"
                                      : "1px solid #ddd",
                                  borderRadius: "8px",
                                  background:
                                    isSelected
                                      ? "#2e7d32"
                                      : isToday
                                      ? "#e8f5e9"
                                      : "#fff",
                                  color:
                                    isSelected
                                      ? "#fff"
                                      : "#222",
                                  WebkitTextFillColor:
                                    isSelected
                                      ? "#fff"
                                      : "#222",
                                  fontSize: "15px",
                                  fontWeight: isSelected || isToday ? "700" : "500",
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
            
                        {/* CANCEL */}
                        <button
                          type="button"
                          onClick={() => {
                            setCalendarOpen(false);
                            setCalendarField("");
                          }}
                          style={{
                            width: "100%",
                            marginTop: "14px",
                            minHeight: "44px",
                            border: "none",
                            borderRadius: "8px",
                            background: "#2e7d32",
                            color: "#fff",
                            WebkitTextFillColor: "#fff",
                            fontSize: "15px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    </div>
                  )}

          <div className="add-kidding-field">
            <label className="add-kidding-label">
              {t("kiddingDate")}
            </label>

            <input
              type="text"
              value={
                formData.kidding_date
                  ? formData.kidding_date.split("-").reverse().join("-")
                  : ""
              }
              placeholder="DD-MM-JJJJ"
              readOnly
              onClick={() => {
                const selected = formData.kidding_date
                  ? new Date(formData.kidding_date + "T00:00:00")
                  : new Date();

                setCalendarMonth(selected);
                setCalendarOpen(true);
              }}
              style={{
                ...inputStyle,
                cursor: "pointer",
              }}
            />

            {calendarOpen && (
              <div
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
                onClick={() => setCalendarOpen(false)}
              >
                <div
                  style={{
                    width: "min(92vw, 360px)",
                    background: "#fff",
                    borderRadius: "14px",
                    padding: "18px",
                    boxSizing: "border-box",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "14px",
                      gap: "10px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setCalendarMonth(
                          new Date(
                            calendarMonth.getFullYear(),
                            calendarMonth.getMonth() - 1,
                            1
                          )
                        )
                      }
                      style={{
                        border: "1px solid #cfd6cf",
                        background: "#fff",
                        borderRadius: "8px",
                        width: "38px",
                        height: "38px",
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#222",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ‹
                    </button>

                    <div
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontSize: "19px",
                        fontWeight: "700",
                        color: "#222",
                        WebkitTextFillColor: "#222",
                      }}
                    >
                      {[
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
                      ].map((key, index) =>
                        index === calendarMonth.getMonth()
                          ? t(key)
                          : null
                      )}{" "}
                      {calendarMonth.getFullYear()}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setCalendarMonth(
                          new Date(
                            calendarMonth.getFullYear(),
                            calendarMonth.getMonth() + 1,
                            1
                          )
                        )
                      }
                      style={{
                        border: "1px solid #cfd6cf",
                        background: "#fff",
                        borderRadius: "8px",
                        width: "38px",
                        height: "38px",
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#222",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
                      marginBottom: "4px",
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
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: "6px",
                    }}
                  >
                    {Array.from({
                      length: new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth(),
                        1
                      ).getDay(),
                    }).map((_, i) => (
                      <div key={"empty-" + i} />
                    ))}

                    {Array.from({
                      length: new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth() + 1,
                        0
                      ).getDate(),
                    }).map((_, i) => {
                      const day = i + 1;
                      const today = new Date();

                      const dateValue =
                        calendarMonth.getFullYear() +
                        "-" +
                        String(calendarMonth.getMonth() + 1).padStart(2, "0") +
                        "-" +
                        String(day).padStart(2, "0");

                      const isSelected =
                        formData.kidding_date === dateValue;

                      const isToday =
                        day === today.getDate() &&
                        calendarMonth.getMonth() === today.getMonth() &&
                        calendarMonth.getFullYear() === today.getFullYear();

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              kidding_date: dateValue,
                            }));
                            setCalendarOpen(false);
                          }}
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
                              isSelected || isToday ? "700" : "600",
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
    </div>
  );
}

export default AddKidding;
