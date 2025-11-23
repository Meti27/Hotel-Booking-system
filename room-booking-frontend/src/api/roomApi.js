import axiosClient from "./axiosClient";

export const roomApi = {
  async getAllRooms() {
    const response = await axiosClient.get("/api/rooms");
    return response.data;
  },

  // Admin: create a new room
  async createRoom(payload) {
    const response = await axiosClient.post("/api/admin/rooms", payload);
    return response.data;
  },

  // Admin: delete a room by id
  async deleteRoom(roomId) {
    const response = await axiosClient.delete(`/api/admin/rooms/${roomId}`);
    return response.data;
  },

 // Admin: update room later if we want edit support
  async updateRoom(roomId, payload) {
    const response = await axiosClient.put(`/api/admin/rooms/${roomId}`, payload);
    return response.data;
  },
    async getAvailableRooms(checkIn, checkOut, guests, type) {
    const response = await axiosClient.get("/api/rooms/available", {
      params: {
        checkIn,
        checkOut,
        // only attach these if they exist (optional)
        ...(guests != null && { guests }),
        ...(type && { type }),
      },
    });
    return response.data;
  },
};
