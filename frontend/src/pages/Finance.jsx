import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Finance() {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState([]);

  const tr = (key, fallback) => {
    const value = t(key);
    return value && value !== key ? value : fallback;
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const response = await fetch(`${API_URL}/api/finance`);
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
    if (!dateValue) return "-";

    const dateOnly = String(dateValue).split("T")[0];
    const parts = dateOnly.split("-");

    if (parts.length !== 3) return dateValue;

    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  }

  function formatDateTime(dateValue) {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  async function deleteTransaction(id) {
    if (
      !window.confirm(
        tr(
          "confirmDeleteTransaction",
          "Delete this transaction?"
        )
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
            tr(
              "failedDeleteTransaction",
              "Failed to delete transaction."
            )
        );
        return;
      }

      alert(
        data.message ||
          tr(
            "transactionDeletedSuccessfully",
            "Transaction deleted successfully."
          )
      );

      loadTransactions();
    } catch (error) {
      console.error(error);

      alert(
        tr(
          "failedDeleteTransaction",
          "Failed to delete transaction."
        )
      );
    }
  }

  const income = transactions
    .filter((transaction) => transaction.type === "Income")
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount || 0),
      0
    );

  const expense = transactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount || 0),
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
            💰 {tr("financeManagement", "Finance Management")}
          </h1>

          <p
            style={{
              margin: "8px 0 0",
            }}
          >
            {tr(
              "financeDescription",
              "Income, expenses and farm profitability."
            )}
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
          ➕ {tr("addTransaction", "Add Transaction")}
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
        <div className="card">
          <h3>{tr("income", "Income")}</h3>
          <p>
            KES {income.toLocaleString()}
          </p>
        </div>

        <div className="card">
          <h3>{tr("expenses", "Expenses")}</h3>
          <p>
            KES {expense.toLocaleString()}
          </p>
        </div>

        <div className="card">
          <h3>{tr("profit", "Profit")}</h3>
          <p>
            KES {profit.toLocaleString()}
          </p>
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
            flexWrap: "wrap",
            marginBottom: "15px",
          }}
        >
          <h2 style={{ margin: 0 }}>
            {tr("transactions", "Transactions")}
          </h2>

          <Link
            className="button"
            to="/finance/add"
            style={{
              whiteSpace: "nowrap",
            }}
          >
            ➕ {tr("addTransaction", "Add Transaction")}
          </Link>
        </div>

        <div
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: "850px",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr>
                <th>
                  {tr("date", "Date")}
                </th>

                <th>
                  {tr("created", "Created")}
                </th>

                <th>
                  {tr("type", "Type")}
                </th>

                <th>
                  {tr("category", "Category")}
                </th>

                <th>
                  {tr("description", "Description")}
                </th>

                <th>
                  {tr("amount", "Amount")}
                </th>

                <th>
                  {tr(
                    "paymentMethod",
                    "Payment Method"
                  )}
                </th>

                <th>
                  {tr("actions", "Actions")}
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      padding: "30px 10px",
                      textAlign: "center",
                    }}
                  >
                    {tr(
                      "noTransactions",
                      "No transactions found."
                    )}
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td
                      style={{
                        padding: "10px 4px",
                        textAlign: "center",
                        fontSize: "10px",
                        whiteSpace: "nowrap",
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
                        whiteSpace: "nowrap",
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
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {transaction.type || "-"}
                    </td>

                    <td
                      style={{
                        padding: "10px 4px",
                        fontSize: "10px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={transaction.category || ""}
                    >
                      {transaction.category || "-"}
                    </td>

                    <td
                      style={{
                        padding: "10px 4px",
                        fontSize: "10px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={
                        transaction.description || ""
                      }
                    >
                      {transaction.description || "-"}
                    </td>

                    <td
                      style={{
                        padding: "10px 4px",
                        textAlign: "center",
                        fontSize: "10px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      KES{" "}
                      {Number(
                        transaction.amount || 0
                      ).toLocaleString()}
                    </td>

                    <td
                      style={{
                        padding: "10px 4px",
                        fontSize: "10px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={
                        transaction.payment_method || ""
                      }
                    >
                      {transaction.payment_method || "-"}
                    </td>

                    <td
                      style={{
                        padding: "8px 3px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "4px",
                          flexWrap: "wrap",
                        }}
                      >
                        <Link
                          className="button"
                          to={`/finance/edit/${transaction.id}`}
                          style={{
                            padding: "5px 6px",
                            fontSize: "10px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ✏ {tr("edit", "Edit")}
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
                            padding: "5px 6px",
                            fontSize: "10px",
                            background: "#D32F2F",
                            color: "white",
                            border: "none",
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                          }}
                        >
                          🗑 {tr("delete", "Delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Finance;
