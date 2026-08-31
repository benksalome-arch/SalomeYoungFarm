import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddRabbitMortality() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [rabbits, setRabbits] = useState([]);

  const [formData, setFormData] = useState({
    rabbit_id: "",
    mortality_date: new Date().toISOString().split("T")[0],
    quantity: 1,
    cause: "",
    notes: "",
  });

  useEffect(() => {
    loadRabbits();
  }, []);

  async function loadRabbits() {
    try {
      const response = await fetch(
        `${API_URL}/api/rabbits`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        setRabbits([]);
        return;
      }

      setRabbits(data);
    } catch (err) {
      console.error(err);
      setRabbits([]);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const selectedRabbit = rabbits.find(
    (rabbit) =>
      Number(rabbit.id) === Number(formData.rabbit_id)
  );

  const availableQuantity = selectedRabbit
    ? Number(selectedRabbit.quantity || 0)
    : 0;

  const mortalityQuantity = Number(formData.quantity || 0);

  const noRabbitSelected = !formData.rabbit_id;

  const rabbitUnavailable =
    selectedRabbit && availableQuantity <= 0;

  const quantityTooHigh =
    selectedRabbit &&
    mortalityQuantity > availableQuantity;

  const invalidQuantity =
    mortalityQuantity <= 0;

  const canSave =
    !noRabbitSelected &&
    !rabbitUnavailable &&
    !quantityTooHigh &&
    !invalidQuantity;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.rabbit_id) {
      alert(t("pleaseSelectRabbit"));
      return;
    }

    if (availableQuantity <= 0) {
      alert(
        `${selectedRabbit.name || t("thisRabbit")} ${t("mortalityUnavailable")}`
      );
      return;
    }

    if (mortalityQuantity <= 0) {
      alert(t("mortalityQuantityPositive"));
      return;
    }

    if (mortalityQuantity > availableQuantity) {
      alert(
        `Mortality quantity cannot exceed the ${availableQuantity} rabbit(s) available.`
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/rabbit-mortality`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to record mortality."
        );
        return;
      }

      alert(data.message);

      navigate("/rabbit-mortality");
    } catch (err) {
      console.error(err);
      alert(t("failedToRecordRabbitMortality"));
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
          <h1>☠️ {t("recordRabbitMortality")}</h1>

          <p>
            Record a rabbit death and automatically
            update the rabbit quantity.
          </p>
        </div>

        <Link
          className="button"
          to="/rabbit-mortality"
        >
          ← {t("back")}
        </Link>
      </div>

      {/* Form */}

      <div className="card">
        <form onSubmit={handleSubmit}>

          {/* Rabbit */}

          <label>{t("rabbit")}</label>

          <select
            name="rabbit_id"
            value={formData.rabbit_id}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Rabbit
            </option>

            {rabbits.map((rabbit) => (
              <option
                key={rabbit.id}
                value={rabbit.id}
              >
                {rabbit.tag_number} -{" "}
                {rabbit.name || t("rabbit")}{" "}
                ({Number(rabbit.quantity || 0)} {t("available")})
              </option>
            ))}
          </select>

          {/* Availability warning */}

          {rabbitUnavailable && (
            <p
              style={{
                color: "#b71c1c",
                fontWeight: "bold",
                marginTop: "8px",
              }}
            >
              ⚠️ {selectedRabbit.name || t("thisRabbit")} has
              {t("mortalityUnavailable")}
            </p>
          )}

          {selectedRabbit &&
            availableQuantity > 0 && (
              <p
                style={{
                  color: "#2E7D32",
                  fontWeight: "bold",
                  marginTop: "8px",
                }}
              >
                ✅ {availableQuantity} {t("rabbit")} {t("available")}
                for mortality recording.
              </p>
            )}

          <br />

          {/* Date */}

          <label>{t("mortalityDate")}</label>

          <input
            type="date"
            name="mortality_date"
            value={formData.mortality_date}
            onChange={handleChange}
            required
          />

          <br />
          <br />

          {/* Quantity */}

          <label>{t("quantity")}</label>

          <input
            type="number"
            min="1"
            max={
              availableQuantity > 0
                ? availableQuantity
                : undefined
            }
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          {quantityTooHigh && (
            <p
              style={{
                color: "#b71c1c",
                fontWeight: "bold",
                marginTop: "8px",
              }}
            >
              ⚠️ {t("quantityCannotExceed")}{" "}
              {availableQuantity} {t("available")}.
            </p>
          )}

          {invalidQuantity && (
            <p
              style={{
                color: "#b71c1c",
                fontWeight: "bold",
                marginTop: "8px",
              }}
            >
              ⚠️ {t("quantityMustBeGreaterThanZero")}
            </p>
          )}

          <br />

          {/* Cause */}

          <label>{t("cause")}</label>

          <input
            type="text"
            name="cause"
            value={formData.cause}
            onChange={handleChange}
            placeholder={t("mortalityReasonExample")}
          />

          <br />
          <br />

          {/* Notes */}

          <label>{t("notes")}</label>

          <textarea
            rows="4"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder={t("additionalNotes")}
          />

          <br />
          <br />

          {/* Submit */}

          <button
            className="button"
            type="submit"
            disabled={!canSave}
            style={{
              opacity: canSave ? 1 : 0.5,
              cursor: canSave
                ? "pointer"
                : "not-allowed",
            }}
          >
            💾 {t("save")} Mortality Record
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddRabbitMortality;
