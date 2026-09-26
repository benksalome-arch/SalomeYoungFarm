import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EditChickenMortality() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();

  const [chickens, setChickens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    chicken_id: "",
    mortality_date: "",
    quantity: 1,
    cause: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const [mortalityResponse, chickensResponse] = await Promise.all([
        fetch(`${API_URL}/api/chicken-mortality`),
        fetch(`${API_URL}/api/chickens`),
      ]);

      const mortalityRecords = await mortalityResponse.json();
      const chickenData = await chickensResponse.json();

      const record = mortalityRecords.find(
        (item) => String(item.id) === String(id)
      );

      if (!record) {
        alert(t("mortalityUnavailable"));
        navigate("/chicken-mortality");
        return;
      }

      setFormData({
        chicken_id: record.chicken_id || "",
        mortality_date: record.mortality_date
          ? record.mortality_date.split("T")[0]
          : "",
        quantity: record.quantity ?? 1,
        cause: record.cause || "",
        notes: record.notes || "",
      });

      setChickens(chickenData);
    } catch (err) {
      console.error(err);
      alert(t("failedRecordMortality"));
      navigate("/chicken-mortality");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/api/chicken-mortality/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            mortality_date: formData.mortality_date,
            quantity: Number(formData.quantity),
            cause: formData.cause,
            notes: formData.notes,
          }),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/chicken-mortality");
      }
    } catch (err) {
      console.error(err);
      alert(t("failedRecordMortality"));
    } finally {
      setSaving(false);
    }
  }

  const formStyle = {
    width: "100%",
    maxWidth: "620px",
    margin: "0 auto",
  };

  const fieldStyle = {
    display: "grid",
    gridTemplateColumns: "150px minmax(0, 260px)",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px",
  };

  const labelStyle = {
    fontWeight: 600,
    fontSize: "15px",
    textAlign: "right",
    color: "#222",
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    minHeight: "44px",
    border: "1px solid #cfd6cf",
    borderRadius: "7px",
    background: "#fff",
    color: "#222",
    WebkitTextFillColor: "#222",
    fontSize: "15px",
  };

  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <p>{t("loadingMortalityRecords")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#222",
            WebkitTextFillColor: "#222",
          }}
        >
          🐔 {t("edit")} {t("chickenMortality")}
        </h1>

        <Link className="button" to="/chicken-mortality">
          ← {t("back")}
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={formStyle}>
          <div className="mortality-field" style={fieldStyle}>
            <label style={labelStyle}>{t("chicken")}</label>

            <select
              value={formData.chicken_id}
              disabled
              style={{
                ...inputStyle,
                background: "#f3f3f3",
                cursor: "not-allowed",
              }}
            >
              {chickens
                .filter(
                  (chicken) =>
                    String(chicken.id) === String(formData.chicken_id)
                )
                .map((chicken) => (
                  <option key={chicken.id} value={chicken.id}>
                    {chicken.tag_number} - {chicken.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="mortality-field" style={fieldStyle}>
            <label style={labelStyle}>{t("date")}</label>

            <input
              type="text"
              value={
                formData.mortality_date
                  ? formData.mortality_date.split("-").reverse().join("-")
                  : ""
              }
              placeholder="DD-MM-JJJJ"
              readOnly
              onClick={() => {
                let selected = formData.mortality_date
                  ? new Date(formData.mortality_date + "T00:00:00")
                  : new Date();

                let viewYear = selected.getFullYear();
                let viewMonth = selected.getMonth();

                const overlay = document.createElement("div");
                overlay.style.cssText =
                  "position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:99999;padding:10px;box-sizing:border-box;";

                const box = document.createElement("div");
                box.style.cssText =
                  "width:min(92vw,340px);background:#fff;border-radius:14px;padding:18px;box-sizing:border-box;box-shadow:0 8px 30px rgba(0,0,0,.25);";

                function renderCalendar() {
                  box.innerHTML = "";

                  const header = document.createElement("div");
                  header.style.cssText =
                    "display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;gap:6px;";

                  const prev = document.createElement("button");
                  prev.type = "button";
                  prev.textContent = "‹";
                  prev.style.cssText =
                    "border:0;background:#f1f1f1;border-radius:7px;width:38px;height:36px;font-size:24px;cursor:pointer;";
                  prev.onclick = () => {
                    viewMonth--;
                    if (viewMonth < 0) {
                      viewMonth = 11;
                      viewYear--;
                    }
                    renderCalendar();
                  };

                  const monthYear = document.createElement("div");
                  monthYear.style.cssText =
                    "font-size:17px;font-weight:700;color:#222;display:flex;align-items:center;gap:6px;";

                  const monthSelect = document.createElement("select");
                  const months = [
                    t("january"), t("february"), t("march"), t("april"),
                    t("may"), t("june"), t("july"), t("august"),
                    t("september"), t("october"), t("november"), t("december")
                  ];

                  months.forEach((m, i) => {
                    const option = document.createElement("option");
                    option.value = i;
                    option.textContent = m;
                    if (i === viewMonth) option.selected = true;
                    monthSelect.appendChild(option);
                  });

                  monthSelect.style.cssText =
                    "border:1px solid #ddd;border-radius:7px;padding:6px;font-size:15px;font-weight:700;background:#fff;color:#222;";

                  monthSelect.onchange = () => {
                    viewMonth = Number(monthSelect.value);
                    renderCalendar();
                  };

                  const yearSelect = document.createElement("select");
                  for (let y = viewYear - 10; y <= viewYear + 10; y++) {
                    const option = document.createElement("option");
                    option.value = y;
                    option.textContent = y;
                    if (y === viewYear) option.selected = true;
                    yearSelect.appendChild(option);
                  }

                  yearSelect.style.cssText =
                    "border:1px solid #ddd;border-radius:7px;padding:6px;font-size:15px;font-weight:700;background:#fff;color:#222;";

                  yearSelect.onchange = () => {
                    viewYear = Number(yearSelect.value);
                    renderCalendar();
                  };

                  monthYear.appendChild(monthSelect);
                  monthYear.appendChild(yearSelect);

                  const next = document.createElement("button");
                  next.type = "button";
                  next.textContent = "›";
                  next.style.cssText =
                    "border:0;background:#f1f1f1;border-radius:7px;width:38px;height:36px;font-size:24px;cursor:pointer;";
                  next.onclick = () => {
                    viewMonth++;
                    if (viewMonth > 11) {
                      viewMonth = 0;
                      viewYear++;
                    }
                    renderCalendar();
                  };

                  header.appendChild(prev);
                  header.appendChild(monthYear);
                  header.appendChild(next);

                  const grid = document.createElement("div");
                  grid.style.cssText =
                    "display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;";

                  [
                    t("sun"), t("mon"), t("tue"), t("wed"),
                    t("thu"), t("fri"), t("sat")
                  ].forEach((day) => {
                    const el = document.createElement("div");
                    el.textContent = day;
                    el.style.cssText =
                      "text-align:center;font-weight:600;font-size:13px;padding:6px 0;color:#222;";
                    grid.appendChild(el);
                  });

                  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
                  const daysInMonth = new Date(
                    viewYear,
                    viewMonth + 1,
                    0
                  ).getDate();

                  for (let i = 0; i < firstDay; i++) {
                    grid.appendChild(document.createElement("div"));
                  }

                  const today = new Date();

                  for (let day = 1; day <= daysInMonth; day++) {
                    const button = document.createElement("button");
                    button.type = "button";
                    button.textContent = day;

                    const value =
                      `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                    const selected = formData.mortality_date === value;
                    const isToday =
                      day === today.getDate() &&
                      viewMonth === today.getMonth() &&
                      viewYear === today.getFullYear();

                    button.style.cssText =
                      "height:36px;border-radius:7px;background:" +
                      (selected ? "#1976d2" : "#fff") +
                      ";color:" +
                      (selected ? "#fff" : "#222") +
                      ";font-weight:" +
                      (selected ? "700" : "400") +
                      ";border:" +
                      (isToday && !selected
                        ? "2px solid #1976d2"
                        : "1px solid #ddd") +
                      ";cursor:pointer;font-size:14px;";

                    button.onclick = () => {
                      setFormData((prev) => ({
                        ...prev,
                        mortality_date: value,
                      }));
                      document.body.removeChild(overlay);
                    };

                    grid.appendChild(button);
                  }

                  const cancel = document.createElement("button");
                  cancel.type = "button";
                  cancel.textContent = t("cancel");
                  cancel.style.cssText =
                    "display:block;margin:16px auto 0;padding:9px 18px;border:0;border-radius:7px;background:#2e7d32;color:#fff;font-size:14px;cursor:pointer;";
                  cancel.onclick = () =>
                    document.body.removeChild(overlay);

                  box.appendChild(header);
                  box.appendChild(grid);
                  box.appendChild(cancel);
                }

                overlay.appendChild(box);
                document.body.appendChild(overlay);
                renderCalendar();
              }}
              style={{
                ...inputStyle,
                cursor: "pointer",
              }}
              required
            />
          </div>

          <div className="mortality-field" style={fieldStyle}>
            <label style={labelStyle}>{t("quantity")}</label>

            <input
              type="number"
              min="1"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div
            className="mortality-field"
            style={{
              ...fieldStyle,
              marginBottom: "20px",
            }}
          >
            <label style={labelStyle}>{t("cause")}</label>

            <input
              type="text"
              name="cause"
              value={formData.cause}
              onChange={handleChange}
              placeholder={t("mortalityCausePlaceholder")}
              style={inputStyle}
            />
          </div>

          <div
            className="mortality-notes"
            style={{
              display: "grid",
              gridTemplateColumns: "150px minmax(0, 260px)",
              alignItems: "start",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            <label style={labelStyle}>{t("notes")}</label>

            <textarea
              rows="4"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              style={{
                ...inputStyle,
                minHeight: "100px",
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="button"
              type="submit"
              disabled={saving}
            >
              💾 {t("save")}
            </button>

            <Link className="button" to="/chicken-mortality">
              {t("cancel")}
            </Link>
          </div>
        </form>

        <style>{`
          @media (max-width: 700px) {
            .mortality-field,
            .mortality-notes {
              grid-template-columns: 105px minmax(0, 1fr) !important;
              gap: 10px !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default EditChickenMortality;
