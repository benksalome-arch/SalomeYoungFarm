import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditChicken() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tag_number: "",
    name: "",
    breed: "",
    type: "Layer",
    sex: "Female",
    hatch_date: "",
    source: "",
    quantity: 1,
    status: "Active",
    purchase_price: "",
    notes: "",
  });

  useEffect(() => {
    loadChicken();
  }, []);

  async function loadChicken() {
    try {
      const response = await fetch(
        `${API_URL}/api/chickens/${id}`
      );

      const data = await response.json();

      setFormData(data);

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
        `${API_URL}/api/chickens/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/chickens");
      }

    } catch (err) {
      console.error(err);
      alert(t("failedUpdateChicken"));
    }
  }

  return (
    <div className="page">

      <div className="page-header">
        <h1>🐔 {t("editChicken")}</h1>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit}>

          <label>{t("tagNumber")}</label>
          <input
            type="text"
            name="tag_number"
            value={formData.tag_number || ""}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>{t("name")}</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("breed")}</label>
          <input
            type="text"
            name="breed"
            value={formData.breed || ""}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>{t("type")}</label>
          <select
            name="type"
            value={formData.type || "Layer"}
            onChange={handleChange}
          >
            <option value="Layer">{t("layer")}</option>
            <option value="Broiler">{t("broiler")}</option>
            <option value="Cockerel">{t("cockerel")}</option>
            <option value="Cock">{t("cock")}</option>
            <option value="Hen">{t("hen")}</option>
            <option value="Chick">{t("chick")}</option>
          </select>

          <br /><br />

          <label>{t("sex")}</label>
          <select
            name="sex"
            value={formData.sex || "Female"}
            onChange={handleChange}
          >
            <option>{t("female")}</option>
            <option>{t("male")}</option>
          </select>

          <br /><br />

          <label>{t("hatchDate")}</label>
          <input
            type="date"
            name="hatch_date"
            value={formData.hatch_date?.split("T")[0] || ""}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("source")}</label>
          <input
            type="text"
            name="source"
            value={formData.source || ""}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("quantity")}</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity || 1}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("status")}</label>
          <select
            name="status"
            value={formData.status || "Active"}
            onChange={handleChange}
          >
            <option>{t("active")}</option>
            <option>{t("sold")}</option>
            <option>{t("dead")}</option>
          </select>

          <br /><br />

          <label>{t("purchasePrice")}</label>
          <input
            type="number"
            step="0.01"
            name="purchase_price"
            value={formData.purchase_price || ""}
            onChange={handleChange}
          />

          <br /><br />

          <label>{t("notes")}</label>
          <textarea
            rows="4"
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
          />

          <br /><br />

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="button" type="submit">
              💾 Update
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

export default EditChicken;
