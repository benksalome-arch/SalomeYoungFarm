import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddChickenMortality() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [chickens, setChickens] = useState([]);

  const [formData, setFormData] = useState({
    chicken_id: "",
    mortality_date: new Date().toISOString().split("T")[0],
    quantity: 1,
    cause: "",
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

      // Only active flocks with birds remaining
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
        `${API_URL}/api/chicken-mortality`,
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
        navigate("/chicken-mortality");
      }

    } catch (err) {
      console.error(err);
      alert(t("failedRecordMortality"));
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
          <h1>🐔 {t("recordChickenMortality")}</h1>
          <p>Record deaths and automatically update flock quantity.</p>
        </div>

        <Link
          className="button"
          to="/chicken-mortality"
        >
          ← Back
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
            <option value="">
              {t("selectChicken")}
            </option>

            {chickens.map((chicken) => (
              <option
                key={chicken.id}
                value={chicken.id}
              >
                {chicken.tag_number} - {chicken.name} ({chicken.quantity})
              </option>
            ))}

          </select>

          <br /><br />

          <label>{t("date")}</label>

          <input
            type="date"
            name="mortality_date"
            value={formData.mortality_date}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>{t("quantity")}</label>

          <input
            type="number"
            min="1"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>{t("cause")}</label>

          <input
            type="text"
            name="cause"
            value={formData.cause}
            onChange={handleChange}
            placeholder={t("mortalityCausePlaceholder")}
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

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              className="button"
              type="submit"
            >
              💾 {t("save")}
            </button>

            <Link
              className="button"
              to="/chicken-mortality"
            >
              {t("cancel")}
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}

export default AddChickenMortality;
