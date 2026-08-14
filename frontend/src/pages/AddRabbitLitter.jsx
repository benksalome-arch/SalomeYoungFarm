import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AddRabbitLitter() {
  const navigate = useNavigate();

  const [breedings, setBreedings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    breeding_id: "",
    birth_date: "",
    total_kits: "",
    live_kits: "",
    dead_kits: "",
    notes: "",
  });

  useEffect(() => {
    loadBreedings();
  }, []);

  async function loadBreedings() {
    try {
      setLoading(true);

      const response = await fetch(
        "${API_URL}/api/rabbit-breeding"
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to load breeding records."
        );
        return;
      }

      setBreedings(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load breeding records.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    const total = Number(form.total_kits || 0);
    const live = Number(form.live_kits || 0);
    const dead = Number(form.dead_kits || 0);

    if (!form.breeding_id) {
      setError("Please select a breeding record.");
      return;
    }

    if (!form.birth_date) {
      setError("Please enter the birth date.");
      return;
    }

    if (total < 0 || live < 0 || dead < 0) {
      setError("Kit quantities cannot be negative.");
      return;
    }

    if (live + dead !== total) {
      setError(
        "Live kits plus dead kits must equal total kits."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "${API_URL}/api/rabbit-litters",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            breeding_id: Number(form.breeding_id),
            birth_date: form.birth_date,
            total_kits: total,
            live_kits: live,
            dead_kits: dead,
            notes: form.notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to save litter record."
        );
        return;
      }

      alert(
        data.message ||
          "Rabbit litter recorded successfully!"
      );

      navigate("/rabbit-litters");
    } catch (err) {
      console.error(err);
      setError("Failed to save litter record.");
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
          <h1>ðŸ‡ Record Rabbit Litter</h1>

          <p>
            Record the kits produced from a rabbit breeding.
          </p>
        </div>

        <Link
          className="button"
          to="/rabbit-litters"
        >
          â† Back to Litters
        </Link>
      </div>

      {/* Error */}

      {error && (
        <div
          style={{
            background: "#FFEBEE",
            color: "#C62828",
            padding: "12px 15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* Form */}

      <div className="card">
        <form onSubmit={handleSubmit}>

          {/* Breeding */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Breeding Record</strong>
            </label>

            <select
              name="breeding_id"
              value={form.breeding_id}
              onChange={handleChange}
              disabled={loading || saving}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
              }}
            >
              <option value="">
                {loading
                  ? "Loading breeding records..."
                  : "Select breeding record"}
              </option>

              {breedings.map((breeding) => (
                <option
                  key={breeding.id}
                  value={breeding.id}
                >
                  {breeding.female_tag_number} -{" "}
                  {breeding.female_name || "Female"}{" "}
                  Ã—{" "}
                  {breeding.male_tag_number || "Unknown"} -{" "}
                  {breeding.male_name || "Male"}{" "}
                  â€”{" "}
                  {breeding.breeding_date
                    ? breeding.breeding_date.split("T")[0]
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Birth Date */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Birth Date</strong>
            </label>

            <input
              type="date"
              name="birth_date"
              value={form.birth_date}
              onChange={handleChange}
              disabled={saving}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
              }}
            />
          </div>

          {/* Total Kits */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Total Kits</strong>
            </label>

            <input
              type="number"
              min="0"
              name="total_kits"
              value={form.total_kits}
              onChange={handleChange}
              disabled={saving}
              placeholder="Example: 6"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
              }}
            />
          </div>

          {/* Live Kits */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Live Kits</strong>
            </label>

            <input
              type="number"
              min="0"
              name="live_kits"
              value={form.live_kits}
              onChange={handleChange}
              disabled={saving}
              placeholder="Example: 5"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
              }}
            />
          </div>

          {/* Dead Kits */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Dead Kits</strong>
            </label>

            <input
              type="number"
              min="0"
              name="dead_kits"
              value={form.dead_kits}
              onChange={handleChange}
              disabled={saving}
              placeholder="Example: 1"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
              }}
            />
          </div>

          {/* Notes */}

          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Notes</strong>
            </label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              disabled={saving}
              rows="4"
              placeholder="Enter any notes about the litter..."
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                resize: "vertical",
              }}
            />
          </div>

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
            >
              {saving
                ? "Saving..."
                : "ðŸ’¾ Save Litter Record"}
            </button>

            <Link
              className="button"
              to="/rabbit-litters"
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddRabbitLitter;
