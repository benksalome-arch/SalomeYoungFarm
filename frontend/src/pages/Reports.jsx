import { useEffect, useState } from "react";

function Reports() {
  const [loading, setLoading] = useState(true);

  const [goats, setGoats] = useState([]);
  const [chickens, setChickens] = useState([]);
  const [rabbits, setRabbits] = useState([]);
  const [feed, setFeed] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [finance, setFinance] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
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
        fetch("http://localhost:5000/api/goats"),
        fetch("http://localhost:5000/api/chickens"),
        fetch("http://localhost:5000/api/rabbits"),
        fetch("http://localhost:5000/api/feed"),
        fetch("http://localhost:5000/api/inventory"),
        fetch("http://localhost:5000/api/finance"),
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
        Array.isArray(goatsData) ? goatsData : []
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
        Array.isArray(feedData) ? feedData : []
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
    } catch (error) {
      console.error(
        "Failed to load reports:",
        error
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

  const totalIncome = finance
    .filter((item) => item.type === "Income")
    .reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );

  const totalExpense = finance
    .filter((item) => item.type === "Expense")
    .reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );

  const profit = totalIncome - totalExpense;

  const totalAnimals =
    goats.length +
    chickens.length +
    rabbits.length;

  function formatDate(dateValue) {
    if (!dateValue) {
      return "-";
    }

    const dateOnly =
      String(dateValue).split("T")[0];

    const parts = dateOnly.split("-");

    if (parts.length !== 3) {
      return dateValue;
    }

    const [year, month, day] = parts;

    return `${day}-${month}-${year}`;
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
        Loading reports...
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      {/* PAGE HEADER */}

      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "25px",
          boxSizing: "border-box",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              lineHeight: 1.2,
            }}
          >
            📊 Farm Reports
          </h1>

          <p
            style={{
              margin: "8px 0 0",
            }}
          >
            Farm statistics, financial summaries
            and records.
          </p>
        </div>

        <button
          type="button"
          className="button"
          onClick={() => window.print()}
          style={{
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          🖨 Print Report
        </button>
      </div>

      {/* FARM OVERVIEW */}

      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "16px",
          marginBottom: "25px",
          boxSizing: "border-box",
        }}
      >
        <div
          className="card"
          style={{
            minWidth: 0,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <h3>🐐 Goats</h3>
          <h2>{goats.length}</h2>
        </div>

        <div
          className="card"
          style={{
            minWidth: 0,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <h3>🐔 Chickens</h3>
          <h2>{chickens.length}</h2>
        </div>

        <div
          className="card"
          style={{
            minWidth: 0,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <h3>🐇 Rabbits</h3>
          <h2>{rabbits.length}</h2>
        </div>

        <div
          className="card"
          style={{
            minWidth: 0,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <h3>🐾 Total Animals</h3>
          <h2>{totalAnimals}</h2>
        </div>

        <div
          className="card"
          style={{
            minWidth: 0,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <h3>🌾 Feed Types</h3>
          <h2>{feed.length}</h2>
        </div>

        <div
          className="card"
          style={{
            minWidth: 0,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <h3>📦 Inventory Items</h3>
          <h2>{inventory.length}</h2>
        </div>
      </div>

      {/* FINANCIAL SUMMARY */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          marginBottom: "25px",
          overflow: "hidden",
        }}
      >
        <h2>💰 Financial Summary</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h3>Total Income</h3>

            <h2
              style={{
                color: "#2e7d32",
                fontSize: "24px",
              }}
            >
              KES{" "}
              {totalIncome.toLocaleString()}
            </h2>
          </div>

          <div style={{ minWidth: 0 }}>
            <h3>Total Expenses</h3>

            <h2
              style={{
                color: "#d32f2f",
                fontSize: "24px",
              }}
            >
              KES{" "}
              {totalExpense.toLocaleString()}
            </h2>
          </div>

          <div style={{ minWidth: 0 }}>
            <h3>Profit</h3>

            <h2
              style={{
                color:
                  profit >= 0
                    ? "#1565c0"
                    : "#d32f2f",
                fontSize: "24px",
              }}
            >
              KES {profit.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>

      {/* FINANCIAL TRANSACTIONS */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          overflow: "hidden",
          marginBottom: "25px",
        }}
      >
        <h2>💵 Financial Transactions</h2>

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
                    width: "14%",
                    fontSize: "10px",
                    padding: "10px 4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Date
                </th>

                <th
                  style={{
                    width: "11%",
                    fontSize: "10px",
                    padding: "10px 4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Type
                </th>

                <th
                  style={{
                    width: "15%",
                    fontSize: "10px",
                    padding: "10px 4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Category
                </th>

                <th
                  style={{
                    width: "24%",
                    fontSize: "10px",
                    padding: "10px 4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Description
                </th>

                <th
                  style={{
                    width: "18%",
                    fontSize: "10px",
                    padding: "10px 4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Amount
                </th>

                <th
                  style={{
                    width: "18%",
                    fontSize: "10px",
                    padding: "10px 4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Payment
                </th>
              </tr>
            </thead>

            <tbody>
              {finance.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "30px 10px",
                    }}
                  >
                    No financial transactions
                    found.
                  </td>
                </tr>
              ) : (
                finance.map((transaction) => (
                  <tr
                    key={transaction.id}
                  >
                    <td
                      style={{
                        padding: "10px 4px",
                        textAlign: "center",
                        fontSize: "10px",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {formatDate(
                        transaction.transaction_date
                      )}
                    </td>

                    <td
                      style={{
                        padding: "10px 4px",
                        textAlign: "center",
                        fontSize: "10px",
                        overflow: "hidden",
                        textOverflow:
                          "ellipsis",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {transaction.type ||
                        "-"}
                    </td>

                    <td
                      style={{
                        padding: "10px 4px",
                        fontSize: "10px",
                        overflow: "hidden",
                        textOverflow:
                          "ellipsis",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {transaction.category ||
                        "-"}
                    </td>

                    <td
                      style={{
                        padding: "10px 4px",
                        fontSize: "10px",
                        overflow: "hidden",
                        textOverflow:
                          "ellipsis",
                        whiteSpace:
                          "nowrap",
                      }}
                      title={
                        transaction.description ||
                        ""
                      }
                    >
                      {transaction.description ||
                        "-"}
                    </td>

                    <td
                      style={{
                        padding: "10px 4px",
                        textAlign: "center",
                        fontSize: "10px",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      KES{" "}
                      {Number(
                        transaction.amount ||
                          0
                      ).toLocaleString()}
                    </td>

                    <td
                      style={{
                        padding: "10px 4px",
                        fontSize: "10px",
                        overflow: "hidden",
                        textOverflow:
                          "ellipsis",
                        whiteSpace:
                          "nowrap",
                      }}
                      title={
                        transaction.payment_method ||
                        ""
                      }
                    >
                      {transaction.payment_method ||
                        "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ANIMAL SUMMARY */}

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
        <h2>🐾 Animal Summary</h2>

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
                  width: "70%",
                  fontSize: "11px",
                  padding: "10px 5px",
                  whiteSpace: "nowrap",
                }}
              >
                Animal
              </th>

              <th
                style={{
                  width: "30%",
                  fontSize: "11px",
                  padding: "10px 5px",
                  whiteSpace: "nowrap",
                }}
              >
                Total Records
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>🐐 Goats</td>
              <td>{goats.length}</td>
            </tr>

            <tr>
              <td>🐔 Chickens</td>
              <td>{chickens.length}</td>
            </tr>

            <tr>
              <td>🐇 Rabbits</td>
              <td>{rabbits.length}</td>
            </tr>

            <tr>
              <td>
                <strong>
                  Total Animals
                </strong>
              </td>

              <td>
                <strong>
                  {totalAnimals}
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;