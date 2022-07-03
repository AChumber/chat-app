import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import userHandler from './eventHandlers/userHandler';
import messageHandler from './eventHandlers/messageHandler';

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
    userHandler(io, socket);
    messageHandler(io, socket);
})


server.listen(PORT, () => console.log(`Server running on Port ${PORT}`))