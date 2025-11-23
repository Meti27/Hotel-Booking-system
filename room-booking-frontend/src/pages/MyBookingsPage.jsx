import { useEffect, useState } from "react";
import { bookingApi } from "../api/bookingApi";
import { hotelConfig } from "../config/hotelConfig";
import { useAuth } from "../auth/AuthContext";

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { shortName } = hotelConfig;
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    async function fetchBookings() {
      try {
        setLoading(true);
        setError("");
        const data = await bookingApi.getBookingsForUser(user.id);
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
        setError("Failed to load your bookings. Check if backend is running.");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [user]);

  if (!user) {
    return (
      <p style={{ padding: "1rem", fontFamily: "system-ui" }}>
        Please log in to view your bookings.
      </p>
    );
  }

  if (loading) {
    return <p style={{ padding: "1rem" }}>Loading your bookings...</p>;
  }

  if (error) {
    return (
      <p style={{ padding: "1rem", color: "red", fontFamily: "system-ui" }}>
        {error}
      </p>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: "0.75rem" }}>My Bookings</h1>
      <p style={{ marginBottom: "1.5rem", opacity: 0.85 }}>
        Here are all your reservations at {shortName}.
      </p>

      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: "0.75rem",
            border: "1px solid #e5e7eb",
            background: "white",
            color: "#111827",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.95rem",
            }}
          >
            <thead style={{ background: "#f3f4f6" }}>
              <tr>
                <th style={thCell}>Room</th>
                <th style={thCell}>Check-in</th>
                <th style={thCell}>Check-out</th>
                <th style={thCell}>Nights</th>
                <th style={thCell}>Total</th>
                <th style={thCell}>Status</th>
                <th style={thCell}>Created at</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const checkInDate = new Date(b.checkIn);
                const checkOutDate = new Date(b.checkOut);
                const nights =
                  (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

                return (
                  <tr key={b.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td style={tdCell}>
                      Room {b.roomNumber} (ID: {b.roomId})
                    </td>
                    <td style={tdCell}>{b.checkIn}</td>
                    <td style={tdCell}>{b.checkOut}</td>
                    <td style={tdCell}>{nights}</td>
                    <td style={tdCell}>{b.totalPrice} €</td>
                    <td
                      style={{
                        ...tdCell,
                        fontWeight: 600,
                        color: statusColor(b.status),
                      }}
                    >
                      {b.status}
                    </td>
                    <td style={tdCell}>
                      {b.createdAt
                        ? b.createdAt.replace("T", " ").slice(0, 16)
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thCell = {
  textAlign: "left",
  padding: "0.75rem",
  fontWeight: 600,
  fontSize: "0.85rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tdCell = {
  padding: "0.75rem",
  verticalAlign: "top",
};

function statusColor(status) {
  switch (status) {
    case "CONFIRMED":
      return "#16a34a"; // green
    case "PENDING":
      return "#d97706"; // amber
    case "CANCELLED":
      return "#b91c1c"; // red
    default:
      return "#111827";
  }
}

export default MyBookingsPage;
