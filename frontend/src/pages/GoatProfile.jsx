import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API = "http://localhost:5000";

function GoatProfile() {
  const { id } = useParams();

  const [goat, setGoat] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadGoat();
  }, [id]);

  const loadGoat = () => {
    fetch(`${API}/api/goats/${id}`)
      .then((res) => res.json())
      .then((data) => setGoat(data))
      .catch(console.error);
  };

  const uploadPhoto = async () => {
    if (!selectedFile) {
      alert("Please choose a photo.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);

    const response = await fetch(
      `${API}/api/photos/${id}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    alert(data.message);

    setSelectedFile(null);

    loadGoat();
  };

  const deletePhoto = async () => {
    if (!window.confirm("Delete goat photo?")) return;

    const response = await fetch(
      `${API}/api/photos/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    alert(data.message);

    loadGoat();
  };

  if (!goat) {
    return (
      <div className="page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 30,
        maxWidth: 1300,
        margin: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        <div>
          <h1>🐐 {goat.name}</h1>
          <p style={{ color: "#666" }}>
            Goat Profile
          </p>
        </div>

        <Link
          to="/goats"
          className="button"
        >
          ← Back
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "330px 1fr",
          gap: 30,
        }}
      >
        {/* LEFT */}

        <div
          className="card"
          style={{
            textAlign: "center",
          }}
        >
          {goat.photo ? (
            <img
              src={`${API}/uploads/goats/${goat.photo}`}
              alt=""
              style={{
                width: "100%",
                height: 320,
                objectFit: "cover",
                borderRadius: 12,
              }}
            />
          ) : (
            <div
              style={{
                height: 320,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 120,
                background: "#efefef",
                borderRadius: 12,
              }}
            >
              🐐
            </div>
          )}

          <input
            type="file"
            onChange={(e) =>
              setSelectedFile(e.target.files[0])
            }
            style={{
              marginTop: 20,
            }}
          />

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 20,
            }}
          >
            <button
              className="button"
              onClick={uploadPhoto}
            >
              Upload
            </button>

            <button
              className="button"
              style={{
                background: "#d32f2f",
              }}
              onClick={deletePhoto}
            >
              Delete
            </button>
          </div>

          <hr
            style={{
              margin: "25px 0",
            }}
          />

          <h3>Quick Statistics</h3>

          <table
            className="table"
            style={{
              marginTop: 15,
            }}
          >
            <tbody>
              <tr>
                <td>Weight</td>
                <td>{goat.weight} kg</td>
              </tr>

              <tr>
                <td>Status</td>
                <td>{goat.status}</td>
              </tr>

              <tr>
                <td>Breed</td>
                <td>{goat.breed}</td>
              </tr>

              <tr>
                <td>Sex</td>
                <td>{goat.sex}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RIGHT */}

        <div
          className="card"
        >
          <h2>General Information</h2>

          <table className="table">
            <tbody>

              <tr>
                <td><strong>Tag</strong></td>
                <td>{goat.tag}</td>
              </tr>

              <tr>
                <td><strong>Name</strong></td>
                <td>{goat.name}</td>
              </tr>

              <tr>
                <td><strong>Breed</strong></td>
                <td>{goat.breed}</td>
              </tr>

              <tr>
                <td><strong>Sex</strong></td>
                <td>{goat.sex}</td>
              </tr>

              <tr>
                <td><strong>Date of Birth</strong></td>
                <td>{goat.date_of_birth || "-"}</td>
              </tr>

              <tr>
                <td><strong>Colour</strong></td>
                <td>{goat.colour || "-"}</td>
              </tr>

              <tr>
                <td><strong>Father</strong></td>
                <td>{goat.father_tag || "-"}</td>
              </tr>

              <tr>
                <td><strong>Mother</strong></td>
                <td>{goat.mother_tag || "-"}</td>
              </tr>

              <tr>
                <td><strong>Purchase Price</strong></td>
                <td>{goat.purchase_price || "-"}</td>
              </tr>

              <tr>
                <td><strong>Notes</strong></td>
                <td>{goat.notes || "-"}</td>
              </tr>

            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 30,
            }}
          >
            <Link
              className="button"
              to={`/goats/edit/${goat.id}`}
            >
              ✏ Edit Goat
            </Link>

            <Link
              className="button"
              to={`/goats/${goat.id}/health`}
            >
              💉 Health
            </Link>

            <Link
              className="button"
              to={`/goats/${goat.id}/weight`}
            >
              ⚖ Weight
            </Link>

            <button className="button">
              🧬 Breeding
            </button>

            <button className="button">
              🐐 Kids
            </button>

            <button className="button">
              🖨 Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoatProfile;