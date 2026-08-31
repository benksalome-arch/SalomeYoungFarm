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
      const response = await fetch(
        `${API_URL}/api/egg-sales`
      );

      const data = await response.json();

      setSales(data);

    } catch (err) {
      console.error(err);
    }
  }

  async function deleteSale(id) {

    const confirmed = window.confirm(
      "Delete this egg sale?"
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
      alert(t("failedToDeleteSale"));
    }

  }

  const totalEggs = sales.reduce(
    (sum, sale) => sum + Number(sale.quantity),
    0
  );

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + Number(sale.total_amount),
    0
  );

  return (
    <div className="page">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1>🥚 Egg Sales</h1>
          <p>Manage egg sales and income.</p>
        </div>

        <Link className="button" to="/egg-sales/add">
          ➕ {t("recordSale")}
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "20px",
        }}
      >

        <div className="card">
          <h3>{t("totalSales")}</h3>
          <h2>{sales.length}</h2>
        </div>

        <div className="card">
          <h3>{t("eggsSold")}</h3>
          <h2>{totalEggs}</h2>
        </div>

        <div className="card">
          <h3>{t("totalRevenue")}</h3>
          <h2>
            KES {totalRevenue.toLocaleString()}
          </h2>
        </div>

      </div>

      <div className="card">

        <table className="table">

          <thead>
            <tr>
              <th>{t("date")}</th>
              <th>{t("customer")}</th>
              <th>{t("quantity")}</th>
              <th>{t("pricePerEgg")}</th>
              <th>{t("total")}</th>
              <th>{t("payment")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>

          <tbody>

            {sales.length === 0 ? (

              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center" }}
                >
                  {t("noEggSalesFound")}
                </td>
              </tr>

            ) : (

              sales.map((sale) => (

                <tr key={sale.id}>

                  <td>
                    {sale.sale_date?.split("T")[0]}
                  </td>

                  <td>
                    {sale.customer || t("walkInCustomer")}
                  </td>

                  <td>{sale.quantity}</td>

                  <td>
                    KES {Number(sale.price_per_egg).toLocaleString()}
                  </td>

                  <td>
                    KES {Number(sale.total_amount).toLocaleString()}
                  </td>

                  <td>{sale.payment_method}</td>

                  <td>

                    <button
                      className="button"
                      onClick={() =>
                        deleteSale(sale.id)
                      }
                    >
                      🗑 {t("delete")}
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
