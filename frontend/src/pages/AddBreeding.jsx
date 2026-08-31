import { useLanguage } from "../context/LanguageContext";
import API_URL from "../api";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddBreeding() {
  const { t } = useLanguage();
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

  useEffect(() => {
    fetch(`${API_URL}/api/goats`)
      .then((res) => res.json())
      .then((data) => setGoats(data))
      .catch(console.error);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    const updated = {
      ...formData,
      [name]: value,
    };

    if (name === "mating_date") {
      const date = new Date(value);
      date.setDate(date.getDate() + 150);

      updated.expected_kidding = date.toISOString().split("T")[0];
    }

    setFormData(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch(`${API_URL}/api/breeding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    alert(data.message);
    navigate("/breeding");
  }

  return (
    <div className="page">
      <div className="card">
        <h1>🧬 {t("newBreedingRecord")}</h1>

        <form onSubmit={handleSubmit}>

          <p>{t("doe")}</p>
          <select
            name="doe_id"
            value={formData.doe_id}
            onChange={handleChange}
            required
          >
            <option value="">{t("selectDoe")}</option>

            {goats
              .filter((g) => String(g.sex || "").trim().toLowerCase() === "female")
              .map((g) => (
                <option key={g.id} value={g.id}>
                  {g.tag} - {g.name}
                </option>
              ))}
          </select>

          <p>{t("buck")}</p>
          <select
            name="buck_id"
            value={formData.buck_id}
            onChange={handleChange}
            required
          >
            <option value="">{t("selectBuck")}</option>

            {goats
              .filter((g) => String(g.sex || "").trim().toLowerCase() === "male")
              .map((g) => (
                <option key={g.id} value={g.id}>
                  {g.tag} - {g.name}
                </option>
              ))}
          </select>

          <p>{t("matingDate")}</p>
          <input
            type="date"
            name="mating_date"
            value={formData.mating_date}
            onChange={handleChange}
            required
          />

          <p>{t("expectedKidding")}</p>
          <input
            type="date"
            value={formData.expected_kidding}
            readOnly
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
            rows="4"
            value={formData.notes}
            onChange={handleChange}
          />

          <br />
          <br />

          <button className="button" type="submit">
            💾 {t("save")}
          </button>

          {" "}

          <Link className="button" to="/breeding">
            {t("cancel")}
          </Link>

        </form>
      </div>
    </div>
  );
}

export default AddBreeding;
