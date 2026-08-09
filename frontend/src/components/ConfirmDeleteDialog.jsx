function ConfirmDeleteDialog({
  isOpen,
  title = "Delete Record",
  message = "Are you sure you want to delete this record?",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        className="card"
        style={{
          width: "400px",
          maxWidth: "95%",
        }}
      >
        <h2>{title}</h2>

        <p>{message}</p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            className="button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="button"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmDeleteDialog;