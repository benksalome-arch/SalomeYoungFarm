import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddRabbit() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tag_number: "",
    name: "",
    breed: "",
    sex: "Female",
    birth_date: "",
    source: "",
    quantity: 1,
    status: "Active",
    purchase_price: "",
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

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      purchase_price:
        formData.purchase_price === ""
          ? 0
          : Number(formData.purchase_price),
    };

    try {
      const response = await fetch(
        `${API_URL}/api/rabbits`,
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
        navigate("/rabbits");
      }

    } catch (err) {
      console.error(err);
      alert(t("failedToSaveRabbit"));
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>🐇 {t("addRabbit")}</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

            <div>
              <label>{t("tagNumber")}</label>
              <input
                type="text"
                name="tag_number"
                value={formData.tag_number}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>{t("name")}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>{t("breed")}</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>{t("sex")}</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
              >
                <option value="Female">{t("female")}</option>
                <option value="Male">{t("male")}</option>
              </select>
            </div>

            <div>
              <label>{t("birthDate")}</label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>{t("source")}</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>{t("quantity")}</label>
              <input
                type="number"
                min="1"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>{t("status")}</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">{t("active")}</option>
                <option value="Sold">{t("sold")}</option>
                <option value="Dead">{t("dead")}</option>
              </select>
            </div>

            <div>
              <label>{t("purchasePrice")}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label>{t("notes")}</label>
              <textarea
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button className="button" type="submit">
              💾 {t("save")}
            </button>

            <Link className="button" to="/rabbits">
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRabbit;
