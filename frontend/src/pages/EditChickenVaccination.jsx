import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditChickenVaccination() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();

  const [chickens, setChickens] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    chicken_id: "",
    vaccination_date: "",
    vaccine_name: "",
    dosage: "",
    next_due_date: "",
    administered_by: "",
    notes: "",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarField, setCalendarField] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const [vaccinationResponse, chickensResponse] = await Promise.all([
        fetch(`${API_URL}/api/chicken-vaccinations/${id}`),
        fetch(`${API_URL}/api/chickens`),
      ]);

      const vaccination = await vaccinationResponse.json();
      const chickenData = await chickensResponse.json();

      if (!vaccinationResponse.ok) {
        alert(vaccination.message || "Vaccination record not found.");
        navigate("/chicken-vaccinations");
        return;
      }

      setChickens(
        chickenData.filter(
          (c) =>
            c.status === "Active" &&
            Number(c.quantity) > 0
        )
      );

      setFormData({
        chicken_id: vaccination.chicken_id || "",
        vaccination_date: vaccination.vaccination_date
          ? String(vaccination.vaccination_date).split("T")[0]
          : "",
        vaccine_name: vaccination.vaccine_name || "",
        dosage: vaccination.dosage || "",
        next_due_date: vaccination.next_due_date
          ? String(vaccination.next_due_date).split("T")[0]
          : "",
        administered_by: vaccination.administered_by || "",
        notes: vaccination.notes || "",
      });
    } catch (err) {
      console.error(err);
      alert(t("failedSaveVaccination"));
      navigate("/chicken-vaccinations");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  function openCalendar(field) {
    const currentValue = formData[field];

    const baseDate = currentValue
      ? new Date(currentValue + "T00:00:00")
      : new Date();

    setCalendarField(field);

    setCalendarMonth(
      new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        1
      )
    );

    setCalendarOpen(true);
  }

  function goPreviousMonth() {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() - 1,
        1
      )
    );
  }

  function goNextMonth() {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + 1,
        1
      )
    );
  }

  function handleDateSelect(day) {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const value =
      year +
      "-" +
      String(month + 1).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0");

    setFormData((prev) => ({
      ...prev,
      [calendarField]: value,
    }));

    setCalendarOpen(false);
    setCalendarField("");
  }

  function formatDate(value) {
    if (!value) return "";

    const parts = value.split("-");

    if (parts.length !== 3) return value;

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
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
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
  ];

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const today = new Date();
  const todayValue =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const selectedValue = calendarField
    ? formData[calendarField]
    : "";

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/chicken-vaccinations/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            chicken_id: Number(formData.chicken_id),
          }),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/chicken-vaccinations");
      }
    } catch (err) {
      console.error(err);
      alert(t("failedSaveVaccination"));
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
    color: "#222",
    WebkitTextFillColor: "#222",
  };

  const inputStyle = {
    width: "100%",
    minWidth: 0,
    height: "44px",
    padding: "9px 12px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    color: "#222",
    WebkitTextFillColor: "#222",
    boxSizing: "border-box",
    fontSize: "15px",
  };

  const textareaStyle = {
    width: "100%",
    minWidth: 0,
    padding: "10px 12px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    color: "#222",
    WebkitTextFillColor: "#222",
    boxSizing: "border-box",
    fontSize: "15px",
    resize: "vertical",
    minHeight: "120px",
  };

  if (loading) {
    return (
      <div
        className="page"
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <h1>💉 {t("edit") || "Edit"} {t("vaccination") || "Vaccination"}</h1>
      </div>
    );
  }

  return (
    <div
      className="page"
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(30px, 4vw, 44px)",
              lineHeight: 1.15,
              color: "#222",
              WebkitTextFillColor: "#222",
            }}
          >
            💉 {t("edit") || "Edit"} {t("recordChickenVaccination") || "Vaccination"}
          </h1>
        </div>

        <Link
          className="button"
          to="/chicken-vaccinations"
          style={{
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
          maxWidth: "900px",
          margin: "0 auto",
          padding: "clamp(18px, 3vw, 32px)",
          boxSizing: "border-box",
        }}
      >
        <form onSubmit={handleSubmit}>
          <section>
            <h2
              style={{
                margin: "0 0 20px",
                fontSize: "22px",
                lineHeight: 1.3,
                color: "#222",
                WebkitTextFillColor: "#222",
              }}
            >
              💉 {t("recordChickenVaccination")}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
                gap: "20px",
                width: "100%",
              }}
            >
              <div style={fieldStyle}>
                <label style={labelStyle}>{t("chicken")}</label>

                <select
                  name="chicken_id"
                  value={formData.chicken_id}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">
                    {t("selectChicken")}
                  </option>

                  {chickens.map((chicken) => (
                    <option key={chicken.id} value={chicken.id}>
                      {chicken.tag_number} - {chicken.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("vaccinationDate")}
                </label>

                <div
                  onClick={() => openCalendar("vaccination_date")}
                  style={{
                    ...inputStyle,
                    width: "100%",
                    cursor: "pointer",
                    color: formData.vaccination_date
                      ? "#222"
                      : "#777",
                  }}
                >
                  {formData.vaccination_date
                    ? formatDate(formData.vaccination_date)
                    : "DD-MM-JJJJ"}
                </div>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("vaccineName")}
                </label>

                <input
                  type="text"
                  name="vaccine_name"
                  value={formData.vaccine_name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("dosage")}
                </label>

                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("nextDueDate")}
                </label>

                <div
                  onClick={() => openCalendar("next_due_date")}
                  style={{
                    ...inputStyle,
                    width: "100%",
                    cursor: "pointer",
                    color: formData.next_due_date
                      ? "#222"
                      : "#777",
                  }}
                >
                  {formData.next_due_date
                    ? formatDate(formData.next_due_date)
                    : "DD-MM-JJJJ"}
                </div>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("administeredBy")}
                </label>

                <input
                  type="text"
                  name="administered_by"
                  value={formData.administered_by}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  ...fieldStyle,
                  gridColumn: "1 / -1",
                }}
              >
                <label style={labelStyle}>
                  {t("notes")}
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  style={textareaStyle}
                />
              </div>
            </div>
          </section>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "14px",
              marginTop: "28px",
              flexWrap: "wrap",
            }}
          >
            <button type="submit" className="button">
              💾 {t("save")}
            </button>

            <Link
              to="/chicken-vaccinations"
              className="button"
            >
              ✕ {t("cancel")}
            </Link>
          </div>
        </form>
      </div>

      {calendarOpen && (
        <div
          onClick={() => {
            setCalendarOpen(false);
            setCalendarField("");
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(360px, calc(100vw - 30px))",
              background: "#fff",
              borderRadius: "14px",
              padding: "20px",
              boxSizing: "border-box",
              boxShadow: "0 10px 35px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "18px",
              }}
            >
              <button
                type="button"
                className="button"
                onClick={goPreviousMonth}
              >
                ‹
              </button>

              <strong style={{ fontSize: "18px" }}>
                {t(monthKeys[month])} {year}
              </strong>

              <button
                type="button"
                className="button"
                onClick={goNextMonth}
              >
                ›
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "5px",
                textAlign: "center",
              }}
            >
              {weekdayKeys.map((key) => (
                <div
                  key={key}
                  style={{
                    fontWeight: 700,
                    fontSize: "13px",
                    padding: "6px 0",
                  }}
                >
                  {t(key)}
                </div>
              ))}

              {Array.from({ length: firstDay }).map((_, index) => (
                <div key={`empty-${index}`} />
              ))}

              {Array.from(
                { length: daysInMonth },
                (_, index) => index + 1
              ).map((day) => {
                const value =
                  year +
                  "-" +
                  String(month + 1).padStart(2, "0") +
                  "-" +
                  String(day).padStart(2, "0");

                const isSelected = value === selectedValue;
                const isToday = value === todayValue;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    style={{
                      height: "38px",
                      borderRadius: "8px",
                      border: isSelected
                        ? "2px solid #2e7d32"
                        : "1px solid #ddd",
                      background: isToday
                        ? "#e8f5e9"
                        : "#fff",
                      color: "#222",
                      fontWeight:
                        isSelected || isToday ? 700 : 400,
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
              className="button"
              onClick={() => {
                setCalendarOpen(false);
                setCalendarField("");
              }}
              style={{
                width: "100%",
                marginTop: "18px",
              }}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditChickenVaccination;
