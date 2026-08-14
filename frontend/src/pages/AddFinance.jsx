import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddFinance() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    transaction_date: new Date().toISOString().split("T")[0],
    type: "Expense",
    category: "",
    description: "",
    amount: "",
    payment_method: "Cash",
    created_by: 1,
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("${API_URL}/api/finance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save transaction.");
        return;
      }

      alert(data.message || "Transaction saved successfully.");
      navigate("/finance");
    } catch (error) {
      console.error(error);
      alert("Failed to save transaction.");
    }
  }

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px",
    fontSize: "15px",
  };

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "20px",
      }}
    >
      {/* PAGE HEADER */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            margin: "0 0 8px 0",
            fontSize: "42px",
            color: "#111",
          }}
        >
          ðŸ’° Add Transaction
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "18px",
          }}
        >
          Create a new financial record.
        </p>
      </div>

      {/* FORM CARD */}
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto",
          padding: "30px",
          boxSizing: "border-box",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* 1. TRANSACTION DATE */}
          <div style={{ marginBottom: "22px" }}>
            <label htmlFor="transaction_date" style={labelStyle}>
              Transaction Date
            </label>

            <input
              id="transaction_date"
              type="date"
              name="transaction_date"
              value={formData.transaction_date}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* 2. TYPE */}
          <div style={{ marginBottom: "22px" }}>
            <label htmlFor="type" style={labelStyle}>
              Type
            </label>

            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          {/* 3. CATEGORY */}
          <div style={{ marginBottom: "22px" }}>
            <label htmlFor="category" style={labelStyle}>
              Category
            </label>

            <input
              id="category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder="Example: Goat Sale"
              style={inputStyle}
            />
          </div>

          {/* 4. AMOUNT */}
          <div style={{ marginBottom: "22px" }}>
            <label htmlFor="amount" style={labelStyle}>
              Amount (KES)
            </label>

            <input
              id="amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              style={inputStyle}
            />
          </div>

          {/* 5. PAYMENT METHOD */}
          <div style={{ marginBottom: "22px" }}>
            <label htmlFor="payment_method" style={labelStyle}>
              Payment Method
            </label>

            <select
              id="payment_method"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Cash">Cash</option>
              <option value="M-PESA">M-PESA</option>
              <option value="Bank">Bank</option>
            </select>
          </div>

          {/* 6. DESCRIPTION - LAST */}
          <div style={{ marginBottom: "25px" }}>
            <label htmlFor="description" style={labelStyle}>
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Example: Sold one Boer buck to John"
              style={{
                ...inputStyle,
                minHeight: "100px",
                resize: "vertical",
              }}
            />

            <small
              style={{
                display: "block",
                marginTop: "6px",
                color: "#666",
                textAlign: "center",
              }}
            >
              Add useful details about this transaction.
            </small>
          </div>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <button className="button" type="submit">
              ðŸ’¾ Save Transaction
            </button>

            <Link className="button" to="/finance">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFinance;
