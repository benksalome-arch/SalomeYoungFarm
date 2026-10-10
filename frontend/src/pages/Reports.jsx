import API_URL from "../api";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

function Reports() {
  const { t } = useLanguage();
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
        maxWidth: "1050px",
        margin: "0 auto",
        minWidth: 0,
        boxSizing: "border-box",
        padding: "0 20px 30px",
        color: "#263238",
        WebkitTextFillColor: "#263238",
        colorScheme: "light",
      }}
    >
      {/* PAGE HEADER */}

      <div
        style={{
          width: "100%",
          maxWidth: "1050px",
          minWidth: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "18px",
          boxSizing: "border-box",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              lineHeight: 1.2,
              color: "#263238",
              WebkitTextFillColor: "#263238",
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
          maxWidth: "none",
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
          <h3 style={{ color: "#263238", WebkitTextFillColor: "#263238" }}>🐐 {t("goats")}</h3>
          <h2 style={{ color: "#263238", WebkitTextFillColor: "#263238" }}>{goats.length}</h2>
        </div>

        <div
          className="card"
          style={{
            minWidth: 0,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <h3 style={{ color: "#263238", WebkitTextFillColor: "#263238" }}>🐔 {t("chickens")}</h3>
          <h2 style={{ color: "#263238", WebkitTextFillColor: "#263238" }}>{chickens.length}</h2>
        </div>

        <div
          className="card"
          style={{
            minWidth: 0,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <h3 style={{ color: "#263238", WebkitTextFillColor: "#263238" }}>🐇 {t("rabbits")}</h3>
          <h2 style={{ color: "#263238", WebkitTextFillColor: "#263238" }}>{rabbits.length}</h2>
        </div>

        <div
          className="card"
          style={{
            minWidth: 0,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <h3 style={{ color: "#263238", WebkitTextFillColor: "#263238" }}>🐾 {t("totalAnimals")}</h3>
          <h2 style={{ color: "#263238", WebkitTextFillColor: "#263238" }}>{totalAnimals}</h2>
        </div>

        <div
          className="card"
          style={{
            minWidth: 0,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <h3 style={{ color: "#263238", WebkitTextFillColor: "#263238" }}>🌾 {t("feedTypes")}</h3>
          <h2 style={{ color: "#263238", WebkitTextFillColor: "#263238" }}>{feed.length}</h2>
        </div>

        <div
          className="card"
          style={{
            minWidth: 0,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <h3 style={{ color: "#263238", WebkitTextFillColor: "#263238" }}>📦 Inventory Items</h3>
          <h2 style={{ color: "#263238", WebkitTextFillColor: "#263238" }}>{inventory.length}</h2>
        </div>
      </div>

      {/* FINANCIAL SUMMARY */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "none",
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
            <h3>{t("totalIncome")}</h3>

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
            <h3>{t("totalExpenses")}</h3>

            <h2
              style={{
                color: "#c62828",
                fontSize: "24px",
              }}
            >
              KES{" "}
              {totalExpense.toLocaleString()}
            </h2>
          </div>

          <div style={{ minWidth: 0 }}>
            <h3>{t("profit")}</h3>

            <h2
              style={{
                color:
                  profit >= 0
                    ? "#1565c0"
                    : "#c62828",
                fontSize: "24px",
              }}
            >
              KES {profit.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>


      {/* BUSINESS PERFORMANCE */}

      <div
        className="card reports-performance-card"
        style={{
          width: "100%",
          maxWidth: "none",
          minWidth: 0,
          boxSizing: "border-box",
          marginBottom: "25px",
          overflow: "hidden",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "8px" }}>
          📈 {t("businessPerformance")}
        </h2>

        <p style={{ marginTop: 0, marginBottom: "24px", color: "#666" }}>
          {t("businessPerformanceDescription")}
        </p>

        {(() => {
          const income = totalIncome;
          const expenses = totalExpense;
          const result = profit;

          const maxValue = Math.max(
            income,
            expenses,
            Math.abs(result),
            1
          );

          const items = [
            {
              key: "income",
              label: t("totalIncome"),
              value: income,
              color: "#1565c0",
            },
            {
              key: "expenses",
              label: t("totalExpenses"),
              value: expenses,
              color: "#c62828",
            },
            {
              key: "result",
              label: result >= 0 ? t("profit") : t("loss"),
              value: Math.abs(result),
              color: result >= 0 ? "#2e7d32" : "#c62828",
              isResult: true,
            },
          ];

          return (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
                gap: "16px",
                alignItems: "stretch",
              }}
            >
              {items.map((item) => {
                const barWidth = item.isResult && result === 0
                  ? 0
                  : Math.min((item.value / maxValue) * 100, 100);

                return (
                  <div
                    key={item.key}
                    style={{
                      minWidth: 0,
                      padding: "18px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "12px",
                      background: "#fff",
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginBottom: "16px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#555",
                        }}
                      >
                        {item.label}
                      </span>

                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: 700,
                          color: item.color,
                          overflowWrap: "anywhere",
                          textAlign: "right",
                        }}
                      >
                        KES {item.value.toLocaleString()}
                      </span>
                    </div>

                    <div
                      role="presentation"
                      style={{
                        width: "100%",
                        height: "12px",
                        background: "#eeeeee",
                        borderRadius: "999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${barWidth}%`,
                          height: "100%",
                          background: item.color,
                          borderRadius: "999px",
                          transition: "width 0.25s ease",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        marginTop: "10px",
                        fontSize: "12px",
                        color: "#777",
                      }}
                    >
                      {item.key === "income"
                        ? "Income"
                        : item.key === "expenses"
                          ? "Expenses"
                          : result >= 0
                            ? t("profit")
                            : t("loss")}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>


      {/* FINANCIAL TRANSACTIONS */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "none",
          minWidth: 0,
          boxSizing: "border-box",
          overflow: "hidden",
          marginBottom: "18px",
        }}
      >
        <h2 style={{ color: "#222", WebkitTextFillColor: "#222" }}>💵 {t("financialTransactions")}</h2>

        <div
          style={{
            width: "100%",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <table
            className="table financial-transactions-table"
            style={{
              width: "100%",
              maxWidth: "none",
              minWidth: 0,
              tableLayout: "fixed",
              boxSizing: "border-box",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    width: "14%",
                    fontSize: "13px",
                    padding: "12px 8px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("date")}
                </th>

                <th
                  style={{
                    width: "12%",
                    fontSize: "13px",
                    padding: "12px 8px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("type")}
                </th>

                <th
                  style={{
                    width: "16%",
                    fontSize: "13px",
                    padding: "12px 8px",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("category")}
                </th>

                <th
                  style={{
                    width: "25%",
                    fontSize: "13px",
                    padding: "12px 8px",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("description")}
                </th>

                <th
                  style={{
                    width: "16%",
                    fontSize: "13px",
                    padding: "12px 8px",
                    textAlign: "right",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("amount")}
                </th>

                <th
                  style={{
                    width: "17%",
                    fontSize: "13px",
                    padding: "12px 8px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("paymentMethod")}
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
                    {t("noFinancialTransactions")}
                  </td>
                </tr>
              ) : (
                finance.map((transaction) => (
                  <tr
                    key={transaction.id}
                  >
                    <td
                      style={{
                        padding: "12px 8px",
                        textAlign: "center",
                        fontSize: "13px",
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
                        padding: "12px 8px",
                        textAlign: "center",
                        fontSize: "13px",
                        overflow: "hidden",
                        textOverflow:
                          "ellipsis",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {transaction.type === "Income"
                        ? t("income")
                        : transaction.type === "Expense"
                        ? t("expense")
                        : transaction.type || "-"}
                    </td>

                    <td
                      style={{
                        padding: "12px 8px",
                        fontSize: "13px",
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
                        padding: "12px 8px",
                        fontSize: "13px",
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
                        padding: "12px 8px",
                        textAlign: "center",
                        fontSize: "13px",
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
                        padding: "12px 8px",
                        fontSize: "13px",
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
                      {transaction.payment_method === "Cash"
                        ? t("cash")
                        : transaction.payment_method || "-"}
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
          maxWidth: "none",
          minWidth: 0,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <h2
          className="animal-summary-heading"
          style={{
            display: "block",
            width: "100%",
            margin: "0 0 16px",
            padding: "0",
            color: "#222",
            WebkitTextFillColor: "#222",
            fontSize: "22px",
            fontWeight: 700,
            lineHeight: 1.35,
            visibility: "visible",
            opacity: 1,
          }}
        >
          🐾 {t("animalSummary")}
        </h2>

        <table
          className="table animal-summary-table"
          style={{
            width: "100%",
            maxWidth: "none",
            minWidth: 0,
            tableLayout: "fixed",
            borderCollapse: "collapse",
            boxSizing: "border-box",
          }}
        >
          <colgroup>
            <col style={{ width: "70%" }} />
            <col style={{ width: "30%" }} />
          </colgroup>

          <thead>
            <tr>
              <th
                style={{
                  color: "#263238",
                  WebkitTextFillColor: "#263238",
                  textAlign: "left",
                  fontSize: "13px",
                  padding: "12px 14px",
                  whiteSpace: "nowrap",
                }}
              >
                {t("animal")}
              </th>

              <th
                style={{
                  color: "#263238",
                  WebkitTextFillColor: "#263238",
                  textAlign: "center",
                  fontSize: "13px",
                  padding: "12px 14px",
                  whiteSpace: "nowrap",
                }}
              >
                {t("totalRecords")}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td
                style={{
                  color: "#263238",
                  WebkitTextFillColor: "#263238",
                  textAlign: "left",
                  padding: "12px 14px",
                }}
              >
                🐐 {t("goats")}
              </td>
              <td
                style={{
                  color: "#263238",
                  WebkitTextFillColor: "#263238",
                  textAlign: "center",
                  padding: "12px 14px",
                }}
              >
                {goats.length}
              </td>
            </tr>

            <tr>
              <td
                style={{
                  color: "#263238",
                  WebkitTextFillColor: "#263238",
                  textAlign: "left",
                  padding: "12px 14px",
                }}
              >
                🐔 {t("chickens")}
              </td>
              <td
                style={{
                  color: "#263238",
                  WebkitTextFillColor: "#263238",
                  textAlign: "center",
                  padding: "12px 14px",
                }}
              >
                {chickens.length}
              </td>
            </tr>

            <tr>
              <td
                style={{
                  color: "#263238",
                  WebkitTextFillColor: "#263238",
                  textAlign: "left",
                  padding: "12px 14px",
                }}
              >
                🐇 {t("rabbits")}
              </td>
              <td
                style={{
                  color: "#263238",
                  WebkitTextFillColor: "#263238",
                  textAlign: "center",
                  padding: "12px 14px",
                }}
              >
                {rabbits.length}
              </td>
            </tr>

            <tr>
              <td
                style={{
                  color: "#263238",
                  WebkitTextFillColor: "#263238",
                  textAlign: "left",
                  padding: "12px 14px",
                  fontWeight: "700",
                }}
              >
                {t("totalAnimals")}
              </td>

              <td
                style={{
                  color: "#263238",
                  WebkitTextFillColor: "#263238",
                  textAlign: "center",
                  padding: "12px 14px",
                  fontWeight: "700",
                }}
              >
                {totalAnimals}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Reports;
