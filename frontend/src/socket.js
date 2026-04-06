import { io } from "socket.io-client";

// HARDCODED - Stop the localhost:5000 errors immediately
const BACKEND_URL = "https://whatsapp-backend-production-7ada.up.railway.app";

export const socket = io(BACKEND_URL, {
  withCredentials: true,
  transports: ["polling", "websocket"]
});

console.log("Socket system initialized to:", BACKEND_URL);