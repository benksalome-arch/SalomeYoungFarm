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
        "http://localhost:5000/api/feed"
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
        `http://localhost:5000/api/feed/${id}`,
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
          <table
            className="table"
            style={{
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
          >
            <colgroup>
              <col style={{ width: "15%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "17%" }} />
            </colgroup>

            <thead>
              <tr>
                <th style={headerStyle}>Feed</th>
                <th style={headerStyle}>Category</th>
                <th style={headerStyle}>Quantity</th>
                <th style={headerStyle}>Unit</th>
                <th style={headerStyle}>Supplier</th>
                <th style={headerStyle}>Cost/Unit</th>
                <th style={headerStyle}>Status</th>
                <th style={headerStyle}>Actions</th>
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
                      fontSize: "14px",
                    }}
                  >
                    No feed records found.
                  </td>
                </tr>
              ) : (
                feeds.map((feed) => {
                  const quantity = Number(feed.quantity || 0);

                  const minimumStock = Number(
                    feed.minimum_stock || 0
                  );

                  const isLow = quantity <= minimumStock;

                  return (
                    <tr key={feed.id}>
                      {/* FEED */}

                      <td
                        style={cellStyle}
                        title={feed.feed_name || ""}
                      >
                        {feed.feed_name || "-"}
                      </td>

                      {/* CATEGORY */}

                      <td
                        style={cellStyle}
                        title={feed.category || ""}
                      >
                        {feed.category || "-"}
                      </td>

                      {/* QUANTITY */}

                      <td
                        style={{
                          ...cellStyle,
                          textAlign: "center",
                        }}
                      >
                        {feed.quantity ?? 0}
                      </td>

                      {/* UNIT */}

                      <td
                        style={{
                          ...cellStyle,
                          textAlign: "center",
                        }}
                      >
                        {feed.unit || "-"}
                      </td>

                      {/* SUPPLIER */}

                      <td
                        style={cellStyle}
                        title={feed.supplier || ""}
                      >
                        {feed.supplier || "-"}
                      </td>

                      {/* COST */}

                      <td
                        style={{
                          ...cellStyle,
                          textAlign: "center",
                        }}
                      >
                        KES{" "}
                        {Number(
                          feed.cost_per_unit || 0
                        ).toLocaleString()}
                      </td>

                      {/* STATUS */}

                      <td
                        style={{
                          ...cellStyle,
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            background: isLow
                              ? "#E53935"
                              : "#4CAF50",
                            color: "white",
                            padding: "6px 9px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {isLow ? "🔴 Low" : "🟢 OK"}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td
                        style={{
                          padding: "8px",
                          verticalAlign: "middle",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
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
                              whiteSpace: "nowrap",
                            }}
                          >
                            ✏ Edit
                          </Link>

                          <button
                            type="button"
                            className="button"
                            onClick={() =>
                              deleteFeed(feed.id)
                            }
                            style={{
                              padding: "6px 8px",
                              fontSize: "11px",
                              background: "#D32F2F",
                              color: "white",
                              border: "none",
                              whiteSpace: "nowrap",
                              cursor: "pointer",
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
      </div>
    </div>
  );
}

export default Feed;