function StatCard({
  icon,
  title,
  value,
  color = "#2e7d32",
}) {
  return (
    <div
      className="card"
      style={{
        minWidth: 0,
        borderLeft: `6px solid ${color}`,
        textAlign: "center",
        padding: "20px 15px",
        boxSizing: "border-box",
      }}
    >
      {/* Icon */}
      <div
        style={{
          fontSize: "32px",
          lineHeight: "1",
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        style={{
          margin: "0 0 8px 0",
          color: "#555",
          fontSize: "18px",
          lineHeight: "1.2",
        }}
      >
        {title}
      </h3>

      {/* Value */}
      <div
        style={{
          fontSize: "28px",
          fontWeight: "700",
          lineHeight: "1.2",
          color: "#222",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={String(value)}
      >
        {value}
      </div>
    </div>
  );
}

export default StatCard;