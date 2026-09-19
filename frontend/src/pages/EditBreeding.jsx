import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditBreeding() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [goats, setGoats] = useState([]);
  const [formData, setFormData] = useState({
    doe_id: "",
    buck_id: "",
    mating_date: "",
    expected_kidding: "",
    veterinarian: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [goatsResponse, breedingResponse] = await Promise.all([
          fetch(`${API_URL}/api/goats`),
          fetch(`${API_URL}/api/breeding`),
        ]);

        const goatsData = await goatsResponse.json();
        const breedingData = await breedingResponse.json();

        setGoats(Array.isArray(goatsData) ? goatsData : []);

        const record = breedingData.find(
          (item) => String(item.id) === String(id)
        );

        if (!record) {
          alert("Breeding record not found.");
          navigate("/breeding");
          return;
        }

        setFormData({
          doe_id: record.doe_id ?? "",
          buck_id: record.buck_id ?? "",
          mating_date: record.mating_date
            ? String(record.mating_date).split("T")[0]
            : "",
          expected_kidding: record.expected_kidding
            ? String(record.expected_kidding).split("T")[0]
            : "",
          veterinarian: record.veterinarian ?? "",
          notes: record.notes ?? "",
        });
      } catch (error) {
        console.error("Failed to load breeding record:", error);
        alert("Failed to load breeding record.");
        navigate("/breeding");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;

    const updated = {
      ...formData,
      [name]: value,
    };

    if (name === "mating_date" && value) {
      const date = new Date(value + "T00:00:00");
      date.setDate(date.getDate() + 150);
      updated.expected_kidding = date.toISOString().split("T")[0];
    }

    setFormData(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/breeding/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update breeding record.");
      }

      alert(data.message || "Breeding record updated successfully.");
      navigate("/breeding");
    } catch (error) {
      console.error("Failed to update breeding record:", error);
      alert(error.message);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div
        style={{
          width: "100%",
          maxWidth: "620px",
          margin: "0 auto",
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
          <h1 style={{ margin: 0 }}>
            ✏️ {t("edit")} {t("breedingRecords")}
          </h1>

          <Link
            className="button"
            to="/breeding"
            style={{ whiteSpace: "nowrap" }}
          >
            ← {t("cancel")}
          </Link>
        </div>

        <div
          className="card"
          style={{
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <form onSubmit={handleSubmit} className="breeding-edit-form">

            <div className="breeding-edit-field">
              <label>{t("doe")}</label>
              <select
                name="doe_id"
                value={formData.doe_id}
                onChange={handleChange}
                required
              >
                <option value="">{t("selectDoe")}</option>
                {goats
                  .filter((g) => g.sex === "Female")
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.tag} - {g.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="breeding-edit-field">
              <label>{t("buck")}</label>
              <select
                name="buck_id"
                value={formData.buck_id}
                onChange={handleChange}
                required
              >
                <option value="">{t("selectBuck")}</option>
                {goats
                  .filter((g) => g.sex === "Male")
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.tag} - {g.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="breeding-edit-field">
              <label>{t("matingDate")}</label>
              <div style={{ position: "relative", width: "100%" }}>
                <div style={{ width: "100%", color: formData.mating_date ? "#222" : "#777", pointerEvents: "none" }}>
                  {formData.mating_date ? new Date(formData.mating_date + "T00:00:00").toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric" }) : "DD-MM-JJJJ"}
                </div>
                <input type="date" name="mating_date" value={formData.mating_date} onChange={handleChange} required
                  onClick={(e) => e.currentTarget.showPicker?.()} onFocus={(e) => e.currentTarget.showPicker?.()}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} />
              </div>
            </div>

            <div className="breeding-edit-field">
              <label>{t("expectedKidding")}</label>
              <input
                type="date"
                value={formData.expected_kidding}
                readOnly
              />
            </div>

            <div className="breeding-edit-field">
              <label>{t("veterinarian")}</label>
              <input
                type="text"
                name="veterinarian"
                value={formData.veterinarian}
                onChange={handleChange}
              />
            </div>

            <div className="breeding-edit-field">
              <label>{t("notes")}</label>
              <textarea
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="breeding-edit-actions">
              <button className="button" type="submit">
                💾 {t("save")}
              </button>

              <Link className="button" to="/breeding">
                {t("cancel")}
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditBreeding;
