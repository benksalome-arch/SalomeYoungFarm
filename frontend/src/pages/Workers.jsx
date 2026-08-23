import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Workers() {
  const { t } = useLanguage();
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    loadWorkers();
  }, []);

  async function loadWorkers() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Your session has expired. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/workers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load workers.");
        return;
      }

      setWorkers(data);
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the server.");
    }
  }

  async function deleteWorker(id) {
    if (!window.confirm("Delete this worker?")) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Your session has expired. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/workers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete worker.");
        return;
      }

      alert(data.message || "Worker deleted successfully!");

      loadWorkers();
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the server.");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>👥 {t("workerManagement")}</h1>
        <p>Manage users who can access Salome Young Farm.</p>
      </div>

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>{t("workers")}</h2>

          <Link className="button" to="/workers/add">
            ➕ {t("addWorker")}
          </Link>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {workers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  {t("noWorkersFound")}
                </td>
              </tr>
            ) : (
              workers.map((worker) => (
                <tr key={worker.id}>
                  <td>{worker.full_name}</td>

                  <td>{worker.email}</td>

                  <td>{worker.role}</td>

                  <td>
                    {worker.active ? (
                      <span
                        style={{
                          color: "#15803d",
                          fontWeight: "600",
                        }}
                      >
                        🟢 Active
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#dc2626",
                          fontWeight: "600",
                        }}
                      >
                        🔴 Disabled
                      </span>
                    )}
                  </td>

                  <td>
                    {new Date(worker.created_at).toLocaleDateString()}
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {/* EDIT */}
                      <Link
                        to={`/workers/edit/${worker.id}`}
                        title="Edit worker"
                        aria-label={`Edit ${worker.full_name}`}
                        style={{
                          width: "38px",
                          height: "38px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #15803d",
                          borderRadius: "8px",
                          background: "#ffffff",
                          color: "#15803d",
                          textDecoration: "none",
                          fontSize: "18px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#15803d";
                          e.currentTarget.style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#ffffff";
                          e.currentTarget.style.color = "#15803d";
                        }}
                      >
                        ✏️
                      </Link>

                      {/* DELETE */}
                      <button
                        type="button"
                        title="Delete worker"
                        aria-label={`Delete ${worker.full_name}`}
                        onClick={() => deleteWorker(worker.id)}
                        style={{
                          width: "38px",
                          height: "38px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #dc2626",
                          borderRadius: "8px",
                          background: "#ffffff",
                          color: "#dc2626",
                          fontSize: "18px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#dc2626";
                          e.currentTarget.style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#ffffff";
                          e.currentTarget.style.color = "#dc2626";
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Workers;
