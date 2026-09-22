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
              <div
                style={{
                  ...inputStyle,
                  width: "100%",
                  color: formData.transaction_date ? "#222" : "#777",
                  WebkitTextFillColor: formData.transaction_date ? "#222" : "#777",
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {formData.transaction_date
                  ? new Date(formData.transaction_date + "T00:00:00").toLocaleDateString("nl-NL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "DD-MM-JJJJ"}
              </div>
              <input
                type="date"
                id="transaction_date"
                name="transaction_date"
                value={formData.transaction_date || ""}
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
                          WebkitTextFillColor: "#222",
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
                            WebkitTextFillColor: "#222",
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
                          calendarMonth.getMonth() ===
                            today.getMonth() &&
                          calendarMonth.getFullYear() ===
                            today.getFullYear();

                        const selectedDate = formData.transaction_date
                          ? new Date(
                              formData.transaction_date +
                                "T00:00:00"
                            )
                          : null;

                        const isSelected =
                          selectedDate &&
                          day === selectedDate.getDate() &&
                          calendarMonth.getMonth() ===
                            selectedDate.getMonth() &&
                          calendarMonth.getFullYear() ===
                            selectedDate.getFullYear();

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
                                isSelected || isToday
                                  ? "#e8f5e9"
                                  : "#fff",
                              color: "#222",
                              WebkitTextFillColor: "#222",
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
