import React, { createContext, useContext, useEffect } from 'react';
import { socket } from '../socket';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, userId, username }) => {
  useEffect(() => {
    if (!userId) return;

    socket.connect(); // Now connect

    const onConnect = () => {
      console.log("Connected!");
      socket.emit('user_online', { id: userId, username });
    };

    if (socket.connected) onConnect();
    socket.on('connect', onConnect);

    return () => {
      socket.off('connect', onConnect);
      socket.disconnect();
    };
  }, [userId, username]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};