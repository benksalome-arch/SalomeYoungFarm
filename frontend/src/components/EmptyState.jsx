function EmptyState({
  icon = "📄",
  title = "No Records",
  message = "Nothing has been added yet.",
}) {
  return (
    <div
      className="card"
      style={{
        textAlign: "center",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          fontSize: "60px",
          marginBottom: "15px",
        }}
      >
        {icon}
      </div>

      <h2>{title}</h2>

      <p
        style={{
          color: "#777",
        }}
      >
        {message}
      </p>
    </div>
  );
}

export default EmptyState;