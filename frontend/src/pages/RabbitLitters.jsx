import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RabbitLitters() {
  const [litters, setLitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadLitters();
  }, []);

  async function loadLitters() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/rabbit-litters`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        setLitters([]);
        return;
      }

      setLitters(data);
    } catch (err) {
      console.error(err);
      setLitters([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteLitter(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this litter record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(id);

      const response = await fetch(
        `${API_URL}/api/rabbit-litters/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete litter record."
        );
        return;
      }

      alert(
        data.message ||
          "Rabbit litter record deleted successfully!"
      );

      await loadLitters();
    } catch (err) {
      console.error(err);

      alert(
        "Failed to delete litter record."
      );
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "20px",
        }}
      >
        <div>
          <h1>🐇 Rabbit Litters</h1>

          <p>
            Record and track rabbit births and kits.
          </p>
        </div>

        <Link
          className="button"
          to="/rabbit-litters/add"
        >
          ➕ Record Litter
        </Link>
      </div>

      {/* Litter Table */}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Birth Date</th>
              <th>Female</th>
              <th>Male</th>
              <th>Total Kits</th>
              <th>Live Kits</th>
              <th>Dead Kits</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                  }}
                >
                  Loading litter records...
                </td>
              </tr>
            ) : litters.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                  }}
                >
                  No rabbit litter records found.
                </td>
              </tr>
            ) : (
              litters.map((litter) => (
                <tr key={litter.id}>
                  <td>
                    {litter.birth_date
                      ? litter.birth_date.split("T")[0]
                      : ""}
                  </td>

                  <td>
                    {litter.female_tag_number}
                    {" - "}
                    {litter.female_name || "Rabbit"}
                  </td>

                  <td>
                    {litter.male_tag_number
                      ? `${litter.male_tag_number} - ${
                          litter.male_name || "Rabbit"
                        }`
                      : "-"}
                  </td>

                  <td>
                    {litter.total_kits}
                  </td>

                  <td>
                    {litter.live_kits}
                  </td>

                  <td>
                    {litter.dead_kits}
                  </td>

                  <td>
                    {litter.notes || "-"}
                  </td>

                  <td>
                    <button
                      className="button"
                      onClick={() =>
                        deleteLitter(litter.id)
                      }
                      disabled={
                        deleting === litter.id
                      }
                      style={{
                        background: "#C62828",
                      }}
                    >
                      {deleting === litter.id
                        ? "Deleting..."
                        : "🗑 Delete"}
                    </button>
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

export default RabbitLitters;
