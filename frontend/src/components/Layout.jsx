import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

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
          {/* Farm Name */}

          <div
            style={{
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <h2
              style={{
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              🐐 Salome Young Farm
            </h2>
          </div>

          {/* User */}

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