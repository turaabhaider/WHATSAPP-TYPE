import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://whatsapp-backend-production-7ada.up.railway.app";

console.log("DEBUG: Connecting to Socket at:", BACKEND_URL);

export const socket = io(BACKEND_URL, {
  withCredentials: true,
  transports: ["polling", "websocket"],
  reconnectionAttempts: 5
});