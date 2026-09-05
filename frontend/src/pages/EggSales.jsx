import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function EggSales() {
  const { t } = useLanguage();
  const [sales, setSales] = useState([]);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    try {
      const response = await fetch(`${API_URL}/api/egg-sales`);
      const data = await response.json();

      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteSale(id) {
    const confirmed = window.confirm(
      t("deleteSaleConfirm") === "deleteSaleConfirm"
        ? "Delete this egg sale?"
        : t("deleteSaleConfirm")
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/api/egg-sales/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        loadSales();
      }
    } catch (err) {
      console.error(err);

      alert(
        t("failedToDeleteSale") === "failedToDeleteSale"
          ? "Failed to delete egg sale."
          : t("failedToDeleteSale")
      );
    }
  }

  function text(key, fallback) {
    const translated = t(key);

    if (!translated || translated === key) {
      return fallback;
    }

    return translated;
  }

  const totalEggs = sales.reduce(
    (sum, sale) => sum + Number(sale.quantity || 0),
    0
  );

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + Number(sale.total_amount || 0),
    0
  );

  return (
    <div
      className="page"
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* PAGE HEADER */}
      <div
        style={{
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
              fontSize: "clamp(30px, 4vw, 44px)",
              lineHeight: 1.15,
            }}
          >
            🥚 {text("eggSales", "Egg Sales")}
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: "16px",
              opacity: 0.75,
            }}
          >
            {text(
              "manageEggSales",
              "Manage egg sales and income."
            )}
          </p>
        </div>

        <Link
          className="button"
          to="/egg-sales/add"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          ➕ {text("recordSale", "Record Sale")}
        </Link>
      </div>

      {/* SUMMARY CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <div className="card">
          <h3>{text("totalSales", "Total Sales")}</h3>
          <h2>{sales.length}</h2>
        </div>

        <div className="card">
          <h3>{text("eggsSold", "Eggs Sold")}</h3>
          <h2>{totalEggs}</h2>
        </div>

        <div className="card">
          <h3>{text("totalRevenue", "Total Revenue")}</h3>
          <h2>
            KES {totalRevenue.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* SALES TABLE */}
      <div
        className="card"
        style={{
          width: "100%",
          overflowX: "auto",
          boxSizing: "border-box",
        }}
      >
        <table
          className="table"
          style={{
            width: "100%",
            minWidth: "850px",
          }}
        >
          <thead>
            <tr>
              <th>{text("date", "Date")}</th>
              <th>{text("customer", "Customer")}</th>
              <th>{text("quantity", "Quantity")}</th>
              <th>{text("pricePerEgg", "Price/Egg")}</th>
              <th>{text("total", "Total")}</th>
              <th>{text("payment", "Payment")}</th>
              <th>{text("actions", "Actions")}</th>
            </tr>
          </thead>

          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "30px 10px",
                  }}
                >
                  {text(
                    "noEggSalesFound",
                    "No egg sales found."
                  )}
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id}>
                  <td>
                    {sale.sale_date
                      ? sale.sale_date.split("T")[0]
                      : "-"}
                  </td>

                  <td>
                    {sale.customer ||
                      text(
                        "walkInCustomer",
                        "Walk-in Customer"
                      )}
                  </td>

                  <td>{sale.quantity}</td>

                  <td>
                    KES{" "}
                    {Number(
                      sale.price_per_egg || 0
                    ).toLocaleString()}
                  </td>

                  <td>
                    KES{" "}
                    {Number(
                      sale.total_amount || 0
                    ).toLocaleString()}
                  </td>

                  <td>
                    {sale.payment_method || "-"}
                  </td>

                  <td>
                    <button
                      className="button"
                      onClick={() =>
                        deleteSale(sale.id)
                      }
                    >
                      🗑 {text("delete", "Delete")}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EggSales;