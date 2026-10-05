import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function FeedUsage() {
  const { t } = useLanguage();
  const [usage, setUsage] = useState([]);

  useEffect(() => {
    loadUsage();
  }, []);

  async function loadUsage() {
    try {
      const response = await fetch(`${API_URL}/api/feed-usage`);
      const data = await response.json();
      setUsage(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteUsage(id) {
    if (!window.confirm(t("deleteFeedConfirm"))) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/feed-usage/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete feed usage.");
        return;
      }

      alert(data.message || "Feed usage deleted successfully!");
      loadUsage();
    } catch (err) {
      console.error(err);
      alert("Failed to delete feed usage.");
    }
  }


  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
          marginBottom: 25,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 8,
            minWidth: 0,
          }}
        >
          <h1
            style={{
              margin: 0,
              padding: 0,
              lineHeight: 1.15,
              display: "block",
              position: "static",
            }}
          >
            🌾 Voergebruik
          </h1>

          <p
            style={{
              margin: 0,
              padding: 0,
              color: "#666",
              lineHeight: 1.5,
              display: "block",
              position: "static",
            }}
          >
            Overzicht van het dagelijkse voerverbruik.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <Link className="button" to="/feed">
            ← {t("back")}
          </Link>

          <Link className="button" to="/feed/usage/add">
            ➕ Voergebruik registreren
          </Link>
        </div>
      </div>

      <div className="card">
        {usage.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 50,
              color: "#666",
            }}
          >
            <div style={{ fontSize: 50 }}>🌾</div>

            <h3>{t("noFeedUsage")}</h3>

            <Link className="button" to="/feed/usage/add">
              ➕ Eerste registratie toevoegen
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>{t("date")}</th>
                  <th>{t("feed")}</th>
                  <th>{t("animalType")}</th>
                  <th>{t("quantity")}</th>
                  <th>{t("notes")}</th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>

              <tbody>
                {usage.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.usage_date
                        ? (() => {
                            const [year, month, day] =
                              item.usage_date.split("T")[0].split("-");
                            return `${day}-${month}-${year}`;
                          })()
                        : "-"}
                    </td>

                    <td>{item.feed_name || "-"}</td>

                    <td>
                      {item.animal_type === "Goat"
                        ? "Geit"
                        : item.animal_type === "Chicken"
                        ? "Kip"
                        : item.animal_type === "Rabbit"
                        ? "Konijn"
                        : item.animal_type || "-"}
                    </td>

                    <td>
                      <strong>{item.quantity_used} kg</strong>
                    </td>

                    <td>{item.notes || "-"}</td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <Link
                          className="button"
                          to={`/feed/usage/${item.id}`}
                        >
                          👁 {t("view")}
                        </Link>

                        <Link
                          className="button"
                          to={`/feed/usage/${item.id}/edit`}
                        >
                          ✏️ {t("update")}
                        </Link>

                        <button
                          className="button"
                          style={{
                            background: "#d32f2f",
                          }}
                          onClick={() => deleteUsage(item.id)}
                        >
                          🗑 Verwijderen
                        </button>
                      </div>
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

export default FeedUsage;
