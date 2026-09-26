import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditEggSale() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [formData, setFormData] = useState({
    sale_date: "",
    customer: "",
    quantity: "",
    price_per_egg: "",
    payment_method: "Cash",
    notes: "",
  });


  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function openCalendar() {
    if (formData.sale_date) {
      const selectedDate = new Date(
        formData.sale_date + "T00:00:00"
      );

      setCalendarMonth(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1
        )
      );
    } else {
      const today = new Date();

      setCalendarMonth(
        new Date(today.getFullYear(), today.getMonth(), 1)
      );
    }

    setCalendarOpen(true);
  }

  function handleDateSelect(day) {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const value = `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    setFormData((prev) => ({
      ...prev,
      sale_date: value,
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
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const currentYear = new Date().getFullYear();

  const calendarYears = Array.from(
    { length: 101 },
    (_, index) => currentYear - index
  );

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);
  const today = new Date();

  useEffect(() => {
    loadSale();
  }, [id]);

  async function loadSale() {
    try {
      const response = await fetch(`${API_URL}/api/egg-sales/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load egg sale.");
      }

      const saleDate = data.sale_date
        ? data.sale_date.split("T")[0]
        : "";

      setFormData({
        sale_date: saleDate,
        customer: data.customer || "",
        quantity: data.quantity ?? "",
        price_per_egg: data.price_per_egg ?? "",
        payment_method: data.payment_method || "Cash",
        notes: data.notes || "",
      });
    } catch (error) {
      console.error("Failed to load egg sale:", error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      price_per_egg: Number(formData.price_per_egg),
    };

    try {
      const response = await fetch(`${API_URL}/api/egg-sales/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || t("failedSaveEggSale"));
        return;
      }

      alert(data.message || t("eggSaleSaved"));
      navigate("/egg-sales");
    } catch (error) {
      console.error("Failed to save egg sale:", error);
      alert(t("failedSaveEggSale"));
    }
  }

  const responsiveStyles = `
    .add-egg-sale-field {
      display: grid;
      grid-template-columns: 150px minmax(0, 260px);
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }

    .add-egg-sale-field label,
    .add-egg-sale-notes label {
      display: block !important;
      margin-bottom: 0 !important;
      font-weight: 600 !important;
      font-size: 15px !important;
      text-align: right !important;
      color: #222 !important;
      -webkit-text-fill-color: #222 !important;
    }

    .add-egg-sale-field input,
    .add-egg-sale-field select,
    .add-egg-sale-notes textarea {
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

    .add-egg-sale-notes {
      display: grid;
      grid-template-columns: 150px minmax(0, 260px);
      align-items: start;
      gap: 14px;
      margin-bottom: 20px;
    }

    .add-egg-sale-notes textarea {
      min-height: 100px !important;
      resize: vertical;
    }

    @media (max-width: 700px) {
      .add-egg-sale-field,
      .add-egg-sale-notes {
        grid-template-columns: 105px minmax(0, 1fr);
        gap: 10px;
      }
    }
  `;

  return (
    <div className="page">
      <style>{responsiveStyles}</style>
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 6px 0",
              color: "#222",
              WebkitTextFillColor: "#222",
            }}
          >
            🥚 {t("recordEggSale")}
          </h1>

          <p style={{ margin: 0 }}>
            {t("recordEggSaleDescription")}
          </p>
        </div>

        <Link
          className="button"
          to="/egg-sales"
          style={{
            textDecoration: "none",
            whiteSpace: "nowrap",
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
        <h2
          style={{
            textAlign: "center",
            marginTop: 0,
            marginBottom: "30px",
            color: "#222",
            WebkitTextFillColor: "#222",
          }}
        >
          🥚 {t("saleDetails")}
        </h2>

        <form onSubmit={handleSubmit} className="add-egg-sale-form">
          <div
            style={{
              display: "block",
            }}
          >
            <div className="add-egg-sale-field">
              <label
                htmlFor="sale_date"
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("saleDate")}
              </label>

              <div
                onClick={openCalendar}
                style={{
                  width: "100%",
                  minHeight: "44px",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  border: "1px solid #cfd6cf",
                  borderRadius: "7px",
                  background: "#fff",
                  color: formData.sale_date ? "#222" : "#777",
                  WebkitTextFillColor: formData.sale_date
                    ? "#222"
                    : "#777",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {formData.sale_date
                  ? new Date(
                      formData.sale_date + "T00:00:00"
                    ).toLocaleDateString("nl-NL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "DD-MM-JJJJ"}
              </div>
            </div>

            <div className="add-egg-sale-field">
              <label
                htmlFor="customer"
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("customer")}
              </label>

              <input
                id="customer"
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                placeholder={t("customerPlaceholder")}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div className="add-egg-sale-field">
              <label
                htmlFor="quantity"
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("quantity")}
              </label>

              <input
                id="quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                step="1"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div className="add-egg-sale-field">
              <label
                htmlFor="price_per_egg"
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("pricePerEgg")}
              </label>

              <input
                id="price_per_egg"
                type="number"
                name="price_per_egg"
                value={formData.price_per_egg}
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

            <div className="add-egg-sale-field">
              <label
                htmlFor="payment_method"
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {t("paymentMethod")}
              </label>

              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <option value="Cash">{t("cash")}</option>
                <option value="M-Pesa">M-Pesa</option>
                <option value="Bank">{t("bank")}</option>
              </select>
            </div>

            <div className="add-egg-sale-notes">
              <label
                htmlFor="notes"
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                  textAlign: "center",
                }}
              >
                {t("notes")}
              </label>

              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder={t("notesPlaceholder")}
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
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "28px",
            }}
          >
            <button type="submit" className="button">
              💾 {t("save")}
            </button>

            <Link
              to="/egg-sales"
              className="button"
              style={{
                textDecoration: "none",
              }}
            >
              {t("cancel")}
            </Link>
          </div>
      {/* CALENDAR */}
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
            {/* MONTH / YEAR SELECTORS */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "14px",
              }}
            >
              <select
                value={month}
                onChange={(e) =>
                  setCalendarMonth(
                    new Date(year, Number(e.target.value), 1)
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
                {monthKeys.map((key, index) => (
                  <option key={key} value={index}>
                    {t(key)}
                  </option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) =>
                  setCalendarMonth(
                    new Date(Number(e.target.value), month, 1)
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
                {calendarYears.map((calendarYear) => (
                  <option key={calendarYear} value={calendarYear}>
                    {calendarYear}
                  </option>
                ))}
              </select>
            </div>

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
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#666",
                    padding: "4px 0",
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
                const isToday =
                  day === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear();

                const selectedDate = formData.sale_date
                  ? new Date(
                      formData.sale_date + "T00:00:00"
                    )
                  : null;

                const isSelected =
                  selectedDate &&
                  day === selectedDate.getDate() &&
                  month === selectedDate.getMonth() &&
                  year === selectedDate.getFullYear();

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    style={{
                      width: "40px",
                      height: "40px",
                      minHeight: "40px",
                      padding: 0,
                      border:
                        isSelected || isToday
                          ? "2px solid #2e7d32"
                          : "1px solid #ddd",
                      borderRadius: "50%",
                      background: isSelected
                        ? "#2e7d32"
                        : isToday
                        ? "#e8f5e9"
                        : "#fff",
                      color: isSelected ? "#fff" : "#222",
                      WebkitTextFillColor: isSelected ? "#fff" : "#222",
                      fontSize: "15px",
                      fontWeight:
                        isSelected || isToday ? "700" : "500",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      justifySelf: "center",
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
              onClick={() => setCalendarOpen(false)}
              style={{
                width: "100%",
                marginTop: "16px",
                height: "40px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: "#fff",
                color: "#333",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}

        </form>
      </div>
    </div>
  );
}

export default EditEggSale;
