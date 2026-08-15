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
    usage_date: new Date().toISOString().split("T")[0],
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

      alert(data.message);

      navigate("/feed/usage");

    } catch (err) {
      console.error(err);
      alert("Failed to record feed usage.");
    }
  }
    return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1>🌾 Record Feed Usage</h1>
          <p>Record daily feed consumption.</p>
        </div>

        <Link className="button" to="/feed/usage">
          ← Back
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>

          <label>Feed</label>
          <select
            name="feed_id"
            value={formData.feed_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Feed</option>

            {feeds.map((feed) => (
              <option key={feed.id} value={feed.id}>
                {feed.feed_name}
              </option>
            ))}
          </select>

          <br /><br />

          <label>Animal Type</label>
          <select
            name="animal_type"
            value={formData.animal_type}
            onChange={handleChange}
          >
            <option value="Goat">Goat</option>
            <option value="Chicken">Chicken</option>
            <option value="Rabbit">Rabbit</option>
          </select>

          <br /><br />

          <label>Animal ID (optional)</label>
          <input
            type="number"
            name="animal_id"
            value={formData.animal_id}
            onChange={handleChange}
          />

          <br /><br />

          <label>Quantity Used (kg)</label>
          <input
            type="number"
            step="0.01"
            name="quantity_used"
            value={formData.quantity_used}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>Usage Date</label>
          <input
            type="date"
            name="usage_date"
            value={formData.usage_date}
            onChange={handleChange}
            required
          />

          <br /><br />

          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          />

          <br /><br />

          <button className="button" type="submit">
            💾 Save
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddFeedUsage;
