import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function FeedUsage() {
  const [usage, setUsage] = useState([]);

  useEffect(() => {
    loadUsage();
  }, []);

  async function loadUsage() {
    try {
      const response = await fetch(
        `${API_URL}/api/feed-usage`
      );

      const data = await response.json();

      setUsage(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteUsage(id) {
    if (!window.confirm("Delete this record?")) return;

    try {
      await fetch(
        `${API_URL}/api/feed-usage/${id}`,
        {
          method: "DELETE",
        }
      );

      loadUsage();

    } catch (err) {
      console.error(err);
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
          <h1>🌾 Feed Usage</h1>
          <p>Daily feed consumption records.</p>
        </div>

        <Link
          className="button"
          to="/feed/usage/add"
        >
          ➕ Record Usage
        </Link>

      </div>

      <div className="card">

        <table className="table">

          <thead>

            <tr>
              <th>Date</th>
              <th>Feed</th>
              <th>Animal</th>
              <th>Quantity</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {usage.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center" }}
                >
                  No feed usage recorded.
                </td>
              </tr>

            ) : (

              usage.map((item) => (

                <tr key={item.id}>

                  <td>
                    {item.usage_date?.split("T")[0]}
                  </td>

                  <td>{item.feed_name}</td>

                  <td>{item.animal_type}</td>

                  <td>
                    {item.quantity_used} kg
                  </td>

                  <td>{item.notes}</td>

                  <td>

                    <button
                      className="button"
                      onClick={() => deleteUsage(item.id)}
                    >
                      🗑 Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default FeedUsage;
