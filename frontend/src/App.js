import './App.css';
import { useState,useEffect,useContext } from 'react';
import { UserContext } from './UserContext.js';
import { UserContextProvider } from './UserContext.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupPage from './components/SignUpPage.js';
import HomePage from './components/HomePage.js';
import LoginPage from './components/LoginPage.js';
import { ChatProvider } from './ChatContext';

function App() {
  return (
    <div className="App">
      <ChatProvider>
        <UserContextProvider>
          <Router>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/signup' element={<SignupPage />} />
              <Route path='/login' element={<LoginPage />} />
            </Routes>
          </Router>
        </UserContextProvider>
        </ChatProvider>
    </div>
  );
}

export default App;
