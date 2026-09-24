import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddChicken() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tag_number: "",
    name: "",
    breed: "",
    type: "",
    sex: "Female",
    hatch_date: "",
    source: "",
    quantity: 1,
    status: "Active",
    purchase_price: "",
    notes: "",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const monthNames = [
    "Januari", "Februari", "Maart", "April", "Mei", "Juni",
    "Juli", "Augustus", "September", "Oktober", "November", "December"
  ];

  const weekDays = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];

  const currentYear = new Date().getFullYear();
  const calendarYears = Array.from(
    { length: 101 },
    (_, index) => currentYear - index
  );

  function openCalendar() {
    setCalendarMonth(
      formData.hatch_date
        ? new Date(formData.hatch_date)
        : new Date()
    );
    setCalendarOpen(true);
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
    const month = calendarMonth.getMonth();
    const selectedDate = new Date(year, month, day);

    const formattedDate =
      selectedDate.getFullYear() +
      "-" +
      String(selectedDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(selectedDate.getDate()).padStart(2, "0");

    setFormData((prev) => ({
      ...prev,
      hatch_date: formattedDate,
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

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      purchase_price:
        formData.purchase_price === ""
          ? 0
          : Number(formData.purchase_price),
    };

    try {
      const response = await fetch(`${API_URL}/api/chickens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/chickens");
      }
    } catch (err) {
      console.error(err);
      alert(t("failedSaveChicken"));
    }
  }

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
        .add-chicken-form {
          width: 100%;
          max-width: 620px;
          margin: 0 auto;
        }

        .add-chicken-field {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .add-chicken-label {
          font-weight: 600;
          font-size: 15px;
          text-align: right;
          color: #222;
        }

        .add-chicken-notes {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: start;
          gap: 14px;
          margin-bottom: 20px;
        }

        .add-chicken-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 700px) {
          .add-chicken-form {
            max-width: 100%;
          }

          .add-chicken-field {
            grid-template-columns: 105px minmax(0, 1fr);
            gap: 10px;
          }

          .add-chicken-notes {
            grid-template-columns: 105px minmax(0, 1fr);
            gap: 10px;
          }

          .add-chicken-label {
            font-size: 14px;
          }
        }
      `}</style>

      <div className="page-header">
        <h1>🐔 {t("addChicken")}</h1>
        <p>{t("addChickenDescription")}</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="add-chicken-form">

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("tagNumber")}
            </label>
            <input
              style={inputStyle}
              type="text"
              name="tag_number"
              value={formData.tag_number}
              onChange={handleChange}
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
                      onClick={() => changeCalendarMonth(-1)}
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
                      onClick={() => changeCalendarMonth(1)}
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
                      gap: "5px",
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
                        formData.hatch_date === dateValue;

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
                            color: selected || isToday ? "#fff" : "#222",
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

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("name")}
            </label>
            <input
              style={inputStyle}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("breed")}
            </label>
            <input
              style={inputStyle}
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              required
              placeholder={t("chickenBreedExample")}
            />
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("type")}
            </label>
            <input
              style={inputStyle}
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder={t("chickenTypeExample")}
            />
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("sex")}
            </label>
            <select
              style={inputStyle}
              name="sex"
              value={formData.sex}
              onChange={handleChange}
            >
              <option value="Female">{t("female")}</option>
              <option value="Male">{t("male")}</option>
            </select>
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("hatchDate")}
            </label>
            <button
              type="button"
              onClick={openCalendar}
              style={{
                ...inputStyle,
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: formData.hatch_date ? "#222" : "#777",
                WebkitTextFillColor: formData.hatch_date
                  ? "#222"
                  : "#777",
              }}
            >
              <span>
                {formData.hatch_date
                  ? new Date(
                      formData.hatch_date + "T00:00:00"
                    ).toLocaleDateString("nl-NL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "DD-MM-JJJJ"}
              </span>
              <span>📅</span>
            </button>
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("source")}
            </label>
            <input
              style={inputStyle}
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder={t("sourcePlaceholder")}
            />
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("quantity")}
            </label>
            <input
              style={inputStyle}
              type="number"
              min="1"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("status")}
            </label>
            <select
              style={inputStyle}
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">{t("active")}</option>
              <option value="Sold">{t("sold")}</option>
              <option value="Dead">{t("dead")}</option>
            </select>
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("purchasePrice")}
            </label>
            <input
              style={inputStyle}
              type="number"
              step="0.01"
              min="0"
              name="purchase_price"
              value={formData.purchase_price}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div className="add-chicken-notes">
            <label className="add-chicken-label">
              {t("notes")}
            </label>

            <textarea
              style={{
                ...inputStyle,
                minHeight: "100px",
                resize: "vertical",
              }}
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              placeholder={t("additionalInformation")}
            />
          </div>

          <div className="add-chicken-buttons">
            <button className="button" type="submit">
              💾 {t("save")}
            </button>

            <Link className="button" to="/chickens">
              {t("cancel")}
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddChicken;
