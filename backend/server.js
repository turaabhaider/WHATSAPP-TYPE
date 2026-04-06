const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();


app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

const server = app.listen(process.env.PORT || 3000);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('user_online', (userData) => {
    if (!userData || !userData.id) return;
    
    const userId = String(userData.id);
    // Overwrite with latest socket ID
    onlineUsers.set(userId, { 
        username: userData.username, 
        socketId: socket.id 
    });
    
    console.log(`User Registered: ${userData.username} [ID: ${userId}] on socket ${socket.id}`);

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
      // Send to the specific receiver
      io.to(receiverData.socketId).emit('receive_message', payload);
      console.log(`Delivered to ${receiverData.username} (${receiverData.socketId})`);
    } else {
      console.log(`FAILED: Receiver ${receiverId} offline.`);
    }
  });

  socket.on('disconnect', () => {
    for (let [id, data] of onlineUsers.entries()) {
      if (data.socketId === socket.id) {
        onlineUsers.delete(id);
        console.log(`User ${data.username} disconnected.`);
        break;
      }
    }
    const userList = Array.from(onlineUsers.entries()).map(([id, data]) => ({ id, username: data.username }));
    io.emit('update_user_list', userList);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});