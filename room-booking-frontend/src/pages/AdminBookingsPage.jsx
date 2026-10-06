import { useEffect, useMemo, useState } from "react";
import { bookingApi } from "../api/bookingApi";
import { hotelConfig } from "../config/hotelConfig";
import "../styles/adminBookings.css";

function formatDateTime(iso) {
  if (!iso) return "-";
  return iso.replace("T", " ").slice(0, 16);
}

function badgeClass(status) {
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

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(""); // "", CONFIRMED, PENDING, CANCELLED

  const { shortName } = hotelConfig;

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  async function handleCancel(id) {
    const ok = window.confirm("Cancel this booking?");
    if (!ok) return;

    try {
      await bookingApi.cancelBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b)));
    } catch (err) {
      console.error("Failed to cancel booking", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to cancel booking.";
      alert(msg);
    }
  }

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();

    return bookings.filter((b) => {
      const matchesStatus = status ? b.status === status : true;

      const hay = [
        b.id,
        b.userId,
        b.userFullName,
        b.roomId,
        b.roomNumber,
        b.checkIn,
        b.checkOut,
        b.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesText = text ? hay.includes(text) : true;

      return matchesStatus && matchesText;
    });
  }, [bookings, q, status]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
    const pending = bookings.filter((b) => b.status === "PENDING").length;
    const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;
    return { total, confirmed, pending, cancelled };
  }, [bookings]);

  return (
    <div className="adminBookings">
      <header className="adminHeader">
        <div>
          <h1 className="adminTitle">Admin • Bookings</h1>
          <p className="adminSubtitle">
            View and manage all bookings for <strong>{shortName}</strong>.
          </p>
        </div>

        <div className="adminStats">
          <div className="statCard">
            <div className="statNum">{stats.total}</div>
            <div className="statLabel">Total</div>
          </div>
          <div className="statCard">
            <div className="statNum">{stats.confirmed}</div>
            <div className="statLabel">Confirmed</div>
          </div>
          <div className="statCard">
            <div className="statNum">{stats.pending}</div>
            <div className="statLabel">Pending</div>
          </div>
          <div className="statCard">
            <div className="statNum">{stats.cancelled}</div>
            <div className="statLabel">Cancelled</div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="panel">
        <div className="filters">
          <div className="field">
            <label className="label">Search</label>
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by user, room, id, dates..."
            />
          </div>

          <div className="field">
            <label className="label">Status</label>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Any</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PENDING">PENDING</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div className="filterActions">
            <button className="btn btn--ghost" onClick={() => { setQ(""); setStatus(""); }}>
              Clear
            </button>
            <button className="btn btn--primary" onClick={fetchBookings}>
              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="panel">
        {loading ? (
          <p className="muted">Loading bookings...</p>
        ) : error ? (
          <p className="errorText">{error}</p>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty__title">No bookings found</div>
            <div className="empty__text">Try clearing filters or refresh.</div>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Room</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th className="right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>
                        <div className="strong">{b.userFullName || `User ${b.userId}`}</div>
                        <div className="mutedSmall">ID: {b.userId}</div>
                      </td>
                      <td>
                        <div className="strong">Room #{b.roomNumber}</div>
                        <div className="mutedSmall">ID: {b.roomId}</div>
                      </td>
                      <td>{b.checkIn}</td>
                      <td>{b.checkOut}</td>
                      <td className="strong">{b.totalPrice} €</td>
                      <td>
                        <span className={badgeClass(b.status)}>{b.status}</span>
                      </td>
                      <td>{formatDateTime(b.createdAt)}</td>
                      <td className="right">
                        <button
                          className={`btn ${b.status === "CANCELLED" ? "btn--disabled" : "btn--danger"}`}
                          disabled={b.status === "CANCELLED"}
                          onClick={() => b.status !== "CANCELLED" && handleCancel(b.id)}
                        >
                          {b.status === "CANCELLED" ? "Cancelled" : "Cancel"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="mobileCards">
              {filtered.map((b) => (
                <article key={b.id} className="bookingCard">
                  <div className="bookingTop">
                    <div>
                      <div className="bookingTitle">Booking #{b.id}</div>
                      <div className="bookingMeta">
                        <span className="strong">Room #{b.roomNumber}</span> • {b.totalPrice} €
                      </div>
                    </div>
                    <span className={badgeClass(b.status)}>{b.status}</span>
                  </div>

                  <div className="bookingGrid">
                    <div>
                      <div className="mutedSmall">User</div>
                      <div className="strong">{b.userFullName || `User ${b.userId}`}</div>
                      <div className="mutedSmall">ID: {b.userId}</div>
                    </div>

                    <div>
                      <div className="mutedSmall">Dates</div>
                      <div className="strong">{b.checkIn} → {b.checkOut}</div>
                      <div className="mutedSmall">Created: {formatDateTime(b.createdAt)}</div>
                    </div>
                  </div>

                  <button
                    className={`btn btn--block ${b.status === "CANCELLED" ? "btn--disabled" : "btn--danger"}`}
                    disabled={b.status === "CANCELLED"}
                    onClick={() => b.status !== "CANCELLED" && handleCancel(b.id)}
                  >
                    {b.status === "CANCELLED" ? "Cancelled" : "Cancel booking"}
                  </button>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
