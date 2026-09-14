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

  return (
    <div className="page">

      <div className="page-header">
        <h1>🐇 {t("editRabbit")}</h1>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit}>

          <label>{t("tagNumber")}</label>
          <input
            type="text"
            name="tag_number"
            value={formData.tag_number}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>{t("name")}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("breed")}</label>
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>{t("sex")}</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
          >
            <option value="Female">{t("female")}</option>
            <option value="Male">{t("male")}</option>
          </select>

          <br /><br />

          <label>{t("birthDate")}</label>
          <input
            type="text"
            name="birth_date"
            value={formatDisplayDate(formData.birth_date)}
            placeholder="DD-MM-JJJJ"
            readOnly
            onClick={() => {
              setCalendarMonth(
                formData.birth_date
                  ? new Date(formData.birth_date + "T00:00:00")
                  : new Date()
              );
              setCalendarOpen(true);
            }}
            style={{
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
              cursor: "pointer",
            }}
          />

          {calendarOpen && (
            <div
              style={{
                position: "fixed",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "min(92vw, 320px)",
                maxHeight: "90vh",
                overflowY: "auto",
                zIndex: 9999,
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "10px",
                boxShadow: "0 8px 30px rgba(0,0,0,.25)",
                padding: "14px",
                boxSizing: "border-box",
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
                  onClick={() => changeCalendarMonth(-1)}
                >
                  ‹
                </button>

                <strong style={{ color: "#222" }}>
                  {calendarMonth.toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </strong>

                <button
                  type="button"
                  onClick={() => changeCalendarMonth(1)}
                >
                  ›
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "4px",
                }}
              >
                {["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"].map((day) => (
                  <div
                    key={day}
                    style={{
                      textAlign: "center",
                      fontWeight: 600,
                      fontSize: "12px",
                      color: "#666",
                      padding: "4px 0",
                    }}
                  >
                    {day}
                  </div>
                ))}

                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} />;
                  }

                  const selected =
                    formData.birth_date ===
                    `${calendarMonth.getFullYear()}-${String(
                      calendarMonth.getMonth() + 1
                    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

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
                        padding: "8px 0",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        background:
                          selected || isToday ? "#1976d2" : "#f5f5f5",
                        color: selected || isToday ? "#fff" : "#222",
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
                  marginTop: "12px",
                  padding: "9px",
                  border: "1px solid #ccc",
                  borderRadius: "7px",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                {t("cancel")}
              </button>
            </div>
          )}


          <br /><br />

          <label>{t("source")}</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("quantity")}</label>
          <input
            type="number"
            min="1"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>{t("status")}</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">{t("active")}</option>
            <option value="Sold">{t("sold")}</option>
            <option value="Dead">{t("dead")}</option>
          </select>

          <br /><br />

          <label>{t("purchasePriceKES")}</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="purchase_price"
            value={formData.purchase_price}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("notes")}</label>
          <textarea
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
          />

          <br /><br />

          <div style={{ display: "flex", gap: "10px" }}>
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
