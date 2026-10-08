import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditFinance() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    transaction_date: "",
    type: "Expense",
    category: "",
    description: "",
    amount: "",
    payment_method: "Cash",
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

  useEffect(() => {
    loadTransaction();
  }, [id]);

  async function loadTransaction() {
    try {
      const response = await fetch(
        `${API_URL}/api/finance/${id}`
      );

      if (!response.ok) {
        throw new Error(`Failed to load transaction: ${response.status}`);
      }

      const data = await response.json();

      const transactionDate = data.transaction_date
        ? data.transaction_date.split("T")[0]
        : "";

      setFormData({
        transaction_date: transactionDate,
        type: data.type || "Expense",
        category: data.category || "",
        description: data.description || "",
        amount: data.amount || "",
        payment_method: data.payment_method || "Cash",
      });

      if (transactionDate) {
        const selectedDate = new Date(transactionDate + "T00:00:00");
        setCalendarMonth(
          new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            1
          )
        );
      }
    } catch (error) {
      console.error(error);
      alert(t("failedToLoadTransaction"));
    }
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
    const month = String(
      calendarMonth.getMonth() + 1
    ).padStart(2, "0");
    const selectedDay = String(day).padStart(2, "0");

    setFormData((previous) => ({
      ...previous,
      transaction_date: `${year}-${month}-${selectedDay}`,
    }));

    setCalendarOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/finance/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update transaction.");
        return;
      }

      alert(data.message || "Transaction updated successfully.");
      navigate("/finance");
    } catch (error) {
      console.error(error);
      alert(t("failedToUpdateTransaction"));
    }
  }

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: 600,
    fontSize: "16px",
    textAlign: "center",
    color: "#222",
    WebkitTextFillColor: "#222",
  };

  const inputStyle = {
    width: "100%",
    minHeight: "48px",
    boxSizing: "border-box",
    padding: "11px 14px",
    fontSize: "16px",
    color: "#222",
    WebkitTextFillColor: "#222",
    backgroundColor: "#fff",
    border: "1px solid #cfd6cf",
    borderRadius: "8px",
    outline: "none",
  };

  const displayDate = formData.transaction_date
    ? new Date(
        formData.transaction_date + "T00:00:00"
      ).toLocaleDateString("nl-NL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "DD-MM-JJJJ";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            className="edit-finance-title"
            style={{
              margin: "0 0 8px 0",
              fontSize: "42px",
              color: "#111",
            }}
          >
            ✏️ {t("edit")} {t("transaction", "Transaction")}
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#666",
            }}
          >
            {t("updateFinancialRecord")}
          </p>
        </div>

        <Link
          className="button"
          to="/finance"
          style={{
            width: "auto",
            minWidth: "90px",
            whiteSpace: "nowrap",
          }}
        >
          ← {t("back", "Terug")}
        </Link>
      </div>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto",
          padding: "30px",
          boxSizing: "border-box",
          borderRadius: "14px",
          background: "#fff",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* DATE */}
          <div
            style={{
              marginBottom: "22px",
              position: "relative",
            }}
          >
            <label
              htmlFor="transaction_date"
              style={labelStyle}
            >
              {t("date", "Date")}
            </label>

            <button
              type="button"
              onClick={() => setCalendarOpen(true)}
              style={{
                ...inputStyle,
                display: "flex",
                alignItems: "center",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              {displayDate}
            </button>

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
                      "0 8px 30px rgba(0, 0, 0, 0.25)",
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
                      gridTemplateColumns:
                        "repeat(7, 1fr)",
                      gap: "6px",
                    }}
                  >
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        style={{
                          textAlign: "center",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#555",
                          paddingBottom: "4px",
                        }}
                      >
                        {day}
                      </div>
                    ))}

                    {Array.from({
                      length:
                        getFirstDayOfMonth(calendarMonth),
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

                      const selectedDate =
                        formData.transaction_date
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
                          onClick={() =>
                            handleDateSelect(day)
                          }
                          style={{
                            width: "40px",
                            height: "40px",
                            minWidth: "40px",
                            minHeight: "40px",
                            justifySelf: "center",
                            borderRadius: "50%",
                            border:
                              isToday || isSelected
                                ? "2px solid #2e7d32"
                                : "1px solid transparent",
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
                            fontSize: "14px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0,
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
                      marginTop: "18px",
                      minHeight: "44px",
                      border: "1px solid #cfd6cf",
                      borderRadius: "8px",
                      background: "#fff",
                      color: "#222",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            )}
            </div>


          <div style={{ marginBottom: "22px" }}>
            <label htmlFor="type" style={labelStyle}>
              {t("type", "Type")}
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

          {/* CATEGORY */}
          <div style={{ marginBottom: "22px" }}>
            <label
              htmlFor="category"
              style={labelStyle}
            >
              {t("category", "Category")}
            </label>

            <input
              id="category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* AMOUNT */}
          <div style={{ marginBottom: "22px" }}>
            <label htmlFor="amount" style={labelStyle}>
              {t("amount", "Amount")} (KES)
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
              style={inputStyle}
            />
          </div>

          {/* PAYMENT METHOD */}
          <div style={{ marginBottom: "22px" }}>
            <label
              htmlFor="payment_method"
              style={labelStyle}
            >
              {t("paymentMethod", "Payment Method")}
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

          {/* DESCRIPTION */}
          <div style={{ marginBottom: "25px" }}>
            <label
              htmlFor="description"
              style={labelStyle}
            >
              {t("description", "Description")}
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
                fontFamily: "inherit",
              }}
            />

            <small
              style={{
                display: "block",
                marginTop: "6px",
                color: "#666",
                textAlign: "center",
                fontSize: "13px",
              }}
            >
              {t("transactionDetailsHelp")}
            </small>
          </div>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="button"
              type="submit"
              style={{
                width: "auto",
                minWidth: "145px",
              }}
            >
              💾 {t("update", "Update")}
            </button>

            <Link
              className="button"
              to="/finance"
              style={{
                width: "auto",
                minWidth: "100px",
              }}
            >
              {t("cancel", "Cancel")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditFinance;
