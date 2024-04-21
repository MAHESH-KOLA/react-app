import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chat, setChat] = useState([]);
  
  const updateChat = (newChat) => {
    setChat(newChat);
  };

  return (
    <ChatContext.Provider value={{ chat, updateChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
