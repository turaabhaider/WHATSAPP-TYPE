const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// HARDCODED ORIGINS - No room for error
const allowedOrigins = [
  "http://localhost:5173",
  "https://whatsapp-type-production.up.railway.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

const PORT = process.env.PORT || 3000;

// Step 1: Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Step 2: Attach Socket.io with hardcoded CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
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
    
    const userList = Array.from(onlineUsers.entries()).map(([id, data]) => ({
      id,
      username: data.username
    }));
    io.emit('update_user_list', userList);
  });

  socket.on('send_message', (data) => {
    const receiverData = onlineUsers.get(String(data.receiver_id));
    if (receiverData) {
      io.to(receiverData.socketId).emit('receive_message', {
        sender_id: String(data.sender_id),
        receiver_id: String(data.receiver_id),
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  });

  socket.on('disconnect', () => {
    for (let [id, data] of onlineUsers.entries()) {
      if (data.socketId === socket.id) {
        onlineUsers.delete(id);
        break;
      }
    }
    const userList = Array.from(onlineUsers.entries()).map(([id, data]) => ({ id, username: data.username }));
    io.emit('update_user_list', userList);
  });
});