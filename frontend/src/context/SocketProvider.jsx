import React, { createContext, useContext, useEffect } from 'react';
// IMPORT the single socket instance from your socket.js file
import { socket } from './socket'; 

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, userId, username }) => {

  useEffect(() => {
    // 1. Check if we have the socket and a valid user
    if (socket && userId) {
      
      const onConnect = () => {
        console.log("SUCCESS: Connected to Railway Backend via Provider");
        // 2. Register the user as online
        socket.emit('user_online', { id: userId, username: username });
      };

      // Handle connection logic
      if (socket.connected) {
        onConnect();
      }

      socket.on('connect', onConnect);

      // 3. Cleanup to prevent memory leaks and multiple connections
      return () => {
        socket.off('connect', onConnect);
      };
    }
  }, [userId, username]);

  // FIX: Destructuring will now work correctly in other components
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};