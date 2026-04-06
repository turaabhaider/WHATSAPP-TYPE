import React, { useState } from "react";
import "./index.css";
import { SocketProvider } from "./context/SocketProvider";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeContact, setActiveContact] = useState(null);
  const [loginInput, setLoginInput] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginInput.trim()) {
      setCurrentUser({
        id: String(Date.now()), // String ID for consistency
        username: loginInput,
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="Logo" width="60" />
          <h2>Enter your name to join</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username..."
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              required
            />
            <button type="submit">Start Chatting</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <SocketProvider userId={currentUser.id} username={currentUser.username}>
      <div className="app-container">
        <Sidebar 
          currentUser={currentUser} 
          activeContact={activeContact} 
          setActiveContact={setActiveContact} 
        />
        <div className="main-content">
          {activeContact ? (
            <ChatWindow currentUser={currentUser} activeContact={activeContact} />
          ) : (
            <div className="empty-state-container">
               <h1>WhatsApp Web Clone</h1>
               <p>Select a user to start a conversation.</p>
            </div>
          )}
        </div>
      </div>
    </SocketProvider>
  );
}

export default App;