import axiosClient from "./axiosClient";

export const bookingApi = {
  async createBooking(payload) {
    const response = await axiosClient.post("/api/bookings", payload);
    return response.data;
  },

  async getBookingsForUser(userId) {
    const response = await axiosClient.get(`/api/bookings/user/${userId}`);
    return response.data;
  },

  async getAllBookings() {
    const response = await axiosClient.get("/api/bookings/admin");
    return response.data;
  },

  async cancelBooking(id) {
    const response = await axiosClient.post(`/api/bookings/${id}/cancel`);
    return response.data;
  },
};
