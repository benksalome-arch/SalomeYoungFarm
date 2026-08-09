import { useState } from "react";

function Settings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [farm, setFarm] = useState({
    farmName: "",
    location: "",
    phone: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  function handleProfileChange(e) {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleFarmChange(e) {
    const { name, value } = e.target;

    setFarm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPhotoPreview(imageUrl);
  }

  function saveProfile(e) {
    e.preventDefault();

    alert("Profile settings saved.");
  }

  function saveFarm(e) {
    e.preventDefault();

    alert("Farm information saved.");
  }

  function changePassword() {
    alert("Password change will be connected to the user account system.");
  }

  function dataManagement() {
    alert(
      "Data management will be connected after the system's final data structure is complete."
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        paddingBottom: "30px",
      }}
    >
      {/* PAGE HEADER */}

      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            margin: 0,
          }}
        >
          ⚙️ Settings
        </h1>

        <p>
          Configure Livestock Pro and user preferences.
        </p>
      </div>

      {/* PROFILE */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "850px",
          boxSizing: "border-box",
          marginBottom: "20px",
        }}
      >
        <h2>👤 Profile</h2>

        <p>
          Manage your personal account information.
        </p>

        <form onSubmit={saveProfile}>
          <div
            style={{
              display: "flex",
              gap: "30px",
              alignItems: "flex-start",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            {/* PROFILE PHOTO */}

            <div
              style={{
                width: "150px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  margin: "0 auto 12px",
                  background: "#eeeeee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  fontSize: "42px",
                }}
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "👤"
                )}
              </div>

              <label
                htmlFor="profile-photo"
                className="button"
                style={{
                  display: "inline-block",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                📷 Change Photo
              </label>

              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{
                  display: "none",
                }}
              />
            </div>

            {/* PROFILE DETAILS */}

            <div
              style={{
                flex: 1,
                minWidth: "250px",
              }}
            >
              <label
                htmlFor="name"
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                }}
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Enter your name"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  marginBottom: "18px",
                }}
              />

              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                }}
              >
                Email / Username
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                placeholder="Enter your email"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "25px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="button"
              type="submit"
            >
              💾 Save Profile
            </button>

            <button
              className="button"
              type="button"
              onClick={changePassword}
            >
              🔐 Change Password
            </button>
          </div>
        </form>
      </div>

      {/* FARM INFORMATION */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "850px",
          boxSizing: "border-box",
          marginBottom: "20px",
        }}
      >
        <h2>🏡 Farm Information</h2>

        <p>
          Manage the basic information for your farm.
        </p>

        <form onSubmit={saveFarm}>
          <label
            htmlFor="farmName"
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
            }}
          >
            Farm Name
          </label>

          <input
            id="farmName"
            type="text"
            name="farmName"
            value={farm.farmName}
            onChange={handleFarmChange}
            placeholder="Enter farm name"
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "18px",
            }}
          />

          <label
            htmlFor="location"
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
            }}
          >
            Location
          </label>

          <input
            id="location"
            type="text"
            name="location"
            value={farm.location}
            onChange={handleFarmChange}
            placeholder="Enter farm location"
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "18px",
            }}
          />

          <label
            htmlFor="phone"
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
            }}
          >
            Contact Phone
          </label>

          <input
            id="phone"
            type="tel"
            name="phone"
            value={farm.phone}
            onChange={handleFarmChange}
            placeholder="Enter contact phone"
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "20px",
            }}
          />

          <button
            className="button"
            type="submit"
          >
            💾 Save Farm Information
          </button>
        </form>
      </div>

      {/* PREFERENCES */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "850px",
          boxSizing: "border-box",
          marginBottom: "20px",
        }}
      >
        <h2>⚙️ Preferences</h2>

        <p>
          Manage your Livestock Pro preferences.
        </p>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <strong>Display Preferences</strong>

          <p
            style={{
              marginBottom: 0,
              color: "#666",
            }}
          >
            Additional display preferences can be added here
            as the application develops.
          </p>
        </div>
      </div>

      {/* DATA MANAGEMENT */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "850px",
          boxSizing: "border-box",
          border: "1px solid #e0b4b4",
        }}
      >
        <h2>🗄️ Data Management</h2>

        <p>
          Manage test and application data.
        </p>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#fff5f5",
            borderRadius: "8px",
          }}
        >
          <strong>⚠️ Test Data</strong>

          <p
            style={{
              margin: "8px 0 15px",
            }}
          >
            Data cleanup and reset tools will be available
            here. These options should only be used when you
            intentionally want to remove test data.
          </p>

          <button
            type="button"
            className="button"
            onClick={dataManagement}
            style={{
              background: "#d32f2f",
              color: "white",
            }}
          >
            🗑️ Data Management
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;