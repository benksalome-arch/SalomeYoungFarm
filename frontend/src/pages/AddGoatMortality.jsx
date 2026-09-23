import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const API_URL =
  import.meta.env.VITE_API_URL || "";

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

function formatDate(date) {
  if (!date) return "";

  const parts = date.split("-");
  if (parts.length !== 3) return date;

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function AddGoatMortality() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [goats, setGoats] = useState([]);
  const [formData, setFormData] = useState({
    goat_id: "",
    mortality_date: "",
    cause: "",
    notes: "",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const currentYear = new Date().getFullYear();

  const calendarYears = Array.from(
    { length: 101 },
    (_, index) => currentYear - index
  );

  useEffect(() => {
    const loadGoats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/goats`);

        if (!response.ok) {
          throw new Error("Failed to load goats");
        }

        const data = await response.json();

        setGoats(
          Array.isArray(data)
            ? data.filter(
                (goat) =>
                  String(goat.status || "").toLowerCase() !==
                  "dead"
              )
            : []
        );
      } catch (error) {
        console.error("Load goats error:", error);
        alert(t("failedLoadGoats"));
      }
    };

    loadGoats();
  }, [t]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateSelect = (day) => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const value = `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    setFormData((prev) => ({
      ...prev,
      mortality_date: value,
    }));

    setCalendarOpen(false);
  };

  const goPreviousMonth = () => {
    setCalendarMonth(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth() - 1,
          1
        )
    );
  };

  const goNextMonth = () => {
    setCalendarMonth(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth() + 1,
          1
        )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.goat_id || !formData.mortality_date) {
      alert(t("requiredFields"));
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/goat-mortality`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            t("failedSaveGoatMortality")
        );
        return;
      }

      alert(t("goatMortalitySaved"));

      navigate("/goat-mortality");
    } catch (error) {
      console.error("Save goat mortality error:", error);
      alert(t("failedSaveGoatMortality"));
    }
  };

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const weekdays = [
    t("sun"),
    t("mon"),
    t("tue"),
    t("wed"),
    t("thu"),
    t("fri"),
    t("sat"),
  ];

  const monthNames = [
    t("january"),
    t("february"),
    t("march"),
    t("april"),
    t("may"),
    t("june"),
    t("july"),
    t("august"),
    t("september"),
    t("october"),
    t("november"),
    t("december"),
  ];

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "20px",
      }}
    >
      <style>{`
        .add-goat-mortality-field {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .add-goat-mortality-label {
          font-weight: 600;
          font-size: 15px;
          text-align: right;
          color: #222;
          overflow-wrap: anywhere;
          line-height: 1.25;
        }

        .add-goat-mortality-notes {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: start;
          gap: 14px;
          margin-bottom: 20px;
        }

        .add-goat-mortality-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 700px) {
          .add-goat-mortality-field,
          .add-goat-mortality-notes {
            grid-template-columns: 105px minmax(0, 1fr);
            gap: 10px;
          }

          .add-goat-mortality-calendar {
            left: 10px !important;
            right: 10px !important;
            width: auto !important;
            max-width: none !important;
          }
        }
      `}</style>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#222",
              WebkitTextFillColor: "#222",
            }}
          >
            💀 {t("recordGoatMortality")}
          </h1>
        </div>

        <div
          className="card"
          style={{
            maxWidth: "620px",
            margin: "0 auto",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#222",
              WebkitTextFillColor: "#222",
            }}
          >
            💀 {t("recordGoatMortality")}
          </h2>

          <form
            onSubmit={handleSubmit}
            style={formStyle}
          >
            <div className="add-goat-mortality-field">
              <label
                className="add-goat-mortality-label"
              >
                {t("goat")}
              </label>

              <select
                name="goat_id"
                value={formData.goat_id}
                onChange={handleChange}
                style={inputStyle}
                required
              >
                <option value="">
                  {t("selectGoat")}
                </option>

                {goats.map((goat) => (
                  <option
                    key={goat.id}
                    value={goat.id}
                  >
                    {goat.tag} - {goat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="add-goat-mortality-field">
              <label
                className="add-goat-mortality-label"
              >
                {t("mortalityDate")}
              </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    type="text"
                    value={
                      formData.mortality_date
                        ? formData.mortality_date.split("-").reverse().join("-")
                        : ""
                    }
                    placeholder="DD-MM-JJJJ"
                    readOnly
                    onClick={() => {
                      const selected = formData.mortality_date
                        ? new Date(formData.mortality_date + "T00:00:00")
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
                            onClick={goPreviousMonth}
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
                            onClick={goNextMonth}
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
                          {weekdays.map((day) => (
                            <div
                              key={day}
                              style={{
                                textAlign: "center",
                                fontWeight: 600,
                                fontSize: "13px",
                                padding: "6px 0",
                                color: "#222",
                              }}
                            >
                              {day}
                            </div>
                          ))}

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
                            const year = calendarMonth.getFullYear();
                            const month = calendarMonth.getMonth();

                            const dateValue =
                              `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                            const selected =
                              formData.mortality_date === dateValue;

                            const today = new Date();

                            const isToday =
                              day === today.getDate() &&
                              month === today.getMonth() &&
                              year === today.getFullYear();

                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => handleDateSelect(day)}
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
                                  color:
                                    selected || isToday
                                      ? "#fff"
                                      : "#222",
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
                            marginTop: "14px",
                            height: "40px",
                            border: "none",
                            borderRadius: "8px",
                            background: "#2e7d32",
                            color: "#fff",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Annuleren
                        </button>
                      </div>
                    </div>
                  )}
                </div>


              </div>

            <div className="add-goat-mortality-field">
              <label
                className="add-goat-mortality-label"
              >
                {t("cause")}
              </label>

              <input
                type="text"
                name="cause"
                value={formData.cause}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div className="add-goat-mortality-notes">
              <label
                className="add-goat-mortality-label"
                style={{
                  textAlign: "right",
                }}
              >
                {t("notes")}
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  minHeight: "100px",
                  resize: "vertical",
                }}
              />
            </div>

            <div className="add-goat-mortality-buttons">
              <button
                className="button"
                type="submit"
              >
                💾 {t("save")}
              </button>

              <Link
                className="button"
                to="/goat-mortality"
              >
                {t("cancel")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
