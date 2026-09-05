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
    vaccination_date: "",
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
      const response = await fetch(`${API_URL}/api/chickens`);
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

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    minWidth: 0,
  };

  const labelStyle = {
    display: "block",
    fontWeight: 600,
    fontSize: "15px",
    lineHeight: 1.3,
    margin: 0,
  };

  const inputStyle = {
    width: "100%",
    minWidth: 0,
    height: "44px",
    padding: "9px 12px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    boxSizing: "border-box",
    fontSize: "15px",
  };

  const textareaStyle = {
    width: "100%",
    minWidth: 0,
    padding: "10px 12px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    boxSizing: "border-box",
    fontSize: "15px",
    resize: "vertical",
    minHeight: "120px",
  };

  return (
    <div
      className="page"
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* PAGE HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(30px, 4vw, 44px)",
              lineHeight: 1.15,
            }}
          >
            💉 {t("recordChickenVaccination")}
          </h1>
        </div>

        <Link
          className="button"
          to="/chicken-vaccinations"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          ← {t("back")}
        </Link>
      </div>

      {/* FORM CARD */}
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "clamp(18px, 3vw, 32px)",
          boxSizing: "border-box",
        }}
      >
        <form onSubmit={handleSubmit}>

          {/* VACCINATION DETAILS */}
          <section>
            <h2
              style={{
                margin: "0 0 20px",
                fontSize: "22px",
                lineHeight: 1.3,
              }}
            >
              💉 {t("recordChickenVaccination")}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
                gap: "20px",
                width: "100%",
              }}
            >
              {/* CHICKEN */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("chicken")}
                </label>

                <select
                  name="chicken_id"
                  value={formData.chicken_id}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">
                    {t("selectChicken")}
                  </option>

                  {chickens.map((chicken) => (
                    <option
                      key={chicken.id}
                      value={chicken.id}
                    >
                      {chicken.tag_number} - {chicken.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* VACCINATION DATE */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("vaccinationDate")}
                </label>

                <input
                  type="date"
                  name="vaccination_date"
                  value={formData.vaccination_date}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              {/* VACCINE NAME */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("vaccineName")}
                </label>

                <input
                  type="text"
                  name="vaccine_name"
                  value={formData.vaccine_name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              {/* DOSAGE */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("dosage")}
                </label>

                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* NEXT DUE DATE */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("nextDueDate")}
                </label>

                <input
                  type="date"
                  name="next_due_date"
                  value={formData.next_due_date}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* ADMINISTERED BY */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {t("administeredBy")}
                </label>

                <input
                  type="text"
                  name="administered_by"
                  value={formData.administered_by}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>
          </section>

          {/* NOTES */}
          <div
            style={{
              marginTop: "24px",
            }}
          >
            <label style={labelStyle}>
              {t("notes")}
            </label>

            <textarea
              rows="5"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              style={{
                ...textareaStyle,
                marginTop: "7px",
              }}
            />
          </div>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "25px",
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