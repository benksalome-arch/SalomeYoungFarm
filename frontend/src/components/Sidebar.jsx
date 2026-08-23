import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Sidebar() {
  const location = useLocation();
  const { t } = useLanguage();

  const menuItems = [
    {
      title: t("dashboard"),
      color: "#E8F5E9",
      textColor: "#1B5E20",
      items: [
        {
          name: t("dashboard"),
          path: "/",
          icon: "🏠",
        },
      ],
    },

    {
      title: t("goats"),
      color: "#FFF3E0",
      textColor: "#E65100",
      items: [
        {
          name: t("goats"),
          path: "/goats",
          icon: "🐐",
        },
        {
          name: "Breeding",
          path: "/breeding",
          icon: "❤️",
        },
        {
          name: "Kidding",
          path: "/kidding",
          icon: "🐐",
        },
      ],
    },

    {
      title: t("chickens"),
      color: "#FFF8E1",
      textColor: "#F57F17",
      items: [
        {
          name: t("chickens"),
          path: "/chickens",
          icon: "🐔",
        },
        {
          name: "Chicken Vaccinations",
          path: "/chicken-vaccinations",
          icon: "💉",
        },
        {
          name: "Chicken Mortality",
          path: "/chicken-mortality",
          icon: "☠️",
        },
        {
          name: "Egg Production",
          path: "/egg-production",
          icon: "🥚",
        },
        {
          name: "Egg Sales",
          path: "/egg-sales",
          icon: "💰",
        },
      ],
    },

    {
      title: t("feedInventory"),
      color: "#F3E5F5",
      textColor: "#6A1B9A",
      items: [
        {
          name: t("feed"),
          path: "/feed",
          icon: "🌾",
        },
        {
          name: "Feed Usage",
          path: "/feed/usage",
          icon: "🥣",
        },
        {
          name: t("inventory"),
          path: "/inventory",
          icon: "📦",
        },
      ],
    },

    {
      title: t("finance"),
      color: "#E3F2FD",
      textColor: "#1565C0",
      items: [
        {
          name: t("finance"),
          path: "/finance",
          icon: "💵",
        },
      ],
    },

    {
      title: t("staff"),
      color: "#ECEFF1",
      textColor: "#455A64",
      items: [
        {
          name: t("workers"),
          path: "/workers",
          icon: "👷",
        },
      ],
    },

    {
      title: t("rabbitFarm"),
      color: "#FCE4EC",
      textColor: "#AD1457",
      items: [
        {
          name: t("rabbits"),
          path: "/rabbits",
          icon: "🐇",
        },
        {
          name: "Rabbit Litters",
          path: "/rabbit-litters",
          icon: "🐰",
        },
        {
          name: "Rabbit Mortality",
          path: "/rabbit-mortality",
          icon: "☠️",
        },
        {
          name: "Rabbit Vaccinations",
          path: "/rabbit-vaccinations",
          icon: "💉",
        },
      ],
    },

    {
      title: t("system"),
      color: "#E0F2F1",
      textColor: "#00695C",
      items: [
        {
          name: t("reports"),
          path: "/reports",
          icon: "📊",
        },
        {
          name: t("settings"),
          path: "/settings",
          icon: "⚙️",
        },
      ],
    },
  ];

  return (
    <div
      style={{
        width: "270px",
        minHeight: "100vh",
        background: "#1B5E20",
        color: "white",
        padding: "20px",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        🐐 Salome Young Farm
      </h2>

      {menuItems.map((section) => (
        <div
          key={section.title}
          style={{
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              background: section.color,
              color: section.textColor,
              padding: "7px 10px",
              borderRadius: "7px",
              marginBottom: "8px",
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              boxSizing: "border-box",
            }}
          >
            {section.title}
          </div>

          {section.items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "block",
                padding: "10px 14px",
                marginBottom: "6px",
                borderRadius: "8px",
                textDecoration: "none",
                color: "white",
                background:
                  location.pathname === item.path
                    ? "#2E7D32"
                    : "transparent",
                transition: "0.2s",
                boxSizing: "border-box",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
