import { io } from "socket.io-client";

const BACKEND_URL = "https://whatsapp-backend-production-7ada.up.railway.app";

export const socket = io(BACKEND_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  autoConnect: false  // Don't connect until we say so
});