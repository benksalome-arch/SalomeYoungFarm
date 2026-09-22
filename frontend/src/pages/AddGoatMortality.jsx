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

      alert(
        data.message ||
          t("goatMortalitySaved")
      );

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
                <div
                  style={{
                    ...inputStyle,
                    width: "100%",
                    color: formData.mortality_date ? "#222" : "#777",
                    WebkitTextFillColor: formData.mortality_date ? "#222" : "#777",
                    pointerEvents: "none",
                  }}
                >
                  {formData.mortality_date
                    ? new Date(formData.mortality_date + "T00:00:00").toLocaleDateString("nl-NL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "DD-MM-JJJJ"}
                </div>

                <input
                  type="date"
                  name="mortality_date"
                  value={formData.mortality_date || ""}
                  onChange={handleChange}
                  required
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    pointerEvents: "none",
                    cursor: "pointer",
                  }}
                />
              </div>

                {calendarOpen && (
                  <div
                    className="add-goat-mortality-calendar"
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
                          {monthNames[month]} {year}
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
                          gridTemplateColumns: "repeat(7,1fr)",
                          gap: "6px",
                        }}
                      >
                        {weekdays.map((day) => (
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

                        {Array.from({ length: firstDay }).map((_, index) => (
                          <div key={"empty-" + index} />
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, index) => {
                          const day = index + 1;
                          const today = new Date();

                          const isToday =
                            day === today.getDate() &&
                            month === today.getMonth() &&
                            year === today.getFullYear();

                          const selectedDate = formData.mortality_date
                            ? new Date(`${formData.mortality_date}T00:00:00`)
                            : null;

                          const isSelected =
                            selectedDate &&
                            day === selectedDate.getDate() &&
                            month === selectedDate.getMonth() &&
                            year === selectedDate.getFullYear();

                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleDateSelect(day)}
                              style={{
                                minHeight: "40px",
                                border: isSelected
                                  ? "2px solid #2e7d32"
                                  : isToday
                                  ? "2px solid #2e7d32"
                                  : "1px solid #ddd",
                                borderRadius: "8px",
                                background:
                                  isSelected || isToday
                                    ? "#e8f5e9"
                                    : "#fff",
                                color: "#222",
                                WebkitTextFillColor: "#222",
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
