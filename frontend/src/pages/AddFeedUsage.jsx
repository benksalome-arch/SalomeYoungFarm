import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddFeedUsage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());


  const labelStyle = {
    fontWeight: 600,
    fontSize: "15px",
    textAlign: "right",
    color: "#222",
    WebkitTextFillColor: "#222",
            lineHeight: "1.05",
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
            lineHeight: "1.05",
    fontSize: "15px",
  };

  const responsiveStyles = `
    .feed-usage-field {
      display: grid;
      grid-template-columns: 150px minmax(0, 320px);
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }

    .feed-usage-field > label,
    .feed-usage-notes > label {
      margin: 0 !important;
      font-weight: 600 !important;
      font-size: 15px !important;
      text-align: right !important;
      color: #222 !important;
      -webkit-text-fill-color: #222 !important;
      overflow-wrap: anywhere;
      line-height: 1.25;
    }

    .feed-usage-field input,
    .feed-usage-field select,
    .feed-usage-notes textarea {
      width: 100% !important;
      box-sizing: border-box !important;
      padding: 10px 12px !important;
      min-height: 44px !important;
      border: 1px solid #cfd6cf !important;
      border-radius: 7px !important;
      background: #fff !important;
      color: #222 !important;
      -webkit-text-fill-color: #222 !important;
      font-size: 15px !important;
    }

    .feed-usage-notes {
      display: grid;
      grid-template-columns: 150px minmax(0, 320px);
      align-items: start;
      gap: 14px;
      margin-bottom: 20px;
    }

    .feed-usage-notes textarea {
      min-height: 100px !important;
      resize: vertical;
    }

    @media (max-width: 700px) {
      .page-header > .button { position: static !important; display: inline-block; margin-top: 12px; }
      .feed-usage-field,
      .feed-usage-notes {
        grid-template-columns: 105px minmax(0, 1fr);
        gap: 10px;
      }
    }
  `;


  const [feeds, setFeeds] = useState([]);
  const [feedSearch, setFeedSearch] = useState("");

  const [formData, setFormData] = useState({
    feed_id: "",
    animal_type: "Goat",
    animal_id: "",
    quantity_used: "",
    usage_date: "",
    notes: "",
  });

  useEffect(() => {
    loadFeeds();
  }, []);

  async function loadFeeds() {
    try {
      const response = await fetch(`${API_URL}/api/feed`);
      const data = await response.json();
      setFeeds(data);
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

  const currentYear = new Date().getFullYear();

  const calendarYears = Array.from(
    { length: 101 },
    (_, index) => currentYear - index
  );

  const monthNames = [
    "Januari", "Februari", "Maart", "April", "Mei", "Juni",
    "Juli", "Augustus", "September", "Oktober", "November", "December"
  ];

  const weekDays = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];

  function formatDateDisplay(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return year && month && day ? `${day}-${month}-${year}` : "";
  }

  function selectCalendarDate(day) {
    const year = calendarMonth.getFullYear();
    const month = String(calendarMonth.getMonth() + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");

    setFormData((previous) => ({
      ...previous,
      usage_date: `${year}-${month}-${date}`,
    }));

    setCalendarOpen(false);
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

  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1
  ).getDay();

  const today = new Date();

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...formData,
      animal_id:
        formData.animal_id === ""
          ? null
          : Number(formData.animal_id),
    };

    try {
      const response = await fetch(
        `${API_URL}/api/feed-usage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Feed not found") {
          alert(t("feedNotFound"));
        } else {
          alert(data.message || t("saveFailed"));
        }
        return;
      }

      alert(t("feedUsageSaved"));
      navigate("/feed/usage");
    } catch (err) {
      console.error(err);
      alert("Het opslaan van het voergebruik is mislukt.");
    }
  }

  return (
    <div className="page">
      <style>{responsiveStyles}</style>
      <div
        className="page-header"
        style={{
          position: "relative",
          textAlign: "center",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            margin: "0 0 6px 0",
            color: "#222",
            WebkitTextFillColor: "#222",
            lineHeight: "1.05",
          }}
        >
          🌾 {t("registerFeedUsage")}
        </h1>

        <p style={{ margin: 0 }}>
          Registreer het dagelijkse voerverbruik van de dieren.
        </p>

        <Link
          className="button"
          to="/feed/usage"
          style={{
            textDecoration: "none",
            whiteSpace: "nowrap",
            position: "absolute",
            right: 0,
            top: 0,
          }}
        >
          ← {t("back")}
        </Link>
      </div>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "620px",
          margin: "0 auto",
          padding: "30px",
          boxSizing: "border-box",
          borderRadius: "14px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="feed-usage-field">
            <label htmlFor="feed_id" style={labelStyle}>
              Voer
            </label>

            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="text"
                value={feedSearch}
                onChange={(e) => {
                  setFeedSearch(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    feed_id: "",
                  }));
                }}
                placeholder={t("selectFeed")}
                required={!formData.feed_id}
                style={inputStyle}
                autoComplete="off"
              />

              {feedSearch.trim() &&
                !formData.feed_id &&
                feeds.filter((feed) =>
                  String(feed.feed_name || "")
                    .toLowerCase()
                    .includes(feedSearch.trim().toLowerCase())
                ).length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      left: 0,
                      right: 0,
                      background: "#fff",
                      border: "1px solid #cfd6cf",
                      borderRadius: "7px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                      maxHeight: "220px",
                      overflowY: "auto",
                      zIndex: 20,
                    }}
                  >
                    {feeds
                      .filter((feed) =>
                        String(feed.feed_name || "")
                          .toLowerCase()
                          .includes(feedSearch.trim().toLowerCase())
                      )
                      .map((feed) => (
                        <button
                          key={feed.id}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              feed_id: feed.id,
                            }));
                            setFeedSearch(feed.feed_name);
                          }}
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "10px 12px",
                            border: "none",
                            borderBottom: "1px solid #eee",
                            background: "#fff",
                            color: "#222",
                            textAlign: "left",
                            cursor: "pointer",
                            fontSize: "15px",
                          }}
                        >
                          {feed.feed_name}
                        </button>
                      ))}
                  </div>
                )}
            </div>
          </div>

          <div className="feed-usage-field">
            <label htmlFor="animal_type" style={labelStyle}>
              Diersoort
            </label>

            <select
              name="animal_type"
              value={formData.animal_type}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Goat">{t("goat")}</option>
              <option value="Chicken">{t("chicken")}</option>
              <option value="Rabbit">{t("rabbit")}</option>
            </select>
          </div>

          <div className="feed-usage-field">
            <label htmlFor="animal_id" style={labelStyle}>
              Diernummer
              <span style={{ fontWeight: 400, color: "#777" }}>
                {" "} (optioneel)
              </span>
            </label>

            <input
              type="number"
              name="animal_id"
              value={formData.animal_id}
              onChange={handleChange}
              placeholder="Bijvoorbeeld 12"
              style={inputStyle}
            />
          </div>

          <div className="feed-usage-field">
            <label htmlFor="quantity_used" style={labelStyle}>
              Hoeveelheid gebruikt (kg)
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              name="quantity_used"
              value={formData.quantity_used}
              onChange={handleChange}
              placeholder="Bijvoorbeeld 2.50"
              required
              style={inputStyle}
            />
          </div>

          {/* Birth Date */}
          <div className="feed-usage-field" style={{ position: "relative" }}>
            <label style={labelStyle}>Datum</label>

            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="text"
                value={
                  formData.usage_date
                    ? formData.usage_date.split("-").reverse().join("-")
                    : ""
                }
                placeholder="DD-MM-JJJJ"
                readOnly
                onClick={() => {
                  const selected = formData.usage_date
                    ? new Date(formData.usage_date + "T00:00:00")
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
                      boxShadow:
                        "0 12px 35px rgba(0,0,0,0.25)",
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
                        marginBottom: "10px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => changeCalendarMonth(-1)}
                        style={{
                          width: "38px",
                          height: "38px",
                          border: "1px solid #cfd6cf",
                          borderRadius: "8px",
                          background: "#fff",
                          fontSize: "20px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        ‹
                      </button>

                      <div
                        style={{
                          fontSize: "19px",
                          fontWeight: "700",
                        }}
                      >
                        {monthNames[calendarMonth.getMonth()]}{" "}
                        {calendarMonth.getFullYear()}
                      </div>

                      <button
                        type="button"
                        onClick={() => changeCalendarMonth(1)}
                        style={{
                          width: "38px",
                          height: "38px",
                          border: "1px solid #cfd6cf",
                          borderRadius: "8px",
                          background: "#fff",
                          fontSize: "20px",
                          fontWeight: "700",
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
                          formData.usage_date === dateValue;

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
                              color: selected
                                ? "#fff"
                                : "#222",
                              fontWeight:
                                selected || isToday ? 700 : 400,
                              cursor: "pointer",
                              padding: 0,
                              justifySelf: "center",
                              boxSizing: "border-box",
                            }}
                            onMouseDown={(e) => e.preventDefault()}
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
                </div>
              )}
            </div>
          </div>


          <div className="feed-usage-notes">
            <label htmlFor="notes" style={labelStyle}>
              Opmerkingen
            </label>

            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Eventuele opmerkingen..."
              style={{
                ...inputStyle,
                minHeight: "100px",
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "28px",
            }}
          >
            <button className="button" type="submit">
              💾 Opslaan
            </button>

            <Link className="button" to="/feed/usage">
              Annuleren
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFeedUsage;
