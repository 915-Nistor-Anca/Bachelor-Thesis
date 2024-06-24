import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './GroupChat.css';

function GroupChat() {
  const { eventId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [usernames, setUsernames] = useState({});

  const getUserIdFromCookie = () => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const userCookie = cookies.find(cookie => cookie[0] === 'user_id');
    return userCookie ? userCookie[1] : null;
  };

  const fetchUsernames = async (userIds) => {
    try {
      const usernamesMap = {};
      await Promise.all(userIds.map(async (userId) => {
        if (!usernamesMap[userId] && !usernames[userId]) {
          const response = await fetch(`http://127.0.0.1:8000/polaris/users/${userId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch user data for user ID: ${userId}`);
          }
          const userData = await response.json();
          usernamesMap[userId] = userData.username;
        }
      }));
      setUsernames(prevUsernames => ({ ...prevUsernames, ...usernamesMap }));
    } catch (error) {
      console.error('Error fetching usernames:', error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/polaris/messages/?chat=${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data);
        fetchUsernames(data.map(msg => msg.user));
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [eventId]);

  const sendMessage = async () => {
    const userId = getUserIdFromCookie();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/polaris/messages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({
          content: newMessage,
          chat: eventId,
          user: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const message = await response.json();
      setMessages([...messages, message]);
      setNewMessage('');
      if (!usernames[userId]) {
        fetchUsernames([userId]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getCsrfToken = () => {
    let token = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, 10) === 'csrftoken=') {
          token = decodeURIComponent(cookie.substring(10));
          break;
        }
      }
    }
    return token;
  };

  const userId = getUserIdFromCookie();

  return (
    <div className="group-chat-container">
      <div className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.user == userId ? 'user-message' : 'other-message'}`}
          >
            <p><strong>{usernames[message.user] || 'Unknown User'}</strong>: {message.content}</p>
          </div>
        ))}
      </div>
      <div className="new-message-container">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button className='button_msg' onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default GroupChat;
