function GoatForm() {
  return (
    <div>
      <h2>Add New Goat</h2>

      <p>
        Ear Tag
        <br />
        <input type="text" placeholder="e.g. G001" />
      </p>

      <p>
        Name
        <br />
        <input type="text" placeholder="e.g. Bella" />
      </p>

      <button>{t("saveGoat")}</button>
    </div>
  );
}

export default GoatForm;