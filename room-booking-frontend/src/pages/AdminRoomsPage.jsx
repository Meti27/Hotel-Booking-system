import { useEffect, useState } from "react";
import { roomApi } from "../api/roomApi";
import { hotelConfig } from "../config/hotelConfig";

const ROOM_TYPES = ["SINGLE", "DOUBLE", "SUITE"];
const ROOM_STATUS = ["AVAILABLE", "OCCUPIED", "MAINTENANCE"];

function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form state for creating a room
  const [roomNumber, setRoomNumber] = useState("");
  const [type, setType] = useState("SINGLE");
  const [capacity, setCapacity] = useState(1);
  const [pricePerNight, setPricePerNight] = useState(40);
  const [status, setStatus] = useState("AVAILABLE");
  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const { shortName } = hotelConfig;

  // load rooms on mount
  useEffect(() => {
    fetchRooms();
  }, []);

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

  async function handleCreateRoom(e) {
    e.preventDefault();

    if (!roomNumber) {
      setSaveError("Room number is required.");
      return;
    }

    if (!capacity || capacity <= 0) {
      setSaveError("Capacity must be at least 1.");
      return;
    }

    if (!pricePerNight || pricePerNight <= 0) {
      setSaveError("Price per night must be greater than 0.");
      return;
    }

    const payload = {
      roomNumber,
      type,
      capacity: Number(capacity),
      pricePerNight: Number(pricePerNight),
      status,
      description: description || null,
    };

    try {
      setSaving(true);
      setSaveError("");
      setSaveSuccess("");

      await roomApi.createRoom(payload);

      setSaveSuccess("Room created successfully.");
      // reset minimal fields
      setRoomNumber("");
      setDescription("");
      // refresh list
      await fetchRooms();
    } catch (err) {
      console.error("Failed to create room", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to create room.";
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteRoom(roomId) {
    const confirm = window.confirm(
      "Are you sure you want to delete this room?"
    );
    if (!confirm) return;

    try {
      await roomApi.deleteRoom(roomId);
      // remove from local state without refetch or refetch, both fine
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
    } catch (err) {
      console.error("Failed to delete room", err);
      alert("Failed to delete room.");
    }
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui", color: "#f9fafb" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Admin – Rooms</h1>
      <p style={{ marginBottom: "1.5rem", opacity: 0.85 }}>
        Manage rooms for {shortName}: create, view and delete rooms.
      </p>

      {/* Create form */}
      <section
        style={{
          marginBottom: "2rem",
          padding: "1.5rem",
          borderRadius: "0.75rem",
          backgroundColor: "#111827",
          border: "1px solid #1f2937",
        }}
      >
        <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Create Room</h2>

        <form
          onSubmit={handleCreateRoom}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          <div>
            <label style={labelStyle}>Room Number</label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              style={inputStyle}
              placeholder="e.g. 101"
            />
          </div>

          <div>
            <label style={labelStyle}>Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={inputStyle}
            >
              {ROOM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Capacity</label>
            <input
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Price per night (€)</label>
            <input
              type="number"
              min="1"
              step="1"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={inputStyle}
            >
              {ROOM_STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
              placeholder="Short description of the room"
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            {saveError && (
              <p style={{ color: "#f97373", marginBottom: "0.5rem" }}>
                {saveError}
              </p>
            )}
            {saveSuccess && (
              <p style={{ color: "#4ade80", marginBottom: "0.5rem" }}>
                {saveSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#2563eb",
                color: "white",
                fontWeight: 600,
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Creating..." : "Create Room"}
            </button>
          </div>
        </form>
      </section>

      {/* Rooms list */}
      <section>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>All Rooms</h2>

        {loading ? (
          <p>Loading rooms...</p>
        ) : error ? (
          <p style={{ color: "#f97373" }}>{error}</p>
        ) : rooms.length === 0 ? (
          <p>No rooms found.</p>
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
                  <th style={thCell}>Room</th>
                  <th style={thCell}>Type</th>
                  <th style={thCell}>Capacity</th>
                  <th style={thCell}>Price/night</th>
                  <th style={thCell}>Status</th>
                  <th style={thCell}>Description</th>
                  <th style={thCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} style={{ borderTop: "1px solid #1f2937" }}>
                    <td style={tdCell}>{room.id}</td>
                    <td style={tdCell}>{room.roomNumber}</td>
                    <td style={tdCell}>{room.type}</td>
                    <td style={tdCell}>{room.capacity}</td>
                    <td style={tdCell}>{room.pricePerNight} €</td>
                    <td style={tdCell}>{room.status}</td>
                    <td style={tdCell}>
                      {room.description || <span style={{ opacity: 0.6 }}>—</span>}
                    </td>
                    <td style={tdCell}>
                      <button
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: "0.4rem",
                          border: "none",
                          cursor: "pointer",
                          backgroundColor: "#b91c1c",
                          color: "white",
                          fontSize: "0.85rem",
                        }}
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "0.25rem",
  fontSize: "0.85rem",
  opacity: 0.85,
};

const inputStyle = {
  width: "100%",
  padding: "0.45rem 0.5rem",
  borderRadius: "0.5rem",
  border: "1px solid #374151",
  backgroundColor: "#020617",
  color: "#e5e7eb",
  fontSize: "0.9rem",
};

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

export default AdminRoomsPage;
