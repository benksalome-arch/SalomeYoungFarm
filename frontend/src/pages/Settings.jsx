import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import API_URL from "../api";

function Settings() {
  const { t, language, setLanguage } = useLanguage();
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

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

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

  function handlePasswordChange(e) {
    const { name, value } = e.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordMessage("");
    setPasswordError("");
  }

  function saveProfile(e) {
    e.preventDefault();

    alert(t("profileSettingsSaved"));
  }

  function saveFarm(e) {
    e.preventDefault();

    alert(t("farmInformationSaved"));
  }

  async function changePassword(e) {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(
          data.message ||
            "Password change failed. Please try again."
        );
        return;
      }

      setPasswordMessage(
        "Password changed successfully."
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Change password error:", error);

      setPasswordError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setChangingPassword(false);
    }
  }

  function dataManagement() {
    alert(t("dataManagementPending"));
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
          width: "100%",
          maxWidth: "850px",
          marginBottom: "25px",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            margin: "0 0 8px 0",
            fontSize: "32px",
            lineHeight: "1.2",
            fontWeight: "700",
          }}
        >
          ⚙️ {t("settings")}
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        >
          {t("settingsDescription")}
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
        <h2>👤 {t("profile")}</h2>

        <p>
          {t("profileDescription")}
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
                📷 {t("changePhoto")}
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
                {t("fullName")}
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder={t("enterYourName")}
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
                {t("emailUsername")}
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                placeholder={t("enterYourEmail")}
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
              💾 {t("saveProfile")}
            </button>
          </div>
        </form>
      </div>

      {/* CHANGE PASSWORD */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "850px",
          boxSizing: "border-box",
          marginBottom: "20px",
        }}
      >
        <h2>🔐 {t("changePassword")}</h2>

        <p>
          {t("changePasswordDescription")}
        </p>

        <form
          onSubmit={changePassword}
          style={{
            marginTop: "20px",
            maxWidth: "600px",
          }}
        >
          <label
            htmlFor="currentPassword"
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
            }}
          >
            {t("currentPassword")}
          </label>

          <input
            id="currentPassword"
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            autoComplete="current-password"
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "18px",
            }}
          />

          <label
            htmlFor="newPassword"
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
            }}
          >
            {t("newPassword")}
          </label>

          <input
            id="newPassword"
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            autoComplete="new-password"
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "18px",
            }}
          />

          <label
            htmlFor="confirmPassword"
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
            }}
          >
            {t("confirmNewPassword")}
          </label>

          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            autoComplete="new-password"
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "20px",
            }}
          />

          {passwordError && (
            <div
              style={{
                marginBottom: "15px",
                padding: "12px",
                borderRadius: "6px",
                background: "#ffebee",
                color: "#c62828",
              }}
            >
              {passwordError}
            </div>
          )}

          {passwordMessage && (
            <div
              style={{
                marginBottom: "15px",
                padding: "12px",
                borderRadius: "6px",
                background: "#e8f5e9",
                color: "#2e7d32",
              }}
            >
              {passwordMessage}
            </div>
          )}

          <button
            className="button"
            type="submit"
            disabled={changingPassword}
          >
            {changingPassword
              ? t("changingPassword")
              : <>🔐 {t("changePassword")}</>}
          </button>
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
        <h2>🏡 {t("farmInformation")}</h2>

        <p>
          {t("farmInformationDescription")}
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
            {t("farmName")}
          </label>

          <input
            id="farmName"
            type="text"
            name="farmName"
            value={farm.farmName}
            onChange={handleFarmChange}
            placeholder={t("enterFarmName")}
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
            {t("location")}
          </label>

          <input
            id="location"
            type="text"
            name="location"
            value={farm.location}
            onChange={handleFarmChange}
            placeholder={t("enterFarmLocation")}
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
            {t("contactPhone")}
          </label>

          <input
            id="phone"
            type="tel"
            name="phone"
            value={farm.phone}
            onChange={handleFarmChange}
            placeholder={t("enterContactPhone")}
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
            💾 {t("saveFarmInformation")}
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
        <h2>⚙️ {t("preferences")}</h2>

        <p>
          {t("preferencesDescription")}
        </p>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <strong>{t("displayPreferences")}</strong>

          <p
            style={{
              marginBottom: "15px",
              color: "#666",
            }}
          >
            {t("displayPreferencesDescription")}
          </p>

          <label
            htmlFor="language"
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
            }}
          >
            🌐 {t("language")}
          </label>

          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "350px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "white",
            }}
          >
            <option value="en">🇬🇧 English</option>
            <option value="sw">🇰🇪 Kiswahili</option>
            <option value="nl">🇳🇱 Nederlands</option>
          </select>
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
        <h2>🗄️ {t("dataManagement")}</h2>

        <p>
          {t("dataManagementDescription")}
        </p>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#fff5f5",
            borderRadius: "8px",
          }}
        >
          <strong>⚠️ {t("testData")}</strong>

          <p
            style={{
              margin: "8px 0 15px",
            }}
          >
            {t("testDataDescription")}
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
            🗑️ {t("dataManagement")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
