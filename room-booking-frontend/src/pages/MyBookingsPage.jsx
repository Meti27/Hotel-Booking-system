import { useEffect, useMemo, useState } from "react";
import { bookingApi } from "../api/bookingApi";
import { hotelConfig } from "../config/hotelConfig";
import { useAuth } from "../auth/AuthContext";
import "../styles/myBookings.css";

function formatDateTime(iso) {
  if (!iso) return "-";
  return iso.replace("T", " ").slice(0, 16);
}

function formatDate(iso) {
  if (!iso) return "-";
  return iso.slice(0, 10);
}

function nightsBetween(checkIn, checkOut) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const n = (b - a) / (1000 * 60 * 60 * 24);
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
}

function statusBadgeClass(status) {
  switch (status) {
    case "CONFIRMED":
      return "badge badge--success";
    case "PENDING":
      return "badge badge--warning";
    case "CANCELLED":
      return "badge badge--danger";
    default:
      return "badge badge--muted";
  }
}

// Image placeholder logic
function roomImageByType(type) {
  const map = {
    SINGLE: "/images/rooms/single.jpg",
    DOUBLE: "/images/rooms/double.jpg",
    SUITE: "/images/rooms/suite.jpg",
  };
  return map[type] || "/images/rooms/default.jpg";
}

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

  const summary = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
    const pending = bookings.filter((b) => b.status === "PENDING").length;
    return { total, confirmed, pending };
  }, [bookings]);

  if (!user) {
    return <p className="muted">Please log in to view your bookings.</p>;
  }

  if (loading) return <p className="muted">Loading your bookings...</p>;

  if (error) return <p className="errorText">{error}</p>;

  return (
    <div className="myBookings">
      <header className="pageHeader">
        <div>
          <h1 className="pageTitle">My Bookings</h1>
          <p className="pageSubtitle">
            All your reservations at <strong>{shortName}</strong>.
          </p>
        </div>

        <div className="summary">
          <div className="summaryCard">
            <div className="summaryNum">{summary.total}</div>
            <div className="summaryLabel">Total</div>
          </div>
          <div className="summaryCard">
            <div className="summaryNum">{summary.confirmed}</div>
            <div className="summaryLabel">Confirmed</div>
          </div>
          <div className="summaryCard">
            <div className="summaryNum">{summary.pending}</div>
            <div className="summaryLabel">Pending</div>
          </div>
        </div>
      </header>

      {bookings.length === 0 ? (
        <div className="empty">
          <div className="empty__title">No bookings yet</div>
          <div className="empty__text">
            Go to Rooms, pick dates, and make your first reservation.
          </div>
        </div>
      ) : (
        <div className="bookingGrid">
          {bookings.map((b) => {
            const nights = nightsBetween(b.checkIn, b.checkOut);

            // If backend doesn’t return type, we still show image fallback.
            // If it DOES return roomType, replace b.roomType below.
            const img = roomImageByType(b.roomType);

            return (
              <article key={b.id} className="bookingCard">
                <div className="bookingImageWrap">
                  <img
                    src={img}
                    alt="Room"
                    className="bookingImage"
                    onError={(e) => {
                      e.currentTarget.src = "/images/rooms/default.jpg";
                    }}
                  />
                  <div className="bookingImageOverlay" />
                  <div className="bookingImageText">
                    Room {b.roomNumber ?? "-"}
                  </div>
                </div>

                <div className="bookingBody">
                  <div className="bookingTop">
                    <div>
                      <h3 className="bookingTitle">
                        Stay • {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                      </h3>
                      <p className="bookingMeta">
                        {nights} night{nights !== 1 ? "s" : ""} •{" "}
                        <span className="price">{b.totalPrice} €</span>
                      </p>
                    </div>

                    <span className={statusBadgeClass(b.status)}>{b.status}</span>
                  </div>

                  <div className="bookingDetails">
                    <div className="detailRow">
                      <span className="detailKey">Room</span>
                      <span className="detailVal">
                        #{b.roomNumber} <span className="mutedSmall">(ID: {b.roomId})</span>
                      </span>
                    </div>

                    <div className="detailRow">
                      <span className="detailKey">Created</span>
                      <span className="detailVal">{formatDateTime(b.createdAt)}</span>
                    </div>
                  </div>

                  {/* Optional: Later add cancel button if you have endpoint */}
                  {/* <button className="btn btn--ghost">Cancel booking</button> */}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyBookingsPage;
