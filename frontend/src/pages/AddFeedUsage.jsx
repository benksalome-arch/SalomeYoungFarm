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

  function getDaysInMonth(date) {
    return new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
  }

  function getFirstDayOfMonth(date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay();
  }

  function goPreviousMonth() {
    setCalendarMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }

  function goNextMonth() {
    setCalendarMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
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
      usage_date: value,
    }));

    setCalendarOpen(false);
  }

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

      alert(data.message || "Voergebruik opgeslagen.");
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
          🌾 Voergebruik registreren
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

            <select
              name="feed_id"
              value={formData.feed_id}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">{t("selectFeed")}</option>

              {feeds.map((feed) => (
                <option key={feed.id} value={feed.id}>
                  {feed.feed_name}
                </option>
              ))}
            </select>
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

          <div className="feed-usage-field">
            <label htmlFor="usage_date" style={labelStyle}>
              Datum
            </label>

            <div style={{ position: "relative", width: "100%" }}>
              <div
                style={{
                  ...inputStyle,
                  width: "100%",
                  color: formData.usage_date ? "#222" : "#777",
                  WebkitTextFillColor: formData.usage_date ? "#222" : "#777",
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {formData.usage_date
                  ? new Date(formData.usage_date + "T00:00:00").toLocaleDateString("nl-NL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "DD-MM-JJJJ"}
              </div>
              <input
                type="date"
                id="usage_date"
                name="usage_date"
                value={formData.usage_date || ""}
                onChange={handleChange}
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
                          width: "38px",
                          height: "38px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          background: "#fff",
                          color: "#222",
                          fontSize: "20px",
                          cursor: "pointer",
                        }}
                      >
                        ‹
                      </button>

                      <div
                        style={{
                          textAlign: "center",
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#222",
                        }}
                      >
                        {calendarMonth.toLocaleDateString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={goNextMonth}
                        style={{
                          width: "38px",
                          height: "38px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          background: "#fff",
                          color: "#222",
                          fontSize: "20px",
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
                        length: getFirstDayOfMonth(calendarMonth),
                      }).map((_, index) => (
                        <div key={`empty-${index}`} />
                      ))}

                      {Array.from({
                        length: getDaysInMonth(calendarMonth),
                      }).map((_, index) => {
                        const day = index + 1;
                        const today = new Date();

                        const isToday =
                          day === today.getDate() &&
                          calendarMonth.getMonth() === today.getMonth() &&
                          calendarMonth.getFullYear() === today.getFullYear();

                        const selectedDate = formData.usage_date
                          ? new Date(formData.usage_date + "T00:00:00")
                          : null;

                        const isSelected =
                          selectedDate &&
                          day === selectedDate.getDate() &&
                          calendarMonth.getMonth() === selectedDate.getMonth() &&
                          calendarMonth.getFullYear() === selectedDate.getFullYear();

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDateSelect(day)}
                            style={{
                              minHeight: "40px",
                              border:
                                isToday || isSelected
                                  ? "2px solid #2e7d32"
                                  : "1px solid #ddd",
                              borderRadius: "8px",
                              background:
                                isSelected || isToday ? "#e8f5e9" : "#fff",
                              color: "#222",
                              fontSize: "15px",
                              fontWeight: 600,
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
                        minHeight: "44px",
                        border: "1px solid #2e7d32",
                        borderRadius: "8px",
                        background: "#2e7d32",
                        color: "#fff",
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
