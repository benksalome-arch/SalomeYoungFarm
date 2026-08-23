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
      const response = await fetch(`${API_URL}/api/feed`);
      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        setFeeds([]);
        return;
      }

      setFeeds(Array.isArray(data) ? data : []);
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
      const response = await fetch(`${API_URL}/api/feed/${id}`, {
        method: "DELETE",
      });

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


<style className="feed-page-mobile-fix">{`
  @media (max-width: 700px) {
    .feed-page-header {
      display: block !important;
      margin-bottom: 18px !important;
    }

    .feed-page-title {
      font-size: 26px !important;
      line-height: 1.2 !important;
      margin: 0 !important;
    }

    .feed-page-subtitle {
      font-size: 14px !important;
      margin-top: 5px !important;
    }

    .feed-page-header > a {
      display: inline-block !important;
      margin-top: 12px !important;
      padding: 10px 16px !important;
      font-size: 14px !important;
    }
  }
`}</style>

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 22px;
        }

        .feed-title {
          margin: 0;
          color: #1b5e20;
          font-size: 32px;
          line-height: 1.2;
          font-weight: 700;
        }

        .feed-subtitle {
          margin: 6px 0 0;
          color: #666;
          font-size: 15px;
        }

        .feed-add-button {
          white-space: nowrap;
          flex-shrink: 0;
          text-decoration: none;
          padding: 9px 13px;
          font-size: 14px;
        }

        .feed-card {
          width: 100%;
          box-sizing: border-box;
          padding: 18px;
        }

        .feed-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .feed-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 720px;
        }

        .feed-table th {
          padding: 12px 8px;
          font-size: 13px;
          font-weight: 700;
          text-align: left;
          white-space: nowrap;
        }

        .feed-table td {
          padding: 12px 8px;
          font-size: 13px;
          vertical-align: middle;
        }

        .feed-mobile-list {
          display: none;
        }

        .feed-mobile-card {
          border: 1px solid #e1e6e2;
          border-radius: 10px;
          padding: 14px;
          background: #fff;
        }

        .feed-mobile-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 13px;
        }

        .feed-mobile-name {
          min-width: 0;
          font-size: 18px;
          font-weight: 700;
          color: #26332a;
          overflow-wrap: anywhere;
        }

        .feed-mobile-category {
          margin-top: 3px;
          font-size: 13px;
          color: #777;
        }

        .feed-status {
          flex-shrink: 0;
          padding: 5px 8px;
          border-radius: 20px;
          color: white;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .feed-mobile-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 12px;
        }

        .feed-info-box {
          background: #f5f7f5;
          border-radius: 8px;
          padding: 9px;
        }

        .feed-info-label {
          display: block;
          color: #777;
          font-size: 12px;
          margin-bottom: 3px;
        }

        .feed-info-value {
          color: #222;
          font-size: 15px;
          font-weight: 700;
        }

        .feed-supplier {
          margin-bottom: 12px;
          font-size: 13px;
          color: #555;
        }

        .feed-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .feed-action {
          padding: 9px 6px;
          font-size: 13px;
          text-align: center;
        }

        @media (max-width: 700px) {
          .feed-header {
            align-items: center;
            gap: 10px;
            margin-bottom: 16px;
          }

          .feed-title {
            font-size: 24px;
          }

          .feed-subtitle {
            font-size: 13px;
            margin-top: 4px;
          }

          .feed-add-button {
            padding: 8px 10px;
            font-size: 13px;
          }

          .feed-card {
            padding: 12px;
          }

          .feed-table-wrapper {
            display: none;
          }

          .feed-mobile-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>

      {/* PAGE HEADER */}

      <div className="feed-header">
        <Link
          className="button feed-add-button"
          to="/feed/add"
        >
          ➕ Add Feed
        </Link>
      </div>

      {/* FEED CONTENT */}

      <div className="card feed-card">

        {/* DESKTOP */}

        <div className="feed-table-wrapper">
          <table className="feed-table">
            <thead>
              <tr>
                <th>Feed</th>
                <th>Category</th>
                <th style={{ textAlign: "center" }}>
                  Quantity
                </th>
                <th style={{ textAlign: "center" }}>
                  Unit
                </th>
                <th>Supplier</th>
                <th style={{ textAlign: "center" }}>
                  Cost/Unit
                </th>
                <th style={{ textAlign: "center" }}>
                  Status
                </th>
                <th style={{ textAlign: "center" }}>
                  Actions
                </th>
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
                  const quantity = Number(
                    feed.quantity || 0
                  );

                  const minimumStock = Number(
                    feed.minimum_stock || 0
                  );

                  const isLow =
                    quantity <= minimumStock;

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
                        KES{" "}
                        {Number(
                          feed.cost_per_unit || 0
                        ).toLocaleString()}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <span
                          className="feed-status"
                          style={{
                            background: isLow
                              ? "#E53935"
                              : "#4CAF50",
                          }}
                        >
                          {isLow
                            ? "🔴 Low"
                            : "🟢 OK"}
                        </span>
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "5px",
                          }}
                        >
                          <Link
                            className="button"
                            to={`/feed/edit/${feed.id}`}
                            style={{
                              padding: "6px 8px",
                              fontSize: "11px",
                              textDecoration: "none",
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

        {/* MOBILE */}

        <div className="feed-mobile-list">
          {feeds.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "25px 10px",
                color: "#666",
                fontSize: "14px",
              }}
            >
              No feed records found.
            </div>
          ) : (
            feeds.map((feed) => {
              const quantity = Number(
                feed.quantity || 0
              );

              const minimumStock = Number(
                feed.minimum_stock || 0
              );

              const isLow =
                quantity <= minimumStock;

              return (
                <div
                  className="feed-mobile-card"
                  key={feed.id}
                >
                  <div className="feed-mobile-top">
                    <div style={{ minWidth: 0 }}>
                      <div className="feed-mobile-name">
                        🌾 {feed.feed_name || "-"}
                      </div>

                      <div className="feed-mobile-category">
                        {feed.category ||
                          "No category"}
                      </div>
                    </div>

                    <span
                      className="feed-status"
                      style={{
                        background: isLow
                          ? "#E53935"
                          : "#4CAF50",
                      }}
                    >
                      {isLow
                        ? "🔴 Low"
                        : "🟢 OK"}
                    </span>
                  </div>

                  <div className="feed-mobile-info">
                    <div className="feed-info-box">
                      <span className="feed-info-label">
                        Quantity
                      </span>

                      <div className="feed-info-value">
                        {feed.quantity ?? 0}{" "}
                        {feed.unit || ""}
                      </div>
                    </div>

                    <div className="feed-info-box">
                      <span className="feed-info-label">
                        Cost / Unit
                      </span>

                      <div className="feed-info-value">
                        KES{" "}
                        {Number(
                          feed.cost_per_unit || 0
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="feed-supplier">
                    <strong>Supplier:</strong>{" "}
                    {feed.supplier || "-"}
                  </div>

                  <div className="feed-actions">
                    <Link
                      className="button feed-action"
                      to={`/feed/edit/${feed.id}`}
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      ✏ Edit
                    </Link>

                    <button
                      type="button"
                      className="button feed-action"
                      onClick={() =>
                        deleteFeed(feed.id)
                      }
                      style={{
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
  );
}

export default Feed;
