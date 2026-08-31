import { useLanguage } from "../context/LanguageContext";

function SearchBar({ value, onChange }) {
  const { t } = useLanguage();

  return (
    <input
      type="text"
      placeholder={`🔍 ${t("searchByTagNameBreed")}`}
      value={value}
      onChange={onChange}
      style={{
        width: "350px",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "16px",
        marginBottom: "20px",
      }}
    />
  );
}

export default SearchBar;
