// ChatComponent.jsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const token = localStorage.getItem('token');

  const getUserId = () => {
    try {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      return payload.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    const userId = getUserId();
    const newSocket = io('http://localhost:4000');

    newSocket.on('connect', () => {
      setIsOnline(true);
      newSocket.emit('join', {
        userId: userId,
        role: 'user'
      });
    });

    newSocket.on('disconnect', () => {
      setIsOnline(false);
    });

    newSocket.on('newMessage', (messageData) => {
      setMessages(prev => [...prev, { ...messageData, timestamp: new Date().toLocaleTimeString() }]);
    });

    newSocket.on('receiveMessage', (messageData) => {
      setMessages(prev => [...prev, { ...messageData, timestamp: new Date().toLocaleTimeString() }]);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [token]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!socket || !message.trim()) return;

    const userId = getUserId();
    const messageData = {
      sender: userId,
      receiver: 'admin',
      message: message,
      timestamp: new Date().toLocaleTimeString()
    };
    
    socket.emit('sendMessage', messageData);
    setMessages(prev => [...prev, messageData]);
    setMessage('');
  };

  return (
    <div className="chat-section">
      <div className="chat-title">
  <h1>Chat With Our Team</h1>
  <p>We typically reply within minutes</p>
</div>
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-info">
            <h2>Customer Support</h2>
            <span className={`status ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="header-actions">
           
          </div>
        </div>

        <div className="messages-container">
          <div className="welcome-message">
            <div className="welcome-header">
              <span className="welcome-icon">👋</span>
              <h3>Welcome to Support Chat</h3>
            </div>
            <p>How can we help you today?</p>
          </div>

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === getUserId() ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p>{msg.message}</p>
                <span className="timestamp">{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="message-form">
          <div className="input-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="message-input"
            />
            <button type="button" className="attachment-btn">📎</button>
          </div>
          <button type="submit" className="send-button">
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;