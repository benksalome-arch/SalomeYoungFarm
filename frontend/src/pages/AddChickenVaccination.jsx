import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddChickenVaccination() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [chickens, setChickens] = useState([]);

  const [formData, setFormData] = useState({
    chicken_id: "",
    vaccination_date: new Date().toISOString().split("T")[0],
    vaccine_name: "",
    dosage: "",
    next_due_date: "",
    administered_by: "",
    notes: "",
  });

  useEffect(() => {
    loadChickens();
  }, []);

  async function loadChickens() {
    try {
      const response = await fetch(
        `${API_URL}/api/chickens`
      );

      const data = await response.json();

      setChickens(
        data.filter(
          (c) =>
            c.status === "Active" &&
            Number(c.quantity) > 0
        )
      );

    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/chicken-vaccinations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/chicken-vaccinations");
      }

    } catch (err) {
      console.error(err);
      alert(t("failedSaveVaccination"));
    }
  }

  return (
    <div className="page">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1>💉 {t("recordChickenVaccination")}</h1>
        </div>

        <Link
          className="button"
          to="/chicken-vaccinations"
        >
          ← {t("back")}
        </Link>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit}>

          <label>{t("chicken")}</label>

          <select
            name="chicken_id"
            value={formData.chicken_id}
            onChange={handleChange}
            required
          >
            <option value="">{t("selectChicken")}</option>

            {chickens.map((chicken) => (
              <option
                key={chicken.id}
                value={chicken.id}
              >
                {chicken.tag_number} - {chicken.name}
              </option>
            ))}
          </select>

          <br /><br />

          <label>{t("vaccinationDate")}</label>

          <input
            type="date"
            name="vaccination_date"
            value={formData.vaccination_date}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>{t("vaccineName")}</label>

          <input
            type="text"
            name="vaccine_name"
            value={formData.vaccine_name}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>{t("dosage")}</label>

          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("nextDueDate")}</label>

          <input
            type="date"
            name="next_due_date"
            value={formData.next_due_date}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("administeredBy")}</label>

          <input
            type="text"
            name="administered_by"
            value={formData.administered_by}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("notes")}</label>

          <textarea
            rows="4"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <br /><br />

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="button"
              type="submit"
            >
              💾 {t("save")}
            </button>

            <Link
              className="button"
              to="/chicken-vaccinations"
            >
              {t("cancel")}
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}

export default AddChickenVaccination;
