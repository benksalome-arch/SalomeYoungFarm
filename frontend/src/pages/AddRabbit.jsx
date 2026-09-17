import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddRabbit() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tag_number: "",
    name: "",
    breed: "",
    sex: "Female",
    birth_date: "",
    source: "",
    quantity: 1,
    status: "Active",
    purchase_price: "",
    notes: "",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

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
    WebkitTextFillColor: "#222",
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

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function formatDateDisplay(value) {
    if (!value) return "";
    const d = value.split("-");
    return `${d[2]}-${d[1]}-${d[0]}`;
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

  function selectDate(day) {
    const year = calendarMonth.getFullYear();
    const month = String(calendarMonth.getMonth() + 1).padStart(2, "0");
    const selectedDay = String(day).padStart(2, "0");

    setFormData({
      ...formData,
      birth_date: `${year}-${month}-${selectedDay}`,
    });

    setCalendarOpen(false);
  }

  function changeMonth(offset) {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + offset,
        1
      )
    );
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
      const response = await fetch(
        `${API_URL}/api/rabbits`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/rabbits");
      }
    } catch (err) {
      console.error(err);
      alert(t("failedToSaveRabbit"));
    }
  }

  const daysInMonth = getDaysInMonth(calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarMonth);

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

  const today = new Date();

  return (
    <>
      <style>{`
        .add-rabbit-form {
          width: 100%;
        }

        .add-rabbit-field {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .add-rabbit-notes {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: start;
          gap: 14px;
          margin-bottom: 20px;
        }

        .add-rabbit-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 700px) {
          .add-rabbit-field,
          .add-rabbit-notes {
            grid-template-columns: 105px minmax(0, 1fr);
            gap: 10px;
          }

          .add-rabbit-label {
            overflow-wrap: anywhere;
            line-height: 1.25;
          }
        }
      `}</style>

      <div className="page">
        <div className="page-header">
          <h1
            style={{
              margin: 0,
              color: "#222",
              WebkitTextFillColor: "#222",
            }}
          >
            🐇 {t("addRabbit")}
          </h1>
        </div>

        <div
          className="card"
          style={{
            width: "100%",
            maxWidth: "620px",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          <form
            className="add-rabbit-form"
            onSubmit={handleSubmit}
            style={formStyle}
          >
            <div className="add-rabbit-field">
              <label className="add-rabbit-label" style={labelStyle}>
                {t("tagNumber")}
              </label>
              <input
                style={inputStyle}
                type="text"
                name="tag_number"
                value={formData.tag_number}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-rabbit-field">
              <label className="add-rabbit-label" style={labelStyle}>
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

            <div className="add-rabbit-field">
              <label className="add-rabbit-label" style={labelStyle}>
                {t("breed")}
              </label>
              <input
                style={inputStyle}
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-rabbit-field">
              <label className="add-rabbit-label" style={labelStyle}>
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

            <div
              className="add-rabbit-field"
              style={{ position: "relative" }}
            >
              <label className="add-rabbit-label" style={labelStyle}>
                {t("birthDate")}
              </label>

              <div style={{ position: "relative" }}>
                <input
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                  }}
                  type="text"
                  value={formatDateDisplay(formData.birth_date)}
                  placeholder="DD-MM-JJJJ"
                  readOnly
                  onClick={() => {
                    setCalendarMonth(
                      formData.birth_date
                        ? new Date(`${formData.birth_date}T00:00:00`)
                        : new Date()
                    );
                    setCalendarOpen(!calendarOpen);
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
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => changeMonth(-1)}
                        style={{
                          border: "none",
                          background: "transparent",
                          fontSize: "22px",
                          cursor: "pointer",
                        }}
                      >
                        ‹
                      </button>

                      <strong
                        style={{
                          color: "#222",
                          WebkitTextFillColor: "#222",
                        }}
                      >
                        {monthNames[calendarMonth.getMonth()]}{" "}
                        {calendarMonth.getFullYear()}
                      </strong>

                      <button
                        type="button"
                        onClick={() => changeMonth(1)}
                        style={{
                          border: "none",
                          background: "transparent",
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
                        gridTemplateColumns: "repeat(7, 1fr)",
                        gap: "4px",
                        textAlign: "center",
                      }}
                    >
                      {weekdays.map((day) => (
                        <div
                          key={day}
                          style={{
                            fontWeight: 600,
                            fontSize: "12px",
                            color: "#666",
                          }}
                        >
                          {day}
                        </div>
                      ))}

                      {Array.from({ length: firstDay }).map((_, index) => (
                        <div key={`empty-${index}`} />
                      ))}

                      {Array.from(
                        { length: daysInMonth },
                        (_, index) => index + 1
                      ).map((day) => {
                        const isSelected =
                          formData.birth_date ===
                          `${calendarMonth.getFullYear()}-${String(
                            calendarMonth.getMonth() + 1
                          ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                        const isToday =
                          day === today.getDate() &&
                          calendarMonth.getMonth() === today.getMonth() &&
                          calendarMonth.getFullYear() === today.getFullYear();

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => selectDate(day)}
                            style={{
                              border: "none",
                              borderRadius: "6px",
                              padding: "7px 2px",
                              cursor: "pointer",
                              background:
                                isSelected || isToday
                                  ? "#1976d2"
                                  : "transparent",
                              color:
                                isSelected || isToday
                                  ? "#fff"
                                  : "#222",
                              fontWeight:
                                isSelected || isToday ? 700 : 400,
                            }}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="add-rabbit-field">
              <label className="add-rabbit-label" style={labelStyle}>
                {t("source")}
              </label>
              <input
                style={inputStyle}
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
              />
            </div>

            <div className="add-rabbit-field">
              <label className="add-rabbit-label" style={labelStyle}>
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

            <div className="add-rabbit-field">
              <label className="add-rabbit-label" style={labelStyle}>
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

            <div className="add-rabbit-field">
              <label className="add-rabbit-label" style={labelStyle}>
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

            <div className="add-rabbit-notes">
              <label className="add-rabbit-label" style={labelStyle}>
                {t("notes")}
              </label>
              <textarea
                style={{
                  ...inputStyle,
                  minHeight: "100px",
                  resize: "vertical",
                }}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="add-rabbit-buttons">
              <button className="button" type="submit">
                💾 {t("save")}
              </button>

              <Link className="button" to="/rabbits">
                {t("cancel")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddRabbit;
