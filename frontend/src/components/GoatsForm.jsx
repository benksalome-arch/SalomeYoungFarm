import { useLanguage } from "../context/LanguageContext";
function GoatForm() {
  const { t } = useLanguage();
  return (
    <div>
      <h2>{t("addGoat")}</h2>

      <p>
        {t("earTag")}
        <br />
        <input type="text" placeholder={t("exampleGoatTag")} />
      </p>

      <p>
        {t("name")}
        <br />
        <input type="text" placeholder={t("exampleGoatName")} />
      </p>

      <button>{t("saveGoat")}</button>
    </div>
  );
}

export default GoatForm;