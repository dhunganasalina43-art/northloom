import axios from "axios";

/**
 * Shared Axios instance used by every service module. `withCredentials`
 * ensures the httpOnly "access_token" cookie set by the API is sent on
 * every request, which is how the backend recognises a logged-in user.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

export default api;
