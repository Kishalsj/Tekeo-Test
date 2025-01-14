import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './AdminChat.css'

const AdminChat = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:4000');

    newSocket.on('connect', () => {
      newSocket.emit('join', {
        userId: 'admin',
        role: 'admin'
      });
    });

    // Listen for new messages from users
    newSocket.on('newMessage', (messageData) => {
      setMessages(prev => [...prev, messageData]);
    });

    // Listen for user list updates
    newSocket.on('updateUserList', (userList) => {
      setUsers(userList);
    });

    setSocket(newSocket);

    // Request initial user list
    newSocket.emit('getUsers');

    return () => newSocket.disconnect();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!socket || !message.trim() || !selectedUser) return;

    const messageData = {
      adminId: 'admin',
      userId: selectedUser,
      message: message
    };
    
    socket.emit('sendAdminMessage', messageData);
    // Add message to local state
    setMessages(prev => [...prev, { ...messageData, sender: 'admin' }]);
    setMessage('');
  };

  return (
    <div className="grid grid-cols-4 h-[500px] max-w-6xl mx-auto p-4 gap-4">
      {/* Users list */}
      <div className="col-span-1 border rounded p-2 overflow-y-auto">
        <h2 className="font-bold mb-2">Users</h2>
        {users.map(user => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user._id)}
            className={`p-2 cursor-pointer rounded ${
              selectedUser === user._id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            {user.name}
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="col-span-3 border rounded p-4 flex flex-col">
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                msg.sender === 'admin' || msg.adminId === 'admin'
                  ? 'bg-blue-500 text-white ml-auto'
                  : 'bg-gray-200 mr-auto'
              } max-w-[70%]`}
            >
              {msg.message}
            </div>
          ))}
        </div>

        {/* Message input form */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={selectedUser ? "Type your message..." : "Select a user to chat"}
            className="flex-1 p-2 border rounded"
            disabled={!selectedUser}
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            disabled={!selectedUser}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminChat;