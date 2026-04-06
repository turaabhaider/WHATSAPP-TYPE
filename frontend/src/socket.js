import { io } from "socket.io-client";

// This URL must match your deployed backend on Railway
const PROD_URL = "https://whatsapp-backend-production-7ada.up.railway.app";
const DEV_URL = "http://localhost:3000";

// Use the environment variable if it exists, otherwise check if we are in production
const URL = import.meta.env.VITE_BACKEND_URL || 
            (import.meta.env.PROD ? PROD_URL : DEV_URL);

export const socket = io(URL, {
  withCredentials: true,
  transports: ["polling", "websocket"] 
});

console.log("Connecting to socket at:", URL);