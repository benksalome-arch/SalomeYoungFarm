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
          alert("Goat was saved, but the photo could not be uploaded.");
        }
      }

      alert("Goat added successfully!");
      navigate(`/goats/${goatId}`);
    } catch (err) {
      console.error("Add goat error:", err);
      alert(`Save failed: ${err?.message || err}`);
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
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{
            width: "100%",
            maxWidth: "320px",
            boxSizing: "border-box",
            margin: "0 auto",
          }}
        />
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
            <label style={labelStyle}>{t("tag")}</label>
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
                  const today = new Date();
                  const selected = formData.date_of_birth
                    ? new Date(formData.date_of_birth + "T00:00:00")
                    : today;

                  const year = selected.getFullYear();
                  const month = selected.getMonth();

                  const firstDay = new Date(year, month, 1).getDay();
                  const daysInMonth = new Date(year, month + 1, 0).getDate();

                  const overlay = document.createElement("div");
                  overlay.style.cssText = `
                    position:fixed;
                    inset:0;
                    background:rgba(0,0,0,.35);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    z-index:99999;
                  `;

                  const box = document.createElement("div");
                  box.style.cssText = `
                    width:min(92vw,360px);
                    background:#fff;
                    border-radius:14px;
                    padding:18px;
                    box-sizing:border-box;
                    box-shadow:0 8px 30px rgba(0,0,0,.25);
                  `;

                  const title = document.createElement("div");
                  title.textContent = selected.toLocaleDateString("en-GB", {
                    day:"2-digit",
                    month:"2-digit",
                    year:"numeric"
                  }).replaceAll("/", "-");
                  title.style.cssText = `
                    text-align:center;
                    font-size:20px;
                    font-weight:700;
                    margin-bottom:14px;
                  `;

                  const grid = document.createElement("div");
                  grid.style.cssText = `
                    display:grid;
                    grid-template-columns:repeat(7,1fr);
                    gap:6px;
                  `;

                  ["Su","Mo","Tu","We","Th","Fr","Sa"].forEach(day => {
                    const el = document.createElement("div");
                    el.textContent = day;
                    el.style.cssText = "text-align:center;font-weight:600;font-size:13px;padding:6px 0;";
                    grid.appendChild(el);
                  });

                  for (let i = 0; i < firstDay; i++) {
                    grid.appendChild(document.createElement("div"));
                  }

                  for (let day = 1; day <= daysInMonth; day++) {
                    const el = document.createElement("button");
                    el.type = "button";
                    el.textContent = day;
                    el.style.cssText = `
                      min-height:40px;
                      border:1px solid #ddd;
                      border-radius:8px;
                      background:#fff;
                      color:#222;
                      -webkit-text-fill-color:#222;
                      font-size:15px;
                      font-weight:500;
                      display:flex;
                      align-items:center;
                      justify-content:center;
                    `;

                    el.onclick = () => {
                      const value =
                        year + "-" +
                        String(month + 1).padStart(2, "0") + "-" +
                        String(day).padStart(2, "0");

                      setFormData(prev => ({
                        ...prev,
                        date_of_birth: value
                      }));

                      document.body.removeChild(overlay);
                    };

                    grid.appendChild(el);
                  }

                  const cancel = document.createElement("button");
                  cancel.type = "button";
                  cancel.textContent = "Cancel";
                  cancel.style.cssText = `
                    width:100%;
                    margin-top:14px;
                    min-height:44px;
                    border:1px solid #ccc;
                    border-radius:8px;
                    background:#fff;
                    color:#222;
                    -webkit-text-fill-color:#222;
                    font-size:15px;
                    font-weight:600;
                  `;
                  cancel.onclick = () => document.body.removeChild(overlay);

                  box.appendChild(title);
                  box.appendChild(grid);
                  box.appendChild(cancel);
                  overlay.appendChild(box);
                  document.body.appendChild(overlay);
                }}
                style={{
                  ...inputStyle,
                  color:"#222",
                  WebkitTextFillColor:"#222",
                  backgroundColor:"#fff",
                  cursor:"pointer"
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
              placeholder="Bijv. 25"
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
