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

  const weekdays = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];

  function formatDateDisplay(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}-${month}-${year}`;
  }

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

            <div className="kidding-edit-calendar-wrap">
              <div style={{ position: "relative", width: "100%" }}>
                <div
                  style={{
                    width: "100%", boxSizing: "border-box", padding: "10px 12px", minHeight: "44px", border: "1px solid #cfd6cf", borderRadius: "7px", background: "#fff",
                    width: "100%",
                    color: formData.kidding_date ? "#222" : "#777",
                    pointerEvents: "none",
                  }}
                >
                  {formData.kidding_date
                    ? new Date(formData.kidding_date + "T00:00:00").toLocaleDateString("nl-NL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "DD-MM-JJJJ"}
                </div>

                <input
                  type="date"
                  name="kidding_date"
                  value={formData.kidding_date || ""}
                  onChange={handleChange}
                  onClick={(e) => e.currentTarget.showPicker?.()}
                  onFocus={(e) => e.currentTarget.showPicker?.()}
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
                <div className="kidding-edit-calendar">
                  <div className="kidding-edit-calendar-header">
                    <button
                      type="button"
                      onClick={() => changeCalendarMonth(-1)}
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
                    >
                      ›
                    </button>
                  </div>

                  <div className="kidding-edit-calendar-weekdays">
                    {weekdays.map((day) => (
                      <div key={day}>{day}</div>
                    ))}
                  </div>

                  <div className="kidding-edit-calendar-grid">
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

                      const selected =
                        formData.kidding_date ===
                        `${calendarMonth.getFullYear()}-${String(
                          calendarMonth.getMonth() + 1
                        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                      const now = new Date();

                      const today =
                        now.getFullYear() === calendarMonth.getFullYear() &&
                        now.getMonth() === calendarMonth.getMonth() &&
                        now.getDate() === day;

                      return (
                        <button
                          key={day}
                          type="button"
                          className={
                            selected
                              ? "kidding-edit-calendar-day selected"
                              : today
                              ? "kidding-edit-calendar-day today"
                              : "kidding-edit-calendar-day"
                          }
                          onClick={() => selectCalendarDate(day)}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className="kidding-edit-calendar-cancel"
                    onClick={() => setCalendarOpen(false)}
                  >
                    Annuleren
                  </button>
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
