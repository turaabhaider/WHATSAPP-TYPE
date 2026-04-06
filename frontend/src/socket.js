import { io } from "socket.io-client";

// This will use the Railway variable in production or localhost in development
const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const socket = io(URL, {
  withCredentials: true
});