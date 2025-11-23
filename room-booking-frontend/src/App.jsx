import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import RoomsPage from "./pages/RoomsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminRoomsPage from "./pages/AdminRoomsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import LoginPage from "./pages/LoginPage";
import { hotelConfig } from "./config/hotelConfig";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";

function AppShell() {
  const { shortName, colors } = hotelConfig;
  const { user, isAdmin, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div
      style={{
        fontFamily: "system-ui",
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem 1.5rem",
          background: colors.navBg,
          borderBottom: "1px solid rgba(148, 163, 184, 0.3)",
        }}
      >
        <Link
          to="/"
          style={{
            color: colors.accent,
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "1.25rem",
          }}
        >
          {shortName}
        </Link>

        <div style={{ display: "flex", gap: "1rem", fontSize: "0.95rem" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Rooms
          </Link>

          {isLoggedIn && (
            <Link
              to="/my-bookings"
              style={{ color: "white", textDecoration: "none" }}
            >
              My Bookings
            </Link>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin/rooms"
                style={{ color: "white", textDecoration: "none" }}
              >
                Admin Rooms
              </Link>
              <Link
                to="/admin/bookings"
                style={{ color: "white", textDecoration: "none" }}
              >
                Admin Bookings
              </Link>
            </>
          )}

          {!isLoggedIn ? (
            <Link
              to="/login"
              style={{ color: "white", textDecoration: "none" }}
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid rgba(148,163,184,0.5)",
                color: "white",
                borderRadius: "999px",
                padding: "0.25rem 0.8rem",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Logout {user?.name ? `(${user.name})` : ""}
            </button>
          )}
        </div>
      </nav>

      {/* Main content */}
      <Routes>
        {/* Public */}
        <Route path="/" element={<RoomsPage />} />

        <Route
          path="/login"
          element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" replace />}
        />

        {/* Protected for any logged-in user */}
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="/admin/rooms"
          element={
            <AdminRoute>
              <AdminRoomsPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <AdminBookingsPage />
            </AdminRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell />
      </Router>
    </AuthProvider>
  );
}

export default App;
