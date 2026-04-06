const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// Use an array for origins to support both local and production
const allowedOrigins = [
  "http://localhost:5173",
  "https://whatsapp-type-production.up.railway.app"
];

// 1. Express CORS Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 2. Socket.io CORS Configuration (CRITICAL FIX HERE)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true // This MUST match the frontend withCredentials setting
  }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('user_online', (userData) => {
    if (!userData || !userData.id) return;
    
    const userId = String(userData.id);
    onlineUsers.set(userId, { 
        username: userData.username, 
        socketId: socket.id 
    });
    
    console.log(`User Registered: ${userData.username} [ID: ${userId}]`);

    const userList = Array.from(onlineUsers.entries()).map(([id, data]) => ({
      id,
      username: data.username
    }));
    
    io.emit('update_user_list', userList);
  });

  socket.on('send_message', (data) => {
    const receiverId = String(data.receiver_id);
    const receiverData = onlineUsers.get(receiverId);

    const payload = {
      sender_id: String(data.sender_id),
      receiver_id: receiverId,
      text: data.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (receiverData) {
      io.to(receiverData.socketId).emit('receive_message', payload);
    }
  });

  socket.on('disconnect', () => {
    for (let [id, data] of onlineUsers.entries()) {
      if (data.socketId === socket.id) {
        onlineUsers.delete(id);
        break;
      }
    }
    const userList = Array.from(onlineUsers.entries()).map(([id, data]) => ({ 
      id, 
      username: data.username 
    }));
    io.emit('update_user_list', userList);
  });
});