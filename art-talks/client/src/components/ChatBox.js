import React, { useState, useEffect, useCallback } from 'react';
import './ChatBox.css';

function ChatBox({ socket }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket]);

  
  const sendMessage = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    socket.emit('send_message', { text: trimmedMessage });
    setMessage('');
  }, [message, socket]);

  
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    },
    [sendMessage]
  );

  
  const handleChange = useCallback((e) => {
    setMessage(e.target.value);
  }, []);

  return (
    <div className="chat">
      <div className="messages">
        {messages.map(({ text }, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;
