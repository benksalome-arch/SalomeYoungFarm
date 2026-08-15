import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Finance() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const response = await fetch(
        `${API_URL}/api/finance`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        setTransactions([]);
        return;
      }

      setTransactions(data);
    } catch (error) {
      console.error(error);
      setTransactions([]);
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "-";
    }

    const dateOnly = String(dateValue).split("T")[0];
    const parts = dateOnly.split("-");

    if (parts.length !== 3) {
      return dateValue;
    }

    const [year, month, day] = parts;

    return `${day}-${month}-${year}`;
  }

  function formatDateTime(dateValue) {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(
      date.getHours()
    ).padStart(2, "0");

    const minutes = String(
      date.getMinutes()
    ).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  async function deleteTransaction(id) {
    if (
      !window.confirm(
        "Delete this transaction?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/finance/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete transaction."
        );
        return;
      }

      alert(
        data.message ||
          "Transaction deleted successfully."
      );

      loadTransactions();
    } catch (error) {
      console.error(error);
      alert("Failed to delete transaction.");
    }
  }

  const income = transactions
    .filter((t) => t.type === "Income")
    .reduce(
      (sum, t) =>
        sum + Number(t.amount || 0),
      0
    );

  const expense = transactions
    .filter((t) => t.type === "Expense")
    .reduce(
      (sum, t) =>
        sum + Number(t.amount || 0),
      0
    );

  const profit = income - expense;

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
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "25px",
          flexWrap: "wrap",
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
            💰 Finance Management
          </h1>

          <p
            style={{
              margin: "8px 0 0",
            }}
          >
            Income, expenses and farm
            profitability.
          </p>
        </div>

        <Link
          className="button"
          to="/finance/add"
          style={{
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          ➕ Add Transaction
        </Link>
      </div>

      {/* FINANCIAL SUMMARY */}

      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
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
          <h3>Total Income</h3>

          <h2
            style={{
              color: "green",
              marginBottom: 0,
              fontSize: "24px",
            }}
          >
            KES {income.toLocaleString()}
          </h2>
        </div>

        <div
          className="card"
          style={{
            minWidth: 0,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <h3>Total Expenses</h3>

          <h2
            style={{
              color: "red",
              marginBottom: 0,
              fontSize: "24px",
            }}
          >
            KES {expense.toLocaleString()}
          </h2>
        </div>

        <div
          className="card"
          style={{
            minWidth: 0,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <h3>Profit</h3>

          <h2
            style={{
              color:
                profit >= 0
                  ? "green"
                  : "red",
              marginBottom: 0,
              fontSize: "24px",
            }}
          >
            KES {profit.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* TRANSACTIONS */}

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
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ margin: 0 }}>
            Transactions
          </h2>

          <Link
            className="button"
            to="/finance/add"
            style={{
              whiteSpace: "nowrap",
            }}
          >
            ➕ Add Transaction
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
                    width: "11%",
                    padding: "10px 4px",
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Date
                </th>

                <th
                  style={{
                    width: "14%",
                    padding: "10px 4px",
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Recorded
                </th>

                <th
                  style={{
                    width: "9%",
                    padding: "10px 4px",
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Type
                </th>

                <th
                  style={{
                    width: "12%",
                    padding: "10px 4px",
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Category
                </th>

                <th
                  style={{
                    width: "17%",
                    padding: "10px 4px",
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Description
                </th>

                <th
                  style={{
                    width: "11%",
                    padding: "10px 4px",
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Amount
                </th>

                <th
                  style={{
                    width: "11%",
                    padding: "10px 4px",
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Payment
                </th>

                <th
                  style={{
                    width: "15%",
                    padding: "10px 4px",
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "30px 10px",
                    }}
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map(
                  (transaction) => (
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
                          fontSize: "9px",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {formatDateTime(
                          transaction.created_at
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
                        title={
                          transaction.category ||
                          ""
                        }
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

                      <td
                        style={{
                          padding: "8px 3px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              "center",
                            alignItems:
                              "center",
                            gap: "4px",
                            flexWrap:
                              "wrap",
                          }}
                        >
                          <Link
                            className="button"
                            to={`/finance/edit/${transaction.id}`}
                            style={{
                              padding:
                                "5px 6px",
                              fontSize:
                                "10px",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            ✏ Edit
                          </Link>

                          <button
                            type="button"
                            className="button"
                            onClick={() =>
                              deleteTransaction(
                                transaction.id
                              )
                            }
                            style={{
                              padding:
                                "5px 6px",
                              fontSize:
                                "10px",
                              background:
                                "#D32F2F",
                              color: "white",
                              border: "none",
                              whiteSpace:
                                "nowrap",
                              cursor:
                                "pointer",
                            }}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Finance;
