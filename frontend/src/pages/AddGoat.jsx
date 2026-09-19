import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddGoat() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    tag: "",
    name: "",
    breed: "",
    sex: "Female",
    date_of_birth: "",
    weight: "",
    color: "",
    status: "Healthy",
    notes: "",
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
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
    const value =
      calendarMonth.getFullYear() +
      "-" +
      String(calendarMonth.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0");

    setFormData((prev) => ({
      ...prev,
      date_of_birth: value,
    }));

    setCalendarOpen(false);
  }


  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      setPhotoPreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert(t("selectImageFile"));
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.date_of_birth) {
      alert(t("dateRequired"));
      return;
    }

    if (saving) return;

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/api/goats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          date_of_birth: formData.date_of_birth
            ? String(formData.date_of_birth).split("T")[0]
            : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409 || String(data.message || "").includes("already exists")) {
          alert(
            t("goatTagAlreadyExists").replace(
              "{tag}",
              formData.tag || ""
            )
          );
        } else {
          alert(t("failedSaveGoat"));
        }
        setSaving(false);
        return;
      }

      const goatId =
        data.id ||
        data.goatId ||
        data.insertId ||
        data.goat?.id;

      if (!goatId) {
        console.error("Create goat response:", data);
        alert(t("goatSavedIdMissing"));
        navigate("/goats");
        return;
      }

      if (selectedFile) {
        const token = localStorage.getItem("token");

        const photoData = new FormData();
        photoData.append("photo", selectedFile);

        const photoResponse = await fetch(
          `${API_URL}/api/photos/new/${goatId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: photoData,
          }
        );

        const photoResult = await photoResponse.json();

        if (!photoResponse.ok) {
          console.error("Photo upload error:", photoResult);
          alert(t("goatSavedPhotoFailed"));
        }
      }

      alert(t("goatAddedSuccessfully"));
      navigate(`/goats/${goatId}`);
    } catch (err) {
      console.error("Add goat error:", err);
      alert(t("saveFailed").replace("{message}", err?.message || err));
      setSaving(false);
    }
  }

  const inputStyle = {
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
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontWeight: 600,
    fontSize: "15px",
    lineHeight: 1.3,
    color: "#222",
  };

  return (
    <div
      className="page add-goat-page"
      style={{
        width: "100%",
        maxWidth: "700px",
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
          🐐 {t("addGoat")}
        </h1>

        <Link
          to="/goats"
          className="button"
          style={{
            textDecoration: "none",
          }}
        >
          ← {t("back")}
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

        {photoPreview ? (
          <img
            src={photoPreview}
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

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 600,
            color: "#222",
          }}
        >
          {t("selectPhoto")}
        </label>

        <input
          id="goat-photo-input"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: "none" }}
        />

        <label
          htmlFor="goat-photo-input"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "320px",
            minHeight: "44px",
            boxSizing: "border-box",
            margin: "0 auto",
            padding: "10px 14px",
            background: "#fff",
            border: "1px solid #cfd6cf",
            borderRadius: "7px",
            color: "#222",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {selectedFile ? selectedFile.name : t("chooseFile")}
        </label>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <h2
            style={{
              marginTop: 0,
              marginBottom: "22px",
              fontSize: "22px",
              color: "#222",
            }}
          >
            {t("basicInformation")}
          </h2>

          <p style={{ margin: "0 0 7px" }}>
            <label style={labelStyle}>{t("earTag")}</label>
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </p>

          <p style={{ margin: "0 0 16px" }}>
            <label style={labelStyle}>{t("name")}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </p>

          <p style={{ margin: "0 0 16px" }}>
            <label style={labelStyle}>{t("breed")}</label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              style={inputStyle}
            />
          </p>

          <p style={{ margin: "0 0 16px" }}>
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
          </p>

          <p style={{ margin: "0 0 16px" }}>
            <label style={labelStyle}>{t("birthDate")}</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={
                  formData.date_of_birth
                    ? formData.date_of_birth.split("-").reverse().join("-")
                    : ""
                }
                placeholder="DD-MM-JJJJ"
                readOnly
                onClick={() => {
                  const selected = formData.date_of_birth
                    ? new Date(formData.date_of_birth + "T00:00:00")
                    : new Date();

                  setCalendarMonth(selected);
                  setCalendarOpen(true);
                }}
                style={inputStyle}
              />

              {calendarOpen && (
                <div
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 99999,
                  }}
                  onClick={() => setCalendarOpen(false)}
                >
                  <div
                    style={{
                      width: "min(92vw, 360px)",
                      background: "#fff",
                      borderRadius: "14px",
                      padding: "18px",
                      boxSizing: "border-box",
                      boxShadow: "0 8px 30px rgba(0,0,0,.25)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "14px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={goPreviousMonth}
                        style={{
                          border: "1px solid #ddd",
                          background: "#fff",
                          borderRadius: "8px",
                          width: "38px",
                          height: "38px",
                          fontSize: "22px",
                          color: "#222",
                          WebkitTextFillColor: "#222",
                          cursor: "pointer",
                        }}
                      >
                        ‹
                      </button>

                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#222",
                          WebkitTextFillColor: "#222",
                        }}
                      >
                        {t(
                          [
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
                          ][calendarMonth.getMonth()]
                        )}{" "}
                        {calendarMonth.getFullYear()}
                      </div>

                      <button
                        type="button"
                        onClick={goNextMonth}
                        style={{
                          border: "1px solid #ddd",
                          background: "#fff",
                          borderRadius: "8px",
                          width: "38px",
                          height: "38px",
                          fontSize: "22px",
                          color: "#222",
                          WebkitTextFillColor: "#222",
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
                      {[t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")].map(
                        (day) => (
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
                        )
                      )}

                      {Array.from({
                        length: getFirstDayOfMonth(
                          calendarMonth.getFullYear(),
                          calendarMonth.getMonth()
                        ),
                      }).map((_, i) => (
                        <div key={"empty-" + i} />
                      ))}

                      {Array.from({
                        length: getDaysInMonth(
                          calendarMonth.getFullYear(),
                          calendarMonth.getMonth()
                        ),
                      }).map((_, i) => {
                        const day = i + 1;
                        const today = new Date();

                        const isToday =
                          day === today.getDate() &&
                          calendarMonth.getMonth() === today.getMonth() &&
                          calendarMonth.getFullYear() === today.getFullYear();

                        const dateValue =
                          `${calendarMonth.getFullYear()}-${String(
                            calendarMonth.getMonth() + 1
                          ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                        const isSelected =
                          formData.date_of_birth === dateValue;

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDateSelect(day)}
                            style={{
                              minHeight: "40px",
                              border:
                                isSelected || isToday
                                  ? "2px solid #2e7d32"
                                  : "1px solid #ddd",
                              borderRadius: "8px",
                              background: isSelected
                                ? "#2e7d32"
                                : isToday
                                ? "#e8f5e9"
                                : "#fff",
                              color: isSelected ? "#fff" : "#222",
                              WebkitTextFillColor: isSelected ? "#fff" : "#222",
                              fontSize: "15px",
                              fontWeight:
                                isSelected || isToday ? "700" : "500",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
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
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </p>

          <p style={{ margin: "0 0 16px" }}>
            <label style={labelStyle}>
              {t("weight")} (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder={t("weightPlaceholder")}
              style={inputStyle}
            />
          </p>

          <p style={{ margin: "0 0 16px" }}>
            <label style={labelStyle}>{t("color")}</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              style={inputStyle}
            />
          </p>

          <p style={{ margin: "0 0 16px" }}>
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
          </p>

          <p style={{ margin: "0 0 20px" }}>
            <label style={labelStyle}>{t("notes")}</label>
            <textarea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              style={{
                ...inputStyle,
                minHeight: "120px",
                resize: "vertical",
              }}
            />
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            <button
              className="button"
              type="submit"
              disabled={saving}
            >
              {saving ? t("saving") : `💾 ${t("saveGoat")}`}
            </button>

            <Link className="button" to="/goats">
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddGoat;
