import React, { useState,useEffect, useContext } from 'react';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { useChat } from '../ChatContext';
import Header from './Header';
import socket from '../socket';

const defaultTheme = createTheme();

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { chat, updateChat } = useChat();
  const { userInfo, setUserInfo } = useContext(UserContext);
  const usernameErrorEle = document.getElementById('usernameError');
  const passwordErrorEle = document.getElementById('passwordError');

  useEffect(() => {
    
    socket.on('broadcast-joined-message', (message) => {
      updateChat([...chat, { message }]);
    });
  
    return () => {
      socket.off('broadcast-joined-message');
    };
  }, [chat,userInfo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    usernameErrorEle.textContent = '';
    passwordErrorEle.textContent = '';
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      const data = await response.json();
      if (!(data.user)) {
        usernameErrorEle.textContent = data.errors.username;
        passwordErrorEle.textContent = data.errors.password;

      }
      if (data.user) {
        console.log(data.user);
        setUserInfo(data.user);
        socket.emit('user-joined',data.user.username);
        console.log(userInfo);
        setRedirect(true);
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  if (redirect) {
    return <Navigate to='/' />
  }

  return (
    <div className='mainContainer'>
      <Header />

      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Log in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '90%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username} onChange={e => setUsername(e.target.value)}
              />
              <Typography
                color={'error'}
                name="usernameError"
                fullWidth
                textAlign={'left'}
                id="usernameError">

              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password} onChange={e => setPassword(e.target.value)}
              />
              <Typography
                color={'error'}
                textAlign={'left'}
                name="passwordError"
                fullWidth
                id="passwordError">

              </Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
              <Grid container spacing={2}>
                <Grid item marginLeft={'auto'}>
                  <Link href="/signup" variant="body2">
                    "Don't have an account? Sign Up"
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>

        </Container>
      </ThemeProvider>
    </div>
  );
}