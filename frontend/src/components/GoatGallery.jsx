import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const API = import.meta.env.VITE_API_URL;

function GoatGallery({ goatId }) {
  const { t } = useLanguage();
  const { t } = useLanguage();
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadPhotos();
  }, [goatId]);

  async function loadPhotos() {
    try {
      const response = await fetch(`${API}/api/gallery/${goatId}`);
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function uploadPhoto() {
    if (!selectedFile) {
      alert("Please select a photo.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      const response = await fetch(
        `${API}/api/gallery/${goatId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      alert(data.message);

      setSelectedFile(null);

      loadPhotos();
    } catch (error) {
      console.error(error);
      alert(t("failedToUploadPhoto"));
    }
  }

  async function deletePhoto(photoId) {
    if (!window.confirm("Delete this photo?")) return;

    try {
      const response = await fetch(
        `${API}/api/gallery/photo/${photoId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      alert(data.message);

      loadPhotos();
    } catch (error) {
      console.error(error);
      alert(t("failedToDeletePhoto"));
    }
  }

  return (
    <div>
      <h2>📷 {t("photoGallery")}</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setSelectedFile(e.target.files[0])
          }
        />

        <button
          className="button"
          onClick={uploadPhoto}
        >
          {t("upload")}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(180px,1fr))",
          gap: "20px",
        }}
      >
        {photos.length === 0 ? (
          <p>{t("noGalleryPhotos")}</p>
        ) : (
          photos.map((photo) => (
            <div
              key={photo.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <img
                src={`${API}/uploads/goats/${photo.photo}`}
                alt=""
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />

              <div
                style={{
                  padding: "10px",
                }}
              >
                <button
                  className="button"
                  style={{
                    width: "100%",
                    background: "#D32F2F",
                    color: "white",
                  }}
                  onClick={() => deletePhoto(photo.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GoatGallery;