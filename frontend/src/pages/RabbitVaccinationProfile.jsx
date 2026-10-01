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
        <p
          style={{
            textAlign: "center",
            padding: "30px",
          }}
        >
          {t("loadingVaccinationRecords")}
        </p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="card">
        <h2>💉 {t("rabbitVaccinations")}</h2>

        <p>Vaccination record not found.</p>

        <Link
          className="button"
          to="/rabbit-vaccinations"
        >
          ← {t("back")}
        </Link>
      </div>
    );
  }

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#666",
    marginBottom: "6px",
  };

  const valueStyle = {
    fontSize: "15px",
    color: "#222",
    minHeight: "20px",
    overflowWrap: "break-word",
  };

  const fieldStyle = {
    padding: "12px 14px",
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: "8px",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}

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
          <h1
            style={{
              margin: "0 0 6px 0",
              fontSize: "26px",
            }}
          >
            👁 {t("view")} {t("rabbitVaccinations")}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#666",
            }}
          >
            {record.name || "-"}
            {record.tag
              ? ` (${record.tag})`
              : record.tag_number
                ? ` (${record.tag_number})`
                : ""}
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
            style={{
              background: "#2e7d32",
              color: "#fff",
              textDecoration: "none",
            }}
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

      {/* Details */}

      <div
        className="card"
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "22px",
        }}
      >
        <h2
          style={{
            margin: "0 0 18px 0",
            fontSize: "19px",
          }}
        >
          💉 {t("rabbitVaccinations")}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
            gap: "14px",
            width: "100%",
          }}
        >
          <div style={fieldStyle}>
            <span style={labelStyle}>
              {t("date")}
            </span>
            <div style={valueStyle}>
              {formatDate(record.vaccination_date)}
            </div>
          </div>

          <div style={fieldStyle}>
            <span style={labelStyle}>
              {t("tag")}
            </span>
            <div style={valueStyle}>
              {record.tag ||
                record.tag_number ||
                "-"}
            </div>
          </div>

          <div style={fieldStyle}>
            <span style={labelStyle}>
              {t("name")}
            </span>
            <div style={valueStyle}>
              {record.name || "-"}
            </div>
          </div>

          <div style={fieldStyle}>
            <span style={labelStyle}>
              {t("breed")}
            </span>
            <div style={valueStyle}>
              {record.breed || "-"}
            </div>
          </div>

          <div style={fieldStyle}>
            <span style={labelStyle}>
              {t("vaccine")}
            </span>
            <div style={valueStyle}>
              {record.vaccine_name || "-"}
            </div>
          </div>

          <div style={fieldStyle}>
            <span style={labelStyle}>
              {t("dosage")}
            </span>
            <div style={valueStyle}>
              {record.dosage || "-"}
            </div>
          </div>

          <div style={fieldStyle}>
            <span style={labelStyle}>
              {t("nextDueDate")}
            </span>
            <div style={valueStyle}>
              {formatDate(record.next_due_date)}
            </div>
          </div>

          <div style={fieldStyle}>
            <span style={labelStyle}>
              {t("administeredBy")}
            </span>
            <div style={valueStyle}>
              {record.administered_by || "-"}
            </div>
          </div>
        </div>

        {/* Notes */}

        <div
          style={{
            marginTop: "18px",
            padding: "16px",
            background: "#fafafa",
            border: "1px solid #e5e5e5",
            borderRadius: "8px",
            boxSizing: "border-box",
          }}
        >
          <span style={labelStyle}>
            {t("notes")}
          </span>

          <div
            style={{
              fontSize: "15px",
              lineHeight: "1.6",
              color: "#333",
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
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
