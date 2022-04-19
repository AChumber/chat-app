import express, { Application, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { MessageTypes } from './messageTypes';
import { responseBuilder } from './model/responseMessage';
import { ChatMessageInterface } from './model/ChatMessage';

const PORT = 3001;
const app:Application = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});


let rooms:string[] = [];

io.on('connection', (socket) => {

    socket.on('user_join', data => {
        socket.join(data.room);
        io.to(data.room).emit('new_user_join', 
            responseBuilder(MessageTypes.USER_JOIN, `${data.name} has joined the chat`, MessageTypes.SERVER, Date.now())
        );

        //add room to the rooms obj
        if(!(rooms.includes(data.room.toLowerCase()))) {
            rooms.push(data.room.toLowerCase());
        }
    });

    socket.on('user-join-new-room', (data, callback) => {
        console.log(data);
        //data.username, data.room, data.newRoom
        const { name, room, newRoom} = data;
        socket.leave(room);
        socket.join(newRoom);
        io.to(room).emit('user_left', 
            responseBuilder(MessageTypes.USER_LEFT, `${name} has left the chat`, MessageTypes.SERVER, Date.now())
        );
        io.to(data.newRoom).emit('new_user_join', 
            responseBuilder(MessageTypes.USER_JOIN, `${name} has joined the chat`, MessageTypes.SERVER, Date.now())
        );
        callback(true);
    })

    socket.on('chat-message', (data: ChatMessageInterface) => {
        console.log(data);
        socket.broadcast.to(data.room).emit('chat-message', 
            responseBuilder(MessageTypes.MESSAGE, data.content, data.sender, data.date));
    });

})




server.listen(PORT, () => console.log(`Server running on Port ${PORT}`))