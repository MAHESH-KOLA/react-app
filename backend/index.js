const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');
const webRoutes = require('./routes/webRoutes');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version'],
        credentials: true,
    },
    transports: ['websocket', 'polling']
})


io.on('connection', (socket) => {
    socket.on('get-initial-chat', async () => {
        try {
            const chatHistory = await Message.find();
            socket.emit('initial-chat-history', chatHistory);
        } catch (error) {
            console.error('Error fetching initial chat history:', error);
        }
    });

    socket.on('send-message', async (payload) => {
        try {
            const messageData = await Message.create({ message: payload.message, author: payload.username });
            io.emit('receive-message', messageData);
        }
        catch (error) {
            console.error('Error creating and broadcasting message:', error);
        }
    });

    socket.on('user-joined', async (username) => {
        try {
            const newMessage = await Message.create({
                author: username,
                extraInfo: `${username} has joined the chat`
            });

            io.emit('broadcast-joined-message', newMessage);
        } catch (error) {
            console.error('Error creating and broadcasting user-joined message:', error);
        }
    });
})


app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/Chatapp')
    .then((result) => server.listen(5000))
    .then(()=>console.log("DB connected successfully"))
    .catch((err) => console.log(err));

app.use(webRoutes);
