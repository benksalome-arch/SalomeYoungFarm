import API_URL from "../api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function ChickenProfile() {
  const { t } = useLanguage();
  const { id } = useParams();

  const [chicken, setChicken] = useState(null);

  useEffect(() => {
    loadChicken();
  }, []);

  async function loadChicken() {
    try {
      const response = await fetch(
        `${API_URL}/api/chickens/${id}`
      );

      const data = await response.json();
      setChicken(data);

    } catch (err) {
      console.error(err);
    }
  }

  if (!chicken) {
    return <p>Loading...</p>;
  }

  return (
    <div className="page">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1>🐔 {chicken.name || chicken.tag_number}</h1>
          <p>{t("chickenProfile")}</p>
        </div>

        <Link className="button" to="/chickens">
          ← Back
        </Link>
      </div>

      <div className="card">

        <table className="table">
          <tbody>

            <tr>
              <th>Tag Number</th>
              <td>{chicken.tag_number}</td>
            </tr>

            <tr>
              <th>Name</th>
              <td>{chicken.name}</td>
            </tr>

            <tr>
              <th>{t("breed")}</th>
              <td>{chicken.breed}</td>
            </tr>

            <tr>
              <th>Type</th>
              <td>{chicken.type}</td>
            </tr>

            <tr>
              <th>Sex</th>
              <td>{chicken.sex}</td>
            </tr>

            <tr>
              <th>Quantity</th>
              <td>{chicken.quantity}</td>
            </tr>

            <tr>
              <th>Status</th>
              <td>{chicken.status}</td>
            </tr>

            <tr>
              <th>Purchase Price</th>
              <td>{chicken.purchase_price}</td>
            </tr>

            <tr>
              <th>Source</th>
              <td>{chicken.source}</td>
            </tr>

            <tr>
              <th>{t("hatchDate")}</th>
              <td>{chicken.hatch_date?.split("T")[0]}</td>
            </tr>

            <tr>
              <th>{t("notes")}</th>
              <td>{chicken.notes}</td>
            </tr>

          </tbody>
        </table>

      </div>

    </div>
  );
}

export default ChickenProfile;
