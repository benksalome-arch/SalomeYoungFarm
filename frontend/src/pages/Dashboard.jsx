import { useLanguage } from "../context/LanguageContext";

function Dashboard() {
  const { t } = useLanguage();

  return (
    <div
      style={{
        width: "100%",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          textAlign: "center",
        }}
      >
        <img
          src="/salome_young_farm_logo.png"
          alt="Salome Young Farm"
          style={{
            width: "260px",
            maxWidth: "80%",
            height: "auto",
            display: "block",
            margin: "0 auto 28px",
          }}
        />

        <h1
          style={{
            margin: 0,
            fontSize: "30px",
            lineHeight: 1.2,
            fontWeight: "700",
            color: "#17221a",
          }}
        >
          {t("welcome")}
        </h1>

        <p
          style={{
            margin: "12px auto 0",
            maxWidth: "500px",
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#707770",
          }}
        >
          {t("dashboard")}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
