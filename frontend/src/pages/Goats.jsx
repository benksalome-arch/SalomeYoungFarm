import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import GoatTable from "../components/GoatTable";
import SearchBar from "../components/SearchBar";
import API_URL from "../api";
import { useLanguage } from "../context/LanguageContext";

function Goats() {
  const { t } = useLanguage();
  const [goats, setGoats] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadGoats() {
      try {
        const response = await fetch(`${API_URL}/api/goats`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load goats.");
        }

        setGoats(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Goats fetch error:", error);
        setGoats([]);
      }
    }

    loadGoats();
  }, []);

  const filteredGoats = goats.filter((goat) =>
    `${goat.tag || goat.tag_number || ""} ${goat.name || ""} ${
      goat.breed || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "25px",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "42px",
            lineHeight: 1.2,
          }}
        >
          🐐 Goat Management
        </h1>

        <Link
          to="/goats/add"
          className="button"
          style={{
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          + {t("addGoat")}
        </Link>
      </div>

      {/* =========================
          SEARCH
      ========================= */}

      <div
        style={{
          width: "100%",
          marginBottom: "25px",
          boxSizing: "border-box",
        }}
      >
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* =========================
          DESKTOP TABLE
      ========================= */}

      <div
        className="goats-desktop-table"
        style={{
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        <GoatTable goats={filteredGoats} />
      </div>

      {/* =========================
          MOBILE GOAT CARDS
      ========================= */}

      <div className="goats-mobile-cards">
        {filteredGoats.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "35px 20px",
            }}
          >
            <div style={{ fontSize: "42px", marginBottom: "10px" }}>
              🐐
            </div>

            <h3 style={{ margin: 0 }}>
              {t("noGoatsFound")}
            </h3>

            <p
              style={{
                margin: "8px 0 0",
                color: "#777",
              }}
            >
              {t("tryAnotherSearch")}
            </p>
          </div>
        ) : (
          filteredGoats.map((goat) => {
            const tag = goat.tag || goat.tag_number || "-";
            const name = goat.name || "-";
            const breed = goat.breed || "-";
            const sex = goat.sex || "-";
            const birthDate =
              goat.birth_date ||
              goat.date_of_birth ||
              "-";
            const weight =
              goat.weight !== null &&
              goat.weight !== undefined &&
              goat.weight !== ""
                ? goat.weight
                : "-";
            const status = goat.status || "Healthy";

            return (
              <div
                key={goat.id}
                className="card"
                style={{
                  padding: "20px",
                  marginBottom: "16px",
                  boxSizing: "border-box",
                  borderLeft: "6px solid #2e7d32",
                }}
              >
                {/* Goat heading */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "42px",
                        lineHeight: 1,
                      }}
                    >
                      🐐
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "22px",
                          color: "#222",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {name}
                      </h2>

                      <div
                        style={{
                          marginTop: "4px",
                          color: "#777",
                          fontSize: "14px",
                        }}
                      >
                        {t("tag")}: <strong>{tag}</strong>
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      background: "#4caf50",
                      color: "white",
                      borderRadius: "20px",
                      padding: "7px 12px",
                      fontSize: "13px",
                      font{t("weight")}: "600",
                      flexShrink: 0,
                      maxWidth: "110px",
                      textAlign: "center",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {status}
                  </span>
                </div>

                {/* Goat information */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, minmax(0, 1fr))",
                    gap: "12px",
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      background: "#f6f8f6",
                      padding: "12px",
                      borderRadius: "10px",
                    }}
                  >
                    <small style={{ color: "#777" }}>
                      {t("breed")}
                    </small>

                    <div
                      style={{
                        font{t("weight")}: "600",
                        marginTop: "3px",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {breed}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f6f8f6",
                      padding: "12px",
                      borderRadius: "10px",
                    }}
                  >
                    <small style={{ color: "#777" }}>
                      {t("sex")}
                    </small>

                    <div
                      style={{
                        font{t("weight")}: "600",
                        marginTop: "3px",
                      }}
                    >
                      {sex}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f6f8f6",
                      padding: "12px",
                      borderRadius: "10px",
                    }}
                  >
                    <small style={{ color: "#777" }}>
                      {t("birthDate")}
                    </small>

                    <div
                      style={{
                        font{t("weight")}: "600",
                        marginTop: "3px",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {birthDate}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f6f8f6",
                      padding: "12px",
                      borderRadius: "10px",
                    }}
                  >
                    <small style={{ color: "#777" }}>
                      {t("weight")}
                    </small>

                    <div
                      style={{
                        font{t("weight")}: "600",
                        marginTop: "3px",
                      }}
                    >
                      {weight === "-" ? "-" : `${weight} kg`}
                    </div>
                  </div>
                </div>

                {/* Actions */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(3, minmax(0, 1fr))",
                    gap: "8px",
                  }}
                >
                  <Link
                    to={`/goats/${goat.id}`}
                    className="button"
                    style={{
                      textAlign: "center",
                      textDecoration: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    👁 {t("view")}
                  </Link>

                  <Link
                    to={`/goats/edit/${goat.id}`}
                    className="button"
                    style={{
                      textAlign: "center",
                      textDecoration: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    ✏️ {t("edit")}
                  </Link>

                  <button
                    type="button"
                    className="button"
                    style={{
                      background: "#d32f2f",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={async () => {
                      const confirmed = window.confirm(
                        `Delete goat ${name} (${tag})?`
                      );

                      if (!confirmed) return;

                      try {
                        const response = await fetch(
                          `${API_URL}/api/goats/${goat.id}`,
                          {
                            method: "DELETE",
                          }
                        );

                        if (!response.ok) {
                          const data = await response.json().catch(() => ({}));

                          throw new Error(
                            data.message ||
                              "Failed to delete goat."
                          );
                        }

                        setGoats((current) =>
                          current.filter(
                            (item) => item.id !== goat.id
                          )
                        );
                      } catch (error) {
                        console.error(
                          "Delete goat error:",
                          error
                        );

                        alert(
                          error.message ||
                            "Could not delete goat."
                        );
                      }
                    }}
                  >
                    🗑 {t("delete")}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* =========================
          MOBILE CSS
      ========================= */}

      <style>
        {`
          .goats-mobile-cards {
            display: none;
          }

          @media (max-width: 700px) {
            .goats-desktop-table {
              display: none !important;
            }

            .goats-mobile-cards {
              display: block;
              width: 100%;
              min-width: 0;
            }
          }

          @media (max-width: 500px) {
            .goats-mobile-cards .card {
              padding: 16px !important;
            }

            .goats-mobile-cards h2 {
              font-size: 20px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Goats;
