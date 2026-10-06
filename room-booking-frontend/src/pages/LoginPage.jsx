import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { hotelConfig } from "../config/hotelConfig";
import "../styles/login.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { shortName } = hotelConfig;

  const [email, setEmail] = useState("admin@hotel.com"); // demo
  const [password, setPassword] = useState("admin123");  // demo
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const loggedUser = login(email.trim(), password.trim());

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
    <div className="loginPage">
      <div className="loginShell">
        {/* Left visual */}
        <section className="loginVisual">
          <img
            className="loginVisual__img"
            src="/images/auth/login.jpg"
            alt="Hotel"
            onError={(e) => {
              // if user didn’t add the image yet, hide img and keep gradient
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="loginVisual__overlay" />

          <div className="loginVisual__content">
            <div className="brandPill">🏨 {shortName || "Hotel"}</div>

            <h1 className="loginVisual__title">Welcome back</h1>
            <p className="loginVisual__subtitle">
              Sign in to manage your bookings, view stays, and access admin tools if you’re staff.
            </p>

            <div className="loginVisual__features">
              <div className="feature">✅ Fast booking flow</div>
              <div className="feature">🔒 Secure access</div>
              <div className="feature">📅 Date conflict prevention</div>
            </div>
          </div>
        </section>

        {/* Right form */}
        <section className="loginCard">
          <div className="loginCard__header">
            <h2 className="loginCard__title">Sign in</h2>
            <p className="loginCard__subtitle">Use your account to continue.</p>
          </div>

          <div className="demoBox">
            <div className="demoBox__title">Demo accounts</div>
            <div className="demoBox__row">
              <span className="demoBox__key">Admin</span>
              <span className="demoBox__val">admin@hotel.com / admin123</span>
            </div>
            <div className="demoBox__row">
              <span className="demoBox__key">User</span>
              <span className="demoBox__val">john@doe.com / user123</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="loginForm">
            <div className="field">
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                placeholder="you@example.com"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="errorText">{error}</p>}

            <button type="submit" className="btn btn--primary btn--block">
              Login
            </button>

            <p className="loginHint">
              Tip: you can change the prefilled email/password to test both roles.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
