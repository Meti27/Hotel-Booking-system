import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080", // Spring Boot backend
});

// (optional) you can add interceptors later for JWT tokens

export default axiosClient;
