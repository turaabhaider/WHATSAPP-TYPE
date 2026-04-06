import { io } from "socket.io-client";

// Hardcoded for production to avoid environment variable build failures
const BACKEND_URL = "https://whatsapp-backend-production-7ada.up.railway.app";

export const socket = io(BACKEND_URL, {
  withCredentials: true,
  transports: ["polling", "websocket"]
});

console.log("Socket initialized to:", BACKEND_URL);