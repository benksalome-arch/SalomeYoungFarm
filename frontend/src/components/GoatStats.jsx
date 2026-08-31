import React from "react";
import { useLanguage } from "../context/LanguageContext";

function GoatStats({ goat }) {
  const { t } = useLanguage();

  return (
    <div>
      <h2>📊 {t("goatStatistics")}</h2>

      <div>
        <h3>⚖ {t("currentWeight")}</h3>
        <h1>{goat.weight || 0} kg</h1>
      </div>

      <div>
        <h3>❤️ {t("status")}</h3>
        <h1>{goat.status}</h1>
      </div>

      <div>
        <h3>🧬 {t("breed")}</h3>
        <h2>{goat.breed}</h2>
      </div>

      <div>
        <h3>🚻 {t("sex")}</h3>
        <h2>{goat.sex}</h2>
      </div>
    </div>
  );
}

export default GoatStats;
