import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditChicken() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tag_number: "",
    name: "",
    breed: "",
    type: "Layer",
    sex: "Female",
    hatch_date: "",
    source: "",
    quantity: 1,
    status: "Active",
    purchase_price: "",
    notes: "",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  function openCalendar() {
    const value = formData.hatch_date?.split("T")[0];

    if (value) {
      const d = new Date(value + "T00:00:00");
      setCalendarMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    } else {
      const d = new Date();
      setCalendarMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }

    setCalendarOpen(true);
  }

  function selectCalendarDate(day) {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const value = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    setFormData((prev) => ({
      ...prev,
      hatch_date: value,
    }));

    setCalendarOpen(false);
  }

  function changeCalendarMonth(amount) {
    setCalendarMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + amount, 1)
    );
  }


  useEffect(() => {
    loadChicken();
  }, []);

  async function loadChicken() {
    try {
      const response = await fetch(
        `${API_URL}/api/chickens/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      setFormData(data);

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

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/chickens/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/chickens");
      }

    } catch (err) {
      console.error(err);
      alert(t("failedUpdateChicken"));
    }
  }

  return (
    <div className="page">

      <div className="page-header">
        <h1>🐔 {t("editChicken")}</h1>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit} className="chicken-edit-form">

          <label>{t("tagNumber")}</label>
          <input
            type="text"
            name="tag_number"
            value={formData.tag_number || ""}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("name")}</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("breed")}</label>
          <input
            type="text"
            name="breed"
            value={formData.breed || ""}
            onChange={handleChange}

          />

          <br /><br />

          <label>{t("type")}</label>
          <select
            name="type"
            value={formData.type || "Layer"}
            onChange={handleChange}
          >
            <option value="Layer">{t("layer")}</option>
            <option value="Broiler">{t("broiler")}</option>
            <option value="Cockerel">{t("cockerel")}</option>
            <option value="Cock">{t("cock")}</option>
            <option value="Hen">{t("hen")}</option>
            <option value="Chick">{t("chick")}</option>
          </select>

          <br /><br />

          <label>{t("sex")}</label>
          <select
            name="sex"
            value={formData.sex || "Female"}
            onChange={handleChange}
          >
            <option>{t("female")}</option>
            <option>{t("male")}</option>
          </select>

          <br /><br />

          <label>{t("hatchDate")}</label>
          <div
            onClick={openCalendar}
            style={{
              width: "100%",
              minHeight: "42px",
              padding: "10px 12px",
              boxSizing: "border-box",
              border: "1px solid #ccc",
              borderRadius: "6px",
              background: "#fff",
              color: formData.hatch_date ? "#222" : "#777",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            {formData.hatch_date
              ? new Date(
                  formData.hatch_date.split("T")[0] + "T00:00:00"
                ).toLocaleDateString("nl-NL", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "DD-MM-JJJJ"}
          </div>

          <br /><br />

          <label>{t("source")}</label>
          <input
            type="text"
            name="source"
            value={formData.source || ""}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("quantity")}</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity || 1}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("status")}</label>
          <select
            name="status"
            value={formData.status || "Active"}
            onChange={handleChange}
          >
            <option>{t("active")}</option>
            <option>{t("sold")}</option>
            <option>{t("dead")}</option>
          </select>

          <br /><br />

          <label>{t("purchasePrice")}</label>
          <input
            type="number"
            step="0.01"
            name="purchase_price"
            value={formData.purchase_price || ""}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("notes")}</label>
          <textarea
            rows="4"
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
          />

          <br /><br />

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="button" type="submit">
              💾 Update
            </button>

            <Link className="button" to="/chickens">
              {t("cancel")}
            </Link>
          </div>


        {calendarOpen && (() => {
          const year = calendarMonth.getFullYear();
          const month = calendarMonth.getMonth();
          const today = new Date();
          const firstDay = new Date(year, month, 1).getDay();
          const daysInMonth = new Date(year, month + 1, 0).getDate();

          const months = [
            t("january"), t("february"), t("march"), t("april"),
            t("may"), t("june"), t("july"), t("august"),
            t("september"), t("october"), t("november"), t("december")
          ];

          const currentYear = new Date().getFullYear();
          const years = Array.from(
            { length: 101 },
            (_, i) => currentYear - i
          );

          const selected = formData.hatch_date
            ? new Date(formData.hatch_date.split("T")[0] + "T00:00:00")
            : null;

          return (
            <div
              onClick={() => setCalendarOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 99999,
                padding: "16px",
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "min(92vw,360px)",
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "18px",
                  boxShadow: "0 8px 30px rgba(0,0,0,.25)",
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "14px"
                }}>
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
                      fontWeight: 600,
                    }}
                  >
                    {months.map((name, i) => (
                      <option key={i} value={i}>{name}</option>
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
                      fontWeight: 600,
                    }}
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "14px"
                }}>
                  <button
                    type="button"
                    onClick={() => changeCalendarMonth(-1)}
                    style={{
                      width: "38px",
                      height: "38px",
                      border: "1px solid #cfd6cf",
                      borderRadius: "8px",
                      background: "#fff",
                      fontSize: "20px",
                      fontWeight: 700,
                    }}
                  >
                    ‹
                  </button>

                  <div style={{
                    fontSize: "19px",
                    fontWeight: 700,
                    color: "#222"
                  }}>
                    {months[month]} {year}
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
                      fontSize: "20px",
                      fontWeight: 700,
                    }}
                  >
                    ›
                  </button>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7,1fr)",
                  gap: "6px",
                  marginBottom: "6px"
                }}>
                  {[
                    t("sun"), t("mon"), t("tue"), t("wed"),
                    t("thu"), t("fri"), t("sat")
                  ].map((day) => (
                    <div
                      key={day}
                      style={{
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: "13px",
                        padding: "6px 0",
                      }}
                    >
                      {day}
                    </div>
                  ))}

                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                    (day) => {
                      const isToday =
                        day === today.getDate() &&
                        month === today.getMonth() &&
                        year === today.getFullYear();

                      const isSelected =
                        selected &&
                        day === selected.getDate() &&
                        month === selected.getMonth() &&
                        year === selected.getFullYear();

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => selectCalendarDate(day)}
                          style={{
                            width: "40px",
                            height: "40px",
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
                    }
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setCalendarOpen(false)}
                  style={{
                    display: "block",
                    margin: "16px auto 0",
                    padding: "9px 18px",
                    border: 0,
                    borderRadius: "7px",
                    background: "#2e7d32",
                    color: "#fff",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          );
        })()}

        </form>

      </div>

    </div>
  );
}

export default EditChicken;
