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
            <div style={{ position: "relative", width: "100%" }}>
              <div
                style={{
                  ...inputStyle,
                  width: "100%",
                  color: formData.date_of_birth ? "#222" : "#777",
                  display: "flex",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                {formData.date_of_birth
                  ? new Date(formData.date_of_birth + "T00:00:00").toLocaleDateString("nl-NL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "DD-MM-JJJJ"}
              </div>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                onClick={(e) => e.currentTarget.showPicker?.()}
                onFocus={(e) => e.currentTarget.showPicker?.()}
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
