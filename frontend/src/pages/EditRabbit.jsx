import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditRabbit() {
  const { t } = useLanguage();
  const { id } = useParams();
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

  useEffect(() => {
    loadRabbit();
  }, []);

  async function loadRabbit() {
    try {
      const response = await fetch(
        `${API_URL}/api/rabbits/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      setFormData({
        tag_number: data.tag_number || "",
        name: data.name || "",
        breed: data.breed || "",
        sex: data.sex || "Female",
        birth_date: data.birth_date
          ? data.birth_date.split("T")[0]
          : "",
        source: data.source || "",
        quantity: data.quantity || 1,
        status: data.status || "Active",
        purchase_price: data.purchase_price || "",
        notes: data.notes || "",
      });

    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

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

  const calendarYears = Array.from(
    { length: 101 },
    (_, index) => new Date().getFullYear() - 100 + index
  );

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
      birth_date: `${year}-${month}-${date}`,
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

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...formData,
      birth_date: formData.birth_date || null,
      quantity: Number(formData.quantity),
      purchase_price:
        formData.purchase_price === ""
          ? 0
          : Number(formData.purchase_price),
    };

    try {
      const response = await fetch(
        `${API_URL}/api/rabbits/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      alert(t("failedToUpdateRabbit"));
    }
  }

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    minWidth: 0,
  };

  const labelStyle = {
    display: "block",
    fontWeight: 600,
    fontSize: "15px",
    lineHeight: 1.3,
    margin: 0,
  };

  const inputStyle = {
    width: "100%",
    minWidth: 0,
    height: "44px",
    padding: "9px 12px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    boxSizing: "border-box",
    fontSize: "15px",
  };

  const textareaStyle = {
    width: "100%",
    minWidth: 0,
    minHeight: "120px",
    padding: "10px 12px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    boxSizing: "border-box",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "inherit",
  };

  return (
    <div className="page">
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <h1 style={{ margin: 0, lineHeight: 1.15 }}>
          🐇 {t("editRabbit")}
        </h1>
      </div>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "clamp(20px, 4vw, 32px)",
          boxSizing: "border-box",
          borderRadius: "14px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div
            className="rabbit-edit-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "20px 24px",
              width: "100%",
              alignItems: "start",
            }}
          >
            <div style={fieldStyle}>
              <label style={labelStyle}>{t("tagNumber")}</label>
              <input
                type="text"
                name="tag_number"
                value={formData.tag_number}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("name")}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("breed")}</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("sex")}</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Female">{t("female")}</option>
                <option value="Male">{t("male")}</option>
              </select>
            </div>

            <div
              className="add-rabbit-field"
              style={{ ...fieldStyle, position: "relative" }}
            >
              <label className="add-rabbit-label" style={labelStyle}>
                {t("birthDate")}
              </label>

              <div style={{ position: "relative" }}>
                <div style={{ position: "relative", width: "100%" }}>
                  <div
                    style={{
                      width: "100%",
                      minWidth: 0,
                      boxSizing: "border-box",
                      minHeight: "44px",
                      padding: "10px 12px",
                      border: "1px solid #cfd6cf",
                      borderRadius: "7px",
                      background: "#fff",
                      color: formData.birth_date ? "#222" : "#777",
                      WebkitTextFillColor: formData.birth_date ? "#222" : "#777",
                      display: "flex",
                      alignItems: "center",
                      pointerEvents: "none",
                    }}
                  >
                    {formData.birth_date
                      ? new Date(formData.birth_date + "T00:00:00").toLocaleDateString("nl-NL", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "DD-MM-JJJJ"}
                  </div>

                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date || ""}
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
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 9999,
                      width: "min(92vw, 320px)",
                      padding: "14px",
                      background: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "12px",
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
                          flex: 1,
                          height: "38px",
                          border: "1px solid #cfd6cf",
                          borderRadius: "8px",
                          background: "#fff",
                          color: "#222",
                          padding: "0 8px",
                          fontSize: "14px",
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
                          width: "100px",
                          height: "38px",
                          border: "1px solid #cfd6cf",
                          borderRadius: "8px",
                          background: "#fff",
                          color: "#222",
                          padding: "0 8px",
                          fontSize: "14px",
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
                          formData.birth_date === dateValue;

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
                )}
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("source")}</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("quantity")}</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("status")}</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Active">{t("active")}</option>
                <option value="Sold">{t("sold")}</option>
                <option value="Dead">{t("dead")}</option>
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("purchasePrice")}</label>
              <input
                type="number"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: "22px" }}>
            <label style={labelStyle}>{t("notes")}</label>
            <textarea
              name="notes"
              rows="5"
              value={formData.notes}
              onChange={handleChange}
              style={{
                ...textareaStyle,
                marginTop: "7px",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "25px",
            }}
          >
            <button className="button" type="submit">
              💾 {t("update")}
            </button>

            <Link className="button" to="/rabbits">
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );

}

export default EditRabbit;
