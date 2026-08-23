import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function EditGoat() {
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

  useEffect(() => {
    fetch(`${API_URL}/api/goats/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          tag: data.tag || "",
          name: data.name || "",
          breed: data.breed || "",
          sex: data.sex || "Female",
          date_of_birth: data.date_of_birth
            ? String(data.date_of_birth).split("T")[0]
            : "",
          weight: data.weight ?? "",
          status: data.status || "Healthy",
          color: data.color || "",
          notes: data.notes || "",
        });

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
      const uploadData = new FormData();
      uploadData.append("photo", selectedFile);

      const response = await fetch(
        `${API_URL}/api/photos/${id}`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to upload photo.");
        return;
      }

      setPhoto(data.photo || "");

      setSelectedFile(null);
      setPhotoPreview("");

      alert(
        data.message ||
          "Goat photo uploaded successfully."
      );
    } catch (err) {
      console.error("Photo upload error:", err);
      alert("Failed to upload photo.");
    }
  }

  async function deletePhoto() {
    if (!photo) {
      return;
    }

    if (!window.confirm("Delete goat photo?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/photos/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete photo.");
        return;
      }

      setPhoto("");
      setSelectedFile(null);
      setPhotoPreview("");

      alert(
        data.message ||
          "Goat photo deleted successfully."
      );
    } catch (err) {
      console.error("Photo delete error:", err);
      alert("Failed to delete photo.");
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

      const response = await fetch(
        `${API_URL}/api/goats/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Update goat error:", data);
        alert(
          data.message ||
            "Failed to update goat."
        );
        return;
      }

      alert(
        data.message ||
          "Goat updated successfully."
      );

      navigate("/goats");
    } catch (err) {
      console.error("Update goat error:", err);
      alert("Database error.");
    }
  }

  const displayedPhoto = photoPreview
    ? photoPreview
    : photo
      ? `${API_URL}/uploads/goats/${photo}`
      : "";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
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
          ✏️ Edit Goat
        </h1>

        <Link
          to={`/goats/${id}`}
          className="button"
          style={{
            textDecoration: "none",
          }}
        >
          ← Profile
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
          📷 Goat Photo
        </h2>

        {displayedPhoto ? (
          <img
            src={displayedPhoto}
            alt="Goat"
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
            📤 Upload Photo
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
              🗑 Delete Photo
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <p>Tag</p>
          <input
            name="tag"
            value={formData.tag}
            onChange={handleChange}
          />

          <p>Name</p>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <p>Breed</p>
          <input
            name="breed"
            value={formData.breed}
            onChange={handleChange}
          />

          <p>Sex</p>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
          >
            <option>Female</option>
            <option>Male</option>
          </select>

          <p>Date of Birth</p>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
          />

          <p>Weight</p>
          <input
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />

          <p>Status</p>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Healthy</option>
            <option>Sick</option>
            <option>Treated</option>
            <option>Sold</option>
          </select>

          <p>Color</p>
          <input
            name="color"
            value={formData.color}
            onChange={handleChange}
          />

          <p>Notes</p>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          />

          <br />
          <br />

          <button
            type="submit"
            className="button"
          >
            Update Goat
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditGoat;
