import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function EggSales() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    try {
      const response = await fetch(
        "${API_URL}/api/egg-sales"
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
      alert("Failed to delete sale.");
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
          <h1>ðŸ¥š Egg Sales</h1>
          <p>Manage egg sales and income.</p>
        </div>

        <Link className="button" to="/egg-sales/add">
          âž• Record Sale
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
          <h3>Total Sales</h3>
          <h2>{sales.length}</h2>
        </div>

        <div className="card">
          <h3>Eggs Sold</h3>
          <h2>{totalEggs}</h2>
        </div>

        <div className="card">
          <h3>Total Revenue</h3>
          <h2>
            KES {totalRevenue.toLocaleString()}
          </h2>
        </div>

      </div>

      <div className="card">

        <table className="table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Quantity</th>
              <th>Price/Egg</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {sales.length === 0 ? (

              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center" }}
                >
                  No egg sales found.
                </td>
              </tr>

            ) : (

              sales.map((sale) => (

                <tr key={sale.id}>

                  <td>
                    {sale.sale_date?.split("T")[0]}
                  </td>

                  <td>
                    {sale.customer || "Walk-in Customer"}
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
                      ðŸ—‘ Delete
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
