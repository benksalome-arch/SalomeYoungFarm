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
          <input
            type="date"
            name="record_date"
            value={formData.record_date}
            onChange={handleChange}
            required
          />

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
