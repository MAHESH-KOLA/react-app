import React, { useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import logoImg from '../chatapp.png'
import { useChat } from '../ChatContext';
import socket from '../socket';

function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const username = userInfo?.username;

  function logout() {
    fetch('http://127.0.0.1:5000/logout', {
      method: 'POST',
      credentials: "include"
    })
      .then(() => {
        setUserInfo(null);
      })
  }

  return (
    <header>
      <Link to='/'>
        <Avatar src={logoImg} />
      </Link>
      <nav>
        {
          username && (
            <>
              <p>{`Hello, ${username}!`}</p>
              <a onClick={logout}>Logout</a>
            </>
          )
        }{
          !username && (
            <>
              <Link to="/login">Login</Link>
              <br />
              <Link to="/signup">Signup</Link>
            </>
          )
        }

      </nav>
    </header>
  )
}

export default Header