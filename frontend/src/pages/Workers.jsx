import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Workers() {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    loadWorkers();
  }, []);

  async function loadWorkers() {
    try {
      const response = await fetch(`${API_URL}/api/workers`);
      const data = await response.json();
      setWorkers(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load workers.");
    }
  }

  async function deleteWorker(id) {
    if (!window.confirm("Delete this worker?")) return;

    try {
      const response = await fetch(
        `${API_URL}/api/workers/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      alert(data.message);

      loadWorkers();

    } catch (error) {
      console.error(error);
      alert("Failed to delete worker.");
    }
  }

  return (
    <div className="page">

      <div className="page-header">
        <h1>👥 Worker Management</h1>
        <p>Manage users who can access Salome Young Farm.</p>
      </div>

      <div className="card">

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2>Workers</h2>

          <Link className="button" to="/workers/add">
            ➕ Add Worker
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
                  No workers found.
                </td>
              </tr>

            ) : (

              workers.map((worker) => (

                <tr key={worker.id}>

                  <td>{worker.full_name}</td>

                  <td>{worker.email}</td>

                  <td>{worker.role}</td>

                  <td>
                    {worker.active ? "🟢 Active" : "🔴 Disabled"}
                  </td>

                  <td>
                    {new Date(worker.created_at).toLocaleDateString()}
                  </td>

                  <td>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >

                      <Link
                        className="button"
                        to={`/workers/edit/${worker.id}`}
                      >
                        ✏ Edit
                      </Link>

                      <button
                        className="button"
                        onClick={() => deleteWorker(worker.id)}
                      >
                        🗑 Delete
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
