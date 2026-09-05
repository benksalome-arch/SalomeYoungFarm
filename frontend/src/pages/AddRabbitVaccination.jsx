import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddRabbitVaccination() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [rabbits, setRabbits] = useState([]);

  const [formData, setFormData] = useState({
    rabbit_id: "",
    vaccination_date: "",
    vaccine_name: "",
    dosage: "",
    next_due_date: "",
    administered_by: "",
    notes: "",
  });

  useEffect(() => {
    loadRabbits();
  }, []);

  async function loadRabbits() {
    try {
      const response = await fetch(
        `${API_URL}/api/rabbits`
      );

      const data = await response.json();

      setRabbits(
        data.filter(
          (rabbit) =>
            rabbit.status === "Active" ||
            rabbit.status === undefined
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
        `${API_URL}/api/rabbit-vaccinations`,
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
        navigate("/rabbit-vaccinations");
      }

    } catch (err) {
      console.error(err);
      alert(t("failedToSaveVaccination"));
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
          <h1>💉 {t("recordRabbitVaccination")}</h1>
        </div>

        <Link
          className="button"
          to="/rabbit-vaccinations"
        >
          ← {t("back")}
        </Link>
      </div>

      <div className="card">

        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            background: "#ffffff",
            padding: "30px",
            borderRadius: "14px",
            boxShadow: "0 3px 14px rgba(0,0,0,0.08)",
          }}
        >
          <div className="vaccination-form-grid">

            <div className="vaccination-field">
              <label>{t("rabbit")}</label>
              <select
                name="rabbit_id"
                value={formData.rabbit_id}
                onChange={handleChange}
                required
              >
                <option value="">{t("selectRabbit")}</option>

                {rabbits.map((rabbit) => (
                  <option
                    key={rabbit.id}
                    value={rabbit.id}
                  >
                    {rabbit.tag_number} - {rabbit.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="vaccination-field">
              <label>{t("vaccinationDate")}</label>
              <input
                type="date"
                name="vaccination_date"
                value={formData.vaccination_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="vaccination-field">
              <label>{t("vaccineName")}</label>
              <input
                type="text"
                name="vaccine_name"
                value={formData.vaccine_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="vaccination-field">
              <label>{t("dosage")}</label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
              />
            </div>

            <div className="vaccination-field">
              <label>{t("nextDueDate")}</label>
              <input
                type="date"
                name="next_due_date"
                value={formData.next_due_date}
                onChange={handleChange}
              />
            </div>

            <div className="vaccination-field">
              <label>{t("administeredBy")}</label>
              <input
                type="text"
                name="administered_by"
                value={formData.administered_by}
                onChange={handleChange}
              />
            </div>

            <div
              className="vaccination-field"
              style={{ gridColumn: "1 / -1" }}
            >
              <label>{t("notes")}</label>
              <textarea
                rows="4"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "28px",
            }}
          >
            <Link
              className="button"
              to="/rabbit-vaccinations"
            >
              {t("cancel")}
            </Link>

            <button
              className="button"
              type="submit"
            >
              💾 {t("save")}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}

export default AddRabbitVaccination;
