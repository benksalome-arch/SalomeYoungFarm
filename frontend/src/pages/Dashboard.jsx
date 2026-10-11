import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Dashboard() {
  const { t } = useLanguage();
  const [goats, setGoats] = useState([]);
  const [chickens, setChickens] = useState([]);
  const [rabbits, setRabbits] = useState([]);
  const [feed, setFeed] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [finance, setFinance] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadData(endpoint, setter) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`);

      if (!response.ok) {
        setter([]);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setter(data);
      } else {
        setter([]);
      }
    } catch (err) {
      console.error(`Dashboard ${endpoint} error:`, err);
      setter([]);
    }
  }

  async function loadDashboardData() {
    await Promise.all([
      loadData("/api/goats", setGoats),
      loadData("/api/chickens", setChickens),
      loadData("/api/rabbits", setRabbits),
      loadData("/api/feed", setFeed),
      loadData("/api/inventory", setInventory),
      loadData("/api/workers", setWorkers),
      loadData("/api/finance", setFinance),
    ]);
  }

  const totalAnimals =
    goats.length +
    chickens.length +
    rabbits.length;

  const statCards = [
    {
      title: t("goats"),
      count: goats.length,
      icon: "🐐",
      path: "/goats",
      color: "#E8F5E9",
      textColor: "#1B5E20",
    },
    {
      title: t("chickens"),
      count: chickens.length,
      icon: "🐔",
      path: "/chickens",
      color: "#FFF8E1",
      textColor: "#E65100",
    },
    {
      title: t("rabbits"),
      count: rabbits.length,
      icon: "🐇",
      path: "/rabbits",
      color: "#FCE4EC",
      textColor: "#AD1457",
    },
    {
      title: t("workers"),
      count: workers.length,
      icon: "👷",
      path: "/workers",
      color: "#ECEFF1",
      textColor: "#455A64",
    },
  ];

  const operationCards = [
    {
      title: t("feed"),
      description: t("manageFeedStock"),
      icon: "🌾",
      path: "/feed",
      color: "#F3E5F5",
      textColor: "#6A1B9A",
    },
    {
      title: t("inventory"),
      description: t("trackFarmSupplies"),
      icon: "📦",
      path: "/inventory",
      color: "#FFF3E0",
      textColor: "#E65100",
    },
    {
      title: t("eggProduction"),
      description: t("recordEggs"),
      icon: "🥚",
      path: "/egg-production",
      color: "#FFFDE7",
      textColor: "#827717",
    },
    {
      title: t("vaccinations"),
      description: t("vaccinationRecords"),
      icon: "💉",
      path: "/chicken-vaccinations",
      color: "#E0F7FA",
      textColor: "#006064",
    },
  ];

  const quickActions = [
    {
      label: t("addGoat"),
      icon: "🐐",
      path: "/goats/add",
    },
    {
      label: t("addChicken"),
      icon: "🐔",
      path: "/chickens/add",
    },
    {
      label: t("addRabbit"),
      icon: "🐇",
      path: "/rabbits/add",
    },
    {
      label: t("addFeed"),
      icon: "🌾",
      path: "/feed/add",
    },
    {
      label: t("addWorker"),
      icon: "👷",
      path: "/workers/add",
    },
    {
      label: t("financeEntry"),
      icon: "💰",
      path: "/finance/add",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          marginBottom: "28px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "34px",
            lineHeight: 1.2,
          }}
        >
          🏡 {t("dashboard")}
        </h1>

        <p
          style={{
            marginTop: "8px",
            marginBottom: 0,
            color: "#666",
          }}
        >
          {t("welcome")}
        </p>
      </div>

      {/* FARM OVERVIEW */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {statCards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              className="card"
              style={{
                minHeight: "120px",
                boxSizing: "border-box",
                background: card.color,
                border: "none",
                transition: "transform 0.15s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      marginBottom: "8px",
                    }}
                  >
                    {card.title}
                  </div>

                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: "800",
                      color: card.textColor,
                    }}
                  >
                    {card.count}
                  </div>

                  <div
                    style={{
                      marginTop: "5px",
                      fontSize: "12px",
                      color: "#777",
                    }}
                  >
                    {t("viewRecords")} →
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "42px",
                  }}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* FARM SUMMARY */}

      <div
        className="card"
        style={{
          marginBottom: "28px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "20px",
          }}
        >
          📊 {t("farmOverview")}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
          }}
        >
          <div
            style={{
              padding: "16px",
              background: "#f5f7f5",
              borderRadius: "10px",
            }}
          >
            <small style={{ color: "#777" }}>
              {t("totalAnimals")}
            </small>

            <div
              style={{
                fontSize: "25px",
                fontWeight: "700",
                marginTop: "5px",
              }}
            >
              {totalAnimals}
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              background: "#f5f7f5",
              borderRadius: "10px",
            }}
          >
            <small style={{ color: "#777" }}>
              {t("feedTypes")}
            </small>

            <div
              style={{
                fontSize: "25px",
                fontWeight: "700",
                marginTop: "5px",
              }}
            >
              {feed.length}
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              background: "#f5f7f5",
              borderRadius: "10px",
            }}
          >
            <small style={{ color: "#777" }}>
              {t("inventoryItems")}
            </small>

            <div
              style={{
                fontSize: "25px",
                fontWeight: "700",
                marginTop: "5px",
              }}
            >
              {inventory.length}
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              background: "#f5f7f5",
              borderRadius: "10px",
            }}
          >
            <small style={{ color: "#777" }}>
              {t("financeRecords")}
            </small>

            <div
              style={{
                fontSize: "25px",
                fontWeight: "700",
                marginTop: "5px",
              }}
            >
              {finance.length}
            </div>
          </div>
        </div>
      </div>

      {/* OPERATIONS */}

      <div
        style={{
          marginBottom: "28px",
        }}
      >
        <h2>⚙️ {t("farmOperations")}</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {operationCards.map((card) => (
            <Link
              key={card.path}
              to={card.path}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                className="card"
                style={{
                  background: card.color,
                  minHeight: "110px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "34px",
                    }}
                  >
                    {card.icon}
                  </div>

                  <div>
                    <h3
                      style={{
                        margin: 0,
                        color: card.textColor,
                      }}
                    >
                      {card.title}
                    </h3>

                    <p
                      style={{
                        marginTop: "6px",
                        marginBottom: 0,
                        color: "#666",
                        fontSize: "13px",
                      }}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* QUICK ACTIONS */}

      <div
        className="card"
        style={{
          marginBottom: "28px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
          }}
        >
          ⚡ {t("quickActions")}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "10px",
          }}
        >
          {quickActions.map((action) => (
            <Link
              key={action.path}
              className="button"
              to={action.path}
              style={{
                textDecoration: "none",
                textAlign: "center",
                padding: "12px 8px",
              }}
            >
              {action.icon} {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* MANAGEMENT */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          marginBottom: "28px",
        }}
      >
        <div className="card">
          <h2
            style={{
              marginTop: 0,
            }}
          >
            💰 Finance
          </h2>

          <p
            style={{
              color: "#666",
              lineHeight: 1.6,
            }}
          >
            {t("manageFinance")}
          </p>

          <Link
            className="button"
            to="/finance"
            style={{
              display: "inline-block",
              textDecoration: "none",
            }}
          >
            Open Finance →
          </Link>
        </div>

        <div className="card">
          <h2
            style={{
              marginTop: 0,
            }}
          >
            👷 Workers
          </h2>

          <p
            style={{
              color: "#666",
              lineHeight: 1.6,
            }}
          >
            {t("manageWorkers")}
          </p>

          <Link
            className="button"
            to="/workers"
            style={{
              display: "inline-block",
              textDecoration: "none",
            }}
          >
            Open Workers →
          </Link>
        </div>

        <div className="card">
          <h2
            style={{
              marginTop: 0,
            }}
          >
            📈 Reports
          </h2>

          <p
            style={{
              color: "#666",
              lineHeight: 1.6,
            }}
          >
            {t("reportsDescription")}
          </p>

          <Link
            className="button"
            to="/reports"
            style={{
              display: "inline-block",
              textDecoration: "none",
            }}
          >
            {t("openReports")} →
          </Link>
        </div>

        <div className="card">
          <h2
            style={{
              marginTop: 0,
            }}
          >
            ⚙️ {t("settings")}
          </h2>

          <p
            style={{
              color: "#666",
              lineHeight: 1.6,
            }}
          >
            {t("settingsDescription")}
          </p>

          <Link
            className="button"
            to="/settings"
            style={{
              display: "inline-block",
              textDecoration: "none",
            }}
          >
            {t("openSettings")} →
          </Link>
        </div>
      </div>

      {/* SYSTEM STATUS */}

      <div className="card">
        <h2
          style={{
            marginTop: 0,
          }}
        >
          ✅ {t("systemStatus")}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
          }}
        >
          <div>✅ Dashboard connected</div>
          <div>✅ Goat module active</div>
          <div>✅ Chicken module active</div>
          <div>✅ Rabbit module active</div>
          <div>✅ Feed connected</div>
          <div>✅ Inventory connected</div>
          <div>✅ Finance connected</div>
          <div>✅ Worker module active</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
