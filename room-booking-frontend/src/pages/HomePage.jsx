import { Link } from "react-router-dom";
import { hotelConfig } from "../config/hotelConfig";
import { useAuth } from "../auth/AuthContext";

export default function HomePage() {
  const { shortName, colors } = hotelConfig;
  const { isLoggedIn } = useAuth();

  const heroStyle = {
    borderRadius: "18px",
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background:
      "radial-gradient(1200px 600px at 20% -10%, rgba(56,189,248,0.25), transparent 60%)," +
      "radial-gradient(1000px 600px at 90% 10%, rgba(167,139,250,0.22), transparent 55%)," +
      "linear-gradient(180deg, rgba(2,6,23,0.65), rgba(2,6,23,0.25))",
  };

  const card = {
    border: "1px solid rgba(148, 163, 184, 0.16)",
    background: "rgba(2,6,23,0.55)",
    borderRadius: "16px",
    padding: "1.1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  };

  const btnPrimary = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    padding: "0.85rem 1.05rem",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.18)",
    textDecoration: "none",
    fontWeight: 700,
    color: "#0b1120",
    background: colors.accent,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const btnGhost = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    padding: "0.85rem 1.05rem",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.18)",
    textDecoration: "none",
    fontWeight: 700,
    color: "white",
    background: "rgba(255,255,255,0.08)",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* HERO */}
      <section style={heroStyle}>
        <div style={{ padding: "2.25rem 1.5rem" }}>
          <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "1.25fr 0.75fr" }}>
            {/* Left */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.35rem 0.7rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "0.9rem",
                  marginBottom: "0.9rem",
                }}
              >
                ✨ Premium stays • Instant booking • Clean experience
              </div>

              <h1 style={{ margin: 0, fontSize: "2.25rem", lineHeight: 1.15, color: "#f9fafb" }}>
                Book your next stay with <span style={{ color: colors.accent }}>{shortName}</span>
              </h1>

              <p style={{ marginTop: "0.9rem", marginBottom: 0, opacity: 0.85, maxWidth: 650 }}>
                Browse rooms, check availability, and manage bookings in one place. A modern, secure hotel
                booking experience built with React + Spring Boot.
              </p>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
                <Link to="/rooms" style={btnPrimary}>
                  Browse Rooms →
                </Link>

                {!isLoggedIn ? (
                  <Link to="/login" style={btnGhost}>
                    Sign in to book
                  </Link>
                ) : (
                  <Link to="/my-bookings" style={btnGhost}>
                    View my bookings
                  </Link>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1.25rem",
                  marginTop: "1.6rem",
                  flexWrap: "wrap",
                  opacity: 0.85,
                }}
              >
                <Stat label="Fast checkout" value="1–2 min" />
                <Stat label="Secure login" value="JWT" />
                <Stat label="Admin panel" value="Built-in" />
              </div>
            </div>

            {/* Right (mini cards) */}
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={card}>
                <div style={{ fontWeight: 800, marginBottom: "0.35rem", color: "#f9fafb" }}>
                  Today’s highlight
                </div>
                <div style={{ opacity: 0.85, fontSize: "0.95rem", marginBottom: "0.75rem" }}>
                  Clean UI, smooth booking flow, and clear room information.
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Badge text="Real-time availability" />
                  <Badge text="Cancel booking" />
                  <Badge text="Admin control" />
                </div>
              </div>

              <div style={card}>
                <div style={{ fontWeight: 800, marginBottom: "0.35rem", color: "#f9fafb" }}>Why it feels premium</div>
                <ul style={{ margin: 0, paddingLeft: "1.15rem", opacity: 0.85, lineHeight: 1.8 }}>
                  <li>Minimal, modern design</li>
                  <li>Clear booking states (Pending / Confirmed / Cancelled)</li>
                  <li>Responsive layout for mobile</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(3, 1fr)" }}>
        <FeatureCard
          title="Browse rooms"
          text="See room number, type, price and availability clearly."
          action={<Link to="/rooms" style={miniLink}>Open Rooms</Link>}
        />
        <FeatureCard
          title="Manage bookings"
          text="View your bookings and track status easily."
          action={<Link to="/my-bookings" style={miniLink}>My Bookings</Link>}
        />
        <FeatureCard
          title="Admin dashboard"
          text="Manage rooms and cancel bookings when needed."
          action={<Link to="/admin/bookings" style={miniLink}>Admin Area</Link>}
        />
      </section>

      {/* CTA */}
      <section
        style={{
          borderRadius: "18px",
          border: "1px solid rgba(148, 163, 184, 0.16)",
          background:
            "linear-gradient(90deg, rgba(56,189,248,0.12), rgba(167,139,250,0.10))," +
            "rgba(2,6,23,0.45)",
          padding: "1.4rem 1.3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "#f9fafb" }}>
            Ready to book your stay?
          </div>
          <div style={{ opacity: 0.85, marginTop: "0.25rem" }}>
            Explore rooms and reserve in a few clicks.
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link to="/rooms" style={btnPrimary}>
            Browse Rooms →
          </Link>
          <Link to="/login" style={btnGhost}>
            Login
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontWeight: 900, color: "#f9fafb" }}>{value}</span>
      <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>{label}</span>
    </div>
  );
}

function Badge({ text }) {
  return (
    <span
      style={{
        fontSize: "0.8rem",
        padding: "0.25rem 0.55rem",
        borderRadius: "999px",
        border: "1px solid rgba(255,255,255,0.16)",
        background: "rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.9)",
      }}
    >
      {text}
    </span>
  );
}

function FeatureCard({ title, text, action }) {
  return (
    <div
      style={{
        borderRadius: "16px",
        border: "1px solid rgba(148, 163, 184, 0.16)",
        background: "rgba(2,6,23,0.55)",
        padding: "1.1rem",
      }}
    >
      <div style={{ fontWeight: 900, color: "#f9fafb", marginBottom: "0.4rem" }}>{title}</div>
      <div style={{ opacity: 0.85, marginBottom: "0.75rem" }}>{text}</div>
      {action}
    </div>
  );
}

const miniLink = {
  display: "inline-flex",
  width: "fit-content",
  textDecoration: "none",
  fontWeight: 800,
  color: "rgba(255,255,255,0.92)",
  borderBottom: "1px solid rgba(255,255,255,0.25)",
  paddingBottom: "0.15rem",
};
