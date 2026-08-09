import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      color: "#E8F5E9",
      textColor: "#1B5E20",
      items: [
        {
          name: "Dashboard",
          path: "/",
          icon: "🏠",
        },
      ],
    },

    {
      title: "Goat Management",
      color: "#FFF3E0",
      textColor: "#8D4E00",
      items: [
        {
          name: "Goats",
          path: "/goats",
          icon: "🐐",
        },
        {
          name: "Breeding",
          path: "/breeding",
          icon: "🧬",
        },
      ],
    },

    {
      title: "Poultry",
      color: "#FFF8E1",
      textColor: "#795548",
      items: [
        {
          name: "Chickens",
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
      title: "Feed & Inventory",
      color: "#F3E5F5",
      textColor: "#6A1B9A",
      items: [
        {
          name: "Feed",
          path: "/feed",
          icon: "🌾",
        },
        {
          name: "Feed Usage",
          path: "/feed/usage",
          icon: "🥣",
        },
        {
          name: "Inventory",
          path: "/inventory",
          icon: "📦",
        },
      ],
    },

    {
      title: "Finance",
      color: "#E3F2FD",
      textColor: "#1565C0",
      items: [
        {
          name: "Finance",
          path: "/finance",
          icon: "💵",
        },
      ],
    },

    {
      title: "Staff",
      color: "#ECEFF1",
      textColor: "#455A64",
      items: [
        {
          name: "Workers",
          path: "/workers",
          icon: "👷",
        },
      ],
    },

    {
      title: "Rabbit Farm",
      color: "#FCE4EC",
      textColor: "#AD1457",
      items: [
        {
          name: "Rabbits",
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
      title: "System",
      color: "#E0F2F1",
      textColor: "#00695C",
      items: [
        {
          name: "Reports",
          path: "/reports",
          icon: "📊",
        },
        {
          name: "Settings",
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
          {/* SECTION TITLE */}

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
              letterSpacing: "0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              boxSizing: "border-box",
            }}
          >
            {section.title}
          </div>

          {/* MENU ITEMS */}

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