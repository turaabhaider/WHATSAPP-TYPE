const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// This allows both your Localhost and your Railway Frontend to connect
const allowedOrigins = [
  "http://localhost:5173",
  "https://whatsapp-type-production.up.railway.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Create the server and start listening immediately
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Attach Socket.io to the running server
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
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
    
    // Send to EVERYONE so the list updates instantly
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
      console.log(`Message delivered to ${receiverData.username}`);
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
    const userList = Array.from(onlineUsers.entries()).map(([id, data]) => ({ 
      id, 
      username: data.username 
    }));
    io.emit('update_user_list', userList);
  });
});