import React, { createContext, useContext, useEffect } from 'react';
// Import the socket we already configured in socket.js
import { socket } from './socket'; 

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, userId, username }) => {

  useEffect(() => {
    // Only run this if the socket exists and we have user data
    if (socket && userId) {
      
      const onConnect = () => {
        console.log("Connected to Railway Backend!");
        socket.emit('user_online', { id: userId, username: username });
      };

      // If already connected, emit immediately
      if (socket.connected) {
        onConnect();
      }

      socket.on('connect', onConnect);

      return () => {
        socket.off('connect', onConnect);
      };
    }
  }, [userId, username]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};