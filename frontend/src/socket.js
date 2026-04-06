import { io } from "socket.io-client";

// HARDCODE the URL as a backup to stop the localhost:5000 errors
const BACKEND_URL = "https://whatsapp-backend-production-7ada.up.railway.app";

export const socket = io(BACKEND_URL, {
  withCredentials: true,
  transports: ["polling", "websocket"]
});