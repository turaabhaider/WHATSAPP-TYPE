import { io } from "socket.io-client";

// Ensure there is no trailing slash in the URL
const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const socket = io(URL, {
  withCredentials: true,
  transports: ["polling", "websocket"] // Force polling first to establish the CORS handshake
});