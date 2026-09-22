import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddRabbitMortality() {
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

  const { t } = useLanguage();
  const navigate = useNavigate();

  const [rabbits, setRabbits] = useState([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [formData, setFormData] = useState({
    rabbit_id: "",
    mortality_date: "",
    quantity: 1,
    cause: "",
    notes: "",
  });

  useEffect(() => {
    loadRabbits();
  }, []);

  async function loadRabbits() {
    try {
      const response = await fetch(
        `${API_URL}/api/rabbits`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        setRabbits([]);
        return;
      }

      setRabbits(data);
    } catch (err) {
      console.error(err);
      setRabbits([]);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function formatDisplayDate(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}-${month}-${year}`;
  }

  function selectCalendarDate(day) {
    const year = calendarMonth.getFullYear();
    const month = String(calendarMonth.getMonth() + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");

    setFormData({
      ...formData,
      mortality_date: `${year}-${month}-${date}`,
    });
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

  const firstDay = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1
  ).getDay();

  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0
  ).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

  const monthKeys = [
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

  const weekdayKeys = [
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
  ];

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();

  const today = new Date();
  const todayValue =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const selectedValue = formData.mortality_date;

  const selectedRabbit = rabbits.find(
    (rabbit) =>
      Number(rabbit.id) === Number(formData.rabbit_id)
  );

  const availableQuantity = selectedRabbit
    ? Number(selectedRabbit.quantity || 0)
    : 0;

  const mortalityQuantity = Number(formData.quantity || 0);

  const noRabbitSelected = !formData.rabbit_id;

  const rabbitUnavailable =
    selectedRabbit && availableQuantity <= 0;

  const quantityTooHigh =
    selectedRabbit &&
    mortalityQuantity > availableQuantity;

  const invalidQuantity =
    mortalityQuantity <= 0;

  const canSave =
    !noRabbitSelected &&
    !rabbitUnavailable &&
    !quantityTooHigh &&
    !invalidQuantity;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.rabbit_id) {
      alert(t("pleaseSelectRabbit"));
      return;
    }

    if (availableQuantity <= 0) {
      alert(
        `${selectedRabbit.name || t("thisRabbit")} ${t("mortalityUnavailable")}`
      );
      return;
    }

    if (mortalityQuantity <= 0) {
      alert(t("mortalityQuantityPositive"));
      return;
    }

    if (mortalityQuantity > availableQuantity) {
      alert(
        `Mortality quantity cannot exceed the ${availableQuantity} rabbit(s) available.`
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/rabbit-mortality`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to record mortality."
        );
        return;
      }

      alert(data.message);

      navigate("/rabbit-mortality");
    } catch (err) {
      console.error(err);
      alert(t("failedToRecordRabbitMortality"));
    }
  }

  const rabbitMortalityMobileStyles = `
    @media (max-width: 700px) {
      .rabbit-mortality-title {
        width: 100%;
        text-align: center;
      }

      .rabbit-mortality-title h1 {
        font-size: 30px !important;
        line-height: 1.15 !important;
      }

      .rabbit-mortality-title p {
        margin: 8px 0 14px !important;
        font-size: 17px;
        line-height: 1.35;
      }

      .rabbit-mortality-header {
        flex-direction: column;
        gap: 4px !important;
        margin-bottom: 16px !important;
      }

      .rabbit-mortality-back {
        align-self: center;
        flex-shrink: 0;
      }

      .rabbit-mortality-grid {
        grid-template-columns: 105px minmax(0, 1fr) !important;
        gap: 14px 10px !important;
        width: 100% !important;
        max-width: 100% !important;
      }

      .rabbit-mortality-grid > label {
        font-weight: 600;
        font-size: 15px;
        text-align: right;
        color: #222;
        -webkit-text-fill-color: #222;
      }
    }
  `;

  const professionalCalendarCSS = `
    .rabbit-mortality-calendar,
    .rabbit-mortality-calendar * {
      box-sizing: border-box !important;
    }

    .rabbit-mortality-calendar {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      padding: 16px !important;
      margin: 0 !important;
      background: rgba(0,0,0,0.35) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 2147483647 !important;
    }

    .rabbit-mortality-calendar-card {
      width: min(92vw, 360px) !important;
      max-width: 360px !important;
      min-width: 360px !important;
      padding: 18px !important;
      margin: 0 !important;
      background: #fff !important;
      border: none !important;
      border-radius: 14px !important;
      box-shadow: 0 8px 30px rgba(0,0,0,0.25) !important;
    }

    .rabbit-mortality-calendar-header {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 10px !important;
      margin-bottom: 14px !important;
    }

    .rabbit-mortality-calendar-nav {
      all: unset !important;
      width: 38px !important;
      height: 38px !important;
      min-width: 38px !important;
      max-width: 38px !important;
      min-height: 38px !important;
      max-height: 38px !important;
      border: 1px solid #cfd6cf !important;
      border-radius: 8px !important;
      background: #fff !important;
      color: #222 !important;
      font-size: 20px !important;
      font-weight: 700 !important;
      line-height: 38px !important;
      text-align: center !important;
      cursor: pointer !important;
    }

    .rabbit-mortality-calendar-month {
      flex: 1 !important;
      text-align: center !important;
      color: #222 !important;
      font-size: 19px !important;
      font-weight: 700 !important;
      line-height: 38px !important;
    }

    .rabbit-mortality-calendar-weekdays,
    .rabbit-mortality-calendar-days {
      display: grid !important;
      grid-template-columns: repeat(7, minmax(0, 1fr)) !important;
      gap: 6px !important;
      width: 100% !important;
    }

    .rabbit-mortality-calendar-weekday {
      text-align: center !important;
      color: #222 !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      padding: 6px 0 !important;
    }

    .rabbit-mortality-calendar-day {
      all: unset !important;
      width: 100% !important;
      height: 40px !important;
      min-height: 40px !important;
      max-height: 40px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border: 1px solid #ddd !important;
      border-radius: 7px !important;
      background: #fff !important;
      color: #222 !important;
      font-size: 15px !important;
      font-weight: 600 !important;
      line-height: 40px !important;
      cursor: pointer !important;
    }

    .rabbit-mortality-calendar-day.selected {
      border: 2px solid #2e7d32 !important;
      background: #2e7d32 !important;
      color: #fff !important;
    }

    .rabbit-mortality-calendar-day.today {
      border: 2px solid #2e7d32 !important;
      background: #e8f5e9 !important;
      color: #222 !important;
    }

    .rabbit-mortality-calendar-cancel {
      all: unset !important;
      width: 100% !important;
      height: 40px !important;
      min-height: 40px !important;
      max-height: 40px !important;
      margin-top: 16px !important;
      border-radius: 7px !important;
      background: #2e7d32 !important;
      color: #fff !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      line-height: 40px !important;
      text-align: center !important;
      cursor: pointer !important;
    }
  `;

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



  const rabbitMortalityTitleFix = `
    .rabbit-mortality-title {
      width: 100% !important;
      margin: 0 0 8px 0 !important;
      padding: 0 !important;
      text-align: center !important;
    }

    .rabbit-mortality-title h1 {
      margin: 0 0 8px 0 !important;
      padding: 0 !important;
      color: #222 !important;
      -webkit-text-fill-color: #222 !important;
      font-size: 28px !important;
      line-height: 1.25 !important;
      font-weight: 700 !important;
      letter-spacing: 0 !important;
      text-align: center !important;
    }

    .rabbit-mortality-title p {
      margin: 0 !important;
      padding: 0 !important;
      color: #555 !important;
      -webkit-text-fill-color: #555 !important;
      font-size: 15px !important;
      line-height: 1.5 !important;
      text-align: center !important;
    }
  `;

  return (
    <>
      <style>{rabbitMortalityTitleFix}</style>
      <style>{`
        @media (max-width: 700px) {
          .rabbit-mortality-header {
            flex-direction: column;
            align-items: stretch !important;
            text-align: center;
            gap: 12px !important;
            margin-bottom: 18px !important;
          }

          .rabbit-mortality-title h1 {
            font-size: 30px !important;
            line-height: 1.15 !important;
          }

          .rabbit-mortality-title p {
            font-size: 17px !important;
            line-height: 1.45 !important;
            margin: 8px 0 0 !important;
          }

          .rabbit-mortality-back {
            align-self: center;
            width: auto;
            min-width: 120px;
          }

          .rabbit-mortality-grid {
            grid-template-columns: 105px minmax(0, 1fr) !important;
            gap: 10px !important;
            width: 100%;
          }

          .rabbit-mortality-grid > label {
            color: #222 !important;
            -webkit-text-fill-color: #222 !important;
            font-weight: 600;
            overflow-wrap: anywhere;
            line-height: 1.25;
          }

          .rabbit-mortality-grid input,
          .rabbit-mortality-grid select,
          .rabbit-mortality-grid textarea {
            min-width: 0 !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            background: #fff !important;
            color: #222 !important;
            -webkit-text-fill-color: #222 !important;
            border: 1px solid #cfd6cf !important;
            border-radius: 7px !important;
          }

          .rabbit-mortality-grid input::placeholder,
          .rabbit-mortality-grid textarea::placeholder {
            color: #777 !important;
            -webkit-text-fill-color: #777 !important;
            opacity: 1 !important;
          }
        }

          .rabbit-mortality-grid input::placeholder,
          .rabbit-mortality-grid textarea::placeholder {
            color: #777 !important;
            -webkit-text-fill-color: #777 !important;
            opacity: 1 !important;
          }

          .rabbit-mortality-grid textarea {
            background: #fff !important;
            color: #222 !important;
            -webkit-text-fill-color: #222 !important;
            border: 1px solid #cfd6cf !important;
          }

          .rabbit-mortality-grid input::placeholder,
          .rabbit-mortality-grid textarea::placeholder {
            color: #777 !important;
            -webkit-text-fill-color: #777 !important;
            opacity: 1 !important;
          }

          .rabbit-mortality-grid textarea {
            min-width: 0 !important;
            max-width: 100%;
            box-sizing: border-box;
            background: #fff !important;
            color: #222 !important;
            -webkit-text-fill-color: #222 !important;
            border: 1px solid #cfd6cf !important;
          }

          .rabbit-mortality-grid input::placeholder,
          .rabbit-mortality-grid textarea::placeholder {
            color: #777 !important;
            -webkit-text-fill-color: #777 !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <div>
      {/* Header */}

      <div
        className="rabbit-mortality-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "20px",
        }}
        className="rabbit-mortality-header"
      >
        <div className="rabbit-mortality-title">
          <h1
            style={{
              margin: 0,
              color: "#222",
              WebkitTextFillColor: "#222",
            }}
          >
            ☠️ {t("recordRabbitMortality")}
          </h1>

          <p style={{ color: "#222", WebkitTextFillColor: "#222" }}>
            {t("rabbitMortalityDescription")}
          </p>
        </div>

        <Link
          className="button rabbit-mortality-back"
          to="/rabbit-mortality"
        >
          ← {t("back")}
        </Link>
      </div>

      {/* Form */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "620px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <form onSubmit={handleSubmit}>
<style>{` .rabbit-mortality-grid { grid-template-columns: 135px minmax(0,1fr) !important; column-gap: 14px !important; row-gap: 14px !important; } .rabbit-mortality-grid > label { font-weight: 600 !important; font-size: 15px !important; line-height: 1.25 !important; text-align: right !important; color: #222 !important; -webkit-text-fill-color: #222 !important; } .rabbit-mortality-grid > div > input:not([type="date"]), .rabbit-mortality-grid > div > select { width: 100% !important; height: 44px !important; min-height: 44px !important; box-sizing: border-box !important; padding: 10px 12px !important; border: 1px solid #cfd6cf !important; border-radius: 7px !important; background: #fff !important; color: #222 !important; font-size: 15px !important; } .rabbit-mortality-grid > div > textarea { width: 100% !important; height: 110px !important; min-height: 110px !important; box-sizing: border-box !important; padding: 10px 12px !important; border: 1px solid #cfd6cf !important; border-radius: 7px !important; background: #fff !important; color: #222 !important; font-size: 15px !important; resize: vertical !important; } .rabbit-mortality-grid .add-rabbit-mortality-buttons { grid-column: 1 / -1 !important; display: flex !important; justify-content: center !important; gap: 20px !important; margin-top: 4px !important; } @media (max-width:700px) { .rabbit-mortality-grid { grid-template-columns: 120px minmax(0,1fr) !important; column-gap: 12px !important; row-gap: 14px !important; } .rabbit-mortality-grid .add-rabbit-mortality-buttons { gap: 16px !important; } } `}</style>
          <div
            className="rabbit-mortality-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "150px minmax(0, 260px)",
              gap: "14px",
              alignItems: "center",
              maxWidth: "620px",
              margin: "0 auto",
            }}
          >
            {/* Rabbit */}
            <label>{t("rabbit")}</label>

            <div>
              <select
                name="rabbit_id"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  minHeight: "44px",
                  border: "1px solid #cfd6cf",
                  borderRadius: "7px",
                  background: "#fff",
                  color: "#222",
                }}
                value={formData.rabbit_id}
                onChange={handleChange}
                required
              >
                <option value="">
                  {t("selectRabbit")}
                </option>

                {rabbits.map((rabbit) => (
                  <option key={rabbit.id} value={rabbit.id}>
                    {rabbit.tag_number} - {rabbit.name || t("rabbit")} (
                    {Number(rabbit.quantity || 0)} {t("available")})
                  </option>
                ))}
              </select>

              {rabbitUnavailable && (
                <p
                  style={{
                    color: "#b71c1c",
                    fontWeight: "bold",
                    margin: "8px 0 0",
                  }}
                >
                  ⚠️ {selectedRabbit.name || t("thisRabbit")}{" "}
                  {t("mortalityUnavailable")}
                </p>
              )}

              {selectedRabbit && availableQuantity > 0 && (
                <p
                  style={{
                    color: "#2E7D32",
                    fontWeight: "bold",
                    margin: "8px 0 0",
                  }}
                >
                  ✅ {availableQuantity} {t("rabbit")} {t("available")}{" "}
                  {t("forMortalityRecording")}.
                </p>
              )}
            </div>

            {/* Date */}
            <label>{t("mortalityDate")}</label>

            <div style={{ position: "relative" }}>
              <div style={{ position: "relative", width: "100%" }}>
                <div
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "10px 12px",
                    minHeight: "44px",
                    border: "1px solid #cfd6cf",
                    borderRadius: "7px",
                    background: "#fff",
                    color: formData.mortality_date ? "#222" : "#777",
                    WebkitTextFillColor: formData.mortality_date ? "#222" : "#777",
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
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
                    cursor: "pointer",
                  }}
                />
              </div>

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
                onClick={() => changeCalendarMonth(-1)}
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
                {t(monthKeys[month])} {year}
              </div>

              <button
                type="button"
                onClick={() => changeCalendarMonth(1)}
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
              {weekdayKeys.map((key) => (
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
                  year +
                  "-" +
                  String(month + 1).padStart(2, "0") +
                  "-" +
                  String(day).padStart(2, "0");

                const isToday = dateValue === todayValue;
                const isSelected = dateValue === selectedValue;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => selectCalendarDate(day)}
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

            {/* CANCEL */}
            <button
              type="button"
              onClick={() => {
                setCalendarOpen(false);
                
              }}
              style={{
                width: "100%",
                marginTop: "14px",
                minHeight: "44px",
                border: "1px solid #ccc",
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
            </div>

            {/* Quantity */}
            <label>{t("quantity")}</label>

            <div>
              <input
                type="number"
                min="1"
                max={availableQuantity > 0 ? availableQuantity : undefined}
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {quantityTooHigh && (
                <p
                  style={{
                    color: "#b71c1c",
                    fontWeight: "bold",
                    margin: "8px 0 0",
                  }}
                >
                  ⚠️ {t("quantityCannotExceed")} {availableQuantity}{" "}
                  {t("available")}.
                </p>
              )}

              {invalidQuantity && (
                <p
                  style={{
                    color: "#b71c1c",
                    fontWeight: "bold",
                    margin: "8px 0 0",
                  }}
                >
                  ⚠️ {t("quantityMustBeGreaterThanZero")}
                </p>
              )}
            </div>

            {/* Cause */}
            <label>{t("cause")}</label>

            <input
              type="text"
              name="cause"
              value={formData.cause}
              onChange={handleChange}
              placeholder={t("mortalityReasonExample")}
              style={inputStyle}
            />

            {/* Notes */}
            <label style={{ alignSelf: "start" }}>{t("notes")}</label>

            <textarea
              rows="4"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder={t("additionalNotes")}
              style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
            />

            {/* Submit */}
            <div></div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                className="button"
                type="submit"
                disabled={!canSave}
                style={{
                  opacity: canSave ? 1 : 0.5,
                  cursor: canSave ? "pointer" : "not-allowed",
                }}
              >
                💾 {t("save")}
              </button>

              <Link className="button" to="/rabbit-mortality">
                {t("cancel")}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default AddRabbitMortality;
