import { useLanguage } from "../context/LanguageContext";
function GoatInfoCard({ goat }) {
  const { t } = useLanguage();
  return (
    <div className="card">

      <h2>🐐 {t("goatInformation")}</h2>

      <table className="table">

        <tbody>

          <tr>
            <td><strong>{t("tag")}</strong></td>
            <td>{goat.tag}</td>
          </tr>

          <tr>
            <td><strong>{t("name")}</strong></td>
            <td>{goat.name}</td>
          </tr>

          <tr>
            <td><strong>{t("breed")}</strong></td>
            <td>{goat.breed}</td>
          </tr>

          <tr>
            <td><strong>{t("sex")}</strong></td>
            <td>{goat.sex}</td>
          </tr>

          <tr>
            <td><strong>{t("dateOfBirth")}</strong></td>
            <td>{goat.date_of_birth || "-"}</td>
          </tr>

          <tr>
            <td><strong>{t("colour")}</strong></td>
            <td>{goat.color || "-"}</td>
          </tr>

          <tr>
            <td><strong>{t("currentWeight")}</strong></td>
            <td>{goat.weight} kg</td>
          </tr>

          <tr>
            <td><strong>{t("status")}</strong></td>
            <td>{goat.status}</td>
          </tr>

          <tr>
            <td><strong>{t("fatherTag")}</strong></td>
            <td>{goat.father_tag || "-"}</td>
          </tr>

          <tr>
            <td><strong>{t("motherTag")}</strong></td>
            <td>{goat.mother_tag || "-"}</td>
          </tr>

          <tr>
            <td><strong>{t("purchasePrice")}</strong></td>
            <td>
              {goat.purchase_price
                ? `KES ${Number(goat.purchase_price).toLocaleString()}`
                : "-"}
            </td>
          </tr>

          <tr>
            <td><strong>{t("notes")}</strong></td>
            <td>{goat.notes || "-"}</td>
          </tr>

        </tbody>

      </table>

    </div>
  );
}

export default GoatInfoCard;