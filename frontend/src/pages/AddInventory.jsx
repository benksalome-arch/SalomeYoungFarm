import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddInventory() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    item_name: "",
    category: "Feed",
    quantity: "",
    unit: "kg",
    minimum_stock: "",
    purchase_price: "",
    supplier: "",
    purchase_date: "",
    notes: "",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

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
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }

  function goNextMonth() {
    setCalendarMonth(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
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
      purchase_date: value,
    }));

    setCalendarOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      alert(data.message);

      navigate("/inventory");
    } catch (error) {
      console.error(error);
      alert(t("failedToSaveInventory"));
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
    .inventory-field {
      display: grid;
      grid-template-columns: 150px minmax(0, 320px);
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }

    .inventory-field > label,
    .inventory-notes > label {
      margin: 0 !important;
      font-weight: 600 !important;
      font-size: 15px !important;
      text-align: right !important;
      color: #222 !important;
      -webkit-text-fill-color: #222 !important;
      overflow-wrap: anywhere;
      line-height: 1.25;
    }

    .inventory-field input,
    .inventory-field select,
    .inventory-notes textarea {
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

    .inventory-notes {
      display: grid;
      grid-template-columns: 150px minmax(0, 320px);
      align-items: start;
      gap: 14px;
      margin-bottom: 20px;
    }

    .inventory-notes textarea {
      min-height: 100px !important;
      resize: vertical;
    }

    @media (max-width: 700px) {
      .inventory-field,
      .inventory-notes {
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
          📦 {t("addInventoryItem")}
        </h1>

        <p style={{ margin: 0 }}>
          {t("addInventoryDescription")}
        </p>

        <Link
          className="button"
          to="/inventory"
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
          <div className="inventory-field">
            <label htmlFor="item_name" style={labelStyle}>
              {t("itemName")}
            </label>
            <input
              id="item_name"
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div className="inventory-field">
            <label htmlFor="category" style={labelStyle}>
              {t("category")}
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Feed">{t("feed")}</option>
              <option value="Medicine">{t("medicine")}</option>
              <option value="Vaccine">{t("vaccine")}</option>
              <option value="Equipment">{t("equipment")}</option>
              <option value="Fuel">{t("fuel")}</option>
              <option value="Building Material">
                {t("buildingMaterial")}
              </option>
              <option value="Other">{t("other")}</option>
            </select>
          </div>

          <div className="inventory-field">
            <label htmlFor="quantity" style={labelStyle}>
              {t("quantity")}
            </label>
            <input
              id="quantity"
              type="number"
              step="0.01"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div className="inventory-field">
            <label htmlFor="unit" style={labelStyle}>
              {t("unit")}
            </label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="kg">{t("kg")}</option>
              <option value="bags">{t("bags")}</option>
              <option value="litres">{t("litres")}</option>
              <option value="pieces">{t("pieces")}</option>
              <option value="bottles">{t("bottles")}</option>
              <option value="packets">{t("packets")}</option>
            </select>
          </div>

          <div className="inventory-field">
            <label htmlFor="minimum_stock" style={labelStyle}>
              {t("minimumStock")}
            </label>
            <input
              id="minimum_stock"
              type="number"
              step="0.01"
              name="minimum_stock"
              value={formData.minimum_stock}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div className="inventory-field">
            <label htmlFor="purchase_price" style={labelStyle}>
              {t("purchasePriceKES")}
            </label>
            <input
              id="purchase_price"
              type="number"
              step="0.01"
              name="purchase_price"
              value={formData.purchase_price}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div className="inventory-field">
            <label htmlFor="supplier" style={labelStyle}>
              {t("supplier")}
            </label>
            <input
              id="supplier"
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div className="inventory-field">
            <label htmlFor="purchase_date" style={labelStyle}>
              {t("purchaseDate")}
            </label>

            <div style={{ position: "relative" }}>
              <input
                id="purchase_date"
                type="text"
                value={
                  formData.purchase_date
                    ? formData.purchase_date
                        .split("-")
                        .reverse()
                        .join("-")
                    : ""
                }
                placeholder="DD-MM-JJJJ"
                readOnly
                onClick={() => {
                  const selected = formData.purchase_date
                    ? new Date(formData.purchase_date + "T00:00:00")
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
                          calendarMonth.getMonth() === today.getMonth() &&
                          calendarMonth.getFullYear() ===
                            today.getFullYear();

                        const selectedDate = formData.purchase_date
                          ? new Date(
                              formData.purchase_date + "T00:00:00"
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

          <div className="inventory-notes">
            <label htmlFor="notes" style={labelStyle}>
              {t("notes")}
            </label>

            <textarea
              id="notes"
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
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
              💾 {t("save")} {t("item")}
            </button>

            <Link
              className="button"
              to="/inventory"
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

export default AddInventory;
