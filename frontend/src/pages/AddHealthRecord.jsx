import API_URL from "../api";
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddHealthRecord() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    goat_id: id,
    record_date: "",
    record_type: "Vaccination",
    medicine: "",
    dosage: "",
    veterinarian: "",
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
      const response = await fetch(`${API_URL}/api/health`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      alert(data.message);

      navigate(`/goats/${id}/health`);
    } catch (error) {
      console.error(error);
      alert(t("failedToSaveHealthRecord"));
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>💉 {t("addHealthRecord")}</h1>

        <form onSubmit={handleSubmit}>

          <p>{t("date")}</p>
          <input
            type="date"
            name="record_date"
            value={formData.record_date}
            onChange={handleChange}
            required
          />

          <p>{t("recordType")}</p>
          <select
            name="record_type"
            value={formData.record_type}
            onChange={handleChange}
          >
            <option>{t("vaccination")}</option>
            <option value="Deworming">{t("deworming")}</option>
            <option value="Treatment">{t("treatment")}</option>
            <option value="Check-up">{t("checkup")}</option>
          </select>

          <p>{t("medicine")}</p>
          <input
            type="text"
            name="medicine"
            value={formData.medicine}
            onChange={handleChange}
          />

          <p>{t("dosage")}</p>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
          />

          <p>{t("veterinarian")}</p>
          <input
            type="text"
            name="veterinarian"
            value={formData.veterinarian}
            onChange={handleChange}
          />

          <p>{t("notes")}</p>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <br />
          <br />

          <button className="button" type="submit">
            Save Health Record
          </button>

          {" "}

          <Link className="button" to={`/goats/${id}/health`}>
            Cancel
          </Link>

        </form>
      </div>
    </div>
  );
}

export default AddHealthRecord;
