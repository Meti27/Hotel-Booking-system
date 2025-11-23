import { useEffect, useState } from "react";
import { bookingApi } from "../api/bookingApi";
import { hotelConfig } from "../config/hotelConfig";

function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { shortName } = hotelConfig;

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        setError("");
        const data = await bookingApi.getAllBookings();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
        setError("Failed to load bookings. Check if backend is running.");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  async function handleCancel(id) {
    const confirm = window.confirm("Cancel this booking?");
    if (!confirm) return;

    try {
      await bookingApi.cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: "CANCELLED" } : b
        )
      );
    } catch (err) {
      console.error("Failed to cancel booking", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to cancel booking.";
      alert(msg);
    }
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui", color: "#f9fafb" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Admin – Bookings</h1>
      <p style={{ marginBottom: "1.5rem", opacity: 0.85 }}>
        View and manage all bookings for {shortName}.
      </p>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p style={{ color: "#f97373" }}>{error}</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            backgroundColor: "#111827",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.95rem",
            }}
          >
            <thead style={{ backgroundColor: "#020617", color: "#e5e7eb" }}>
              <tr>
                <th style={thCell}>ID</th>
                <th style={thCell}>User</th>
                <th style={thCell}>Room</th>
                <th style={thCell}>Check-in</th>
                <th style={thCell}>Check-out</th>
                <th style={thCell}>Total</th>
                <th style={thCell}>Status</th>
                <th style={thCell}>Created</th>
                <th style={thCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} style={{ borderTop: "1px solid #1f2937" }}>
                  <td style={tdCell}>{b.id}</td>
                  <td style={tdCell}>
                    {b.userFullName || "User " + b.userId} (ID: {b.userId})
                  </td>
                  <td style={tdCell}>
                    Room {b.roomNumber} (ID: {b.roomId})
                  </td>
                  <td style={tdCell}>{b.checkIn}</td>
                  <td style={tdCell}>{b.checkOut}</td>
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
                  <td style={tdCell}>
                    <button
                      style={{
                        padding: "0.35rem 0.75rem",
                        borderRadius: "0.4rem",
                        border: "none",
                        cursor: b.status === "CANCELLED" ? "default" : "pointer",
                        backgroundColor:
                          b.status === "CANCELLED" ? "#4b5563" : "#b91c1c",
                        color: "white",
                        fontSize: "0.85rem",
                        opacity: b.status === "CANCELLED" ? 0.6 : 1,
                      }}
                      disabled={b.status === "CANCELLED"}
                      onClick={() =>
                        b.status !== "CANCELLED" && handleCancel(b.id)
                      }
                    >
                      {b.status === "CANCELLED" ? "Cancelled" : "Cancel"}
                    </button>
                  </td>
                </tr>
              ))}
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
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tdCell = {
  padding: "0.6rem 0.75rem",
  verticalAlign: "top",
  fontSize: "0.9rem",
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
      return "#e5e7eb";
  }
}

export default AdminBookingsPage;
