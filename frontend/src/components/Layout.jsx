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
        icon: "👷",
        logo: "/salome_young_farm_logo.png",
      };
    }

    if (path.startsWith("/reports")) {
      return {
        name: "Reports",
        icon: "📊",
        logo: "/salome_young_farm_logo.png",
      };
    }

    if (path.startsWith("/settings")) {
      return {
        name: "Settings",
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
    <>
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          html,
          body,
          #root {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100%;
          }

          @media (max-width: 768px) {
            .syf-sidebar {
              display: none !important;
            }

            .syf-main {
              margin-left: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
            }

            .syf-header {
              height: auto !important;
              min-height: 64px !important;
              padding: 10px 12px !important;
              gap: 8px !important;
            }

            .syf-brand-logo {
              width: 38px !important;
              height: 38px !important;
            }

            .syf-module-title {
              font-size: 15px !important;
            }

            .syf-brand-subtitle {
              font-size: 10px !important;
            }

            .syf-user {
              gap: 6px !important;
            }

            .syf-user-info {
              display: none !important;
            }

            .syf-logout {
              padding: 7px 9px !important;
              font-size: 12px !important;
            }

            .syf-content {
              padding: 12px !important;
            }

            table {
              max-width: 100%;
            }
          }

          @media (max-width: 400px) {
            .syf-module-title {
              font-size: 13px !important;
            }

            .syf-brand-logo {
              width: 34px !important;
              height: 34px !important;
            }

            .syf-header {
              padding: 8px 10px !important;
            }

            .syf-content {
              padding: 8px !important;
            }
          }
        `}
      </style>

      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
          background: "#F4F6F8",
        }}
      >
        {/* SIDEBAR */}

        <div
          className="syf-sidebar"
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
          }}
        >
          <Sidebar />
        </div>

        {/* MAIN AREA */}

        <div
          className="syf-main"
          style={{
            marginLeft: "270px",
            width: "calc(100% - 270px)",
            maxWidth: "calc(100% - 270px)",
            minWidth: 0,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
          }}
        >
          {/* TOP HEADER */}

          <div
            className="syf-header"
            style={{
              height: "70px",
              flexShrink: 0,
              width: "100%",
              background: "white",
              borderBottom: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 30px",
              position: "sticky",
              top: 0,
              zIndex: 900,
              overflow: "hidden",
            }}
          >
            {/* MODULE BRANDING */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                minWidth: 0,
                overflow: "hidden",
                flex: 1,
              }}
            >
              <img
                className="syf-brand-logo"
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
                  className="syf-module-title"
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
                  className="syf-brand-subtitle"
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
              className="syf-user"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                flexShrink: 0,
              }}
            >
              <div
                className="syf-user-info"
                style={{
                  textAlign: "right",
                }}
              >
                <strong>{user?.full_name}</strong>

                <br />

                <small>{user?.role}</small>
              </div>

              <button
                className="button syf-logout"
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
            className="syf-content"
            style={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              width: "100%",
              maxWidth: "100%",
              padding: "25px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default Layout;
