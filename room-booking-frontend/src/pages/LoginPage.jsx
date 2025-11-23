import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@hotel.com"); // prefill for demo
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const loggedUser = login(email.trim(), password.trim());

      // Redirect based on role
      if (loggedUser.role === "ADMIN") {
        navigate("/admin/rooms", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed.");
    }
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          backgroundColor: "#020617",
          borderRadius: "1rem",
          padding: "2rem",
          border: "1px solid #1f2937",
          boxShadow: "0 18px 40px rgba(0,0,0,0.7)",
          color: "#f9fafb",
        }}
      >
        <h1 style={{ marginBottom: "0.5rem", fontSize: "1.4rem" }}>Sign in</h1>
        <p style={{ marginBottom: "1.5rem", opacity: 0.8, fontSize: "0.9rem" }}>
          Use the demo accounts:
          <br />
          <strong>Admin:</strong> admin@hotel.com / admin123
          <br />
          <strong>User:</strong> john@doe.com / user123
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "0.9rem" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "0.25rem",
                fontSize: "0.85rem",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              autoComplete="username"
            />
          </div>

          <div style={{ marginBottom: "0.9rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "0.25rem",
                fontSize: "0.85rem",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p
              style={{
                color: "#f97373",
                fontSize: "0.85rem",
                marginBottom: "0.75rem",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.6rem",
              borderRadius: "0.7rem",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#2563eb",
              color: "white",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.45rem 0.5rem",
  borderRadius: "0.55rem",
  border: "1px solid #374151",
  backgroundColor: "#020617",
  color: "#e5e7eb",
  fontSize: "0.9rem",
};

export default LoginPage;
