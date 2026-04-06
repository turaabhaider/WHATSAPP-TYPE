// src/socket.js
import { io } from "socket.io-client";

// This uses localhost in development, and the live Railway backend URL in production
const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"); 

export default socket;