import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditGoat() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tag: "",
    name: "",
    breed: "",
    sex: "Female",
    date_of_birth: "",
    weight: "",
    status: "Healthy",
    color: "",
    notes: "",
  });

  const [photo, setPhoto] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

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

  const currentYear = new Date().getFullYear();
  const calendarYears = Array.from(
    { length: 101 },
    (_, index) => currentYear - 50 + index
  );

  useEffect(() => {
    fetch(`${API_URL}/api/goats/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const date = data.date_of_birth
          ? String(data.date_of_birth).split("T")[0]
          : "";

        setFormData({
          tag: data.tag || "",
          name: data.name || "",
          breed: data.breed || "",
          sex: data.sex || "Female",
          date_of_birth: date,
          weight: data.weight ?? "",
          status: data.status || "Healthy",
          color: data.color || "",
          notes: data.notes || "",
        });

        if (date) {
          const [year, month] = date.split("-").map(Number);
          setCalendarMonth(new Date(year, month - 1, 1));
        }

        setPhoto(data.photo || "");
      })
      .catch((err) => {
        console.error("Failed to load goat:", err);
      });
  }, [id]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function formatDate(dateString) {
    if (!dateString) return "DD-MM-JJJJ";

    const [year, month, day] = dateString.split("-");

    if (!year || !month || !day) {
      return "DD-MM-JJJJ";
    }

    return `${day}-${month}-${year}`;
  }

  function selectDate(year, month, day) {
    const selectedDate = `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    setFormData({
      ...formData,
      date_of_birth: selectedDate,
    });

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

  function changeCalendarYear(year) {
    setCalendarMonth(
      new Date(Number(year), calendarMonth.getMonth(), 1)
    );
  }

  function getCalendarDays() {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }

  function isSelectedDay(day) {
    if (!day || !formData.date_of_birth) return false;

    const [year, month, selectedDay] = formData.date_of_birth
      .split("-")
      .map(Number);

    return (
      year === calendarMonth.getFullYear() &&
      month === calendarMonth.getMonth() + 1 &&
      selectedDay === day
    );
  }

  function isToday(day) {
    if (!day) return false;

    const today = new Date();

    return (
      today.getFullYear() === calendarMonth.getFullYear() &&
      today.getMonth() === calendarMonth.getMonth() &&
      today.getDate() === day
    );
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  }

  async function uploadPhoto() {
    if (!selectedFile) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const uploadData = new FormData();
      uploadData.append("photo", selectedFile);

      const response = await fetch(`${API_URL}/api/photos/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(t("failedToUploadPhoto"));
        return;
      }

      setPhoto(data.photo || "");
      setSelectedFile(null);
      setPhotoPreview("");

      alert(t("photoUploadedSuccessfully"));
    } catch (err) {
      console.error("Photo upload error:", err);
      alert(t("failedToUploadPhoto"));
    }
  }

  async function deletePhoto() {
    if (!photo) {
      return;
    }

    if (!window.confirm(t("deleteGoatPhoto"))) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/photos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(t("failedToDeletePhoto"));
        return;
      }

      setPhoto("");
      setSelectedFile(null);
      setPhotoPreview("");

      alert(t("photoDeletedSuccessfully"));
    } catch (err) {
      console.error("Photo delete error:", err);
      alert(t("failedToDeletePhoto"));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const dataToSend = {
        ...formData,
        date_of_birth: formData.date_of_birth
          ? String(formData.date_of_birth).split("T")[0]
          : null,
      };

      const response = await fetch(`${API_URL}/api/goats/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Update goat error:", data);
        alert(t("failedToUpdateGoat"));
        return;
      }

      alert(t("goatUpdatedSuccessfully"));
      navigate("/goats");
    } catch (err) {
      console.error("Update goat error:", err);
      alert(t("failedToUpdateGoat"));
    }
  }

  const displayedPhoto = photoPreview
    ? photoPreview
    : photo
      ? photo.startsWith("http")
        ? photo
        : `${API_URL}/uploads/goats/${photo}`
      : "";

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 13px",
    border: "1px solid #bdbdbd",
    borderRadius: "8px",
    fontSize: "16px",
    background: "#fff",
    color: "#222",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontWeight: "600",
    fontSize: "15px",
    color: "#333",
  };

  const fieldStyle = {
    marginBottom: "18px",
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "760px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "30px",
            color: "#1b5e20",
          }}
        >
          ✏️ {t("editGoat")}
        </h1>

        <Link
          to={`/goats/${id}`}
          className="button"
          style={{
            textDecoration: "none",
          }}
        >
          ← {t("profile")}
        </Link>
      </div>

      <div
        className="card"
        style={{
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            fontSize: "20px",
          }}
        >
          📷 {t("goatPhoto")}
        </h2>

        {displayedPhoto ? (
          <img
            src={displayedPhoto}
            alt={t("goat")}
            style={{
              width: "100%",
              maxWidth: "320px",
              height: "280px",
              objectFit: "cover",
              borderRadius: "12px",
              display: "block",
              margin: "0 auto 15px",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              maxWidth: "320px",
              height: "280px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "100px",
              background: "#f0f2f0",
              borderRadius: "12px",
              margin: "0 auto 15px",
            }}
          >
            🐐
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{
            width: "100%",
            maxWidth: "320px",
            boxSizing: "border-box",
            marginBottom: "12px",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className="button"
            onClick={uploadPhoto}
            disabled={!selectedFile}
            style={{
              opacity: selectedFile ? 1 : 0.5,
            }}
          >
            📤 {t("uploadPhoto")}
          </button>

          {photo && (
            <button
              type="button"
              className="button"
              onClick={deletePhoto}
              style={{
                background: "#d32f2f",
                color: "white",
                border: "none",
              }}
            >
              🗑 {t("deletePhoto")}
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "0 18px",
            }}
          >
            <div style={fieldStyle}>
              <label style={labelStyle}>{t("earTag")}</label>
              <input
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("name")}</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("breed")}</label>
              <input
                name="breed"
                value={formData.breed}
                onChange={handleChange}
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

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("dateOfBirth")}</label>

              <button
                type="button"
                onClick={() => setCalendarOpen(true)}
                style={{
                  ...inputStyle,
                  textAlign: "left",
                  cursor: "pointer",
                  minHeight: "45px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    color: formData.date_of_birth ? "#222" : "#777",
                  }}
                >
                  {formatDate(formData.date_of_birth)}
                </span>

                <span style={{ fontSize: "18px" }}>📅</span>
              </button>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("weight")}</label>
              <input
                name="weight"
                value={formData.weight}
                onChange={handleChange}
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
                <option value="Healthy">{t("healthy")}</option>
                <option value="Sick">{t("sick")}</option>
                <option value="Treated">{t("treated")}</option>
                <option value="Sold">{t("sold")}</option>
                <option value="Dead">{t("dead")}</option>
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>{t("color")}</label>
              <input
                name="color"
                value={formData.color}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>{t("notes")}</label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              style={{
                ...inputStyle,
                minHeight: "110px",
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "10px",
            }}
          >
            <button
              type="submit"
              className="button"
            >
              {t("updateGoat")}
            </button>

            <Link
              className="button"
              to={`/goats/${id}`}
              style={{ textDecoration: "none" }}
            >
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>

      {calendarOpen && (
        <div
          onClick={() => setCalendarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
            padding: "16px",
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
              boxShadow: "0 10px 35px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "15px",
              }}
            >
              <button
                type="button"
                onClick={() => changeCalendarMonth(-1)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "26px",
                  cursor: "pointer",
                  padding: "4px 8px",
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
                  padding: "8px",
                  borderRadius: "7px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
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
                onChange={(e) => changeCalendarYear(e.target.value)}
                style={{
                  width: "90px",
                  padding: "8px",
                  borderRadius: "7px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
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
                  border: "none",
                  background: "transparent",
                  fontSize: "26px",
                  cursor: "pointer",
                  padding: "4px 8px",
                }}
              >
                ›
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                textAlign: "center",
                gap: "5px",
                marginBottom: "7px",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              {["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "6px",
              }}
            >
              {getCalendarDays().map((day, index) => {
                const selected = isSelectedDay(day);
                const today = isToday(day);

                return (
                  <div key={`${day}-${index}`} style={{ textAlign: "center" }}>
                    {day ? (
                      <button
                        type="button"
                        onClick={() =>
                          selectDate(
                            calendarMonth.getFullYear(),
                            calendarMonth.getMonth(),
                            day
                          )
                        }
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          border: selected
                            ? "2px solid #1b5e20"
                            : "1px solid transparent",
                          background: selected ? "#4caf50" : "#fff",
                          color: selected ? "#fff" : "#222",
                          fontWeight: selected ? "700" : "400",
                          cursor: "pointer",
                          boxShadow: today
                            ? "0 0 0 2px #c8e6c9"
                            : "none",
                        }}
                      >
                        {day}
                      </button>
                    ) : (
                      <div style={{ height: "34px" }} />
                    )}
                  </div>
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
                borderRadius: "8px",
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
                fontSize: "15px",
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

export default EditGoat;
