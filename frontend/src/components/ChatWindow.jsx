import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketProvider';

const ChatWindow = ({ currentUser, activeContact }) => {
    const { socket } = useSocket(); 
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // 1. Always keep the server updated on who we are
    useEffect(() => {
        if (socket && currentUser) {
            socket.emit('user_online', currentUser);
        }
    }, [socket, currentUser]);

    // 2. Persistent Listener for receiving messages
    useEffect(() => {
        if (!socket) return;

        // Remove old listener to prevent duplicates
        socket.off('receive_message');
        
        socket.on('receive_message', (msg) => {
            console.log("Message arrived in frontend:", msg);
            // Use functional update to ensure we have latest state
            setMessages((prev) => [...prev, msg]);
        });

        return () => socket.off('receive_message');
    }, [socket]); // Only reset if socket connection changes

    // 3. Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, activeContact]);

    const handleSend = (e) => {
        if (e) e.preventDefault();
        if (!socket || !newMessage.trim() || !activeContact) return;

        const data = {
            sender_id: String(currentUser.id),
            receiver_id: String(activeContact.id),
            text: newMessage,
        };

        // Emit to server
        socket.emit('send_message', data);
        
        // Add locally so it shows up instantly for me
        const localMsg = { 
            ...data, 
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        setMessages((prev) => [...prev, localMsg]);
        setNewMessage('');
    };

    // 4. Filter logic: Ensure we only see the current conversation
    const chatHistory = messages.filter(m => 
        (String(m.sender_id) === String(currentUser.id) && String(m.receiver_id) === String(activeContact.id)) ||
        (String(m.sender_id) === String(activeContact.id) && String(m.receiver_id) === String(currentUser.id))
    );

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h3>{activeContact.username}</h3>
            </div>
            
            <div className="message-area">
                {chatHistory.length > 0 ? chatHistory.map((msg, i) => (
                    <div key={i} className={`message ${String(msg.sender_id) === String(currentUser.id) ? 'sent' : 'received'}`}>
                        <div className="bubble">
                            <p>{msg.text}</p>
                            <span className="time">{msg.timestamp}</span>
                        </div>
                    </div>
                )) : <p className="no-msgs">No messages yet. Say hi!</p>}
                <div ref={messagesEndRef} />
            </div>

           <form onSubmit={handleSend} className="chat-footer">
    <input 
        className="chat-input" // <--- Add this class
        value={newMessage} 
        onChange={(e) => setNewMessage(e.target.value)} 
        placeholder="Type a message..."
    />
    <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
        Send
    </button>
</form>
        </div>
    );
};

export default ChatWindow;