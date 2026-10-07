import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditInventory() {
  const { t } = useLanguage();
  const { id } = useParams();
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
    loadItem();
  }, []);

  async function loadItem() {
    try {
      const response = await fetch(
        `${API_URL}/api/inventory/${id}`
      );

      const data = await response.json();

      setFormData({
        item_name: data.item_name || "",
        category: data.category || "Feed",
        quantity: data.quantity || "",
        unit: data.unit || "kg",
        minimum_stock: data.minimum_stock || "",
        purchase_price: data.purchase_price || "",
        supplier: data.supplier || "",
        purchase_date: data.purchase_date
          ? data.purchase_date.split("T")[0]
          : "",
        notes: data.notes || "",
      });
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    const month = String(calendarMonth.getMonth() + 1).padStart(2, "0");
    const selectedDay = String(day).padStart(2, "0");

    setFormData((previous) => ({
      ...previous,
      purchase_date: `${year}-${month}-${selectedDay}`,
    }));

    setCalendarOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await fetch(
        `${API_URL}/api/inventory/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      alert(t("inventoryUpdatedSuccessfully"));

      navigate("/inventory");
    } catch (error) {
      console.error(error);
      alert(t("failedToUpdateInventory"));
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

  const fieldStyle = {
    display: "grid",
    gridTemplateColumns: "150px minmax(0, 1fr)",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px",
  };

  return (
    <div className="page">
      <style>{`
        .edit-inventory-form {
          width: 100%;
        }

        .edit-inventory-field {
          display: grid;
          grid-template-columns: 150px minmax(0, 1fr);
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .edit-inventory-field textarea {
          resize: vertical;
        }

        .edit-inventory-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 8px;
        }

        .edit-inventory-actions .button {
          min-height: 44px;
          padding: 10px 18px;
          border-radius: 8px;
          text-decoration: none;
          box-sizing: border-box;
        }

        @media (max-width: 700px) {
          .edit-inventory-field {
            grid-template-columns: 1fr;
            gap: 6px;
          }

          .edit-inventory-field label {
            text-align: left !important;
          }

          .edit-inventory-actions {
            flex-direction: column;
          }

          .edit-inventory-actions .button {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      <div className="page-header">
        <h1>✏️ {t("editInventoryItem")}</h1>
      </div>

      <div className="card">
        <form
          onSubmit={handleSubmit}
          className="edit-inventory-form"
        >
          <div className="edit-inventory-field">
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

          <div className="edit-inventory-field">
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

          <div className="edit-inventory-field">
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

          <div className="edit-inventory-field">
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

          <div className="edit-inventory-field">
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

          <div className="edit-inventory-field">
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

          <div className="edit-inventory-field">
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

          <div className="edit-inventory-field">
            <label htmlFor="purchase_date" style={labelStyle}>
              {t("purchaseDate")}
            </label>

            <div style={{ position: "relative", width: "100%" }}>
              <button
                id="purchase_date"
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (formData.purchase_date) {
                    const selected = new Date(
                      formData.purchase_date + "T00:00:00"
                    );

                    setCalendarMonth(
                      new Date(
                        selected.getFullYear(),
                        selected.getMonth(),
                        1
                      )
                    );
                  } else {
                    const today = new Date();

                    setCalendarMonth(
                      new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        1
                      )
                    );
                  }

                  setCalendarOpen(true);
                }}
                style={{
                  ...inputStyle,
                  width: "100%",
                  textAlign: "left",
                  color: formData.purchase_date ? "#222" : "#777",
                  WebkitTextFillColor: formData.purchase_date
                    ? "#222"
                    : "#777",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                {formData.purchase_date
                  ? new Date(
                      formData.purchase_date + "T00:00:00"
                    ).toLocaleDateString("nl-NL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "DD-MM-JJJJ"}
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
                      width: "min(92vw, 420px)",
                      background: "#fff",
                      borderRadius: "14px",
                      padding: "18px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
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
                        marginBottom: "8px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => changeCalendarMonth(-1)}
                        style={{
                          width: "38px",
                          height: "38px",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          background: "#fff",
                          cursor: "pointer",
                          fontSize: "22px",
                        }}
                      >
                        ‹
                      </button>

                      <strong>
                        {monthNames[calendarMonth.getMonth()]}{" "}
                        {calendarMonth.getFullYear()}
                      </strong>

                      <button
                        type="button"
                        onClick={() => changeCalendarMonth(1)}
                        style={{
                          width: "38px",
                          height: "38px",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          background: "#fff",
                          cursor: "pointer",
                          fontSize: "22px",
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
                        gap: "8px",
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
                          `${String(
                            calendarMonth.getMonth() + 1
                          ).padStart(2, "0")}-` +
                          `${String(day).padStart(2, "0")}`;

                        const selected =
                          formData.purchase_date &&
                          formData.purchase_date.split("T")[0] ===
                            dateValue;

                        const today = new Date();

                        const isToday =
                          day === today.getDate() &&
                          calendarMonth.getMonth() === today.getMonth() &&
                          calendarMonth.getFullYear() ===
                            today.getFullYear();

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDateSelect(day)}
                            style={{
                              height: "44px",
                              minWidth: "44px",
                              border: isToday
                                ? "2px solid #1565c0"
                                : selected
                                ? "2px solid #1b5e20"
                                : "1px solid #ddd",
                              borderRadius: "50%",
                              background: isToday
                                ? "#1976d2"
                                : selected
                                ? "#2e7d32"
                                : "#fff",
                              color:
                                selected || isToday
                                  ? "#fff"
                                  : "#222",
                              fontWeight:
                                selected || isToday ? 800 : 400,
                              cursor: "pointer",
                              fontSize: "15px",
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
                      }}
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="edit-inventory-field">
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
              }}
            />
          </div>

          <div className="edit-inventory-actions">
            <button
              className="button"
              type="submit"
            >
              💾 {t("updateItem")}
            </button>

            <Link
              className="button"
              to="/inventory"
            >
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditInventory;
