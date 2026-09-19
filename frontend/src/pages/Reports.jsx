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
          <h3>🐐 {t("goats")}</h3>
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
          <h3>🐔 {t("chickens")}</h3>
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
          <h3>🐇 {t("rabbits")}</h3>
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
          <h3>🐾 {t("totalAnimals")}</h3>
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
          <h3>🌾 {t("feedTypes")}</h3>
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
        className="card"
        style={{
          width: "100%",
          maxWidth: "none",
          boxSizing: "border-box",
          marginBottom: "25px",
        }}
      >
        <h2>📈 {t("businessPerformance")}</h2>

        <p>{t("businessPerformanceDescription")}</p>

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

          const scale = (value) =>
            Math.max((Math.abs(value) / maxValue) * 150, value === 0 ? 0 : 8);

          return (
            <div
              style={{
                width: "100%",
                height: "260px",
                marginTop: "15px",
                position: "relative",
                boxSizing: "border-box",
                padding: "0 30px",
              }}
            >
              {/* ZERO LINE */}
              <div
                style={{
                  position: "absolute",
                  left: "30px",
                  right: "30px",
                  top: "125px",
                  borderTop: "2px solid #444",
                  zIndex: 1,
                }}
              />

              {/* ZERO LABEL */}
              <div
                style={{
                  position: "absolute",
                  left: "0",
                  top: "115px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                KES 0
              </div>

              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  columnGap: "35px",
                }}
              >

                {/* INCOME */}
                <div
                  style={{
                    position: "relative",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: "135px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "70%",
                      maxWidth: "180px",
                      height: `${scale(income)}px`,
                      background: "#1565c0",
                      borderRadius: "8px 8px 0 0",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      bottom: `${140 + scale(income)}px`,
                      width: "100%",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#1565c0",
                    }}
                  >
                    KES {income.toLocaleString()}
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      top: "157px",
                      width: "100%",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {t("totalIncome")}
                  </div>
                </div>

                {/* EXPENSES */}
                <div
                  style={{
                    position: "relative",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: "135px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "70%",
                      maxWidth: "180px",
                      height: `${scale(expenses)}px`,
                      background: "#c62828",
                      borderRadius: "8px 8px 0 0",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      bottom: `${140 + scale(expenses)}px`,
                      width: "100%",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#c62828",
                    }}
                  >
                    KES {expenses.toLocaleString()}
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      top: "157px",
                      width: "100%",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {t("totalExpenses")}
                  </div>
                </div>

                {/* PROFIT / LOSS */}
                <div
                  style={{
                    position: "relative",
                    height: "100%",
                  }}
                >

                  {result >= 0 ? (
                    <>
                      {/* PROFIT BAR UPWARD */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "135px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "70%",
                          maxWidth: "180px",
                          height: `${scale(result)}px`,
                          background: "#2e7d32",
                          borderRadius: "8px 8px 0 0",
                        }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          bottom: `${140 + scale(result)}px`,
                          width: "100%",
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#2e7d32",
                        }}
                      >
                        {t("profit")}: KES {result.toLocaleString()}
                      </div>

                      <div
                        style={{
                          position: "absolute",
                          top: "157px",
                          width: "100%",
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#2e7d32",
                        }}
                      >
                        {t("profit")}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* LOSS BAR DOWNWARD */}
                      <div
                        style={{
                          position: "absolute",
                          top: "200px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "70%",
                          maxWidth: "180px",
                          height: `${scale(result)}px`,
                          background: "#c62828",
                          borderRadius: "0 0 8px 8px",
                        }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          top: `${160 + scale(result)}px`,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "100%",
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#c62828",
                        }}
                      >
                        {t("loss")}: KES {Math.abs(result).toLocaleString()}
                      </div>
                    </>
                  )}

                </div>

              </div>
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
        <h2>🐾 {t("animalSummary")}</h2>

        <table
          className="table"
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
                  textAlign: "left",
                  padding: "12px 14px",
                }}
              >
                🐐 {t("goats")}
              </td>
              <td
                style={{
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
                  textAlign: "left",
                  padding: "12px 14px",
                }}
              >
                🐔 {t("chickens")}
              </td>
              <td
                style={{
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
                  textAlign: "left",
                  padding: "12px 14px",
                }}
              >
                🐇 {t("rabbits")}
              </td>
              <td
                style={{
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
                  textAlign: "left",
                  padding: "12px 14px",
                  fontWeight: "700",
                }}
              >
                {t("totalAnimals")}
              </td>

              <td
                style={{
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
