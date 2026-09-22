import API_URL from "../api";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddRabbitBreeding() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [rabbits, setRabbits] = useState([]);
  const [loadingRabbits, setLoadingRabbits] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [formData, setFormData] = useState({
    rabbit_id: id,
    breeding_date: "",
    male_rabbit_id: "",
    breeding_type: "",
    expected_birth_date: "",
    status: "Planned",
    notes: "",
  });

  // ======================================
  // Load rabbits
  // ======================================

  useEffect(() => {
    loadRabbits();
  }, [id]);

  async function loadRabbits() {
    try {
      setLoadingRabbits(true);

      const response = await fetch(
        `${API_URL}/api/rabbits`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to load rabbits:", data);
        setRabbits([]);
        return;
      }

      let rabbitList = [];

      if (Array.isArray(data)) {
        rabbitList = data;
      } else if (Array.isArray(data.rabbits)) {
        rabbitList = data.rabbits;
      } else if (Array.isArray(data.data)) {
        rabbitList = data.data;
      }

      setRabbits(rabbitList);
    } catch (err) {
      console.error("Error loading rabbits:", err);
      setRabbits([]);
    } finally {
      setLoadingRabbits(false);
    }
  }

  // ======================================
  // Find selected female rabbit
  // ======================================

  const femaleRabbit = rabbits.find(
    (rabbit) =>
      String(rabbit.id) === String(id)
  );

  // ======================================
  // Find available male rabbits
  // ======================================

  const maleRabbits = rabbits.filter((rabbit) => {
    const sex = String(rabbit.sex || "")
      .trim()
      .toLowerCase();

    const status = String(rabbit.status || "active")
      .trim()
      .toLowerCase();

    return (
      sex === "male" &&
      status === "active" &&
      String(rabbit.id) !== String(id)
    );
  });

  // ======================================
  // Automatically calculate expected birth
  // Rabbit gestation: 31 days
  // ======================================

  useEffect(() => {
    if (!formData.breeding_date) {
      return;
    }

    const date = new Date(formData.breeding_date + "T00:00:00");
    date.setDate(date.getDate() + 31);

    const expectedDate =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0");

    setFormData((previous) => {
      if (previous.expected_birth_date === expectedDate) {
        return previous;
      }

      return {
        ...previous,
        expected_birth_date: expectedDate,
      };
    });
  }, [formData.breeding_date]);

  // ======================================
  // Breeding date calendar
  // ======================================

  function formatDateDisplay(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}-${month}-${year}`;
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  function selectBreedingDate(day) {
    const year = calendarMonth.getFullYear();
    const month = String(calendarMonth.getMonth() + 1).padStart(2, "0");
    const selectedDay = String(day).padStart(2, "0");

    setFormData((previous) => ({
      ...previous,
      breeding_date: `${year}-${month}-${selectedDay}`,
    }));

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

  const daysInMonth = getDaysInMonth(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth()
  );

  const firstDay = getFirstDayOfMonth(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth()
  );

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // ======================================
  // Handle form changes
  // ======================================

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // ======================================
  // Submit breeding record
  // ======================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!femaleRabbit) {
      alert(t("femaleRabbitNotFound"));
      return;
    }

    if (
      String(femaleRabbit.sex || "")
        .trim()
        .toLowerCase() !== "female"
    ) {
      alert(
        "The selected rabbit is not female."
      );
      return;
    }

    if (!formData.male_rabbit_id) {
      alert(t("pleaseSelectMaleRabbit"));
      return;
    }

    if (!formData.breeding_type) {
      alert(t("pleaseSelectBreedingType"));
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/rabbit-breeding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...formData,
            rabbit_id: id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to save breeding record."
        );
        return;
      }

      alert(
        data.message ||
          "Rabbit breeding record added successfully!"
      );

      navigate(`/rabbits/${id}/breeding`);
    } catch (err) {
      console.error("Save breeding error:", err);

      alert(
        "Failed to save rabbit breeding record."
      );
    }
  }

  return (
    <div>
      {/* ==================================
          Header
      ================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1>❤️ {t("addRabbitBreedingRecord")}</h1>

          <p>
            Record a breeding event for this female rabbit.
          </p>
        </div>

        <Link
          className="button"
          to={`/rabbits/${id}/breeding`}
        >
          ← {t("back")}
        </Link>
      </div>

      {/* ==================================
          Form
      ================================== */}

      <div className="card rabbit-breeding-form-card">
        <form onSubmit={handleSubmit}>

          {/* Female Rabbit */}

          <label>
            <strong>{t("femaleRabbit")}</strong>
          </label>

          {loadingRabbits ? (
            <p>{t("loadingRabbit")}...</p>
          ) : femaleRabbit ? (
            <div
              style={{
                padding: "12px",
                background: "#E8F5E9",
                borderRadius: "8px",
                marginTop: "8px",
                marginBottom: "15px",
                color: "#1B5E20",
              }}
            >
              🐇{" "}
              <strong>
                {femaleRabbit.tag_number}
              </strong>

              {femaleRabbit.name
                ? ` - ${femaleRabbit.name}`
                : ""}

              <br />

              <small>
                Sex: {femaleRabbit.sex}
              </small>
            </div>
          ) : (
            <p
              style={{
                color: "#D32F2F",
              }}
            >
              Female rabbit not found.
            </p>
          )}

          {/* Breeding Date */}

          <label>
            Breeding Date
          </label>

          <div style={{ position: "relative" }}>
            <div style={{ position: "relative", width: "100%" }}>
              <div
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  minHeight: "44px",
                  padding: "10px 12px",
                  border: "1px solid #cfd6cf",
                  borderRadius: "7px",
                  background: "#fff",
                  color: formData.breeding_date ? "#222" : "#777",
                  WebkitTextFillColor: formData.breeding_date ? "#222" : "#777",
                  display: "flex",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                {formData.breeding_date
                  ? new Date(formData.breeding_date + "T00:00:00").toLocaleDateString("nl-NL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "DD-MM-JJJJ"}
              </div>

              <input
                type="date"
                name="breeding_date"
                value={formData.breeding_date || ""}
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
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => changeCalendarMonth(-1)}
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: "28px",
                      cursor: "pointer",
                      color: "#222",
                    }}
                  >
                    ‹
                  </button>

                  <strong style={{ color: "#222" }}>
                    {monthNames[calendarMonth.getMonth()]}{" "}
                    {calendarMonth.getFullYear()}
                  </strong>

                  <button
                    type="button"
                    onClick={() => changeCalendarMonth(1)}
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: "28px",
                      cursor: "pointer",
                      color: "#222",
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
                    textAlign: "center",
                  }}
                >
                  {weekdays.map(day => (
                    <div
                      key={day}
                      style={{
                        fontWeight: 700,
                        fontSize: "12px",
                        color: "#555",
                        padding: "4px 0",
                      }}
                    >
                      {day}
                    </div>
                  ))}

                  {Array.from({ length: firstDay }).map((_, index) => (
                    <div key={`empty-${index}`} />
                  ))}

                  {Array.from(
                    { length: daysInMonth },
                    (_, index) => index + 1
                  ).map(day => {
                    const dateValue =
                      `${calendarMonth.getFullYear()}-` +
                      `${String(calendarMonth.getMonth() + 1).padStart(2, "0")}-` +
                      `${String(day).padStart(2, "0")}`;

                    const today = new Date();

                    const isSelected =
                      formData.breeding_date === dateValue;

                    const isToday =
                      day === today.getDate() &&
                      calendarMonth.getMonth() === today.getMonth() &&
                      calendarMonth.getFullYear() === today.getFullYear();

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => selectBreedingDate(day)}
                        style={{
                          border: "none",
                          borderRadius: "6px",
                          padding: "7px 0",
                          cursor: "pointer",
                          background:
                            isSelected || isToday
                              ? "#1976d2"
                              : "transparent",
                          color:
                            isSelected || isToday
                              ? "#fff"
                              : "#222",
                          fontWeight:
                            isSelected || isToday
                              ? 700
                              : 400,
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <br />
          <br />

          {/* Male Rabbit */}

          <label>
            <strong>{t("maleRabbit")}</strong>
          </label>

          {loadingRabbits ? (
            <p>{t("loadingMaleRabbits")}...</p>
          ) : (
            <>
              <select
                name="male_rabbit_id"
                value={formData.male_rabbit_id}
                onChange={handleChange}
                required
              >
                <option value="">
                  {t("selectMaleRabbit")}
                </option>

                {maleRabbits.map((rabbit) => (
                  <option
                    key={rabbit.id}
                    value={rabbit.id}
                  >
                    {rabbit.tag_number}

                    {rabbit.name
                      ? ` - ${rabbit.name}`
                      : ""}

                    {` (${t("male")})`}
                  </option>
                ))}
              </select>

              {maleRabbits.length === 0 && (
                <p
                  style={{
                    color: "#D32F2F",
                    marginTop: "8px",
                  }}
                >
                  {t("noAvailableMaleRabbits")}
                </p>
              )}

              {maleRabbits.length > 0 && (
                <p
                  style={{
                    color: "#2E7D32",
                    marginTop: "8px",
                  }}
                >
                  {maleRabbits.length} {t("maleRabbit")}
                  {maleRabbits.length !== 1
                    ? t("pluralS")
                    : ""}{" "}
                  {t("available")}.
                </p>
              )}
            </>
          )}

          <br />
          <br />

          {/* {t("breedingType")} */}

          <label>
            {t("breedingType")}
          </label>

          <select
            name="breeding_type"
            value={formData.breeding_type}
            onChange={handleChange}
            required
          >
            <option value="">
              {t("selectBreedingType")}
            </option>

            <option value="Natural">
              {t("natural")}
            </option>

            <option value="Assisted">
              {t("assisted")}
            </option>

            <option value="Planned">
              {t("planned")}
            </option>
          </select>

          <br />
          <br />

          {/* {t("expectedBirthDate")} */}

          <label>
            {t("expectedBirthDate")}
          </label>

          <input
            type="date"
            name="expected_birth_date"
            value={formData.expected_birth_date}
            readOnly
            title="Automatically calculated 31 days after breeding date"
          />

          <br />
          <br />

          {/* {t("status")} */}

          <label>
            {t("status")}
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Planned">
              {t("planned")}
            </option>

            <option value="Confirmed">
              {t("confirmed")}
            </option>

            <option value="Pregnant">
              {t("pregnant")}
            </option>

            <option value="Completed">
              {t("completed")}
            </option>

            <option value="Failed">
              {t("failed")}
            </option>
          </select>

          <br />
          <br />

          {/* Notes */}

          <label>
            {t("notes")}
          </label>

          <textarea
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            placeholder={t("additionalBreedingNotes")}
          />

          <br />
          <br />

          {/* Buttons */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="button"
              type="submit"
              disabled={
                loadingRabbits ||
                !femaleRabbit ||
                maleRabbits.length === 0
              }
            >
              💾 Save Breeding Record
            </button>

            <Link
              className="button"
              to={`/rabbits/${id}/breeding`}
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddRabbitBreeding;
