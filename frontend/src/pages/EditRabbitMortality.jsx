import API_URL from "../api";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditRabbitMortality() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const mortalityDateRef = useRef(null);

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

  const [rabbits, setRabbits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);

      const [rabbitsResponse, mortalityResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/rabbits`),
          fetch(`${API_URL}/api/rabbit-mortality`),
        ]);

      const rabbitsData = await rabbitsResponse.json();
      const mortalityData = await mortalityResponse.json();

      if (!rabbitsResponse.ok) {
        throw new Error(
          rabbitsData.message || "Failed to load rabbits."
        );
      }

      if (!mortalityResponse.ok) {
        throw new Error(
          mortalityData.message ||
            "Failed to load mortality record."
        );
      }

      const record = mortalityData.find(
        (item) => Number(item.id) === Number(id)
      );

      if (!record) {
        alert(t("noRabbitMortalityRecordsFound"));
        navigate("/rabbit-mortality");
        return;
      }

      setRabbits(rabbitsData);

      const date = record.mortality_date
        ? String(record.mortality_date).split("T")[0]
        : "";

      setFormData({
        rabbit_id: record.rabbit_id || "",
        mortality_date: date,
        quantity: record.quantity || 1,
        cause: record.cause || "",
        notes: record.notes || "",
      });

      if (date) {
        const [year, month] = date.split("-").map(Number);
        setCalendarMonth(new Date(year, month - 1, 1));
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to load mortality record.");
      navigate("/rabbit-mortality");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function formatDisplayDate(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return year && month && day ? `${day}-${month}-${year}` : "";
  }

  const currentYear = new Date().getFullYear();

  const calendarYears = Array.from(
    { length: 101 },
    (_, index) => currentYear - index
  );

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
      mortality_date: `${year}-${month}-${date}`,
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

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const selectedRabbit = rabbits.find(
    (rabbit) =>
      Number(rabbit.id) ===
      Number(formData.rabbit_id)
  );

  const mortalityQuantity = Number(
    formData.quantity || 0
  );

  /*
   * When editing an existing mortality record, the current
   * rabbit quantity already excludes the old mortality.
   * Therefore the old mortality quantity must be added back
   * when checking the maximum allowed quantity.
   */
  const oldRecord = selectedRabbit
    ? rabbits.find(
        (rabbit) =>
          Number(rabbit.id) ===
          Number(formData.rabbit_id)
      )
    : null;

  const availableQuantity = selectedRabbit
    ? Number(selectedRabbit.quantity || 0)
    : 0;

  const noRabbitSelected = !formData.rabbit_id;

  const invalidQuantity =
    mortalityQuantity <= 0;

  const canSave =
    !noRabbitSelected &&
    !invalidQuantity &&
    Boolean(formData.mortality_date);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.rabbit_id) {
      alert(t("pleaseSelectRabbit"));
      return;
    }

    if (!formData.mortality_date) {
      alert(t("dateRequired") || "Mortality date is required.");
      return;
    }

    if (mortalityQuantity <= 0) {
      alert(t("mortalityQuantityPositive"));
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/rabbit-mortality/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...formData,
            quantity: mortalityQuantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update mortality record."
        );
        return;
      }

      alert(t("rabbitMortalityUpdatedSuccessfully"));
      navigate("/rabbit-mortality");
    } catch (err) {
      console.error(err);
      alert(
        t("failedToUpdateRabbitMortality") ||
          "Failed to update rabbit mortality."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="card">
        <p>{t("loadingMortalityRecords")}</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .rabbit-mortality-edit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .rabbit-mortality-edit-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .rabbit-mortality-edit-calendar {
          position: relative;
        }

        .rabbit-mortality-calendar-popup {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          z-index: 1000;
          width: 300px;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .rabbit-mortality-calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .rabbit-mortality-calendar-header button {
          border: none;
          background: transparent;
          font-size: 20px;
          cursor: pointer;
          padding: 4px 8px;
        }

        .rabbit-mortality-calendar-weekdays,
        .rabbit-mortality-calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .rabbit-mortality-calendar-weekdays div {
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          color: #666;
          padding: 5px 0;
        }

        .rabbit-mortality-calendar-days button {
          border: none;
          background: transparent;
          border-radius: 7px;
          padding: 8px 0;
          cursor: pointer;
        }

        .rabbit-mortality-calendar-days button:hover {
          background: #eee;
        }

        .rabbit-mortality-calendar-days button.selected {
          background: #222;
          color: #fff;
        }

        .rabbit-mortality-calendar-days button.today {
          border: 1px solid #222;
        }

        @media (max-width: 700px) {
          .rabbit-mortality-edit-header {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }

          .rabbit-mortality-edit-grid {
            grid-template-columns: 1fr;
          }

          .rabbit-mortality-edit-header h1 {
            font-size: 30px !important;
          }

          .rabbit-mortality-calendar-popup {
            width: min(300px, calc(100vw - 50px));
          }
        }
      `}</style>

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
            className="rabbit-mortality-edit-header"
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
                ✏️ {t("editRabbitMortality")}
              </h1>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#555",
                  WebkitTextFillColor: "#555",
                }}
              >
                {t("rabbitMortalityDescription")}
              </p>
            </div>

            <Link
              className="button"
              to="/rabbit-mortality"
            >
              ← {t("back")}
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="rabbit-mortality-edit-grid">

              {/* Rabbit */}
              <div>
                <label>{t("rabbit")}</label>

                <select
                  name="rabbit_id"
                  value={formData.rabbit_id}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">
                    {t("selectRabbit")}
                  </option>

                  {rabbits.map((rabbit) => (
                    <option
                      key={rabbit.id}
                      value={rabbit.id}
                    >
                      {rabbit.tag_number ||
                        rabbit.tag ||
                        "-"}{" "}
                      -{" "}
                      {rabbit.name || "-"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Birth Date */}
          <p style={{ margin: "0 0 16px" }}>
            <label style={labelStyle}>{t("birthDate")}</label>

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
                          formData.mortality_date === dateValue;

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
          </p>

              {/* Quantity */}
              <div>
                <label>{t("quantity")}</label>

                <input
                  type="number"
                  min="1"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* Cause */}
              <div>
                <label>{t("cause")}</label>

                <input
                  type="text"
                  name="cause"
                  value={formData.cause}
                  onChange={handleChange}
                  placeholder={t("mortalityReasonExample")}
                  style={inputStyle}
                />
              </div>

              {/* Notes */}
              <div
                style={{
                  gridColumn: "1 / -1",
                }}
              >
                <label>{t("notes")}</label>

                <textarea
                  rows="4"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder={t("additionalNotes")}
                  style={{
                    ...inputStyle,
                    minHeight: "100px",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Buttons */}
              <div />

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
                  disabled={!canSave || saving}
                  style={{
                    opacity:
                      !canSave || saving ? 0.5 : 1,
                    cursor:
                      !canSave || saving
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  💾 {saving ? t("saving") : t("save")}
                </button>

                <Link
                  className="button"
                  to="/rabbit-mortality"
                >
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

export default EditRabbitMortality;
