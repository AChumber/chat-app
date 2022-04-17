import express, { Application, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { MessageTypes } from './messageTypes';
import { responseBuilder } from './model/responseMessage';
import { ChatMessageInterface } from './model/ChatMessage';
import { SocketAddress } from 'net';

const PORT = 3001;
const app:Application = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});


io.on('connection', (socket) => {

    socket.on('user_join', data => {
        console.log(data, data.name, data.room)
        socket.join(data.room);
        io.to(data.room).emit('new_user_join', 
            responseBuilder(MessageTypes.USER_JOIN, `${data.name} has joined the chat`, MessageTypes.SERVER, Date.now())
        );
    });

    socket.on('chat-message', (data: ChatMessageInterface) => {
        console.log(data);
        socket.broadcast.to(data.room).emit('chat-message', 
            responseBuilder(MessageTypes.MESSAGE, data.content, data.sender, data.date));
    });

})




server.listen(PORT, () => console.log(`Server running on Port ${PORT}`))