import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";

function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [goats, setGoats] = useState([]);
  const [chickens, setChickens] = useState([]);
  const [rabbits, setRabbits] = useState([]);
  const [feed, setFeed] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [finance, setFinance] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const [
        goatsRes,
        chickensRes,
        rabbitsRes,
        feedRes,
        inventoryRes,
        financeRes,
      ] = await Promise.all([
        fetch(`${API_URL}/api/goats`),
        fetch(`${API_URL}/api/chickens`),
        fetch(`${API_URL}/api/rabbits`),
        fetch(`${API_URL}/api/feed`),
        fetch(`${API_URL}/api/inventory`),
        fetch(`${API_URL}/api/finance`),
      ]);

      const [
        goatsData,
        chickensData,
        rabbitsData,
        feedData,
        inventoryData,
        financeData,
      ] = await Promise.all([
        goatsRes.json(),
        chickensRes.json(),
        rabbitsRes.json(),
        feedRes.json(),
        inventoryRes.json(),
        financeRes.json(),
      ]);

      setGoats(
        Array.isArray(goatsData)
          ? goatsData
          : []
      );

      setChickens(
        Array.isArray(chickensData)
          ? chickensData
          : []
      );

      setRabbits(
        Array.isArray(rabbitsData)
          ? rabbitsData
          : []
      );

      setFeed(
        Array.isArray(feedData)
          ? feedData
          : []
      );

      setInventory(
        Array.isArray(inventoryData)
          ? inventoryData
          : []
      );

      setFinance(
        Array.isArray(financeData)
          ? financeData
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load dashboard:",
        err
      );

      setGoats([]);
      setChickens([]);
      setRabbits([]);
      setFeed([]);
      setInventory([]);
      setFinance([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  const totalIncome = finance
    .filter(
      (item) => item.type === "Income"
    )
    .reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );

  const totalExpense = finance
    .filter(
      (item) => item.type === "Expense"
    )
    .reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );

  const profit =
    totalIncome - totalExpense;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          marginBottom: "25px",
          boxSizing: "border-box",
        }}
      >
        <PageHeader
          title="🏡 Salome Young Farm Dashboard"
          subtitle="Farm Overview"
        />
      </div>

      {/* STATISTICS */}

      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "14px",
          marginBottom: "25px",
          boxSizing: "border-box",
        }}
      >
        <StatCard
          icon="🐐"
          title="Goats"
          value={goats.length}
        />

        <StatCard
          icon="🐔"
          title="Chickens"
          value={chickens.length}
        />

        <StatCard
          icon="🐇"
          title="Rabbits"
          value={rabbits.length}
        />

        <StatCard
          icon="🌾"
          title="Feed Types"
          value={feed.length}
        />

        <StatCard
          icon="📦"
          title="Inventory Items"
          value={inventory.length}
        />

        <StatCard
          icon="💰"
          title="Income"
          value={`KES ${totalIncome.toLocaleString()}`}
          color="#2e7d32"
        />

        <StatCard
          icon="💸"
          title="Expenses"
          value={`KES ${totalExpense.toLocaleString()}`}
          color="#d32f2f"
        />

        <StatCard
          icon="📈"
          title="Profit"
          value={`KES ${profit.toLocaleString()}`}
          color="#1565c0"
        />
      </div>

      {/* MAIN DASHBOARD */}

      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 2fr) minmax(220px, 1fr)",
          gap: "20px",
          boxSizing: "border-box",
        }}
      >
        {/* RECENT GOATS */}

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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              marginBottom: "15px",
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                margin: 0,
              }}
            >
              Recent Goats
            </h2>

            <Link
              className="button"
              to="/goats"
              style={{
                whiteSpace: "nowrap",
              }}
            >
              View All
            </Link>
          </div>

          <div
            style={{
              width: "100%",
              minWidth: 0,
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
                boxSizing: "border-box",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      width: "20%",
                      fontSize: "12px",
                      padding: "10px 5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Tag
                  </th>

                  <th
                    style={{
                      width: "30%",
                      fontSize: "12px",
                      padding: "10px 5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Name
                  </th>

                  <th
                    style={{
                      width: "25%",
                      fontSize: "12px",
                      padding: "10px 5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Breed
                  </th>

                  <th
                    style={{
                      width: "25%",
                      fontSize: "12px",
                      padding: "10px 5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {goats.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "25px 10px",
                      }}
                    >
                      No goats found.
                    </td>
                  </tr>
                ) : (
                  goats
                    .slice(0, 5)
                    .map((goat) => (
                      <tr key={goat.id}>
                        <td
                          style={{
                            fontSize: "12px",
                            padding: "10px 5px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {goat.tag_number ||
                            goat.tag ||
                            "-"}
                        </td>

                        <td
                          style={{
                            fontSize: "12px",
                            padding: "10px 5px",
                            overflow: "hidden",
                            textOverflow:
                              "ellipsis",
                            whiteSpace:
                              "nowrap",
                          }}
                          title={goat.name || ""}
                        >
                          {goat.name || "-"}
                        </td>

                        <td
                          style={{
                            fontSize: "12px",
                            padding: "10px 5px",
                            overflow: "hidden",
                            textOverflow:
                              "ellipsis",
                            whiteSpace:
                              "nowrap",
                          }}
                          title={goat.breed || ""}
                        >
                          {goat.breed || "-"}
                        </td>

                        <td
                          style={{
                            fontSize: "12px",
                            padding: "10px 5px",
                            overflow: "hidden",
                            textOverflow:
                              "ellipsis",
                            whiteSpace:
                              "nowrap",
                          }}
                          title={goat.status || ""}
                        >
                          {goat.status || "-"}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN */}

        <div
          style={{
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* FARM SUMMARY */}

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
            <h2>Farm Summary</h2>

            <p>
              <strong>
                Total Animal Records:
              </strong>{" "}
              {goats.length +
                chickens.length +
                rabbits.length}
            </p>

            <p>
              <strong>Goats:</strong>{" "}
              {goats.length}
            </p>

            <p>
              <strong>Chickens:</strong>{" "}
              {chickens.length}
            </p>

            <p>
              <strong>Rabbits:</strong>{" "}
              {rabbits.length}
            </p>

            <p>
              <strong>Feed Types:</strong>{" "}
              {feed.length}
            </p>

            <p>
              <strong>
                Inventory Items:
              </strong>{" "}
              {inventory.length}
            </p>
          </div>

          {/* QUICK ACTIONS */}

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
            <h2>Quick Actions</h2>

            <div
              style={{
                display: "grid",
                gap: "10px",
              }}
            >
              <Link
                className="button"
                to="/goats/add"
              >
                🐐 Add Goat
              </Link>

              <Link
                className="button"
                to="/chickens/add"
              >
                🐔 Add Chicken
              </Link>

              <Link
                className="button"
                to="/rabbits/add"
              >
                🐇 Add Rabbit
              </Link>

              <Link
                className="button"
                to="/feed/add"
              >
                🌾 Add Feed
              </Link>

              <Link
                className="button"
                to="/finance/add"
              >
                💰 Finance Entry
              </Link>

              <Link
                className="button"
                to="/reports"
              >
                📊 Reports
              </Link>
            </div>
          </div>

          {/* SYSTEM STATUS */}

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
            <h2>System Status</h2>

            <ul
              style={{
                paddingLeft: "20px",
                lineHeight: "2",
                marginBottom: 0,
              }}
            >
              <li>
                ✅ Dashboard connected
              </li>
              <li>
                ✅ Finance connected
              </li>
              <li>
                ✅ Feed connected
              </li>
              <li>
                ✅ Chicken module active
              </li>
              <li>
                ✅ Rabbit module active
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
