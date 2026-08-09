function LoadingSpinner() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "50px",
        fontSize: "18px",
        color: "#666",
      }}
    >
      ⏳ Loading...
    </div>
  );
}

export default LoadingSpinner;