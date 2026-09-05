import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddRabbitWeight() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [rabbit, setRabbit] = useState(null);

  const [formData, setFormData] = useState({
    weight_date: new Date().toISOString().split("T")[0],
    weight: "",
    unit: "kg",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ======================================
  // Load Rabbit
  // ======================================

  useEffect(() => {
    loadRabbit();
  }, [id]);

  async function loadRabbit() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/rabbits/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not load rabbit.");
        return;
      }

      setRabbit(data);
    } catch (err) {
      console.error(err);
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  // ======================================
  // Handle Input
  // ======================================

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ======================================
  // Save Weight
  // ======================================

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!formData.weight_date) {
      setError("Weight date is required.");
      return;
    }

    if (!formData.weight) {
      setError("Weight is required.");
      return;
    }

    if (Number(formData.weight) <= 0) {
      setError("Weight must be greater than zero.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/rabbit-weight`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rabbit_id: Number(id),
            weight_date: formData.weight_date,
            weight: Number(formData.weight),
            unit: formData.unit,
            notes: formData.notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to save weight record.");
        return;
      }

      alert(
        data.message || "Rabbit weight record added successfully!"
      );

      navigate(`/rabbits/${id}/weight`);
    } catch (err) {
      console.error(err);
      setError("Could not connect to the server.");
    } finally {
      setSaving(false);
    }
  }

  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="card">
        <h2>{t("loadingRabbit")}</h2>
      </div>
    );
  }

  // ======================================
  // Rabbit Not Found
  // ======================================

  if (!rabbit) {
    return (
      <div className="card">
        <h2>{t("rabbitNotFound")}</h2>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <Link
          className="button"
          to="/rabbits"
        >
          ← {t("back")}
        </Link>
      </div>
    );
  }

  // ======================================
  // Form
  // ======================================

  return (
    <div>
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "20px",
        }}
      >
        <div>
          <h1>⚖ {t("addRabbitWeight")}</h1>

          <p>
            Record a new weight for{" "}
            <strong>
              {rabbit.name || t("rabbit")}
            </strong>{" "}
            ({rabbit.tag_number})
          </p>
        </div>

        <Link
          className="button"
          to={`/rabbits/${id}/weight`}
        >
          ← {t("back")}
        </Link>
      </div>

      {/* Form */}

      <div className="card">
        <form onSubmit={handleSubmit}>

          {/* Rabbit */}

          <div
            style={{
              marginBottom: "15px",
            }}
          >
            <label>
              <strong>{t("rabbit")}</strong>
            </label>

            <input
              type="text"
              value={`${rabbit.tag_number} - ${
                rabbit.name || t("rabbit")
              }`}
              disabled
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                boxSizing: "border-box",
                background: "#f1f1f1",
              }}
            />
          </div>

          {/* Date */}

          <div
            style={{
              marginBottom: "15px",
            }}
          >
            <label>
              <strong>{t("weightDate")}</strong>
            </label>

            <input
              type="date"
              name="weight_date"
              value={formData.weight_date}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Weight */}

          <div
            style={{
              marginBottom: "15px",
            }}
          >
            <label>
              <strong>{t("weight")}</strong>
            </label>

            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              placeholder={t("enterWeight")}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Unit */}

          <div
            style={{
              marginBottom: "15px",
            }}
          >
            <label>
              <strong>{t("unit")}</strong>
            </label>

            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            >
              <option value="kg">
                Kilograms (kg)
              </option>

              <option value="g">
                Grams (g)
              </option>
            </select>
          </div>

          {/* Notes */}

          <div
            style={{
              marginBottom: "15px",
            }}
          >
            <label>
              <strong>{t("notes")}</strong>
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder={t("optionalNotes")}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          {/* Error */}

          {error && (
            <div
              style={{
                background: "#ffebee",
                color: "#c62828",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "15px",
              }}
            >
              {error}
            </div>
          )}

          {/* Buttons */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              className="button"
              disabled={saving}
              style={{
                background: "#1B5E20",
                color: "white",
              }}
            >
              {saving
                ? t("saving")
                : `💾 ${t("saveWeightRecord")}`}
            </button>

            <Link
              className="button"
              to={`/rabbits/${id}/weight`}
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddRabbitWeight;
