import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditKidding() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    breeding_id: "",
    kidding_date: "",
    male_kids: 0,
    female_kids: 0,
    stillborn: 0,
    notes: "",
  });

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const monthNames = [
    "Januari", "Februari", "Maart", "April", "Mei", "Juni",
    "Juli", "Augustus", "September", "Oktober", "November", "December"
  ];

  const weekDays = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];

  const currentYear = new Date().getFullYear();
  const calendarYears = Array.from(
    { length: 101 },
    (_, index) => currentYear - index
  );

  function selectCalendarDate(day) {
    const year = calendarMonth.getFullYear();
    const month = String(calendarMonth.getMonth() + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");

    setFormData((prev) => ({
      ...prev,
      kidding_date: `${year}-${month}-${date}`,
    }));

    setCalendarOpen(false);
  }

  function changeCalendarMonth(amount) {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + amount,
        1
      )
    );
  }

  useEffect(() => {
    loadRecord();
  }, [id]);

  async function loadRecord() {
    try {
      const response = await fetch(`${API_URL}/api/kidding`);
      const data = await response.json();

      const found = data.find((item) => String(item.id) === String(id));

      if (!found) {
        alert("Kidding record not found.");
        navigate("/kidding");
        return;
      }

      setRecord(found);

      setFormData({
        breeding_id: found.breeding_id || "",
        kidding_date: found.kidding_date
          ? String(found.kidding_date).substring(0, 10)
          : "",
        male_kids: found.male_kids ?? 0,
        female_kids: found.female_kids ?? 0,
        stillborn: found.stillborn ?? 0,
        notes: found.notes || "",
      });
    } catch (error) {
      console.error(error);
      alert("Could not load record.");
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

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/kidding/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          male_kids: Number(formData.male_kids) || 0,
          female_kids: Number(formData.female_kids) || 0,
          stillborn: Number(formData.stillborn) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Update failed.");
        return;
      }

      alert("Geboorteregistratie succesvol bijgewerkt.");
      navigate("/kidding");
    } catch (error) {
      console.error(error);
      alert("Update failed.");
    }
  }

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>🍼 {t("edit")} {t("kiddingRecords")}</h1>
      </div>

      <div className="card kidding-edit-card">
        <form onSubmit={handleSubmit} className="kidding-edit-form">

          <div className="kidding-edit-field">
            <label>{t("doe")}</label>
            <input
              value={record?.doe_name || "-"}
              readOnly
            />
          </div>

          <div className="kidding-edit-field">
            <label>{t("buck")}</label>
            <input
              value={record?.buck_name || "-"}
              readOnly
            />
          </div>

          <div className="kidding-edit-field kidding-edit-date-field">
            <label>{t("date")}</label>

            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="text"
                value={
                  formData.kidding_date
                    ? formData.kidding_date.split("-").reverse().join("-")
                    : ""
                }
                placeholder="DD-MM-JJJJ"
                readOnly
                onClick={() => {
                  const selected = formData.kidding_date
                    ? new Date(formData.kidding_date + "T00:00:00")
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
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  minHeight: "44px",
                  border: "1px solid #cfd6cf",
                  borderRadius: "7px",
                  background: "#fff",
                  color: "#222",
                  cursor: "pointer",
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
                      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "14px",
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
                          fontSize: "22px",
                          cursor: "pointer",
                        }}
                      >
                        ‹
                      </button>

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
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          background: "#fff",
                          padding: "0 8px",
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
                          width: "92px",
                          height: "38px",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          background: "#fff",
                          padding: "0 8px",
                        }}
                      >
                        {calendarYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => changeCalendarMonth(1)}
                        style={{
                          width: "38px",
                          height: "38px",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          background: "#fff",
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
                        gap: "6px",
                        marginBottom: "6px",
                      }}
                    >
                      {weekDays.map((day) => (
                        <div
                          key={day}
                          style={{
                            textAlign: "center",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#666",
                            padding: "4px 0",
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
                        gap: "6px",
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
                        const selectedDate =
                          `${calendarMonth.getFullYear()}-${String(
                            calendarMonth.getMonth() + 1
                          ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                        const today = new Date();
                        const isSelected =
                          formData.kidding_date === selectedDate;

                        const isToday =
                          today.getFullYear() ===
                            calendarMonth.getFullYear() &&
                          today.getMonth() === calendarMonth.getMonth() &&
                          today.getDate() === day;

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              setFormData((previous) => ({
                                ...previous,
                                kidding_date: selectedDate,
                              }));
                              setCalendarOpen(false);
                            }}
                            style={{
                              width: "38px",
                              height: "38px",
                              justifySelf: "center",
                              borderRadius: "50%",
                              border: isSelected
                                ? "2px solid #1b5e20"
                                : "1px solid transparent",
                              background: isSelected || isToday
                                ? "#4caf50"
                                : "#fff",
                              color:
                                isSelected || isToday
                                  ? "#fff"
                                  : "#222",
                              fontWeight:
                                isSelected || isToday ? "600" : "400",
                              cursor: "pointer",
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
                        marginTop: "14px",
                        padding: "10px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#2e7d32",
                        color: "#fff",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Annuleren
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="kidding-edit-field">
            <label>{t("male")}</label>
            <input
              type="number"
              name="male_kids"
              min="0"
              value={formData.male_kids}
              onChange={handleChange}
              style={{
                width: "100%",
                boxSizing: "border-box",
                cursor: "text",
                pointerEvents: "auto",
              }}
            />
          </div>

          <div className="kidding-edit-field">
            <label>{t("female")}</label>
            <input
              type="number"
              name="female_kids"
              min="0"
              value={formData.female_kids}
              onChange={handleChange}
              style={{
                width: "100%",
                boxSizing: "border-box",
                cursor: "text",
                pointerEvents: "auto",
              }}
            />
          </div>

          <div className="kidding-edit-field">
            <label>{t("stillborn")}</label>
            <input
              type="number"
              name="stillborn"
              min="0"
              value={formData.stillborn}
              onChange={handleChange}
              style={{
                width: "100%",
                boxSizing: "border-box",
                cursor: "text",
                pointerEvents: "auto",
              }}
            />
          </div>

          <div className="kidding-edit-field kidding-edit-notes">
            <label>Notities</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="kidding-edit-actions">
            <button type="submit" className="button">
              💾 {t("save")}
            </button>

            <Link to="/kidding" className="button">
              {t("cancel")}
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditKidding;
