import React, { useState,useEffect, useContext } from 'react';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate} from 'react-router-dom'
import { UserContext } from '../UserContext';
import { useChat } from '../ChatContext';
import Header from './Header';
import socket from '../socket';
const defaultTheme = createTheme();

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { chat, updateChat } = useChat();
  const { userInfo, setUserInfo } = useContext(UserContext);
  const userNameErrorEle = document.getElementById('userNameError');
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
    userNameErrorEle.textContent = '';
    passwordErrorEle.textContent = '';
    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      const data = await response.json();

      if (!(data.user)) {
        userNameErrorEle.textContent = data.errors.username;
        passwordErrorEle.textContent = data.errors.password;

      }
      if (data.user) {
        setUserInfo(data.user);
        socket.emit('user-joined',data.user.username);
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
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>

              <Grid container spacing={2}>
                
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="userName"
                    required
                    fullWidth
                    id="userName"
                    label="user name"
                    value={username} onChange={e => setUsername(e.target.value)}
                  />
                  <Typography
                    color={'error'}
                    textAlign={'left'}
                    name="userNameError"
                    fullWidth
                    id="userNameError">

                  </Typography>
                </Grid>


                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password} onChange={e => setPassword(e.target.value)}
                  />
                  <Typography
                    color={'error'}
                    textAlign={'left'}
                    name="passwordError"
                    fullWidth
                    id="passwordError">

                  </Typography>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Log in
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