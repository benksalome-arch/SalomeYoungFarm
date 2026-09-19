import API_URL from "../api";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

function Receipts() {
  const { t } = useLanguage();
  const fileRef = useRef(null);

  const tr = (key, fallback) => {
    const value = t(key);
    return value && value !== key ? value : fallback;
  };

  const [receipts, setReceipts] = useState([]);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const handleReceiptDateSelect = (day) => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const value = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setForm((prev) => ({ ...prev, receipt_date: value }));
    setCalendarOpen(false);
  };

  const goPreviousMonth = () => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goNextMonth = () => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const month = calendarMonth.getMonth();
  const year = calendarMonth.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();


  const [form, setForm] = useState({
    receipt_date: "",
    supplier: "",
    amount: "",
    description: "",
    finance_id: "",
  });

  useEffect(() => {
    loadReceipts();
  }, []);

  async function loadReceipts() {
    try {
      const response = await fetch(`${API_URL}/api/receipts`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) setReceipts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      alert(tr("selectReceipt", "Please select a receipt."));
      return;
    }

    if (!form.receipt_date) {
      alert(tr("receiptDateRequired", "Receipt date is required."));
      return;
    }

    setSaving(true);

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== "") data.append(key, value);
      });

      data.append("receipt", file);

      const response = await fetch(`${API_URL}/api/receipts`, {
        method: "POST",
        credentials: "include",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || tr("receiptUploadFailed", "Failed to upload receipt."));
        return;
      }

      alert(
        result.message ||
          tr("receiptUploadedSuccessfully", "Receipt uploaded successfully.")
      );

      setForm({
        receipt_date: "",
        supplier: "",
        amount: "",
        description: "",
        finance_id: "",
      });
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";

      loadReceipts();
    } catch (error) {
      console.error(error);
      alert(tr("receiptUploadFailed", "Failed to upload receipt."));
    } finally {
      setSaving(false);
    }
  }

  async function deleteReceipt(id) {
    if (
      !window.confirm(
        tr("confirmDeleteReceipt", "Delete this receipt?")
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/receipts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || tr("receiptDeleteFailed", "Failed to delete receipt."));
        return;
      }

      loadReceipts();
    } catch (error) {
      console.error(error);
      alert(tr("receiptDeleteFailed", "Failed to delete receipt."));
    }
  }

  function formatDate(value) {
    if (!value) return "-";
    const parts = String(value).split("T")[0].split("-");
    if (parts.length !== 3) return value;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  return (
    <div style={{ width: "100%", maxWidth: "100%", minWidth: 0 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "42px", lineHeight: 1.2 }}>
            🧾 {tr("receipts", "Receipts")}
          </h1>
          <p style={{ margin: "8px 0 0" }}>
            {tr("receiptsDescription", "Upload and manage farm receipts.")}
          </p>
        </div>
      </div>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto 25px",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          {tr("uploadReceipt", "Upload Receipt")}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label>{tr("receiptDate", "Receipt Date")}</label>

            <div style={{ position: "relative", width: "100%" }}>
              <div
                onClick={() => {
                  if (form.receipt_date) {
                    setCalendarMonth(new Date(form.receipt_date + "T00:00:00"));
                  } else {
                    setCalendarMonth(new Date());
                  }
                  setCalendarOpen(true);
                }}
                style={{
                  ...inputStyle,
                  width: "100%",
                  color: form.receipt_date ? "#222" : "#777",
                  WebkitTextFillColor: form.receipt_date ? "#222" : "#777",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {form.receipt_date
                  ? new Date(form.receipt_date + "T00:00:00").toLocaleDateString("nl-NL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "DD-MM-JJJJ"}
              </div>

              {calendarOpen && (
                <div
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 99999,
                  }}
                  onClick={() => setCalendarOpen(false)}
                >
                  <div
                    style={{
                      width: "min(92vw,360px)",
                      background: "#fff",
                      borderRadius: "14px",
                      padding: "18px",
                      boxSizing: "border-box",
                      boxShadow: "0 8px 30px rgba(0,0,0,.25)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "14px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={goPreviousMonth}
                        style={{
                          border: "1px solid #ddd",
                          background: "#fff",
                          borderRadius: "8px",
                          width: "38px",
                          height: "38px",
                          fontSize: "22px",
                          cursor: "pointer",
                        }}
                      >
                        ‹
                      </button>

                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#222",
                          WebkitTextFillColor: "#222",
                        }}
                      >
                        {monthNames[month]} {year}
                      </div>

                      <button
                        type="button"
                        onClick={goNextMonth}
                        style={{
                          border: "1px solid #ddd",
                          background: "#fff",
                          borderRadius: "8px",
                          width: "38px",
                          height: "38px",
                          fontSize: "22px",
                          cursor: "pointer",
                        }}
                      >
                        ›
                      </button>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7,1fr)",
                        gap: "6px",
                      }}
                    >
                      {weekdays.map((day) => (
                        <div
                          key={day}
                          style={{
                            textAlign: "center",
                            fontWeight: "600",
                            fontSize: "13px",
                            padding: "6px 0",
                            color: "#222",
                          }}
                        >
                          {day}
                        </div>
                      ))}

                      {Array.from({ length: firstDay }).map((_, index) => (
                        <div key={"empty-" + index} />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const today = new Date();

                        const isToday =
                          day === today.getDate() &&
                          month === today.getMonth() &&
                          year === today.getFullYear();

                        const selectedDate = form.receipt_date
                          ? new Date(`${form.receipt_date}T00:00:00`)
                          : null;

                        const isSelected =
                          selectedDate &&
                          day === selectedDate.getDate() &&
                          month === selectedDate.getMonth() &&
                          year === selectedDate.getFullYear();

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleReceiptDateSelect(day)}
                            style={{
                              minHeight: "40px",
                              border:
                                isSelected || isToday
                                  ? "2px solid #2e7d32"
                                  : "1px solid #ddd",
                              borderRadius: "8px",
                              background:
                                isSelected || isToday ? "#e8f5e9" : "#fff",
                              color: "#222",
                              WebkitTextFillColor: "#222",
                              fontSize: "15px",
                              fontWeight:
                                isSelected || isToday ? "700" : "500",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCalendarOpen(false)}
                      style={{
                        width: "100%",
                        marginTop: "14px",
                        padding: "10px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#2e7d32",
                        color: "#fff",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={fieldStyle}>
            <label>{tr("supplier", "Supplier")}</label>
            <input
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label>{tr("amount", "Amount")}</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label>{tr("description", "Description")}</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="2"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div style={fieldStyle}>
            <label>{tr("receiptFile", "Receipt File")}</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={inputStyle}
              required
            />
          </div>

          {file && (
            <p style={{ margin: "0 0 18px", color: "#555" }}>
              {file.name}
            </p>
          )}

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button className="button" type="submit" disabled={saving}>
              {saving
                ? tr("uploading", "Uploading...")
                : `📤 ${tr("uploadReceipt", "Upload Receipt")}`}
            </button>
          </div>
        </form>
      </div>

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          {tr("savedReceipts", "Saved Receipts")}
        </h2>

        {receipts.length === 0 ? (
          <p>{tr("noReceipts", "No receipts uploaded yet.")}</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>{tr("date", "Date")}</th>
                  <th style={thStyle}>{tr("supplier", "Supplier")}</th>
                  <th style={thStyle}>{tr("amount", "Amount")}</th>
                  <th style={thStyle}>{tr("receipt", "Receipt")}</th>
                  <th style={thStyle}>{tr("actions", "Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt) => (
                  <tr key={receipt.id}>
                    <td style={tdStyle}>{formatDate(receipt.receipt_date)}</td>
                    <td style={tdStyle}>{receipt.supplier || "-"}</td>
                    <td style={tdStyle}>
                      {receipt.amount
                        ? `KES ${Number(receipt.amount).toLocaleString()}`
                        : "-"}
                    </td>
                    <td style={tdStyle}>
                      <a
                        href={receipt.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="button"
                        style={{
                          display: "inline-block",
                          textDecoration: "none",
                          padding: "7px 12px",
                        }}
                      >
                        👁️ {tr("view", "View")}
                      </a>
                    </td>
                    <td style={tdStyle}>
                      <button
                        className="button"
                        type="button"
                        onClick={() => deleteReceipt(receipt.id)}
                        style={{
                          padding: "7px 12px",
                          background: "#c62828",
                        }}
                      >
                        🗑️ {tr("delete", "Delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const fieldStyle = {
  display: "grid",
  gridTemplateColumns: "150px minmax(0, 1fr)",
  alignItems: "center",
  gap: "14px",
  marginBottom: "16px",
};

const inputStyle = {
  width: "100%",
  minHeight: "44px",
  padding: "10px 12px",
  border: "1px solid #ccc",
  borderRadius: "7px",
  boxSizing: "border-box",
  fontSize: "15px",
  background: "#fff",
};

const thStyle = {
  textAlign: "left",
  padding: "12px 10px",
  borderBottom: "2px solid #ddd",
};

const tdStyle = {
  padding: "12px 10px",
  borderBottom: "1px solid #eee",
  verticalAlign: "middle",
};

export default Receipts;
