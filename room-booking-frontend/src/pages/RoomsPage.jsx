import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { roomApi } from "../api/roomApi";
import { bookingApi } from "../api/bookingApi";
import { hotelConfig } from "../config/hotelConfig";
import { useAuth } from "../auth/AuthContext";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking modal state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  // NEW: date filter state
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const [filterError, setFilterError] = useState("");
  const [filterGuests, setFilterGuests] = useState("");
  const [filterType, setFilterType] = useState("");
  const { hero, contact } = hotelConfig;
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // moved out of useEffect so we can reuse it
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

    // NEW: prefill modal dates from filter if user used the filter
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
      userId: user.id, // <- real logged-in user
      checkIn,
      checkOut,
    };

    try {
      setBookingLoading(true);
      setBookingError("");
      setBookingSuccess("");

      await bookingApi.createBooking(payload);

      setBookingSuccess("Booking successful!");
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

  // NEW: filter by date handler
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

    // parse guests as integer or leave undefined
    const guestsNumber =
      filterGuests && !Number.isNaN(Number(filterGuests))
        ? Number(filterGuests)
        : undefined;

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
  // NEW: reset filter (back to all rooms)
async function handleResetFilter() {
  setFilterStart("");
  setFilterEnd("");
  setFilterGuests("");
  setFilterType("");
  setFilterError("");
  await fetchRooms();
}

  if (loading) {
    return <p style={{ padding: "1rem" }}>Loading rooms...</p>;
  }

  if (error) {
    return <p style={{ padding: "1rem", color: "red" }}>{error}</p>;
  }

  return (
    <div
      style={{
        padding: "2rem 1.5rem 3rem",
        fontFamily: "system-ui",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      {/* HERO SECTION */}
      <section
        style={{
          marginBottom: "2rem",
          padding: "2rem",
          borderRadius: "1.25rem",
          background:
            "radial-gradient(circle at top left, #38bdf8 0, #0f172a 40%, #020617 100%)",
          color: "#f9fafb",
          boxShadow: "0 20px 40px rgba(15,23,42,0.8)",
          border: "1px solid rgba(148,163,184,0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: "1 1 260px", minWidth: "0" }}>
            <p
              style={{
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                opacity: 0.8,
                marginBottom: "0.5rem",
              }}
            >
              Modern Hotel Booking
            </p>
            <h1
              style={{
                fontSize: "2rem",
                lineHeight: 1.2,
                marginBottom: "0.5rem",
              }}
            >
              {hero?.title || "Welcome to Our Hotel"}
            </h1>
            <p
              style={{
                opacity: 0.9,
                fontSize: "0.95rem",
                maxWidth: "480px",
                marginBottom: "1rem",
              }}
            >
              {hero?.subtitle ||
                "Browse available rooms, choose your dates, and confirm your stay in just a few clicks."}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.9rem",
                  backgroundColor: "rgba(15,23,42,0.7)",
                  padding: "0.4rem 0.7rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(148,163,184,0.4)",
                }}
              >
                🛏️ Instant overview of available rooms
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.9rem",
                  backgroundColor: "rgba(15,23,42,0.7)",
                  padding: "0.4rem 0.7rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(148,163,184,0.4)",
                }}
              >
                📅 Smart booking with conflict prevention
              </span>
            </div>
          </div>

          <div
            style={{
              flex: "0 0 230px",
              alignSelf: "stretch",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "1rem",
              backgroundColor: "rgba(15,23,42,0.8)",
              borderRadius: "1rem",
              padding: "1rem 1.25rem",
              border: "1px solid rgba(148,163,184,0.3)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  opacity: 0.8,
                  marginBottom: "0.25rem",
                }}
              >
                Need help with a reservation?
              </p>
              <p style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                Contact our front desk directly for group stays, events, and
                special requests.
              </p>
            </div>
            <div style={{ fontSize: "0.9rem" }}>
              <p style={{ marginBottom: "0.25rem" }}>
                📞 <strong>{contact?.phone || "+389 70 000 000"}</strong>
              </p>
              <p style={{ marginBottom: "0.25rem" }}>
                📧 {contact?.email || "info@hotel.example"}
              </p>
              <p style={{ opacity: 0.85 }}>
                📍 {contact?.address || "Your City, Your Country"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: DATE FILTER SECTION */}
     <section
  style={{
    marginBottom: "1.5rem",
    padding: "1rem 1.25rem",
    borderRadius: "1rem",
    backgroundColor: "#020617",
    border: "1px solid #1f2937",
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    alignItems: "flex-end",
    justifyContent: "space-between",
  }}
>
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
    }}
  >
    {/* Check-in */}
    <div>
      <label
        htmlFor="filterCheckIn"
        style={{
          display: "block",
          marginBottom: "0.25rem",
          fontSize: "0.85rem",
          color: "#e5e7eb",
        }}
      >
        Check-in date
      </label>
      <input
        id="filterCheckIn"
        type="date"
        value={filterStart}
        onChange={(e) => setFilterStart(e.target.value)}
        onFocus={(e) => {
          if (typeof e.target.showPicker === "function") {
            e.target.showPicker();
          }
        }}
        style={modalInputStyle}
      />
    </div>

    {/* Check-out */}
    <div>
      <label
        htmlFor="filterCheckOut"
        style={{
          display: "block",
          marginBottom: "0.25rem",
          fontSize: "0.85rem",
          color: "#e5e7eb",
        }}
      >
        Check-out date
      </label>
      <input
        id="filterCheckOut"
        type="date"
        value={filterEnd}
        onChange={(e) => setFilterEnd(e.target.value)}
        onFocus={(e) => {
          if (typeof e.target.showPicker === "function") {
            e.target.showPicker();
          }
        }}
        style={modalInputStyle}
      />
    </div>

    {/* Guests */}
    <div>
      <label
        htmlFor="filterGuests"
        style={{
          display: "block",
          marginBottom: "0.25rem",
          fontSize: "0.85rem",
          color: "#e5e7eb",
        }}
      >
        Guests
      </label>
      <input
        id="filterGuests"
        type="number"
        min="1"
        value={filterGuests}
        onChange={(e) => setFilterGuests(e.target.value)}
        style={modalInputStyle}
        placeholder="e.g. 2"
      />
    </div>

    {/* Room type */}
    <div>
      <label
        htmlFor="filterType"
        style={{
          display: "block",
          marginBottom: "0.25rem",
          fontSize: "0.85rem",
          color: "#e5e7eb",
        }}
      >
        Room type
      </label>
      <select
        id="filterType"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        style={modalInputStyle}
      >
        <option value="">Any</option>
        <option value="SINGLE">Single</option>
        <option value="DOUBLE">Double</option>
        <option value="SUITE">Suite</option>
        {/* ⚠️ These must match your RoomType enum values exactly */}
      </select>
    </div>
  </div>

  <div
    style={{
      display: "flex",
      gap: "0.5rem",
      flexWrap: "wrap",
    }}
  >
    <button
      onClick={handleFilterRooms}
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "0.6rem",
        border: "none",
        backgroundColor: "#2563eb",
        color: "#f9fafb",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Search available rooms
    </button>

    <button
      onClick={handleResetFilter}
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "0.6rem",
        border: "1px solid #4b5563",
        backgroundColor: "#020617",
        color: "#e5e7eb",
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      Reset
    </button>
  </div>

  {filterError && (
    <p
      style={{
        width: "100%",
        marginTop: "0.5rem",
        color: "#f97373",
        fontSize: "0.85rem",
      }}
    >
      {filterError}
    </p>
  )}
</section>


      {/* ROOMS SECTION */}
      {rooms.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        <>
          <h2
            style={{
              marginBottom: "0.75rem",
              fontSize: "1.3rem",
              color: "#e5e7eb",
            }}
          >
            Available Rooms
          </h2>
          <p
            style={{
              marginBottom: "1.5rem",
              opacity: 0.85,
              fontSize: "0.95rem",
            }}
          >
            Choose a room type and start your booking. You’ll see conflicts
            prevented automatically if dates overlap with existing bookings.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {rooms.map((room) => (
              <div
                key={room.id}
                style={{
                  border: "1px solid #1f2937",
                  borderRadius: "0.9rem",
                  padding: "1rem",
                  boxShadow: "0 6px 20px rgba(15,23,42,0.6)",
                  background:
                    "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(15,23,42,0.8))",
                }}
              >
                <h2 style={{ marginBottom: "0.5rem", color: "#f9fafb" }}>
                  Room {room.roomNumber} ({room.type})
                </h2>
                <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                  <strong>Capacity:</strong> {room.capacity} guest
                  {room.capacity > 1 ? "s" : ""}
                </p>
                <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                  <strong>Price per night:</strong> {room.pricePerNight} €
                </p>
                <p
                  style={{
                    margin: "0.25rem 0",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color:
                      room.status === "AVAILABLE"
                        ? "#22c55e"
                        : room.status === "OCCUPIED"
                        ? "#f97316"
                        : "#9ca3af",
                  }}
                >
                  Status: {room.status}
                </p>
                {room.description && (
                  <p
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.9rem",
                      opacity: 0.95,
                      color: "#e5e7eb",
                    }}
                  >
                    {room.description}
                  </p>
                )}

                {/* Book button */}
                <button
                  style={{
                    marginTop: "0.9rem",
                    padding: "0.55rem 1rem",
                    background:
                      room.status === "AVAILABLE" ? "#2563eb" : "#4b5563",
                    color: "white",
                    border: "none",
                    borderRadius: "0.6rem",
                    cursor:
                      room.status === "AVAILABLE" ? "pointer" : "not-allowed",
                    width: "100%",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    opacity: room.status === "AVAILABLE" ? 1 : 0.7,
                  }}
                  onClick={() =>
                    room.status === "AVAILABLE" && openBookingModal(room)
                  }
                  disabled={room.status !== "AVAILABLE"}
                >
                  {room.status === "AVAILABLE" ? "Book Now" : "Not Available"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* BOOKING MODAL */}
      {selectedRoom && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#020617",
              padding: "2rem",
              borderRadius: "1.25rem",
              width: "350px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
              border: "1px solid #1f2937",
              color: "#f9fafb",
            }}
          >
            <h2 style={{ marginBottom: "0.5rem" }}>
              Book Room {selectedRoom.roomNumber}
            </h2>
            <p
              style={{
                marginBottom: "1rem",
                fontSize: "0.9rem",
                opacity: 0.85,
              }}
            >
              {selectedRoom.type} • {selectedRoom.capacity} guest
              {selectedRoom.capacity > 1 ? "s" : ""} •{" "}
              {selectedRoom.pricePerNight} €/night
            </p>

            <div style={{ marginBottom: "0.75rem" }}>
              <label
                htmlFor="checkIn"
                style={{
                  display: "block",
                  marginBottom: "0.25rem",
                  fontSize: "0.85rem",
                }}
              >
                Check-in date
              </label>
              <input
                id="checkIn"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                onFocus={(e) => {
                  if (typeof e.target.showPicker === "function") {
                    e.target.showPicker();
                  }
                }}
                style={modalInputStyle}
              />
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <label
                htmlFor="checkOut"
                style={{
                  display: "block",
                  marginBottom: "0.25rem",
                  fontSize: "0.85rem",
                }}
              >
                Check-out date
              </label>
              <input
                id="checkOut"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                onFocus={(e) => {
                  if (typeof e.target.showPicker === "function") {
                    e.target.showPicker();
                  }
                }}
                style={modalInputStyle}
              />
            </div>

            {bookingError && (
              <p
                style={{
                  color: "#f97373",
                  fontSize: "0.85rem",
                  marginBottom: "0.5rem",
                }}
              >
                {bookingError}
              </p>
            )}

            {bookingSuccess && (
              <p
                style={{
                  color: "#4ade80",
                  fontSize: "0.85rem",
                  marginBottom: "0.5rem",
                }}
              >
                {bookingSuccess}
              </p>
            )}

            <button
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "0.6rem",
                cursor: "pointer",
                width: "100%",
                opacity: bookingLoading ? 0.7 : 1,
                fontWeight: 600,
              }}
              onClick={handleSubmitBooking}
              disabled={bookingLoading}
            >
              {bookingLoading ? "Booking..." : "Confirm Booking"}
            </button>

            <button
              style={{
                marginTop: "0.5rem",
                width: "100%",
                padding: "0.5rem",
                background: "#4b5563",
                color: "white",
                borderRadius: "0.6rem",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
              }}
              onClick={closeBookingModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const modalInputStyle = {
  width: "100%",
  padding: "0.4rem 0.5rem",
  borderRadius: "0.5rem",
  border: "1px solid #374151",
  backgroundColor: "#020617",
  color: "#e5e7eb",
  fontSize: "0.9rem",
};

export default RoomsPage;
