import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketProvider';
import { Search } from 'lucide-react';

const Sidebar = ({ currentUser, activeContact, setActiveContact }) => {
    const { socket } = useSocket(); // Correct destructuring
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!socket) return;

        socket.on('update_user_list', (userList) => {
            // Filter out self using String comparison
            const otherUsers = userList.filter(u => String(u.id) !== String(currentUser.id));
            setUsers(otherUsers);
        });

        return () => socket.off('update_user_list');
    }, [socket, currentUser.id]);

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="user-profile">
                    <div className="avatar-circle">{currentUser.username[0].toUpperCase()}</div>
                    <span>{currentUser.username} (You)</span>
                </div>
            </div>
            <div className="search-container">
                <div className="search-bar">
                    <Search size={16} />
                    <input placeholder="Search users..." onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>
            <div className="contact-list">
                {users.length === 0 ? (
                    <p style={{padding: '20px', color: '#667781'}}>No one else is online...</p>
                ) : (
                    users.filter(u => u.username.toLowerCase().includes(search.toLowerCase())).map(user => (
                        <div 
                            key={user.id} 
                            className={`contact-item ${activeContact?.id === user.id ? 'active' : ''}`}
                            onClick={() => setActiveContact(user)}
                        >
                            <div className="avatar-circle">{user.username[0].toUpperCase()}</div>
                            <div className="contact-meta">
                                <h4>{user.username}</h4>
                                <p className="online-status">Online</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Sidebar;