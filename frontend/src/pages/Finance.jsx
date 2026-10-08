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
      const response = await fetch(`${API_URL}/api/finance`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
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
          method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  const translateTransactionType = (value) => {
    if (value === "Income") return tr("income", "Income");
    if (value === "Expense") return tr("expense", "Expense");
    return value || "-";
  };

  const translateTransactionCategory = (value) => {
    if (value === "Inventory") return tr("inventory", "Inventory");
    if (value === "Feed") return tr("feed", "Feed");
    return value || "-";
  };

  const translatePaymentMethod = (value) => {
    if (value === "Cash") return tr("cash", "Cash");
    if (value === "Bank") return tr("bank", "Bank");
    return value || "-";
  };

  const financeMobileStyles = `
    .finance-mobile-transactions {
      display: none;
    }

    @media (max-width: 700px) {
      .finance-transactions-table {
        display: none !important;
      }

      .finance-mobile-transactions {
        display: flex;
        flex-direction: column;
        gap: 14px;
        width: 100%;
      }

      .finance-mobile-card {
        width: 100%;
        box-sizing: border-box;
        background: #fff;
        border: 1px solid #dfe4df;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      }

      .finance-mobile-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding-bottom: 12px;
        margin-bottom: 10px;
        border-bottom: 1px solid #e5e8e5;
        font-size: 16px;
        color: #222;
      }

      .finance-mobile-card-header strong:last-child {
        color: #2e7d32;
        white-space: nowrap;
      }

      .finance-mobile-row {
        display: grid;
        grid-template-columns: 42% minmax(0, 1fr);
        gap: 10px;
        padding: 7px 0;
        font-size: 14px;
        line-height: 1.4;
      }

      .finance-mobile-row span:first-child {
        font-weight: 600;
        color: #666;
      }

      .finance-mobile-row span:last-child {
        color: #222;
        overflow-wrap: anywhere;
        min-width: 0;
      }

      .finance-mobile-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid #e5e8e5;
      }

      .finance-mobile-actions .button {
        width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box;
        text-align: center;
        white-space: nowrap;
        padding: 10px 8px !important;
        font-size: 14px !important;
      }

      .finance-mobile-actions .button:last-child {
        background: #D32F2F !important;
        color: #fff !important;
        border: none !important;
      }

      .finance-mobile-empty {
        padding: 30px 15px;
        text-align: center;
        color: #666;
      }
    }
  `;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <style>{financeMobileStyles}</style>

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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
            flexWrap: "wrap",
          }}
        >
          <Link
            className="button"
            to="/"
            style={{
              width: "auto",
              whiteSpace: "nowrap",
            }}
          >
            ← {tr("back", "Terug")}
          </Link>

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


        </div>

        <div
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <table
            className="finance-transactions-table"
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
                        fontSize: "14px",
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
                        fontSize: "14px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {translateTransactionType(transaction.type)}
                    </td>

                    <td
                      style={{
                        padding: "10px 4px",
                        fontSize: "14px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={transaction.category || ""}
                    >
                      {translateTransactionCategory(transaction.category)}
                    </td>

                    <td
                      style={{
                        padding: "10px 4px",
                        fontSize: "14px",
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
                        fontSize: "14px",
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
                        fontSize: "14px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={
                        transaction.payment_method || ""
                      }
                    >
                      {translatePaymentMethod(transaction.payment_method)}
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
                            padding: "7px 10px",
                            fontSize: "13px",
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
                            padding: "7px 10px",
                            fontSize: "13px",
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

        <div className="finance-mobile-transactions">
          {transactions.length === 0 ? (
            <div className="finance-mobile-empty">
              {tr("noTransactions", "No transactions found.")}
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={`mobile-${transaction.id}`}
                className="finance-mobile-card"
              >
                <div className="finance-mobile-card-header">
                  <strong>
                    {formatDate(transaction.transaction_date)}
                  </strong>
                  <strong>
                    KES {Number(transaction.amount || 0).toLocaleString()}
                  </strong>
                </div>

<div className="finance-mobile-row">
                  <span>{tr("type", "Type")}</span>
                  <span>{translateTransactionType(transaction.type)}</span>
                </div>

                <div className="finance-mobile-row">
                  <span>{tr("category", "Category")}</span>
                  <span>{translateTransactionCategory(transaction.category)}</span>
                </div>

                <div className="finance-mobile-row">
                  <span>{tr("description", "Description")}</span>
                  <span>{transaction.description || "-"}</span>
                </div>

                <div className="finance-mobile-row">
                  <span>{tr("paymentMethod", "Payment Method")}</span>
                  <span>{translatePaymentMethod(transaction.payment_method)}</span>
                </div>

                <div className="finance-mobile-actions">
                  <Link
                    className="button"
                    to={`/finance/edit/${transaction.id}`}
                  >
                    ✏ {tr("edit", "Edit")}
                  </Link>

                  <button
                    type="button"
                    className="button"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    🗑 {tr("delete", "Delete")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Finance;
