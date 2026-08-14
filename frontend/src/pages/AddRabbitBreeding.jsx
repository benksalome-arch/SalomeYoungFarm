import API_URL from "../api";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function AddRabbitBreeding() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rabbits, setRabbits] = useState([]);
  const [loadingRabbits, setLoadingRabbits] = useState(true);

  const [formData, setFormData] = useState({
    rabbit_id: id,
    breeding_date: new Date().toISOString().split("T")[0],
    male_rabbit_id: "",
    breeding_type: "",
    expected_birth_date: "",
    status: "Planned",
    notes: "",
  });

  // ======================================
  // Load rabbits
  // ======================================

  useEffect(() => {
    loadRabbits();
  }, [id]);

  async function loadRabbits() {
    try {
      setLoadingRabbits(true);

      const response = await fetch(
        "${API_URL}/api/rabbits"
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to load rabbits:", data);
        setRabbits([]);
        return;
      }

      let rabbitList = [];

      if (Array.isArray(data)) {
        rabbitList = data;
      } else if (Array.isArray(data.rabbits)) {
        rabbitList = data.rabbits;
      } else if (Array.isArray(data.data)) {
        rabbitList = data.data;
      }

      setRabbits(rabbitList);
    } catch (err) {
      console.error("Error loading rabbits:", err);
      setRabbits([]);
    } finally {
      setLoadingRabbits(false);
    }
  }

  // ======================================
  // Find selected female rabbit
  // ======================================

  const femaleRabbit = rabbits.find(
    (rabbit) =>
      String(rabbit.id) === String(id)
  );

  // ======================================
  // Find available male rabbits
  // ======================================

  const maleRabbits = rabbits.filter((rabbit) => {
    const sex = String(rabbit.sex || "")
      .trim()
      .toLowerCase();

    const status = String(rabbit.status || "active")
      .trim()
      .toLowerCase();

    return (
      sex === "male" &&
      status === "active" &&
      String(rabbit.id) !== String(id)
    );
  });

  // ======================================
  // Handle form changes
  // ======================================

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // ======================================
  // Submit breeding record
  // ======================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!femaleRabbit) {
      alert("Female rabbit could not be found.");
      return;
    }

    if (
      String(femaleRabbit.sex || "")
        .trim()
        .toLowerCase() !== "female"
    ) {
      alert(
        "The selected rabbit is not female."
      );
      return;
    }

    if (!formData.male_rabbit_id) {
      alert("Please select a male rabbit.");
      return;
    }

    if (!formData.breeding_type) {
      alert("Please select the breeding type.");
      return;
    }

    try {
      const response = await fetch(
        "${API_URL}/api/rabbit-breeding",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            rabbit_id: id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to save breeding record."
        );
        return;
      }

      alert(
        data.message ||
          "Rabbit breeding record added successfully!"
      );

      navigate(`/rabbits/${id}/breeding`);
    } catch (err) {
      console.error("Save breeding error:", err);

      alert(
        "Failed to save rabbit breeding record."
      );
    }
  }

  return (
    <div>
      {/* ==================================
          Header
      ================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1>â¤ï¸ Add Rabbit Breeding Record</h1>

          <p>
            Record a breeding event for this female rabbit.
          </p>
        </div>

        <Link
          className="button"
          to={`/rabbits/${id}/breeding`}
        >
          â† Back to Breeding
        </Link>
      </div>

      {/* ==================================
          Form
      ================================== */}

      <div className="card">
        <form onSubmit={handleSubmit}>

          {/* Female Rabbit */}

          <label>
            <strong>Female Rabbit</strong>
          </label>

          {loadingRabbits ? (
            <p>Loading rabbit...</p>
          ) : femaleRabbit ? (
            <div
              style={{
                padding: "12px",
                background: "#E8F5E9",
                borderRadius: "8px",
                marginTop: "8px",
                marginBottom: "15px",
                color: "#1B5E20",
              }}
            >
              ðŸ‡{" "}
              <strong>
                {femaleRabbit.tag_number}
              </strong>

              {femaleRabbit.name
                ? ` - ${femaleRabbit.name}`
                : ""}

              <br />

              <small>
                Sex: {femaleRabbit.sex}
              </small>
            </div>
          ) : (
            <p
              style={{
                color: "#D32F2F",
              }}
            >
              Female rabbit not found.
            </p>
          )}

          {/* Breeding Date */}

          <label>
            Breeding Date
          </label>

          <input
            type="date"
            name="breeding_date"
            value={formData.breeding_date}
            onChange={handleChange}
            required
          />

          <br />
          <br />

          {/* Male Rabbit */}

          <label>
            <strong>Male Rabbit</strong>
          </label>

          {loadingRabbits ? (
            <p>Loading male rabbits...</p>
          ) : (
            <>
              <select
                name="male_rabbit_id"
                value={formData.male_rabbit_id}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select male rabbit
                </option>

                {maleRabbits.map((rabbit) => (
                  <option
                    key={rabbit.id}
                    value={rabbit.id}
                  >
                    {rabbit.tag_number}

                    {rabbit.name
                      ? ` - ${rabbit.name}`
                      : ""}

                    {" (Male)"}
                  </option>
                ))}
              </select>

              {maleRabbits.length === 0 && (
                <p
                  style={{
                    color: "#D32F2F",
                    marginTop: "8px",
                  }}
                >
                  No available male rabbits found.
                </p>
              )}

              {maleRabbits.length > 0 && (
                <p
                  style={{
                    color: "#2E7D32",
                    marginTop: "8px",
                  }}
                >
                  {maleRabbits.length} male rabbit
                  {maleRabbits.length !== 1
                    ? "s"
                    : ""}{" "}
                  available.
                </p>
              )}
            </>
          )}

          <br />
          <br />

          {/* Breeding Type */}

          <label>
            Breeding Type
          </label>

          <select
            name="breeding_type"
            value={formData.breeding_type}
            onChange={handleChange}
            required
          >
            <option value="">
              Select breeding type
            </option>

            <option value="Natural">
              Natural
            </option>

            <option value="Assisted">
              Assisted
            </option>

            <option value="Planned">
              Planned
            </option>
          </select>

          <br />
          <br />

          {/* Expected Birth Date */}

          <label>
            Expected Birth Date
          </label>

          <input
            type="date"
            name="expected_birth_date"
            value={formData.expected_birth_date}
            onChange={handleChange}
          />

          <br />
          <br />

          {/* Status */}

          <label>
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Planned">
              Planned
            </option>

            <option value="Confirmed">
              Confirmed
            </option>

            <option value="Pregnant">
              Pregnant
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Failed">
              Failed
            </option>
          </select>

          <br />
          <br />

          {/* Notes */}

          <label>
            Notes
          </label>

          <textarea
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional breeding notes"
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
              disabled={
                loadingRabbits ||
                !femaleRabbit ||
                maleRabbits.length === 0
              }
            >
              ðŸ’¾ Save Breeding Record
            </button>

            <Link
              className="button"
              to={`/rabbits/${id}/breeding`}
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddRabbitBreeding;
