import API_URL from "../api";
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddWeightRecord() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    goat_id: id,
    weight: "",
    record_date: "",
    notes: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/weight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      alert(data.message);
      navigate(`/goats/${id}/weight`);
    } catch (error) {
      console.error(error);
      alert(t("failedToSaveWeightRecord"));
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>⚖ {t("addWeightRecord")}</h1>

        <form onSubmit={handleSubmit}>
          <p>{t("date")}</p>
          <div style={{ position: "relative", width: "100%" }}>
            <div style={{ width: "100%", color: formData.record_date ? "#222" : "#777", pointerEvents: "none" }}>
              {formData.record_date ? new Date(formData.record_date + "T00:00:00").toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric" }) : "DD-MM-JJJJ"}
            </div>
            <input type="date" name="record_date" value={formData.record_date} onChange={handleChange} required
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} />
          </div>

          <p>{t("weightKg")}</p>
          <input
            type="number"
            step="0.01"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
          />

          <p>{t("notes")}</p>
          <textarea
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
          />

          <br />
          <br />

          <button className="button" type="submit">
            💾 Save Weight
          </button>

          {" "}

          <Link className="button" to={`/goats/${id}/weight`}>
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
}

export default AddWeightRecord;
