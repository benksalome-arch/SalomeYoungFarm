import API_URL from "../api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import WeightChart from "../components/WeightChart";
import { useLanguage } from "../context/LanguageContext";

function WeightHistory() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/weight/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRecords(data.reverse());
      })
      .catch(console.error);
  }, [id]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>⚖ {t("weightHistory")}</h1>
        <p>{t("trackWeightOverTime")}</p>
      </div>

      <div className="card">

        <WeightChart records={[...records].reverse()} />

        <br />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Link className="button" to={`/goats/${id}`}>
            ← {t("back")} to Goat
          </Link>

          <Link className="button" to={`/goats/${id}/weight/add`}>
            ➕ Add Weight
          </Link>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>{t("date")}</th>
              <th>{t("weightKg")}</th>
              <th>{t("gainLoss")}</th>
              <th>{t("notes")}</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No weight records found.
                </td>
              </tr>
            ) : (
              records.map((record, index) => {
                let gainLoss = "-";
                let color = "black";

                if (index < records.length - 1) {
                  const previousWeight = Number(records[index + 1].weight);
                  const currentWeight = Number(record.weight);
                  const difference = currentWeight - previousWeight;

                  if (difference > 0) {
                    gainLoss = `+${difference.toFixed(2)} kg`;
                    color = "green";
                  } else if (difference < 0) {
                    gainLoss = `${difference.toFixed(2)} kg`;
                    color = "red";
                  } else {
                    gainLoss = t("noChange");
                    color = "#666";
                  }
                }

                return (
                  <tr key={record.id}>
                    <td>{new Date(record.record_date).toLocaleDateString()}</td>
                    <td>{Number(record.weight).toFixed(2)} kg</td>
                    <td style={{ color, fontWeight: "bold" }}>
                      {gainLoss}
                    </td>
                    <td>{record.notes}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default WeightHistory;
