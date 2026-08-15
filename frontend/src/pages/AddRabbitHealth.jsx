import API_URL from "../api";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function AddRabbitHealth() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rabbit_id: id,
    treatment_date: new Date().toISOString().split("T")[0],
    treatment_type: "",
    diagnosis: "",
    medication: "",
    veterinarian: "",
    cost: 0,
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  const costValue = Number(formData.cost || 0);

  const formValid =
    formData.rabbit_id &&
    formData.treatment_date &&
    formData.treatment_type.trim() &&
    costValue >= 0;

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!formData.treatment_date) {
      setError("Please select the treatment date.");
      return;
    }

    if (!formData.treatment_type.trim()) {
      setError("Please enter the treatment type.");
      return;
    }

    if (costValue < 0) {
      setError("Cost cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/rabbit-health`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            treatment_type:
              formData.treatment_type.trim(),
            diagnosis:
              formData.diagnosis.trim() || null,
            medication:
              formData.medication.trim() || null,
            veterinarian:
              formData.veterinarian.trim() || null,
            cost: costValue,
            notes:
              formData.notes.trim() || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to save health record."
        );
        return;
      }

      alert(
        data.message ||
          "Rabbit health record added successfully!"
      );

      navigate(`/rabbits/${id}/health`);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to save rabbit health record. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

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
          <h1>🏥 Add Rabbit Health Record</h1>

          <p>
            Record a medical treatment or health event.
          </p>
        </div>

        <Link
          className="button"
          to={`/rabbits/${id}/health`}
        >
          ← Back to Health
        </Link>
      </div>

      {/* Error */}

      {error && (
        <div
          style={{
            background: "#FFEBEE",
            color: "#B71C1C",
            padding: "12px 15px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          âš ï¸ {error}
        </div>
      )}

      {/* Form */}

      <div className="card">
        <form onSubmit={handleSubmit}>

          {/* Treatment Date */}

          <label>
            <strong>Treatment Date</strong>
          </label>

          <input
            type="date"
            name="treatment_date"
            value={formData.treatment_date}
            onChange={handleChange}
            disabled={saving}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
            }}
          />

          <br />
          <br />

          {/* Treatment Type */}

          <label>
            <strong>Treatment Type</strong>
          </label>

          <input
            type="text"
            name="treatment_type"
            value={formData.treatment_type}
            onChange={handleChange}
            disabled={saving}
            placeholder="e.g. Treatment, Checkup, Deworming"
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
            }}
          />

          <br />
          <br />

          {/* Diagnosis */}

          <label>
            <strong>Diagnosis</strong>
          </label>

          <input
            type="text"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            disabled={saving}
            placeholder="Enter diagnosis"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
            }}
          />

          <br />
          <br />

          {/* Medication */}

          <label>
            <strong>Medication</strong>
          </label>

          <input
            type="text"
            name="medication"
            value={formData.medication}
            onChange={handleChange}
            disabled={saving}
            placeholder="Enter medication"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
            }}
          />

          <br />
          <br />

          {/* Veterinarian */}

          <label>
            <strong>Veterinarian</strong>
          </label>

          <input
            type="text"
            name="veterinarian"
            value={formData.veterinarian}
            onChange={handleChange}
            disabled={saving}
            placeholder="Veterinarian name"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
            }}
          />

          <br />
          <br />

          {/* Cost */}

          <label>
            <strong>Cost</strong>
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            disabled={saving}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
            }}
          />

          {costValue > 0 && (
            <p
              style={{
                color: "#2E7D32",
                fontWeight: "600",
                marginTop: "8px",
              }}
            >
              💰 This cost will automatically be
              recorded as a Rabbit Health expense in
              Finance.
            </p>
          )}

          {costValue === 0 && (
            <p
              style={{
                color: "#616161",
                marginTop: "8px",
              }}
            >
              No Finance expense will be created when
              the cost is 0.
            </p>
          )}

          <br />

          {/* Notes */}

          <label>
            <strong>Notes</strong>
          </label>

          <textarea
            rows="4"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            disabled={saving}
            placeholder="Additional health notes..."
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              resize: "vertical",
            }}
          />

          <br />
          <br />

          {/* Buttons */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="button"
              type="submit"
              disabled={!formValid || saving}
              style={{
                opacity:
                  !formValid || saving ? 0.5 : 1,
                cursor:
                  !formValid || saving
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {saving
                ? "Saving..."
                : "💾 Save Health Record"}
            </button>

            <Link
              className="button"
              to={`/rabbits/${id}/health`}
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddRabbitHealth;
