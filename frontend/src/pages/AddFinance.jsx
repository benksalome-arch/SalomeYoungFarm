import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddFinance() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    transaction_date: "",
    type: "Expense",
    category: "",
    description: "",
    amount: "",
    payment_method: "Cash",
    created_by: 1,
  });

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

function changeCalendarMonth(offset) {
  setCalendarMonth(
    (previous) =>
      new Date(
        previous.getFullYear(),
        previous.getMonth() + offset,
        1
      )
  );
}

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
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
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() - 1,
          1
        )
    );
  }

  function goNextMonth() {
    setCalendarMonth(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + 1,
          1
        )
    );
  }

  function handleDateSelect(day) {
    const value =
      calendarMonth.getFullYear() +
      "-" +
      String(calendarMonth.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0");

    setFormData((previous) => ({
      ...previous,
      transaction_date: value,
    }));

    setCalendarOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/finance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || t("failedToSaveTransaction"));
        return;
      }

      alert(data.message || t("saveTransaction"));
      navigate("/finance");
    } catch (error) {
      console.error(error);
      alert(t("failedToSaveTransaction"));
    }
  }

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

  const responsiveStyles = `
    .finance-field {
      display: grid;
      grid-template-columns: 150px minmax(0, 320px);
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }

    .finance-field > label,
    .finance-description > label {
      margin: 0 !important;
      font-weight: 600 !important;
      font-size: 15px !important;
      text-align: right !important;
      color: #222 !important;
      -webkit-text-fill-color: #222 !important;
      overflow-wrap: anywhere;
      line-height: 1.25;
    }

    .finance-field input,
    .finance-field select,
    .finance-description textarea {
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

    .finance-description {
      display: grid;
      grid-template-columns: 150px minmax(0, 320px);
      align-items: start;
      gap: 14px;
      margin-bottom: 20px;
    }

    .finance-description textarea {
      min-height: 100px !important;
      resize: vertical;
    }

    .finance-help {
      grid-column: 2;
      margin-top: -8px;
      color: #666;
      font-size: 13px;
      line-height: 1.4;
    }

    @media (max-width: 700px) {
      .page-header h1 {
        font-size: 30px !important;
        line-height: 1.15 !important;
        margin-bottom: 6px !important;
        padding: 0 4px !important;
      }

      .page-header > .button {
        position: static !important;
        display: flex !important;
        width: max-content !important;
        margin: 12px 0 0 auto !important;
      }

      .finance-field,
      .finance-description {
        grid-template-columns: 105px minmax(0, 1fr);
        gap: 10px;
      }

      .finance-help {
        grid-column: 2;
      }
    }
  `;

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
          }}
        >
          💰 {t("addTransaction")}
        </h1>

        <p style={{ margin: 0 }}>
          {t("createFinancialRecord")}
        </p>

        <Link
          className="button"
          to="/finance"
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

          <div className="finance-field">
            <label htmlFor="transaction_date" style={labelStyle}>
              {t("date")}
            </label>

            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="text"
                id="transaction_date"
                name="transaction_date"
                value={
                  formData.transaction_date
                    ? formData.transaction_date.split("-").reverse().join("-")
                    : ""
                }
                placeholder="DD-MM-JJJJ"
                readOnly
                onClick={() => {
                  const selected = formData.transaction_date
                    ? new Date(
                        formData.transaction_date + "T00:00:00"
                      )
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
                required
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
                          formData.transaction_date === dateValue;

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
                                ? "2px solid #1976d2"
                                : "1px solid #ddd",
                              borderRadius: "50%",
                              background: selected
                                ? "#2e7d32"
                                : isToday
                                ? "#1976d2"
                                : "#fff",
                              color: selected || isToday ? "#fff" : "#222",
                              fontWeight:
                                selected || isToday ? 800 : 400,
                              cursor: "pointer",
                              fontSize: "14px",
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

          <div className="finance-field">
            <label htmlFor="type" style={labelStyle}>
              {t("type")}
            </label>

            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Income">{t("income")}</option>
              <option value="Expense">{t("expense")}</option>
            </select>
          </div>

          <div className="finance-field">
            <label htmlFor="category" style={labelStyle}>
              {t("category")}
            </label>

            <input
              id="category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder={t("exampleGoatSaleNote")}
              style={inputStyle}
            />
          </div>

          <div className="finance-field">
            <label htmlFor="amount" style={labelStyle}>
              {t("amount")} (KES)
            </label>

            <input
              id="amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              style={inputStyle}
            />
          </div>

          <div className="finance-field">
            <label htmlFor="payment_method" style={labelStyle}>
              {t("paymentMethod")}
            </label>

            <select
              id="payment_method"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Cash">{t("cash")}</option>
              <option value="M-PESA">{t("mpesa")}</option>
              <option value="Bank">{t("bank")}</option>
            </select>
          </div>

          <div className="finance-description">
            <label htmlFor="description" style={labelStyle}>
              {t("description")}
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder={t("exampleGoatSaleNote")}
              style={{
                ...inputStyle,
                minHeight: "100px",
                resize: "vertical",
              }}
            />

            <small className="finance-help">
              {t("transactionDetailsHelp")}
            </small>
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
              💾 {t("saveTransaction")}
            </button>

            <Link
              className="button"
              to="/finance"
              style={{ textDecoration: "none" }}
            >
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFinance;
