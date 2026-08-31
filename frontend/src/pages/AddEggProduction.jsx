import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddEggProduction() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [chickens, setChickens] = useState([]);

  const [formData, setFormData] = useState({
    chicken_id: "",
    production_date: new Date().toISOString().split("T")[0],
    eggs_collected: "",
    broken_eggs: 0,
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
      setChickens(data);
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

    const payload = {
      ...formData,
      chicken_id: Number(formData.chicken_id),
      eggs_collected: Number(formData.eggs_collected),
      broken_eggs: Number(formData.broken_eggs),
    };

    try {
      const response = await fetch(
        `${API_URL}/api/egg-production`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/egg-production");
      }
    } catch (err) {
      console.error(err);
      alert(t("failedToSaveEggProduction"));
    }
  }

  return (
    <div className="page">

      <div className="page-header">
        <h1>🥚 {t("recordEggProduction")}</h1>
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
            <option value="">
              {t("selectChicken")}
            </option>

            {chickens.map((chicken) => (
              <option
                key={chicken.id}
                value={chicken.id}
              >
                {chicken.name || chicken.tag_number}
              </option>
            ))}
          </select>

          <br /><br />

          <label>{t("productionDate")}</label>

          <input
            type="date"
            name="production_date"
            value={formData.production_date}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>{t("eggsCollected")}</label>

          <input
            type="number"
            min="0"
            name="eggs_collected"
            value={formData.eggs_collected}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>{t("brokenEggs")}</label>

          <input
            type="number"
            min="0"
            name="broken_eggs"
            value={formData.broken_eggs}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("notes")}</label>

          <textarea
            name="notes"
            rows="4"
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
              to="/egg-production"
            >
              {t("cancel")}
            </Link>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddEggProduction;
