import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Feed() {
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    loadFeeds();
  }, []);

  async function loadFeeds() {
    try {
      const response = await fetch(
        `${API_URL}/api/feed`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        setFeeds([]);
        return;
      }

      setFeeds(data);
    } catch (err) {
      console.error(err);
      setFeeds([]);
    }
  }

  async function deleteFeed(id) {
    if (!window.confirm("Delete this feed?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/feed/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete feed.");
        return;
      }

      alert(data.message || "Feed deleted successfully.");

      loadFeeds();
    } catch (err) {
      console.error(err);
      alert("Failed to delete feed.");
    }
  }

  const cellStyle = {
    padding: "12px 8px",
    fontSize: "13px",
    textAlign: "left",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const headerStyle = {
    padding: "12px 8px",
    fontSize: "13px",
    fontWeight: "bold",
    textAlign: "left",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* PAGE HEADER */}

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "25px",
          flexWrap: "wrap",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            minWidth: 0,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              lineHeight: 1.2,
            }}
          >
            🌾 Feed Management
          </h1>

          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
            }}
          >
            Manage all animal feeds.
          </p>
        </div>

        <Link
          className="button"
          to="/feed/add"
          style={{
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          ➕ Add Feed
        </Link>
      </div>

      {/* FEED TABLE */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <style>{`
            .feed-desktop-table {
              display: block;
            }

            .feed-mobile-cards {
              display: none;
            }

            @media (max-width: 700px) {
              .feed-desktop-table {
                display: none !important;
              }

              .feed-mobile-cards {
                display: flex !important;
                flex-direction: column;
                gap: 14px;
              }
            }
          `}</style>

          <div className="feed-desktop-table">
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "720px",
    }}
  >
    <thead>
      <tr>
        <th>Feed</th>
        <th>Category</th>
        <th>Quantity</th>
        <th>Unit</th>
        <th>Supplier</th>
        <th>Cost/Unit</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {feeds.length === 0 ? (
        <tr>
          <td
            colSpan="8"
            style={{
              textAlign: "center",
              padding: "30px 10px",
            }}
          >
            No feed records found.
          </td>
        </tr>
      ) : (
        feeds.map((feed) => {
          const quantity = Number(feed.quantity || 0);
          const minimumStock = Number(feed.minimum_stock || 0);
          const isLow = quantity <= minimumStock;

          return (
            <tr key={feed.id}>
              <td>{feed.feed_name || "-"}</td>
              <td>{feed.category || "-"}</td>
              <td style={{ textAlign: "center" }}>
                {feed.quantity ?? 0}
              </td>
              <td style={{ textAlign: "center" }}>
                {feed.unit || "-"}
              </td>
              <td>{feed.supplier || "-"}</td>
              <td style={{ textAlign: "center" }}>
                KES {Number(feed.cost_per_unit || 0).toLocaleString()}
              </td>
              <td style={{ textAlign: "center" }}>
                <span
                  style={{
                    display: "inline-block",
                    background: isLow ? "#E53935" : "#4CAF50",
                    color: "white",
                    padding: "6px 9px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                >
                  {isLow ? "🔴 Low" : "🟢 OK"}
                </span>
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "5px",
                    flexWrap: "wrap",
                  }}
                >
                  <Link
                    className="button"
                    to={`/feed/edit/${feed.id}`}
                    style={{
                      padding: "6px 8px",
                      fontSize: "11px",
                    }}
                  >
                    ✏ Edit
                  </Link>

                  <button
                    type="button"
                    className="button"
                    onClick={() => deleteFeed(feed.id)}
                    style={{
                      padding: "6px 8px",
                      fontSize: "11px",
                      background: "#D32F2F",
                      color: "white",
                      border: "none",
                    }}
                  >
                    🗑 Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  </table>
</div>

<div className="feed-mobile-cards">
  {feeds.length === 0 ? (
    <div
      style={{
        textAlign: "center",
        padding: "30px 15px",
        color: "#777",
      }}
    >
      No feed records found.
    </div>
  ) : (
    feeds.map((feed) => {
      const quantity = Number(feed.quantity || 0);
      const minimumStock = Number(feed.minimum_stock || 0);
      const isLow = quantity <= minimumStock;

      return (
        <div
          key={feed.id}
          style={{
            background: "#ffffff",
            borderRadius: "14px",
            padding: "17px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
            borderLeft: `5px solid ${
              isLow ? "#E53935" : "#4CAF50"
            }`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                minWidth: 0,
                flex: 1,
              }}
            >
              <div
                style={{
                  fontSize: "19px",
                  fontWeight: "700",
                  color: "#26332a",
                  overflowWrap: "anywhere",
                }}
              >
                🌾 {feed.feed_name || "-"}
              </div>

              <div
                style={{
                  marginTop: "4px",
                  color: "#777",
                  fontSize: "13px",
                }}
              >
                {feed.category || "No category"}
              </div>
            </div>

            <span
              style={{
                flexShrink: 0,
                background: isLow ? "#E53935" : "#4CAF50",
                color: "white",
                padding: "6px 9px",
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: "700",
              }}
            >
              {isLow ? "🔴 Low" : "🟢 OK"}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                background: "#f5f7f5",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <small style={{ color: "#777" }}>Quantity</small>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "16px",
                  marginTop: "3px",
                }}
              >
                {feed.quantity ?? 0} {feed.unit || ""}
              </div>
            </div>

            <div
              style={{
                background: "#f5f7f5",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <small style={{ color: "#777" }}>Cost / Unit</small>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "16px",
                  marginTop: "3px",
                }}
              >
                KES {Number(feed.cost_per_unit || 0).toLocaleString()}
              </div>
            </div>
          </div>

          <div
            style={{
              marginBottom: "14px",
              fontSize: "14px",
              color: "#555",
            }}
          >
            <strong>Supplier:</strong>{" "}
            {feed.supplier || "-"}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            <Link
              className="button"
              to={`/feed/edit/${feed.id}`}
              style={{
                textDecoration: "none",
                textAlign: "center",
                padding: "10px 6px",
                fontSize: "13px",
              }}
            >
              ✏ Edit
            </Link>

            <button
              type="button"
              className="button"
              onClick={() => deleteFeed(feed.id)}
              style={{
                padding: "10px 6px",
                fontSize: "13px",
                background: "#D32F2F",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      );
    })
  )}
</div>

        </div>
      </div>
    </div>
  );
}

export default Feed;
