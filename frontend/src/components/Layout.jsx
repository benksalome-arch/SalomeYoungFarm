import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  // ============================
  // Detect current module
  // ============================

  function getModule() {
    const path = location.pathname;

    if (
      path.startsWith("/chickens") ||
      path.startsWith("/chicken-mortality") ||
      path.startsWith("/chicken-vaccinations") ||
      path.startsWith("/egg-production") ||
      path.startsWith("/egg-sales")
    ) {
      return {
        name: "Chicken Management",
        icon: "🐔",
        logo: "/salome_young_farm_logo.png",
      };
    }

    if (
      path.startsWith("/goats") ||
      path.startsWith("/breeding") ||
      path.startsWith("/kidding")
    ) {
      return {
        name: "Goat Management",
        icon: "🐐",
        logo: "/salome_young_farm_logo.png",
      };
    }

    if (
      path.startsWith("/rabbits") ||
      path.startsWith("/rabbit-litters") ||
      path.startsWith("/rabbit-mortality") ||
      path.startsWith("/rabbit-vaccinations")
    ) {
      return {
        name: "Rabbit Management",
        icon: "🐇",
        logo: "/salome_young_farm_logo.png",
      };
    }

    if (path.startsWith("/feed")) {
      return {
        name: "Feed Management",
        icon: "🌾",
        logo: "/salome_young_farm_logo.png",
      };
    }

    if (path.startsWith("/inventory")) {
      return {
        name: "Inventory Management",
        icon: "📦",
        logo: "/salome_young_farm_logo.png",
      };
    }

    if (path.startsWith("/finance")) {
      return {
        name: "Finance Management",
        icon: "💰",
        logo: "/salome_young_farm_logo.png",
      };
    }

    if (path.startsWith("/workers")) {
      return {
        name: "Worker Management",
        icon: "👥",
        logo: "/salome_young_farm_logo.png",
      };
    }

    if (path.startsWith("/reports")) {
      return {
        name: "Farm Reports",
        icon: "📊",
        logo: "/salome_young_farm_logo.png",
      };
    }

    if (path.startsWith("/settings")) {
      return {
        name: "Farm Settings",
        icon: "⚙️",
        logo: "/salome_young_farm_logo.png",
      };
    }

    return {
      name: "Salome Young Farm",
      icon: "",
      logo: "/salome_young_farm_logo.png",
    };
  }

  const module = getModule();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        background: "#F4F6F8",
        boxSizing: "border-box",
      }}
    >
      {/* SIDEBAR */}

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "270px",
          maxWidth: "270px",
          overflowY: "auto",
          overflowX: "hidden",
          zIndex: 1000,
          boxSizing: "border-box",
        }}
      >
        <Sidebar />
      </div>

      {/* MAIN AREA */}

      <div
        style={{
          marginLeft: "270px",
          width: "calc(100% - 270px)",
          maxWidth: "calc(100% - 270px)",
          minWidth: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {/* TOP HEADER */}

        <div
          style={{
            height: "70px",
            flexShrink: 0,
            width: "100%",
            maxWidth: "100%",
            background: "white",
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 30px",
            position: "sticky",
            top: 0,
            zIndex: 900,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* MODULE BRANDING */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <img
              src={module.logo}
              alt="Salome Young Farm"
              style={{
                width: "48px",
                height: "48px",
                objectFit: "contain",
                flexShrink: 0,
              }}
            />

            <div
              style={{
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#17221a",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {module.icon} {module.name}
              </h2>

              <small
                style={{
                  color: "#737873",
                  whiteSpace: "nowrap",
                }}
              >
                Salome Young Farm
              </small>
            </div>
          </div>

          {/* USER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                textAlign: "right",
              }}
            >
              <strong>
                {user?.full_name}
              </strong>

              <br />

              <small>
                {user?.role}
              </small>
            </div>

            <button
              className="button"
              onClick={logout}
              style={{
                background: "#D32F2F",
                color: "white",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}

        <main
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            width: "100%",
            maxWidth: "100%",
            padding: "25px",
            overflowY: "auto",
            overflowX: "hidden",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;