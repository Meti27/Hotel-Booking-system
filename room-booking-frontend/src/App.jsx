import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

import RoomsPage from "./pages/RoomsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminRoomsPage from "./pages/AdminRoomsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { hotelConfig } from "./config/hotelConfig";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";

function Navbar() {
  const { shortName, colors } = hotelConfig;
  const { user, isAdmin, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: 600,
    padding: "0.5rem 0.75rem",
    borderRadius: "999px",
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: colors.navBg,
        borderBottom: "1px solid rgba(148, 163, 184, 0.25)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0.9rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          style={{
            color: colors.accent,
            textDecoration: "none",
            fontWeight: 800,
            letterSpacing: "0.3px",
            fontSize: "1.15rem",
            whiteSpace: "nowrap",
          }}
        >
          {shortName}
        </Link>

        {/* Desktop links */}
        <nav
          style={{
            display: "flex",
            gap: "0.35rem",
            alignItems: "center",
          }}
          className="nav-desktop"
        >
        <Link to="/" style={linkStyle}>
  Home
</Link>

<Link to="/rooms" style={linkStyle}>
  Rooms
</Link>

          {isLoggedIn && (
            <Link to="/my-bookings" style={linkStyle}>
              My Bookings
            </Link>
          )}

          {isAdmin && (
            <>
              <Link to="/admin/rooms" style={linkStyle}>
                Admin Rooms
              </Link>
              <Link to="/admin/bookings" style={linkStyle}>
                Admin Bookings
              </Link>
            </>
          )}

          {!isLoggedIn ? (
            <Link
              to="/login"
              style={{
                ...linkStyle,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "white",
                borderRadius: "999px",
                padding: "0.5rem 0.8rem",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Logout {user?.name ? `(${user.name})` : ""}
            </button>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "white",
            borderRadius: "10px",
            padding: "0.45rem 0.65rem",
            cursor: "pointer",
            display: "none",
          }}
          className="nav-mobile-btn"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            borderTop: "1px solid rgba(148, 163, 184, 0.2)",
            background: colors.navBg,
          }}
          className="nav-mobile-menu"
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0.75rem 1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <Link to="/" onClick={() => setOpen(false)} style={linkStyle}>
                Rooms
              </Link>

              {isLoggedIn && (
                <Link to="/my-bookings" onClick={() => setOpen(false)} style={linkStyle}>
                  My Bookings
                </Link>
              )}

              {isAdmin && (
                <>
                  <Link to="/admin/rooms" onClick={() => setOpen(false)} style={linkStyle}>
                    Admin Rooms
                  </Link>
                  <Link to="/admin/bookings" onClick={() => setOpen(false)} style={linkStyle}>
                    Admin Bookings
                  </Link>
                </>
              )}

              {!isLoggedIn ? (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  style={{
                    ...linkStyle,
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    display: "inline-flex",
                    width: "fit-content",
                  }}
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "white",
                    borderRadius: "999px",
                    padding: "0.55rem 0.9rem",
                    cursor: "pointer",
                    fontWeight: 600,
                    width: "fit-content",
                  }}
                >
                  Logout {user?.name ? `(${user.name})` : ""}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { shortName, colors } = hotelConfig;

  return (
    <footer
      style={{
        borderTop: "1px solid rgba(148, 163, 184, 0.2)",
        padding: "2rem 1rem",
        marginTop: "2rem",
        background: "rgba(2,6,23,0.35)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", color: colors.text, opacity: 0.9 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <div style={{ fontWeight: 800, color: colors.accent }}>{shortName}</div>
            <div style={{ fontSize: "0.95rem", opacity: 0.85 }}>Comfort stays • Real bookings • Clean UI</div>
          </div>

          <div style={{ fontSize: "0.95rem", opacity: 0.85 }}>
            <div>Support: support@{shortName.toLowerCase()}.com</div>
            <div>Phone: +389 xx xxx xxx</div>
          </div>
        </div>

        <div style={{ marginTop: "1rem", fontSize: "0.9rem", opacity: 0.7 }}>
          © {new Date().getFullYear()} {shortName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function AppShell() {
  const { colors } = hotelConfig;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      }}
    >
      <Navbar />

      {/* IMPORTANT: remove maxWidth from main so Home hero can be full width */}
      <main style={{ padding: "0" }}>
        <Routes>
          {/* NEW: Home */}
          <Route path="/" element={<HomePage />} />

          {/* MOVE RoomsPage here */}
          <Route
            path="/rooms"
            element={
              <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.25rem 1rem" }}>
                <RoomsPage />
              </div>
            }
          />

          <Route
            path="/login"
            element={
              <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.25rem 1rem" }}>
                <LoginPage />
              </div>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.25rem 1rem" }}>
                  <MyBookingsPage />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/rooms"
            element={
              <AdminRoute>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.25rem 1rem" }}>
                  <AdminRoomsPage />
                </div>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.25rem 1rem" }}>
                  <AdminBookingsPage />
                </div>
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell />
      </Router>
    </AuthProvider>
  );
}
