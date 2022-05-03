import io,{ Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { MessageTypes } from "../messageTypes";
import { responseBuilder } from "../model/responseMessage";

interface RoomUser {
    name: string,
    isActive: boolean,
    socketId: string
};
interface RoomObject {
    name: string,
    users: Array<RoomUser>
};

const rooms:{[key: string]: RoomObject} = {};

export default (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, socket:Socket) => {
    socket.on('user:new-join', (data, callback) => {
        socket.join(data.room);
        io.to(data.room).emit('user:new-join', 
            responseBuilder(MessageTypes.USER_JOIN, `${data.name} has joined the chat`, MessageTypes.SERVER, Date.now())
        );
        
        addUserToRoom(data.room, data.name, socket.id);
        callback(rooms[data.room].users.map(user => {
            //dont send the socketId to the user.
            const {socketId, ...userToSend} = user;
            return userToSend;
        }));

        console.log(rooms);
    });

    socket.on('user:join-new-room', (data, callback) => {
        //data.username, data.room, data.newRoom
        const { name, room, newRoom} = data;
        socket.leave(room);
        socket.join(newRoom);
        io.to(room).emit('user:left', 
            responseBuilder(MessageTypes.USER_LEFT, `${name} has left the chat`, MessageTypes.SERVER, Date.now())
        );
        io.to(newRoom).emit('user:new-join', 
            responseBuilder(MessageTypes.USER_JOIN, `${name} has joined the chat`, MessageTypes.SERVER, Date.now())
        );
        
        if(rooms[newRoom] === undefined) {
            rooms[newRoom] = {
                name: newRoom,
                users: [{name, isActive: true, socketId: socket.id}]
            };
        }
        callback(true, rooms[newRoom].users.map(user => {
            //dont send the socketId to the user.
            const {socketId, ...userToSend} = user;
            return userToSend;
        }));
    })
}



const addUserToRoom = (roomName: string, name: string, socketId: string) => {
    if(!(roomName in rooms)) {
        rooms[roomName] = {
            name: roomName,
            users: [{
                name,
                isActive: true,
                socketId
            }]
        }
    } else {
        rooms[roomName].users.push({
            name,
            isActive: true,
            socketId
        });
    }
}