import { io } from "socket.io-client";

// This line tells Vite to use the Railway variable if it exists, 
// otherwise it uses the hardcoded string as a backup.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://whatsapp-backend-production-7ada.up.railway.app";

export const socket = io(BACKEND_URL, {
  withCredentials: true,
  transports: ["polling", "websocket"]
});