function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="🔍 Search by tag, name or breed..."
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