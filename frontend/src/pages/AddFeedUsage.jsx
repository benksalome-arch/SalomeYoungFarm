import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddFeedUsage() {
  const navigate = useNavigate();

  const [feeds, setFeeds] = useState([]);

  const [formData, setFormData] = useState({
    feed_id: "",
    animal_type: "Goat",
    animal_id: "",
    quantity_used: "",
    usage_date: "",
    notes: "",
  });

  useEffect(() => {
    loadFeeds();
  }, []);

  async function loadFeeds() {
    try {
      const response = await fetch(`${API_URL}/api/feed`);
      const data = await response.json();
      setFeeds(data);
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

    const payload = {
      ...formData,
      animal_id:
        formData.animal_id === ""
          ? null
          : Number(formData.animal_id),
    };

    try {
      const response = await fetch(
        `${API_URL}/api/feed-usage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      alert(data.message || "Voergebruik opgeslagen.");
      navigate("/feed/usage");
    } catch (err) {
      console.error(err);
      alert("Het opslaan van het voergebruik is mislukt.");
    }
  }

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
          marginBottom: 30,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 8px 0",
              fontSize: 32,
              lineHeight: 1.2,
              fontWeight: 700,
            }}
          >
            🌾 Voergebruik registreren
          </h1>
          <p
            style={{
              margin: 0,
              color: "#666",
              fontSize: 16,
              lineHeight: 1.5,
            }}
          >
            Registreer het dagelijkse voerverbruik van de dieren.
          </p>
        </div>

        <Link className="button" to="/feed/usage">
          ← Terug
        </Link>
      </div>

      <div
        className="card"
        style={{
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 7, fontWeight: 600 }}>
              Voer
            </label>

            <select
              name="feed_id"
              value={formData.feed_id}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            >
              <option value="">{t("selectFeed")}</option>

              {feeds.map((feed) => (
                <option key={feed.id} value={feed.id}>
                  {feed.feed_name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 7, fontWeight: 600 }}>
              Diersoort
            </label>

            <select
              name="animal_type"
              value={formData.animal_type}
              onChange={handleChange}
              style={{ width: "100%" }}
            >
              <option value="Goat">{t("goat")}</option>
              <option value="Chicken">{t("chicken")}</option>
              <option value="Rabbit">{t("rabbit")}</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 7, fontWeight: 600 }}>
              Diernummer
              <span style={{ fontWeight: 400, color: "#777" }}>
                {" "} (optioneel)
              </span>
            </label>

            <input
              type="number"
              name="animal_id"
              value={formData.animal_id}
              onChange={handleChange}
              placeholder="Bijvoorbeeld 12"
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 7, fontWeight: 600 }}>
              Hoeveelheid gebruikt (kg)
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              name="quantity_used"
              value={formData.quantity_used}
              onChange={handleChange}
              placeholder="Bijvoorbeeld 2.50"
              required
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 7, fontWeight: 600 }}>
              Datum
            </label>

            <input
              type="date"
              name="usage_date"
              value={formData.usage_date}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: 25 }}>
            <label style={{ display: "block", marginBottom: 7, fontWeight: 600 }}>
              Opmerkingen
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Eventuele opmerkingen..."
              style={{ width: "100%", resize: "vertical" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button className="button" type="submit">
              💾 Opslaan
            </button>

            <Link className="button" to="/feed/usage">
              Annuleren
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFeedUsage;
