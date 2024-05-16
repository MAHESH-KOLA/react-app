import '../App.css';
import React, { useState, useEffect, useContext, useRef } from 'react'
import { Snackbar, Button, IconButton, TextField, Tooltip, Chip, Avatar } from '@mui/material';
import { format } from 'date-fns';
import Header from './Header'
import { UserContext } from '../UserContext';
import { useChat } from '../ChatContext';
import socket from '../socket';

import CloseIcon from '@mui/icons-material/Close';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import SendIcon from '@mui/icons-material/Send';
import Fab from '@mui/material/Fab';

function HomePage() {
  const [message, setMessage] = useState('');
  const { chat, updateChat } = useChat();
  const [initialChatFetched, setInitialChatFetched] = useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const { userInfo } = useContext(UserContext);
  const username = userInfo?.username;
  const bottomRef = useRef(null);
  const topRef = useRef(null);

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  useEffect(() => {
    console.log('h2');
    socket.on('receive-message', (payload) => {
      console.log('after receive', payload);
      updateChat([...chat, payload]);
      // setInitialChatFetched(false);
    });

    return () => {
      socket.off('receive-message');
    };
  }, [chat]);

  useEffect(() => {
    // if (!initialChatFetched) {
    console.log('h1');
    socket.emit('get-initial-chat');
    setInitialChatFetched(true);
    // }
    socket.on('initial-chat-history', (initialChat) => {
      console.log('initial chat', initialChat);
      updateChat(initialChat);
    });

    return () => {
      socket.off('initial-chat-history');
    };

  }, [initialChatFetched]);

  const handleChatSubmission = (e) => {
    e.preventDefault();
    if (!userInfo || !userInfo.username) {
      setOpenSnack(true);
      return;
    }
    if(message.length>0){
      socket.emit('send-message', { message, username });
      setMessage('');
    }
  }

  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };

  return (
    <div className='mainContainer'>
      <div ref={topRef}></div>
      <Header />
      <Snackbar
        open={openSnack}
        autoHideDuration={4000}
        onClose={handleCloseSnack}
        message="Please login to send message!!"
        action={
          <React.Fragment>
            <Button color="primary" size="small" href='/login' onClick={handleCloseSnack}>
              Login
            </Button>
            <IconButton
              size="small"
              color="inherit"
              onClick={handleCloseSnack}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <h1 style={{ color: '#395886', marginBottom: '0px' }}>TalkMore</h1>
      <h2 style={{ color: '#395886', marginTop: '0px' }}>Connect, Collaborate, Communicate</h2>
      {
        chat.map((payload, ind) => {
          return (
            <React.Fragment key={ind}>
              {/* {payload?.author} */}
              {payload?.extraInfo ? (
                <div style={{ marginBottom: '8px' }}>
                  <Chip label={payload?.extraInfo} variant="outlined" sx={{ maxWidth: 'fit-content', margin: 'auto', color: '#395886' }} />
                </div>
              ) : payload?.author === username ? (
                <div className='myMessage'>
                  <p className='authorName'>Me &nbsp;<sub className='timeStamp'>{format(new Date(payload?.createdAt), "dd/MMM/yyyy hh:mm a")}</sub></p>
                  <p className='messageContent'>{payload?.message}</p>
                </div>
              ) : (
                <div style={{ display: 'flex', marginLeft: '8px' }}>
                  <Avatar sx={{ bgcolor: '#628ecb',zIndex:'0' }}>{payload?.author[0].toUpperCase()}</Avatar>
                  <div className='otherMessage'>
                    <p className='authorName'>{payload?.author} &nbsp;<sub className='timeStamp'>{format(new Date(payload?.createdAt), "dd/MMM/yyyy hh:mm a")}</sub></p>
                    <p className='messageContent'>{payload?.message}</p>
                  </div>
                </div>
              )}
            </React.Fragment>
          )
        })
      }
      <form onSubmit={handleChatSubmission} style={{ position: 'sticky',top:'90%', bottom: 5 }}>
        <TextField label="Message" value={message} onChange={e => setMessage(e.target.value)} autoFocus variant="outlined" sx={{ width: '80%', bgcolor: '#e0e0e0', borderRadius: '4px' }} />
        <Fab color="primary" sx={{ ml: 1 }} disabled={message.length === 0}><SendIcon /></Fab>
      </form>
      <div style={{ alignSelf: 'flex-end', position: 'sticky', bottom: '50%' }}>
        <Tooltip title="Scroll to top" arrow>
          <Button sx={{ padding: '12px' }} onClick={scrollToTop}>
            <ArrowCircleUpIcon sx={{ fontSize: '28px', color: 'black' }} />
          </Button>
        </Tooltip>
      </div>
      <div ref={bottomRef}></div>
    </div >
  )
}

export default HomePage
