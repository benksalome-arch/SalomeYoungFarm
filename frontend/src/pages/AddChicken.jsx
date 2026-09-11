import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddChicken() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tag_number: "",
    name: "",
    breed: "",
    type: "",
    sex: "Female",
    hatch_date: "",
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
      const response = await fetch(`${API_URL}/api/chickens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/chickens");
      }
    } catch (err) {
      console.error(err);
      alert(t("failedSaveChicken"));
    }
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    minHeight: "44px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    color: "#222",
    WebkitTextFillColor: "#222",
    fontSize: "15px",
  };

  return (
    <div className="page">
      <style>{`
        .add-chicken-form {
          width: 100%;
          max-width: 620px;
          margin: 0 auto;
        }

        .add-chicken-field {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .add-chicken-label {
          font-weight: 600;
          font-size: 15px;
          text-align: right;
          color: #222;
        }

        .add-chicken-notes {
          display: grid;
          grid-template-columns: 150px minmax(0, 260px);
          align-items: start;
          gap: 14px;
          margin-bottom: 20px;
        }

        .add-chicken-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 700px) {
          .add-chicken-form {
            max-width: 100%;
          }

          .add-chicken-field {
            grid-template-columns: 105px minmax(0, 1fr);
            gap: 10px;
          }

          .add-chicken-notes {
            grid-template-columns: 105px minmax(0, 1fr);
            gap: 10px;
          }

          .add-chicken-label {
            font-size: 14px;
          }
        }
      `}</style>

      <div className="page-header">
        <h1>🐔 {t("addChicken")}</h1>
        <p>{t("addChickenDescription")}</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="add-chicken-form">

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("tagNumber")}
            </label>
            <input
              style={inputStyle}
              type="text"
              name="tag_number"
              value={formData.tag_number}
              onChange={handleChange}
            />
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("name")}
            </label>
            <input
              style={inputStyle}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("breed")}
            </label>
            <input
              style={inputStyle}
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              required
              placeholder={t("chickenBreedExample")}
            />
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("type")}
            </label>
            <input
              style={inputStyle}
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder={t("chickenTypeExample")}
            />
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("sex")}
            </label>
            <select
              style={inputStyle}
              name="sex"
              value={formData.sex}
              onChange={handleChange}
            >
              <option value="Female">{t("female")}</option>
              <option value="Male">{t("male")}</option>
            </select>
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("hatchDate")}
            </label>
            <input
              type="date"
              name="hatch_date"
              value={formData.hatch_date}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("source")}
            </label>
            <input
              style={inputStyle}
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder={t("sourcePlaceholder")}
            />
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("quantity")}
            </label>
            <input
              style={inputStyle}
              type="number"
              min="1"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("status")}
            </label>
            <select
              style={inputStyle}
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">{t("active")}</option>
              <option value="Sold">{t("sold")}</option>
              <option value="Dead">{t("dead")}</option>
            </select>
          </div>

          <div className="add-chicken-field">
            <label className="add-chicken-label">
              {t("purchasePrice")}
            </label>
            <input
              style={inputStyle}
              type="number"
              step="0.01"
              min="0"
              name="purchase_price"
              value={formData.purchase_price}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div className="add-chicken-notes">
            <label className="add-chicken-label">
              {t("notes")}
            </label>

            <textarea
              style={{
                ...inputStyle,
                minHeight: "100px",
                resize: "vertical",
              }}
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              placeholder={t("additionalInformation")}
            />
          </div>

          <div className="add-chicken-buttons">
            <button className="button" type="submit">
              💾 {t("save")}
            </button>

            <Link className="button" to="/chickens">
              {t("cancel")}
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddChicken;
