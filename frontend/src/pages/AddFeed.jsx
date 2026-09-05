import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddFeed() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    feed_name: "",
    category: "Goat",
    quantity: "",
    unit: "kg",
    minimum_stock: "",
    cost_per_unit: "",
    supplier: "",
    purchase_date: new Date().toISOString().split("T")[0],
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
      const response = await fetch(`${API_URL}/api/feed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/feed");
      }
    } catch (err) {
      console.error(err);
      alert(t("serverConnectionFailed"));
    }
  }

  const labelStyle = {
    display: "block",
    fontWeight: "600",
    marginBottom: "8px",
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div className="page">
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "6px" }}>
            🌾 {t("addFeed")}
          </h1>

          <p style={{ margin: 0 }}>
            {t("addFeedDescription")}
          </p>
        </div>

        <Link
          className="button"
          to="/feed"
          style={{
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          ← {t("back")}
        </Link>
      </div>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "30px",
          boxSizing: "border-box",
          borderRadius: "14px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginTop: 0,
            marginBottom: "30px",
          }}
        >
          🌾 {t("feedManagement")}
        </h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: "24px 28px",
              alignItems: "start",
            }}
          >
            <div>
              <label
                htmlFor="feed_name"
                style={labelStyle}
              >
                {t("feedName")}
              </label>

              <input
                id="feed_name"
                type="text"
                name="feed_name"
                value={formData.feed_name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label
                htmlFor="category"
                style={labelStyle}
              >
                {t("category")}
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Goat">
                  {t("goat")}
                </option>

                <option value="Chicken">
                  {t("chicken")}
                </option>

                <option value="Rabbit">
                  {t("rabbit")}
                </option>

                <option value="General">
                  {t("general")}
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="quantity"
                style={labelStyle}
              >
                {t("quantity")}
              </label>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  background: "white",
                  overflow: "hidden",
                }}
              >
                <input
                  id="quantity"
                  type="number"
                  step="0.01"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  style={{
                    ...inputStyle,
                    flex: 1,
                    minWidth: 0,
                    border: "none",
                    outline: "none",
                    borderRadius: 0,
                    margin: 0,
                  }}
                />

                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  aria-label={t("unit")}
                  style={{
                    width: "105px",
                    flexShrink: 0,
                    padding: "10px 8px",
                    border: "none",
                    borderLeft: "1px solid #ddd",
                    outline: "none",
                    background: "white",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  <option value="kg">
                    {t("kg")}
                  </option>
                  <option value="bags">
                    {t("bags")}
                  </option>
                  <option value="litres">
                    {t("litres")}
                  </option>
                  <option value="pieces">
                    {t("pieces")}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="minimum_stock"
                style={labelStyle}
              >
                {t("minimumStock")}
              </label>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  background: "white",
                  overflow: "hidden",
                }}
              >
                <input
                  id="minimum_stock"
                  type="number"
                  step="0.01"
                  name="minimum_stock"
                  value={formData.minimum_stock}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    flex: 1,
                    minWidth: 0,
                    border: "none",
                    outline: "none",
                    borderRadius: 0,
                    margin: 0,
                  }}
                />

                <select
                  value={formData.unit}
                  onChange={handleChange}
                  name="unit"
                  aria-label={t("unit")}
                  style={{
                    width: "105px",
                    flexShrink: 0,
                    padding: "10px 8px",
                    border: "none",
                    borderLeft: "1px solid #ddd",
                    outline: "none",
                    background: "white",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  <option value="kg">
                    {t("kg")}
                  </option>
                  <option value="bags">
                    {t("bags")}
                  </option>
                  <option value="litres">
                    {t("litres")}
                  </option>
                  <option value="pieces">
                    {t("pieces")}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="cost_per_unit"
                style={labelStyle}
              >
                {t("costPerUnitKES")}
              </label>

              <input
                id="cost_per_unit"
                type="number"
                step="0.01"
                name="cost_per_unit"
                value={formData.cost_per_unit}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label
                htmlFor="supplier"
                style={labelStyle}
              >
                {t("supplier")}
              </label>

              <input
                id="supplier"
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label
                htmlFor="purchase_date"
                style={labelStyle}
              >
                {t("purchaseDate")}
              </label>

              <input
                id="purchase_date"
                type="date"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div
              style={{
                gridColumn: "1 / -1",
              }}
            >
              <label
                htmlFor="notes"
                style={{
                  ...labelStyle,
                  textAlign: "center",
                }}
              >
                {t("notes")}
              </label>

              <textarea
                id="notes"
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
                placeholder={t("notesPlaceholder")}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "28px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="button"
              type="submit"
            >
              💾 {t("saveFeed")}
            </button>

            <Link
              className="button"
              to="/feed"
              style={{
                textDecoration: "none",
              }}
            >
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFeed;
