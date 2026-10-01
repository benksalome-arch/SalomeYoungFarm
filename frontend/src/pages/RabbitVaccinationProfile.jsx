import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function RabbitVaccinationProfile() {
  const { t } = useLanguage();
  const { id } = useParams();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecord();
  }, [id]);

  async function loadRecord() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/rabbit-vaccinations`
      );

      const data = await response.json();

      if (!response.ok) {
        setRecord(null);
        return;
      }

      const found = data.find(
        (item) => String(item.id) === String(id)
      );

      setRecord(found || null);
    } catch (err) {
      console.error(err);
      setRecord(null);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) return "-";

    const dateOnly = String(dateValue).split("T")[0];
    const parts = dateOnly.split("-");

    if (parts.length !== 3) return dateValue;

    const [year, month, day] = parts;

    return `${day}-${month}-${year}`;
  }

  if (loading) {
    return (
      <div className="card">
        <p style={{ textAlign: "center", padding: "30px" }}>
          {t("loadingVaccinationRecords")}
        </p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="card">
        <h2>💉 {t("rabbitVaccinations")}</h2>

        <p>
          Vaccination record not found.
        </p>

        <Link
          className="button"
          to="/rabbit-vaccinations"
        >
          ← {t("back")}
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1>👁 {t("view")} {t("rabbitVaccinations")}</h1>
          <p>
            {record.name || "-"}{" "}
            {record.tag ? `(${record.tag})` : ""}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <Link
            className="button"
            to={`/rabbit-vaccinations/${record.id}/edit`}
          >
            ✏️ {t("edit")}
          </Link>

          <Link
            className="button"
            to="/rabbit-vaccinations"
          >
            ← {t("back")}
          </Link>
        </div>
      </div>

      <div className="card">
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "18px",
          }}
        >
          <div>
            <strong>{t("date")}</strong>
            <div>{formatDate(record.vaccination_date)}</div>
          </div>

          <div>
            <strong>{t("tag")}</strong>
            <div>{record.tag || record.tag_number || "-"}</div>
          </div>

          <div>
            <strong>{t("name")}</strong>
            <div>{record.name || "-"}</div>
          </div>

          <div>
            <strong>{t("breed")}</strong>
            <div>{record.breed || "-"}</div>
          </div>

          <div>
            <strong>{t("vaccine")}</strong>
            <div>{record.vaccine_name || "-"}</div>
          </div>

          <div>
            <strong>{t("dosage")}</strong>
            <div>{record.dosage || "-"}</div>
          </div>

          <div>
            <strong>{t("nextDueDate")}</strong>
            <div>{formatDate(record.next_due_date)}</div>
          </div>

          <div>
            <strong>{t("administeredBy")}</strong>
            <div>{record.administered_by || "-"}</div>
          </div>
        </div>

        <div style={{ marginTop: "22px" }}>
          <strong>{t("notes")}</strong>

          <div
            style={{
              marginTop: "8px",
              padding: "12px",
              background: "#f5f5f5",
              borderRadius: "6px",
              whiteSpace: "pre-wrap",
              minHeight: "50px",
            }}
          >
            {record.notes || "-"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RabbitVaccinationProfile;
