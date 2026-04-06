import { io } from "socket.io-client";

const BACKEND_URL = "https://whatsapp-backend-production-7ada.up.railway.app";

export const socket = io(BACKEND_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"], // websocket FIRST
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  path: "/socket.io/",           // explicit path
  forceNew: true
});

console.log("Socket initialized to:", BACKEND_URL);