import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { roomApi } from "../api/roomApi";
import { bookingApi } from "../api/bookingApi";
import { hotelConfig } from "../config/hotelConfig";
import { useAuth } from "../auth/AuthContext";

// Helpers for UI labels
function formatRoomType(type) {
  if (!type) return "Room";
  const map = { SINGLE: "Single", DOUBLE: "Double", SUITE: "Suite" };
  return map[type] || type;
}

function statusLabel(status) {
  if (!status) return "Unknown";
  const map = { AVAILABLE: "Available", OCCUPIED: "Occupied", MAINTENANCE: "Maintenance" };
  return map[status] || status;
}

function statusClass(status) {
  if (status === "AVAILABLE") return "badge badge--success";
  if (status === "OCCUPIED") return "badge badge--warning";
  return "badge badge--muted";
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // booking modal state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  // filter state
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const [filterGuests, setFilterGuests] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterError, setFilterError] = useState("");

  const { hero, contact } = hotelConfig;
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  async function fetchRooms() {
    try {
      setLoading(true);
      setError("");
      const data = await roomApi.getAllRooms();
      setRooms(data);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
      setError("Failed to load rooms. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  function openBookingModal(room) {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setSelectedRoom(room);
    setCheckIn(filterStart || "");
    setCheckOut(filterEnd || "");
    setBookingError("");
    setBookingSuccess("");
  }

  function closeBookingModal() {
    setSelectedRoom(null);
    setCheckIn("");
    setCheckOut("");
    setBookingError("");
    setBookingSuccess("");
    setBookingLoading(false);
  }

  async function handleSubmitBooking() {
    if (!selectedRoom || !user) return;

    if (!checkIn || !checkOut) {
      setBookingError("Please select both check-in and check-out dates.");
      return;
    }

    if (checkIn >= checkOut) {
      setBookingError("Check-in must be before check-out.");
      return;
    }

    const payload = {
      roomId: selectedRoom.id,
      userId: user.id,
      checkIn,
      checkOut,
    };
      console.log("Payload being sent:", payload);

    try {
      setBookingLoading(true);
      setBookingError("");
      setBookingSuccess("");

      await bookingApi.createBooking(payload);

      setBookingSuccess("Booking successful!");
      // Optional UX: auto-close after success
      // setTimeout(() => closeBookingModal(), 900);
    } catch (err) {
      console.error("Booking failed", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Booking failed. Please try again.";
      setBookingError(msg);
    } finally {
      setBookingLoading(false);
    }
  }

  async function handleFilterRooms() {
    if (!filterStart || !filterEnd) {
      setFilterError("Please select both check-in and check-out to filter rooms.");
      return;
    }
    if (filterStart >= filterEnd) {
      setFilterError("Check-in must be before check-out.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setFilterError("");

      const guestsNumber =
        filterGuests && !Number.isNaN(Number(filterGuests)) ? Number(filterGuests) : undefined;

      const data = await roomApi.getAvailableRooms(
        filterStart,
        filterEnd,
        guestsNumber,
        filterType || undefined
      );

      setRooms(data);
    } catch (err) {
      console.error("Failed to filter rooms", err);

      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err.message;

      setError(backendMsg || "Failed to filter rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetFilter() {
    setFilterStart("");
    setFilterEnd("");
    setFilterGuests("");
    setFilterType("");
    setFilterError("");
    await fetchRooms();
  }

  // cheap “stats” to make the hero feel real
  const stats = useMemo(() => {
    const total = rooms.length;
    const available = rooms.filter((r) => r.status === "AVAILABLE").length;
    const suites = rooms.filter((r) => r.type === "SUITE").length;
    return { total, available, suites };
  }, [rooms]);

  return (
    <div className="rooms-page">
      {/* HERO */}
      <section className="hero">
        <div className="hero__overlay" />
        <div className="hero__content">
          <div className="hero__left">
            <p className="hero__eyebrow">Modern Hotel Booking</p>
            <h1 className="hero__title">{hero?.title || "Welcome to Our Hotel"}</h1>
            <p className="hero__subtitle">
              {hero?.subtitle ||
                "Browse available rooms, choose your dates, and confirm your stay in just a few clicks."}
            </p>

            <div className="hero__chips">
              <span className="chip">🛏️ Instant room overview</span>
              <span className="chip">📅 Conflict prevention</span>
              <span className="chip">⚡ Fast booking flow</span>
            </div>

            <div className="hero__stats">
              <div className="stat">
                <div className="stat__num">{stats.total}</div>
                <div className="stat__label">Rooms shown</div>
              </div>
              <div className="stat">
                <div className="stat__num">{stats.available}</div>
                <div className="stat__label">Available now</div>
              </div>
              <div className="stat">
                <div className="stat__num">{stats.suites}</div>
                <div className="stat__label">Suites</div>
              </div>
            </div>
          </div>

          <aside className="hero__card">
            <p className="hero__cardTitle">Need help with a reservation?</p>
            <p className="hero__cardText">
              Contact our front desk for group stays, events, and special requests.
            </p>
            <div className="hero__contact">
              <div>📞 <strong>{contact?.phone || "+389 70 000 000"}</strong></div>
              <div>📧 {contact?.email || "info@hotel.example"}</div>
              <div>📍 {contact?.address || "Your City, Your Country"}</div>
            </div>
          </aside>
        </div>

        {/* SEARCH CARD */}
        <div className="searchCard">
          <div className="searchCard__grid">
            <div className="field">
              <label className="label" htmlFor="filterCheckIn">Check-in</label>
              <input
                id="filterCheckIn"
                className="input"
                type="date"
                value={filterStart}
                onChange={(e) => setFilterStart(e.target.value)}
                onFocus={(e) => typeof e.target.showPicker === "function" && e.target.showPicker()}
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="filterCheckOut">Check-out</label>
              <input
                id="filterCheckOut"
                className="input"
                type="date"
                value={filterEnd}
                onChange={(e) => setFilterEnd(e.target.value)}
                onFocus={(e) => typeof e.target.showPicker === "function" && e.target.showPicker()}
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="filterGuests">Guests</label>
              <input
                id="filterGuests"
                className="input"
                type="number"
                min="1"
                placeholder="e.g. 2"
                value={filterGuests}
                onChange={(e) => setFilterGuests(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="filterType">Room type</label>
              <select
                id="filterType"
                className="input"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Any</option>
                <option value="SINGLE">Single</option>
                <option value="DOUBLE">Double</option>
                <option value="SUITE">Suite</option>
              </select>
            </div>

            <div className="searchCard__actions">
              <button className="btn btn--primary" onClick={handleFilterRooms}>
                Search
              </button>
              <button className="btn btn--ghost" onClick={handleResetFilter}>
                Reset
              </button>
            </div>
          </div>

          {filterError && <p className="errorText">{filterError}</p>}
        </div>
      </section>

      {/* CONTENT */}
      <section className="section">
        {loading && <p className="muted">Loading rooms...</p>}
        {!loading && error && <p className="errorText">{error}</p>}

        {!loading && !error && (
          <>
            <div className="section__header">
              <div>
                <h2 className="section__title">Rooms</h2>
                <p className="section__subtitle">
                  Choose a room and book instantly. Date conflicts are prevented automatically.
                </p>
              </div>

              <div className="section__hint">
                Tip: pick dates first, then open a room — it pre-fills the booking modal.
              </div>
            </div>

            {rooms.length === 0 ? (
              <div className="empty">
                <div className="empty__title">No rooms found</div>
                <div className="empty__text">Try different dates or reset filters.</div>
                <button className="btn btn--ghost" onClick={handleResetFilter}>
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid">
                {rooms.map((room) => (
                  <article key={room.id} className="roomCard">
                    <div className="roomCard__image">
                      {/* Placeholder “image”. Later you can replace with real photos per room */}
                      <div className="roomCard__imageOverlay" />
                      <div className="roomCard__imageText">
                        {formatRoomType(room.type)} • #{room.roomNumber}
                      </div>
                    </div>

                    <div className="roomCard__body">
                      <div className="roomCard__top">
                        <div>
                          <h3 className="roomCard__title">
                            Room {room.roomNumber}
                            <span className="roomCard__type">({formatRoomType(room.type)})</span>
                          </h3>
                          <div className="roomCard__meta">
                            <span>👤 {room.capacity} guest{room.capacity > 1 ? "s" : ""}</span>
                            <span>•</span>
                            <span className="price">{room.pricePerNight} € / night</span>
                          </div>
                        </div>

                        <span className={statusClass(room.status)}>{statusLabel(room.status)}</span>
                      </div>

                      {room.description && <p className="roomCard__desc">{room.description}</p>}

                      <div className="roomCard__actions">
                        <button
                          className={`btn btn--primary ${room.status === "AVAILABLE" ? "" : "btn--disabled"}`}
                          onClick={() => room.status === "AVAILABLE" && openBookingModal(room)}
                          disabled={room.status !== "AVAILABLE"}
                        >
                          {room.status === "AVAILABLE" ? "Book now" : "Not available"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* MODAL */}
      {selectedRoom && (
        <div className="modalBackdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal__header">
              <div>
                <h3 className="modal__title">
                  Book Room {selectedRoom.roomNumber}{" "}
                  <span className="modal__type">({formatRoomType(selectedRoom.type)})</span>
                </h3>
                <p className="modal__subtitle">
                  {selectedRoom.capacity} guest{selectedRoom.capacity > 1 ? "s" : ""} •{" "}
                  {selectedRoom.pricePerNight} €/night
                </p>
              </div>

              <button className="iconBtn" onClick={closeBookingModal} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="modal__body">
              <div className="modalGrid">
                <div className="field">
                  <label className="label" htmlFor="checkIn">Check-in</label>
                  <input
                    id="checkIn"
                    className="input"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    onFocus={(e) => typeof e.target.showPicker === "function" && e.target.showPicker()}
                  />
                </div>

                <div className="field">
                  <label className="label" htmlFor="checkOut">Check-out</label>
                  <input
                    id="checkOut"
                    className="input"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    onFocus={(e) => typeof e.target.showPicker === "function" && e.target.showPicker()}
                  />
                </div>
              </div>

              {bookingError && <p className="errorText">{bookingError}</p>}
              {bookingSuccess && <p className="successText">{bookingSuccess}</p>}
            </div>

            <div className="modal__footer">
              <button
                className={`btn btn--success ${bookingLoading ? "btn--disabled" : ""}`}
                onClick={handleSubmitBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? "Booking..." : "Confirm booking"}
              </button>

              <button className="btn btn--ghost" onClick={closeBookingModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
