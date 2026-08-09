function FormSection({ title, children }) {
  return (
    <div
      className="card"
      style={{
        marginBottom: "25px",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
        }}
      >
        {title}
      </h2>

      {children}
    </div>
  );
}

export default FormSection;