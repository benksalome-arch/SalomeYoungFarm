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
      alert("Please select an image file.");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

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
        alert(data.message || "Failed to save goat.");
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
        alert("Goat was saved, but the new goat ID was not returned.");
        navigate("/goats");
        return;
      }

      if (selectedFile) {
        const photoData = new FormData();
        photoData.append("photo", selectedFile);

        const photoResponse = await fetch(
          `${API_URL}/api/photos/${goatId}`,
          {
            method: "POST",
            body: photoData,
          }
        );

        const photoResult = await photoResponse.json();

        if (!photoResponse.ok) {
          console.error("Photo upload error:", photoResult);
          alert("Goat was saved, but the photo could not be uploaded.");
        }
      }

      alert("Goat added successfully!");
      navigate(`/goats/${goatId}`);
    } catch (err) {
      console.error("Add goat error:", err);
      alert("Database or network error.");
      setSaving(false);
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
  };

  const inputStyle = {
    width: "100%",
    minWidth: 0,
    height: "44px",
    padding: "9px 12px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
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
    boxSizing: "border-box",
    fontSize: "15px",
    resize: "vertical",
    minHeight: "120px",
  };

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
            }}
          >
            🐐 {t("addGoat")}
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#666",
              fontSize: "16px",
              lineHeight: 1.5,
            }}
          >
            {t("registerNewGoat")}
          </p>
        </div>

        <Link
          to="/goats"
          className="button"
          style={{ whiteSpace: "nowrap" }}
        >
          ← {t("back")}
        </Link>
      </div>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "clamp(18px, 3vw, 32px)",
          boxSizing: "border-box",
        }}
      >
        <form onSubmit={handleSubmit}>
          <section
            style={{
              marginBottom: "32px",
              padding: "20px",
              background: "#f7f9f7",
              border: "1px solid #e0e5e0",
              borderRadius: "12px",
              boxSizing: "border-box",
            }}
          >
            <h2
              style={{
                margin: "0 0 18px",
                fontSize: "22px",
                lineHeight: 1.3,
              }}
            >
              📷 {t("goatPhoto")}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(150px, 200px) minmax(0, 1fr)",
                gap: "24px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  maxWidth: "200px",
                  margin: "0 auto",
                }}
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Goat preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "12px",
                      border: "1px solid #ccc",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#e9ece9",
                      borderRadius: "12px",
                      fontSize: "70px",
                      border: "1px solid #ddd",
                      boxSizing: "border-box",
                    }}
                  >
                    🐐
                  </div>
                )}
              </div>

              <div style={{ minWidth: 0 }}>
                <label style={labelStyle}>
                  {t("selectPhoto")}
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{
                    display: "block",
                    width: "100%",
                    maxWidth: "100%",
                    marginTop: "10px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          </section>

          <section>
            <h2
              style={{
                margin: "0 0 20px",
                fontSize: "22px",
                lineHeight: 1.3,
              }}
            >
              {t("basicInformation")}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                gap: "20px",
                width: "100%",
              }}
            >
              <div style={fieldStyle}>
                <label style={labelStyle}>{t("tag")}</label>

                <input
                  type="text"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>{t("name")}</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>{t("breed")}</label>

                <input
                  type="text"
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
                <label style={labelStyle}>
                  {t("birthDate")}
                </label>

                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
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
                  placeholder="Bijv. 25"
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>{t("color")}</label>

                <input
                  type="text"
                  name="color"
                  value={formData.color}
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
            </div>
          </section>

          <div style={{ marginTop: "24px" }}>
            <label style={labelStyle}>{t("notes")}</label>

            <textarea
              name="notes"
              rows="5"
              value={formData.notes}
              onChange={handleChange}
              style={{
                ...textareaStyle,
                marginTop: "7px",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "25px",
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