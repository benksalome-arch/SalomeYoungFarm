import API_URL from "../api";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

function Receipts() {
  const { t, language } = useLanguage();
  const fileRef = useRef(null);

  const tr = (key, fallback) => {
    const value = t(key);
    return value && value !== key ? value : fallback;
  };

  const [receipts, setReceipts] = useState([]);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState(null);

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

  const locale = language === "nl" ? "nl-NL" : language === "sw" ? "sw-KE" : "en-GB";

  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2026, i, 1))
  );

  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
      new Date(2026, 0, 4 + i)
    )
  );
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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

    const isEditing = Boolean(editingReceipt);

    if (!file && !isEditing) {
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
        if (value !== "" && value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      if (file) data.append("receipt", file);

      const response = await fetch(
        isEditing
          ? `${API_URL}/api/receipts/${editingReceipt.id}`
          : `${API_URL}/api/receipts`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          credentials: "include",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(
          isEditing
            ? tr("receiptUpdateFailed", "Failed to update receipt.")
            : tr("receiptUploadFailed", "Failed to upload receipt.")
        );
        return;
      }

      alert(
        isEditing
          ? tr("receiptUpdatedSuccessfully", "Receipt updated successfully.")
          : tr("receiptUploadedSuccessfully", "Receipt uploaded successfully.")
      );

      cancelReceiptEdit();
      await loadReceipts();
    } catch (error) {
      console.error(error);
      alert(
        editingReceipt
          ? tr("receiptUpdateFailed", "Failed to update receipt.")
          : tr("receiptUploadFailed", "Failed to upload receipt.")
      );
    } finally {
      setSaving(false);
    }
  }

  function startReceiptEdit(receipt) {
    setEditingReceipt(receipt);
    setForm({
      receipt_date: receipt.receipt_date
        ? String(receipt.receipt_date).split("T")[0]
        : "",
      supplier: receipt.supplier || "",
      amount: receipt.amount ?? "",
      description: receipt.description || "",
      finance_id: receipt.finance_id ?? "",
    });
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";

    const date = receipt.receipt_date
      ? new Date(String(receipt.receipt_date).split("T")[0] + "T00:00:00")
      : new Date();
    setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setCalendarOpen(false);
  }

  function cancelReceiptEdit() {
    setEditingReceipt(null);
    setForm({
      receipt_date: "",
      supplier: "",
      amount: "",
      description: "",
      finance_id: "",
    });
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setCalendarOpen(false);
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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
    <div className="receipts-page" style={{ width: "100%", maxWidth: "100%", minWidth: 0 }}>
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

      <div style={{ marginBottom: 16 }}>
        <Link
          className="button"
          to="/"
          state={{ highlightPath: "/receipts" }}
          style={{
            background: "#2e7d32",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "9px 16px",
            cursor: "pointer",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          ← {tr("back", "Back")}
        </Link>
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
          {editingReceipt
            ? tr("editReceipt", "Edit Receipt")
            : tr("uploadReceipt", "Upload Receipt")}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="receipts-form-grid" style={fieldStyle}>
            <label>{tr("receiptDate", "Receipt Date")}</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input type="text" name="receipt_date" value={form.receipt_date ? form.receipt_date.split("-").reverse().join("-") : ""} placeholder="DD-MM-JJJJ" readOnly required onClick={() => { const d = form.receipt_date ? new Date(form.receipt_date + "T00:00:00") : new Date(); setCalendarMonth(new Date(d.getFullYear(), d.getMonth(), 1)); setCalendarOpen(true); }} style={{ ...inputStyle, width: "100%", cursor: "pointer", color: "#222", WebkitTextFillColor: "#222", backgroundColor: "#fff" }} />
              {calendarOpen && (
                <div onClick={(e) => { if (e.target === e.currentTarget) setCalendarOpen(false); }} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:99999, padding:16, boxSizing:"border-box" }}>
                  <div onClick={(e) => e.stopPropagation()} style={{ width:"min(92vw,360px)", maxHeight:"calc(100dvh - 32px)", overflowY:"auto", background:"#fff", borderRadius:14, padding:18, boxSizing:"border-box", boxShadow:"0 8px 30px rgba(0,0,0,0.25)" }}>
                    <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:14 }}>
                      <select value={month} onChange={(e) => setCalendarMonth(new Date(year,Number(e.target.value),1))} style={{ height:38, maxWidth:"58%", padding:"0 8px", border:"1px solid #cfd6cf", borderRadius:8, background:"#fff", color:"#222", fontSize:14, fontWeight:600 }}>
                        {monthNames.map((name,i) => <option key={name} value={i}>{name}</option>)}
                      </select>
                      <select value={year} onChange={(e) => setCalendarMonth(new Date(Number(e.target.value),month,1))} style={{ height:38, padding:"0 8px", border:"1px solid #cfd6cf", borderRadius:8, background:"#fff", color:"#222", fontSize:14, fontWeight:600 }}>
                        {Array.from({length:101},(_,i)=>new Date().getFullYear()-i).map((y)=><option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:10 }}>
                      <button type="button" onClick={goPreviousMonth} style={{ width:38,height:38,border:"1px solid #cfd6cf",borderRadius:8,background:"#fff",color:"#222",fontSize:20,cursor:"pointer" }}>‹</button>
                      <div style={{ flex:1,textAlign:"center",fontSize:17,fontWeight:700,color:"#222" }}>{monthNames[month]} {year}</div>
                      <button type="button" onClick={goNextMonth} style={{ width:38,height:38,border:"1px solid #cfd6cf",borderRadius:8,background:"#fff",color:"#222",fontSize:20,cursor:"pointer" }}>›</button>
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"repeat(7,minmax(0,1fr))",gap:4,marginBottom:6 }}>
                      {weekdays.map((d)=><div key={d} style={{textAlign:"center",fontWeight:700,fontSize:12,color:"#555",padding:"5px 0"}}>{d}</div>)}
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"repeat(7,minmax(0,1fr))",gap:5 }}>
                      {Array.from({length:firstDay},(_,i)=><div key={"empty-"+i}/>)}
                      {Array.from({length:daysInMonth},(_,i)=>{
                        const day=i+1;
                        const value=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                        const selected=form.receipt_date===value;
                        const now=new Date();
                        const today=day===now.getDate()&&month===now.getMonth()&&year===now.getFullYear();
                        return <button key={day} type="button" onClick={()=>handleReceiptDateSelect(day)} style={{width:"100%",aspectRatio:"1",maxHeight:40,border:selected?"2px solid #1b5e20":today?"2px solid #2e7d32":"1px solid #ddd",borderRadius:"50%",background:selected?"#2e7d32":today?"#2196f3":"#fff",color:selected||today?"#fff":"#222",fontWeight:selected||today?800:400,cursor:"pointer",fontSize:14,boxShadow:today?"0 0 0 2px #c8e6c9":"none"}}>{day}</button>;
                      })}
                    </div>
                    <button type="button" onClick={()=>setCalendarOpen(false)} style={{width:"100%",marginTop:16,padding:10,border:"1px solid #ccc",borderRadius:8,background:"#fff",color:"#222",cursor:"pointer",fontWeight:600}}>{tr("cancel", "Cancel")}</button>
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="receipts-form-grid" style={fieldStyle}>
            <label>{tr("supplier", "Supplier")}</label>
            <input
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              style={{ ...inputStyle, textAlign: "left" }}
            />
          </div>

          <div className="receipts-form-grid" style={fieldStyle}>
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

          <div className="receipts-form-grid" style={fieldStyle}>
            <label>{tr("description", "Description")}</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="2"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {editingReceipt?.file_url && (
            <p style={{ margin: "0 0 12px", color: "#555" }}>
              {tr("currentReceiptFile", "Current receipt file")}:{" "}
              <a href={editingReceipt.file_url} target="_blank" rel="noreferrer">
                {editingReceipt.file_name || tr("view", "View")}
              </a>
            </p>
          )}

          <div className="receipts-form-grid" style={fieldStyle}>
            <label>{tr("receiptFile", "Receipt File")}</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="receipts-native-file-input"
              style={inputStyle}
            />
            <div className="receipts-file-picker">
              <button
                type="button"
                className="receipts-file-picker-button"
                onClick={() => fileRef.current?.click()}
              >
                {tr("chooseFile", "Choose File")}
              </button>
              <span className="receipts-file-picker-name">
                {file?.name || (editingReceipt
                  ? tr("keepCurrentReceiptFile", "Existing file will be kept unless replaced")
                  : tr("noFileChosen", "No file chosen"))}
              </span>
            </div>
          </div>

          {file && (
            <p style={{ margin: "0 0 18px", color: "#555" }}>
              {file.name}
            </p>
          )}

          <div style={{ textAlign: "center", marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
            {editingReceipt && (
              <button className="button" type="button" onClick={cancelReceiptEdit} disabled={saving}
                style={{ background: "#666" }}>
                {tr("cancel", "Cancel")}
              </button>
            )}
            <button className="button" type="submit" disabled={saving}>
              {saving
                ? tr("saving", "Saving...")
                : editingReceipt
                  ? tr("saveChanges", "Save Changes")
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
                    <td data-label={tr("date", "Date")} style={tdStyle}>{formatDate(receipt.receipt_date)}</td>
                    <td data-label={tr("supplier", "Supplier")} style={tdStyle}>{receipt.supplier || "-"}</td>
                    <td data-label={tr("amount", "Amount")} style={tdStyle}>
                      {receipt.amount
                        ? `KES ${Number(receipt.amount).toLocaleString()}`
                        : "-"}
                    </td>
                    <td data-label={tr("receipt", "Receipt")} style={tdStyle}>
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
                    <td data-label={tr("actions", "Actions")} style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                      <button
                        className="button"
                        type="button"
                        onClick={() => startReceiptEdit(receipt)}
                        style={{ padding: "7px 12px", marginRight: "6px", marginBottom: "4px" }}
                      >
                        ✏️ {tr("edit", "Edit")}
                      </button>
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
  textAlign: "center",
  padding: "12px 10px",
  borderBottom: "2px solid #ddd",
  verticalAlign: "middle",
};

const tdStyle = {
  padding: "12px 10px",
  borderBottom: "1px solid #eee",
  verticalAlign: "middle",
  textAlign: "center",
};

export default Receipts;
