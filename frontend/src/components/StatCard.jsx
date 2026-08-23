import { useNavigate } from "react-router-dom";

function StatCard({
  icon,
  title,
  value,
  color = "#2e7d32",
  to,
}) {
  const navigate = useNavigate();

  function handleClick() {
    if (to) {
      navigate(to);
    }
  }

  return (
    <div
      className="card"
      onClick={handleClick}
      role={to ? "button" : undefined}
      tabIndex={to ? 0 : undefined}
      onKeyDown={(e) => {
        if (to && (e.key === "Enter" || e.key === " ")) {
          navigate(to);
        }
      }}
      style={{
        minWidth: 0,
        borderLeft: `6px solid ${color}`,
        textAlign: "center",
        padding: "20px 15px",
        boxSizing: "border-box",
        cursor: to ? "pointer" : "default",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      <div
        style={{
          fontSize: "32px",
          lineHeight: "1",
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

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
