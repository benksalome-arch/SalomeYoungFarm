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

            <button
              type="button"
              onClick={() => {
                if (formData.kidding_date) {
                  const selected = new Date(
                    formData.kidding_date + "T00:00:00"
                  );
                  setCalendarMonth(
                    new Date(
                      selected.getFullYear(),
                      selected.getMonth(),
                      1
                    )
                  );
                } else {
                  setCalendarMonth(new Date());
                }

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
                color: formData.kidding_date ? "#222" : "#777",
                fontSize: "15px",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              {formatDateDisplay(formData.kidding_date) || "DD-MM-JJJJ"}
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
                  background: "rgba(0,0,0,.35)",
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
                    boxShadow: "0 8px 30px rgba(0,0,0,.25)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
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
                        border: "1px solid #cfd6cf",
                        borderRadius: "8px",
                        background: "#fff",
                        fontSize: "22px",
                        cursor: "pointer",
                      }}
                    >
                      ‹
                    </button>

                    <strong
                      style={{
                        flex: 1,
                        textAlign: "center",
                        color: "#222",
                        fontSize: "17px",
                      }}
                    >
                      {monthNames[calendarMonth.getMonth()]}{" "}
                      {calendarMonth.getFullYear()}
                    </strong>

                    <button
                      type="button"
                      onClick={() => changeCalendarMonth(1)}
                      style={{
                        width: "38px",
                        height: "38px",
                        border: "1px solid #cfd6cf",
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
                    }}
                  >
                    {weekdays.map((day) => (
                      <div
                        key={day}
                        style={{
                          textAlign: "center",
                          fontWeight: "600",
                          fontSize: "13px",
                          padding: "6px 0",
                          color: "#222",
                        }}
                      >
                        {day}
                      </div>
                    ))}

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
                        `${calendarMonth.getFullYear()}-${String(
                          calendarMonth.getMonth() + 1
                        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                      const selected =
                        formData.kidding_date === dateValue;

                      const now = new Date();

                      const today =
                        now.getFullYear() === calendarMonth.getFullYear() &&
                        now.getMonth() === calendarMonth.getMonth() &&
                        now.getDate() === day;

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => selectCalendarDate(day)}
                          style={{
                            width: "40px",
                            height: "40px",
                            minWidth: "40px",
                            minHeight: "40px",
                            justifySelf: "center",
                            border: selected
                              ? "2px solid #1b5e20"
                              : today
                              ? "2px solid #4caf50"
                              : "1px solid transparent",
                            borderRadius: "50%",
                            background: selected
                              ? "#2e7d32"
                              : today
                              ? "#4caf50"
                              : "#fff",
                            color: selected || today ? "#fff" : "#222",
                            fontSize: "15px",
                            fontWeight: selected || today ? "700" : "500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: today
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
                      background: "#fff",
                      color: "#222",
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
