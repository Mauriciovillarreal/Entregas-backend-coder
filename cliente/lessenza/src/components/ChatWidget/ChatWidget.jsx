import React, { useState } from 'react';
import "./ChatWidget.css";
import Chat from '../Chat/Chat';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='chatContainer'>
      <div className='chatWidget' onClick={toggleChat}>
        <img src="../img/chat.png" alt="Chat Icon" />
      </div>
      {isOpen && (
        <div className='chatPopup'>
          <Chat />
        </div>
      )}
    </div>
  );
};
