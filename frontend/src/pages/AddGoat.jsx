import API_URL from "../api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AddGoat() {
  const navigate = useNavigate();

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
      // -----------------------------------
      // 1. CREATE GOAT
      // -----------------------------------

      const response = await fetch(
        `${API_URL}/api/goats`,
        {
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
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to save goat."
        );
        setSaving(false);
        return;
      }

      // The create-goat controller should return the
      // newly created goat ID.
      const goatId =
        data.id ||
        data.goatId ||
        data.insertId ||
        data.goat?.id;

      if (!goatId) {
        console.error(
          "Create goat response:",
          data
        );

        alert(
          "Goat was saved, but the new goat ID was not returned. The photo cannot be uploaded yet."
        );

        navigate("/goats");
        return;
      }

      // -----------------------------------
      // 2. UPLOAD PHOTO IF SELECTED
      // -----------------------------------

      if (selectedFile) {
        const photoData = new FormData();

        photoData.append(
          "photo",
          selectedFile
        );

        const photoResponse = await fetch(
          `${API_URL}/api/photos/${goatId}`,
          {
            method: "POST",
            body: photoData,
          }
        );

        const photoResult =
          await photoResponse.json();

        if (!photoResponse.ok) {
          console.error(
            "Photo upload error:",
            photoResult
          );

          alert(
            "Goat was saved, but the photo could not be uploaded."
          );
        }
      }

      alert("Goat added successfully!");

      navigate(`/goats/${goatId}`);
    } catch (err) {
      console.error(
        "Add goat error:",
        err
      );

      alert(
        "Database or network error."
      );

      setSaving(false);
    }
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
            }}
          >
            🐐 Add Goat
          </h1>

          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              color: "#666",
            }}
          >
            Register a new goat in the farm.
          </p>
        </div>

        <Link
          to="/goats"
          className="button"
        >
          ← Back
        </Link>
      </div>

      <div
        className="card"
        style={{
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* PHOTO */}

          <div
            style={{
              marginBottom: "30px",
              padding: "20px",
              background: "#f7f9f7",
              borderRadius: "12px",
              border: "1px solid #e0e5e0",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "15px",
              }}
            >
              📷 Goat Photo
            </h2>

            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Goat preview"
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "1px solid #ccc",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "180px",
                    height: "180px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#e9ece9",
                    borderRadius: "12px",
                    fontSize: "75px",
                  }}
                >
                  🐐
                </div>
              )}

              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Select a photo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handlePhotoChange
                  }
                />

                <p
                  style={{
                    marginTop: "8px",
                    color: "#777",
                    fontSize: "13px",
                  }}
                >
                  JPG, PNG or another image format.
                </p>
              </div>
            </div>
          </div>

          {/* BASIC INFORMATION */}

          <h2>
            Basic Information
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div>
              <label>Ear Tag</label>

              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Breed</label>

              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Sex</label>

              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
              >
                <option value="Female">
                  Female
                </option>

                <option value="Male">
                  Male
                </option>
              </select>
            </div>

            <div>
              <label>Date of Birth</label>

              <input
                type="date"
                name="date_of_birth"
                value={
                  formData.date_of_birth
                }
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Weight (kg)</label>

              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label>Color</label>

              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Healthy">
                  Healthy
                </option>

                <option value="Sick">
                  Sick
                </option>

                <option value="Treated">
                  Treated
                </option>

                <option value="Sold">
                  Sold
                </option>

                <option value="Dead">
                  Dead
                </option>
              </select>
            </div>
          </div>

          {/* NOTES */}

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <label>Notes</label>

            <textarea
              name="notes"
              rows="5"
              value={formData.notes}
              onChange={handleChange}
              style={{
                width: "100%",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          {/* BUTTONS */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "25px",
            }}
          >
            <button
              className="button"
              type="submit"
              disabled={saving}
              style={{
                opacity: saving ? 0.6 : 1,
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {saving
                ? "Saving..."
                : "💾 Save Goat"}
            </button>

            <Link
              className="button"
              to="/goats"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddGoat;
