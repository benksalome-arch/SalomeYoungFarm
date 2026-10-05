import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditFeedUsage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [calendarOpen, setCalendarOpen] = useState(false);
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

  const currentYear = new Date().getFullYear();

  const calendarYears = Array.from(
    { length: 101 },
    (_, index) => currentYear - index
  );

  useEffect(() => {
    loadUsage();
  }, [id]);

  async function loadUsage() {
    try {
      const response = await fetch(`${API_URL}/api/feed-usage/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load feed usage.");
      }

      setUsage(data);

      if (data.usage_date) {
        const selected = new Date(
          data.usage_date.split("T")[0] + "T00:00:00"
        );

        setCalendarMonth(
          new Date(
            selected.getFullYear(),
            selected.getMonth(),
            1
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  function handleDateSelect(day) {
    const year = calendarMonth.getFullYear();
    const month = String(calendarMonth.getMonth() + 1).padStart(2, "0");
    const selectedDay = String(day).padStart(2, "0");

    setUsage((previous) => ({
      ...previous,
      usage_date: `${year}-${month}-${selectedDay}`,
    }));

    setCalendarOpen(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setUsage((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/feed-usage/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            quantity_used: usage.quantity_used,
            usage_date: usage.usage_date
              ? usage.usage_date.split("T")[0]
              : "",
            notes: usage.notes || "",
          }),
        }
      );

      const data = await response.json();

      alert(t("feedUsageSaved"));

      if (!response.ok) {
        return;
      }

      navigate(`/feed/usage/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update feed usage.");
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div
          className="card"
          style={{
            padding: 30,
            textAlign: "center",
          }}
        >
          {t("loading")}
        </div>
      </div>
    );
  }

  if (!usage) {
    return (
      <div className="page">
        <div
          className="card"
          style={{
            padding: 30,
            textAlign: "center",
          }}
        >
          <h2>{t("error")}</h2>

          <Link
            className="button"
            to="/feed/usage"
          >
            ← {t("back")}
          </Link>
        </div>
      </div>
    );
  }

  const displayDate = usage.usage_date
    ? usage.usage_date
        .split("T")[0]
        .split("-")
        .reverse()
        .join("-")
    : "";

  return (
    <>
      <style>{`
        .feed-usage-edit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .feed-usage-edit-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        @media (max-width: 700px) {
          .feed-usage-edit-header {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }

          .feed-usage-edit-grid {
            grid-template-columns: 1fr;
          }

          .feed-usage-edit-header h1 {
            font-size: 30px !important;
          }
        }
        /* Professional form controls */
        .feed-usage-edit-grid label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          font-size: 14px;
          color: #555;
        }

        .feed-usage-edit-grid input,
        .feed-usage-edit-grid select,
        .feed-usage-edit-grid textarea {
          width: 100% !important;
          box-sizing: border-box !important;
          padding: 10px 12px !important;
          min-height: 44px !important;
          border: 1px solid #ccc !important;
          border-radius: 6px !important;
          font-size: 15px !important;
          font-family: inherit !important;
          color: #222 !important;
          background: #fff !important;
        }

        .feed-usage-edit-grid input:focus,
        .feed-usage-edit-grid select:focus,
        .feed-usage-edit-grid textarea:focus {
          outline: none;
          border-color: #2e7d32 !important;
          box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.12);
        }

        .feed-usage-edit-grid textarea {
          min-height: 100px !important;
          resize: vertical;
        }

        `}
</style>

      <div>
        <div
          className="card"
          style={{
            width: "100%",
            maxWidth: "620px",
            margin: "0 auto",
          }}
        >
          <div
            className="feed-usage-edit-header"
            style={{
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  color: "#222",
                  WebkitTextFillColor: "#222",
                  fontSize: "30px",
                  lineHeight: 1.2,
                }}
              >
                ✏️ {t("update")} {t("feedUsage")}
              </h1>
            </div>

            <Link
              className="button"
              to={`/feed/usage/${id}`}
            >
              ← {t("back")}
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="feed-usage-edit-grid">
              <div style={{ position: "relative" }}>
              <label>{t("date")}</label>

                <input
                  type="text"
                  value={
                    usage.usage_date
                      ? (() => {
                          const [year, month, day] =
                            usage.usage_date.split("T")[0].split("-");
                          return `${day}-${month}-${year}`;
                        })()
                      : ""
                  }
                  readOnly
                  onMouseDown={(e) => {
                    e.preventDefault();

                    if (usage.usage_date) {
                      const selected = usage.usage_date.split("T")[0];
                      const [year, month] = selected.split("-");

                      setCalendarMonth(
                        new Date(
                          Number(year),
                          Number(month) - 1,
                          1
                        )
                      );
                    } else {
                      setCalendarMonth(new Date());
                    }

                    setCalendarOpen(true);
                  }}
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    minHeight: "44px",
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
                      width: "min(92vw, 420px)",
                      background: "#fff",
                      borderRadius: "14px",
                      padding: "18px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
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
                        marginBottom: "8px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => changeCalendarMonth(-1)}
                        style={{
                          width: "38px",
                          height: "38px",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          background: "#fff",
                          cursor: "pointer",
                          fontSize: "22px",
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
                          width: "38px",
                          height: "38px",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          background: "#fff",
                          cursor: "pointer",
                          fontSize: "22px",
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
                        gap: "8px",
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
                          `${String(
                            calendarMonth.getMonth() + 1
                          ).padStart(2, "0")}-` +
                          `${String(day).padStart(2, "0")}`;

                        const selected =
                          usage.usage_date &&
                          usage.usage_date.split("T")[0] === dateValue;

                        const today = new Date();

                        const isToday =
                          day === today.getDate() &&
                          calendarMonth.getMonth() === today.getMonth() &&
                          calendarMonth.getFullYear() === today.getFullYear();

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDateSelect(day)}
                            style={{
                              height: "44px",
                              minWidth: "44px",
                              border: isToday
                                  ? "2px solid #1565c0"
                                  : selected
                                  ? "2px solid #1b5e20"
                                  : "1px solid #ddd",
                                borderRadius: "50%",
                                background: isToday
                                  ? "#1976d2"
                                  : selected
                                  ? "#2e7d32"
                                  : "#fff",
                              color:
                                selected || isToday
                                  ? "#fff"
                                  : "#222",
                              fontWeight:
                                selected || isToday ? 800 : 400,
                              cursor: "pointer",
                              fontSize: "15px",
                              boxShadow: isToday
                                ? "0 0 0 2px #bbdefb"
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
                        marginTop: "16px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        background: "#fff",
                        color: "#222",
                        cursor: "pointer",
                      }}
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label>{t("feed")}</label>

              <input
                type="text"
                value={usage.feed_name || "-"}
                disabled
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label>{t("animalType")}</label>

              <input
                type="text"
                value={
                  usage.animal_type === "Goat"
                    ? "Geit"
                    : usage.animal_type === "Chicken"
                    ? "Kip"
                    : usage.animal_type === "Rabbit"
                    ? "Konijn"
                    : usage.animal_type || "-"
                }
                disabled
                style={{
                  width: "100%",
                }}
              />
            </div>

            <div>
              <label>{t("quantity")}</label>

              <input
                type="number"
                name="quantity_used"
                value={usage.quantity_used ?? ""}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div
              style={{
                gridColumn: "1 / -1",
              }}
            >
              <label>{t("notes")}</label>

              <textarea
                name="notes"
                value={usage.notes || ""}
                onChange={handleChange}
                rows="4"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 30,
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              className="button"
              disabled={saving}
              style={{
                minWidth: 140,
              }}
            >
              {saving
                ? t("saving")
                : `💾 ${t("update")}`}
            </button>

            <Link
              className="button"
              to={`/feed/usage/${id}`}
              style={{
                minWidth: 100,
                textAlign: "center",
              }}
            >
              ← {t("back")}
            </Link>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default EditFeedUsage;
