import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddChickenMortality() {
  const navigate = useNavigate();

  const [chickens, setChickens] = useState([]);

  const [formData, setFormData] = useState({
    chicken_id: "",
    mortality_date: new Date().toISOString().split("T")[0],
    quantity: 1,
    cause: "",
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
    { length: 11 },
    (_, i) => currentYear - 5 + i
  );

  useEffect(() => {
    loadChickens();
  }, []);

  async function loadChickens() {
    try {
      const response = await fetch(
        `${API_URL}/api/chickens`
      );

      const data = await response.json();

      setChickens(
        data.filter(
          (c) =>
            c.status === "Active" &&
            Number(c.quantity) > 0
        )
      );
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

  function openCalendar() {
    const baseDate = formData.mortality_date
      ? new Date(formData.mortality_date + "T00:00:00")
      : new Date();

    setCalendarMonth(
      new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        1
      )
    );

    setCalendarOpen(true);
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
    const month = calendarMonth.getMonth();

    const value =
      year +
      "-" +
      String(month + 1).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0");

    setFormData((prev) => ({
      ...prev,
      mortality_date: value,
    }));

    setCalendarOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/chicken-mortality`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/chicken-mortality");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to record mortality.");
    }
  }

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();

  return (
    <div className="page">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1>🐔 Record Chicken Mortality</h1>
          <p>
            Record deaths and automatically update flock quantity.
          </p>
        </div>

        <Link
          className="button"
          to="/chicken-mortality"
        >
          ← Back
        </Link>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit}>

          <label>Chicken</label>

          <select
            name="chicken_id"
            value={formData.chicken_id}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Chicken
            </option>

            {chickens.map((chicken) => (
              <option
                key={chicken.id}
                value={chicken.id}
              >
                {chicken.tag_number} - {chicken.name} (
                {chicken.quantity})
              </option>
            ))}
          </select>

          <br />
          <br />

          <label>Date</label>

          <div
            onClick={openCalendar}
            style={{
              position: "relative",
              width: "100%",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                minHeight: "44px",
                border: "1px solid #cfd6cf",
                borderRadius: "7px",
                background: "#fff",
                color: "#222",
                display: "flex",
                alignItems: "center",
              }}
            >
              {formData.mortality_date
                ? formData.mortality_date
                    .split("-")
                    .reverse()
                    .join("-")
                : "DD-MM-JJJJ"}
            </div>
          </div>

          <br />
          <br />

          <label>Quantity</label>

          <input
            type="number"
            min="1"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <br />
          <br />

          <label>Cause</label>

          <input
            type="text"
            name="cause"
            value={formData.cause}
            onChange={handleChange}
            placeholder="Disease, Predator, Accident..."
          />

          <br />
          <br />

          <label>Notes</label>

          <textarea
            rows="4"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <br />
          <br />

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              className="button"
              type="submit"
            >
              💾 Save
            </button>

            <Link
              className="button"
              to="/chicken-mortality"
            >
              Cancel
            </Link>
          </div>

        </form>

      </div>

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
            style={{
              width: "min(92vw, 360px)",
              background: "#fff",
              borderRadius: "14px",
              padding: "18px",
              boxSizing: "border-box",
              boxShadow:
                "0 8px 30px rgba(0, 0, 0, 0.25)",
            }}
          >

            {/* MONTH / YEAR */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
                {monthNames.map((name, index) => (
                  <option key={index} value={index}>
                    {name}
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
                {calendarYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* NAVIGATION */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
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
                {monthNames[month]} {year}
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

            {/* WEEKDAYS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(7, 1fr)",
                gap: "4px",
                marginBottom: "6px",
              }}
            >
              {weekDays.map((day) => (
                <div
                  key={day}
                  style={{
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#555",
                    textAlign: "center",
                    padding: "5px 0",
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* DAYS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(7, 1fr)",
                gap: "5px",
              }}
            >
              {Array.from(
                {
                  length: new Date(
                    year,
                    month,
                    1
                  ).getDay(),
                },
                (_, i) => (
                  <div key={`empty-${i}`} />
                )
              )}

              {Array.from(
                {
                  length: new Date(
                    year,
                    month + 1,
                    0
                  ).getDate(),
                },
                (_, i) => {
                  const day = i + 1;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() =>
                        handleDateSelect(day)
                      }
                      style={{
                        minHeight: "38px",
                        border:
                          "1px solid #e0e4e0",
                        borderRadius: "7px",
                        background: "#fff",
                        color: "#222",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      {day}
                    </button>
                  );
                }
              )}
            </div>

            {/* CANCEL */}
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
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Annuleren
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default AddChickenMortality;
