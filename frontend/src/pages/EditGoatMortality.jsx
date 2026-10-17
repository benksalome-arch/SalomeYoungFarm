import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || "";

const formStyle = {
  width: "100%",
  maxWidth: "620px",
  margin: "0 auto",
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

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function EditGoatMortality() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [goat, setGoat] = useState(null);
  const [formData, setFormData] = useState({
    mortality_date: "",
    cause: "",
    notes: "",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  useEffect(() => {
    const loadRecord = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/goat-mortality/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load mortality record."
          );
        }

        setGoat(data);

        setFormData({
          mortality_date: data.mortality_date
            ? String(data.mortality_date).split("T")[0]
            : "",
          cause: data.cause || "",
          notes: data.notes || "",
        });

        if (data.mortality_date) {
          setCalendarMonth(
            new Date(
              `${String(data.mortality_date).split("T")[0]}T00:00:00`
            )
          );
        }
      } catch (error) {
        console.error("Load goat mortality record error:", error);
        alert(
          error.message ||
            t(
              "failedLoadGoatMortality",
              "Failed to load goat mortality record."
            )
        );
        navigate("/goat-mortality");
      } finally {
        setLoading(false);
      }
    };

    loadRecord();
  }, [id, navigate, t]);

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
  }

  const calendarYears = Array.from(
    { length: 101 },
    (_, index) => new Date().getFullYear() - index
  );

  function changeCalendarYear(year) {
    setCalendarMonth(
      new Date(Number(year), calendarMonth.getMonth(), 1)
    );
  }

  function changeCalendarMonth(amount) {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + amount,
        1
      )
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mortality_date) {
      alert(t("requiredFields"));
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/goat-mortality/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            t(
              "failedUpdateGoatMortality",
              "Failed to update goat mortality."
            )
        );
        return;
      }

      alert(
        data.message ||
          t(
            "goatMortalityUpdated",
            "Goat mortality updated successfully!"
          )
      );

      navigate("/goat-mortality");
    } catch (error) {
      console.error("Update goat mortality error:", error);

      alert(
        t(
          "failedUpdateGoatMortality",
          "Failed to update goat mortality."
        )
      );
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

  function getCalendarDays() {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);

    return days;
  }

  if (loading) {

  return (
      <div style={{ padding: "20px" }}>
        <h1 style={{ color: "#222" }}>
          💀 {t("edit", "Edit")} {t("goatMortality")}
        </h1>
        <p>{t("loading")}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "20px",
      }}
    >
      <style>{`
        .edit-goat-mortality-field {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .edit-goat-mortality-label {
          font-weight: 600;
          font-size: 15px;
          text-align: right;
          color: #222;
          overflow-wrap: anywhere;
          line-height: 1.25;
        }

        .edit-goat-mortality-notes {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: start;
          gap: 14px;
          margin-bottom: 20px;
        }

        .edit-goat-mortality-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 700px) {
          .edit-goat-mortality-field,
          .edit-goat-mortality-notes {
            grid-template-columns: 105px minmax(0, 1fr);
            gap: 10px;
          }

          .edit-goat-mortality-calendar {
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
          <Link
            to="/goat-mortality"
            className="button back-button-goat-mortality"
            style={{
              backgroundColor: "#2e7d32",
              color: "#ffffff",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "40px",
              padding: "8px 16px",
              borderRadius: "8px",
              boxSizing: "border-box",
              flexShrink: 0,
            }}
          >
            ← {t("back", "Terug")}
          </Link>
          <h1
            style={{
              margin: 0,
              color: "#222",
              WebkitTextFillColor: "#222",
            }}
          >
            💀 {t("edit", "Edit")} {t("goatMortality")}
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
            💀 {t("edit", "Edit")} {t("goatMortality")}
          </h2>

          <form onSubmit={handleSubmit} style={formStyle}>
            <div className="edit-goat-mortality-field">
              <label className="edit-goat-mortality-label">
                {t("goat")}
              </label>

              <div
                style={{
                  ...inputStyle,
                  display: "flex",
                  alignItems: "center",
                  background: "#f5f5f5",
                }}
              >
                {goat
                  ? `${goat.tag || "-"} - ${goat.name || "-"}`
                  : "-"}
              </div>
            </div>

            <div className="edit-goat-mortality-field">
              <label className="edit-goat-mortality-label">
                {t("mortalityDate")}
              </label>

              <div style={{ position: "relative", width: "100%" }}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (formData.mortality_date) {
                      const selectedDate = new Date(
                        `${formData.mortality_date}T00:00:00`
                      );
                      setCalendarMonth(
                        new Date(
                          selectedDate.getFullYear(),
                          selectedDate.getMonth(),
                          1
                        )
                      );
                    }
                    setCalendarOpen(true);
                  }}
                  style={{
                    ...inputStyle,
                    display: "block",
                    width: "100%",
                    minWidth: 0,
                    minHeight: "42px",
                    boxSizing: "border-box",
                    padding: "10px 12px",
                    cursor: "pointer",
                    color: formData.mortality_date ? "#222" : "#777",
                    WebkitTextFillColor: formData.mortality_date ? "#222" : "#777",
                    backgroundColor: "#fff",
                    textAlign: "left",
                  }}
                >
                  {formData.mortality_date
                    ? new Date(`${formData.mortality_date}T00:00:00`).toLocaleDateString("nl-NL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "DD-MM-JJJJ"}
                </button>
              </div>
            </div>

            {calendarOpen && (
              <div
                className="edit-goat-mortality-calendar"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: "6px",
                  zIndex: 99999,
                }}
              >
                <div
                  style={{
                    width: "min(92vw,340px)",
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
                      gap: "8px",
                      marginBottom: "14px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => changeCalendarMonth(-1)}
                      style={{
                        border: "none",
                        background: "#f1f1f1",
                        borderRadius: "7px",
                        width: "38px",
                        height: "36px",
                        fontSize: "24px",
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
                        padding: "6px",
                        borderRadius: "7px",
                        border: "1px solid #ddd",
                        background: "#fff",
                        color: "#222",
                        fontSize: "15px",
                        fontWeight: 700,
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
                      onChange={(e) => changeCalendarYear(e.target.value)}
                      style={{
                        width: "90px",
                        padding: "6px",
                        borderRadius: "7px",
                        border: "1px solid #ddd",
                        background: "#fff",
                        color: "#222",
                        fontSize: "15px",
                        fontWeight: 700,
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
                      onClick={() => changeCalendarMonth(1)}
                      style={{
                        border: "none",
                        background: "#f1f1f1",
                        borderRadius: "7px",
                        width: "38px",
                        height: "36px",
                        fontSize: "24px",
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
              {getCalendarDays().map((day, index) => {
                const dateValue = day
                  ? `${calendarMonth.getFullYear()}-${String(
                      calendarMonth.getMonth() + 1
                    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  : "";
                const selected = Boolean(day) && formData.mortality_date === dateValue;
                const now = new Date();
                const today =
                  Boolean(day) &&
                  now.getFullYear() === calendarMonth.getFullYear() &&
                  now.getMonth() === calendarMonth.getMonth() &&
                  now.getDate() === day;

                return (
                  <div key={`${day ?? "empty"}-${index}`} style={{ textAlign: "center" }}>
                    {day ? (
                      <button
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        style={{
                          width: "100%",
                          height: "36px",
                          borderRadius: "7px",
                          border: selected
                            ? "1px solid #1976d2"
                            : today
                            ? "2px solid #1976d2"
                            : "1px solid #ddd",
                          background: selected ? "#1976d2" : "#fff",
                          color: selected ? "#fff" : "#222",
                          fontWeight: selected ? "700" : "400",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        {day}
                      </button>
                    ) : (
                      <div style={{ height: "36px" }} />
                    )}
                  </div>
                );
              })}
            </div>

                  <button
                    type="button"
                    onClick={() => setCalendarOpen(false)}
                    style={{
                      width: "auto",
                      margin: "16px auto 0",
                      display: "block",
                      padding: "9px 18px",
                      border: "none",
                      borderRadius: "7px",
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

            <div className="edit-goat-mortality-field">
              <label className="edit-goat-mortality-label">
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

            <div className="edit-goat-mortality-notes">
              <label
                className="edit-goat-mortality-label"
                style={{ textAlign: "right" }}
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

            <div className="edit-goat-mortality-buttons">
              <button className="button" type="submit">
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
