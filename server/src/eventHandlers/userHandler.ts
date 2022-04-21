import io,{ Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { MessageTypes } from "../messageTypes";
import { responseBuilder } from "../model/responseMessage";

export default (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, socket:Socket) => {
    socket.on('user:new-join', (data) => {
        socket.join(data.room);
        io.to(data.room).emit('user:new-join', 
            responseBuilder(MessageTypes.USER_JOIN, `${data.name} has joined the chat`, MessageTypes.SERVER, Date.now())
        );
    });

    socket.on('user:join-new-room', (data, callback) => {
        console.log(data);
        //data.username, data.room, data.newRoom
        const { name, room, newRoom} = data;
        socket.leave(room);
        socket.join(newRoom);
        io.to(room).emit('user:left', 
            responseBuilder(MessageTypes.USER_LEFT, `${name} has left the chat`, MessageTypes.SERVER, Date.now())
        );
        io.to(data.newRoom).emit('user:new-join', 
            responseBuilder(MessageTypes.USER_JOIN, `${name} has joined the chat`, MessageTypes.SERVER, Date.now())
        );
        callback(true);
    })
}