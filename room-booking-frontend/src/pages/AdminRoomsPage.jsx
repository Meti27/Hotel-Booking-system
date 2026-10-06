import { useEffect, useMemo, useState } from "react";
import { roomApi } from "../api/roomApi";
import { hotelConfig } from "../config/hotelConfig";
import "../styles/adminRooms.css";

const ROOM_TYPES = ["SINGLE", "DOUBLE", "SUITE"];
const ROOM_STATUS = ["AVAILABLE", "OCCUPIED", "MAINTENANCE"];

function badgeClass(status) {
  if (status === "AVAILABLE") return "badge badge--success";
  if (status === "OCCUPIED") return "badge badge--warning";
  if (status === "MAINTENANCE") return "badge badge--muted";
  return "badge badge--muted";
}

function typePill(type) {
  const map = { SINGLE: "Single", DOUBLE: "Double", SUITE: "Suite" };
  return map[type] || type;
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // create form state
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
      setRoomNumber("");
      setDescription("");
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
    const ok = window.confirm("Are you sure you want to delete this room?");
    if (!ok) return;

    try {
      await roomApi.deleteRoom(roomId);
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
    } catch (err) {
      console.error("Failed to delete room", err);
      alert("Failed to delete room.");
    }
  }

  const stats = useMemo(() => {
    const total = rooms.length;
    const available = rooms.filter((r) => r.status === "AVAILABLE").length;
    const occupied = rooms.filter((r) => r.status === "OCCUPIED").length;
    const maintenance = rooms.filter((r) => r.status === "MAINTENANCE").length;
    return { total, available, occupied, maintenance };
  }, [rooms]);

  return (
    <div className="adminPage">
      <header className="adminHeader">
        <div>
          <h1 className="adminTitle">Admin • Rooms</h1>
          <p className="adminSubtitle">
            Manage rooms for <strong>{shortName}</strong>: create, view, and delete.
          </p>
        </div>

        <div className="adminStats">
          <div className="statCard">
            <div className="statNum">{stats.total}</div>
            <div className="statLabel">Total rooms</div>
          </div>
          <div className="statCard">
            <div className="statNum">{stats.available}</div>
            <div className="statLabel">Available</div>
          </div>
          <div className="statCard">
            <div className="statNum">{stats.occupied}</div>
            <div className="statLabel">Occupied</div>
          </div>
          <div className="statCard">
            <div className="statNum">{stats.maintenance}</div>
            <div className="statLabel">Maintenance</div>
          </div>
        </div>
      </header>

      {/* Create form */}
      <section className="panel">
        <div className="panelHeader">
          <h2 className="panelTitle">Create room</h2>
          <p className="panelHint">Add new rooms to inventory.</p>
        </div>

        <form onSubmit={handleCreateRoom} className="formGrid">
          <div className="field">
            <label className="label">Room number</label>
            <input
              className="input"
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="e.g. 101"
            />
          </div>

          <div className="field">
            <label className="label">Type</label>
            <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
              {ROOM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {typePill(t)}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Capacity</label>
            <input
              className="input"
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">Price / night (€)</label>
            <input
              className="input"
              type="number"
              min="1"
              step="1"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">Status</label>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              {ROOM_STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="field spanAll">
            <label className="label">Description (optional)</label>
            <textarea
              className="input textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the room"
            />
          </div>

          <div className="spanAll">
            {saveError && <p className="errorText">{saveError}</p>}
            {saveSuccess && <p className="successText">{saveSuccess}</p>}

            <button className={`btn btn--primary ${saving ? "btn--disabled" : ""}`} disabled={saving}>
              {saving ? "Creating..." : "Create room"}
            </button>
          </div>
        </form>
      </section>

      {/* Rooms list */}
      <section className="panel">
        <div className="panelHeader">
          <h2 className="panelTitle">All rooms</h2>
          <p className="panelHint">View, filter (later), and delete rooms.</p>
        </div>

        {loading ? (
          <p className="muted">Loading rooms...</p>
        ) : error ? (
          <p className="errorText">{error}</p>
        ) : rooms.length === 0 ? (
          <div className="empty">
            <div className="empty__title">No rooms found</div>
            <div className="empty__text">Create the first room above.</div>
          </div>
        ) : (
          <>
            {/* Desktop / tablet table */}
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Room</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Price/night</th>
                    <th>Status</th>
                    <th>Description</th>
                    <th className="right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id}>
                      <td>{room.id}</td>
                      <td className="strong">#{room.roomNumber}</td>
                      <td>{typePill(room.type)}</td>
                      <td>{room.capacity}</td>
                      <td className="strong">{room.pricePerNight} €</td>
                      <td>
                        <span className={badgeClass(room.status)}>{room.status}</span>
                      </td>
                      <td className="descCell">
                        {room.description || <span className="mutedSmall">—</span>}
                      </td>
                      <td className="right">
                        <button className="btn btn--danger" onClick={() => handleDeleteRoom(room.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="mobileCards">
              {rooms.map((room) => (
                <article key={room.id} className="roomMiniCard">
                  <div className="roomMiniTop">
                    <div>
                      <div className="roomMiniTitle">Room #{room.roomNumber}</div>
                      <div className="roomMiniMeta">
                        {typePill(room.type)} • {room.capacity} guest{room.capacity > 1 ? "s" : ""} •{" "}
                        <span className="strong">{room.pricePerNight} €</span>
                      </div>
                    </div>
                    <span className={badgeClass(room.status)}>{room.status}</span>
                  </div>

                  {room.description && <p className="roomMiniDesc">{room.description}</p>}

                  <div className="roomMiniActions">
                    <button className="btn btn--danger btn--block" onClick={() => handleDeleteRoom(room.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
