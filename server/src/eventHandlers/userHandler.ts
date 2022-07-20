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
    });

    socket.on('user:disconnect', (data) => {
        const { room, name } = data;
        removeUserFromRoom(room, name);

        socket.broadcast.to(room).emit('user:disconnect', 
        {
            message: responseBuilder(MessageTypes.USER_LEFT, `${name} has left the chat`, MessageTypes.SERVER, Date.now()),
            usersInRoom: rooms[room].users.map(user => {
                            //dont send the socketId to the user.
                            const {socketId, ...userToSend} = user;
                            return userToSend;
                        }) 
        }
        );

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

        removeUserFromRoom(room, name);
        addUserToRoom(newRoom, name, socket.id);

        callback(true, rooms[newRoom].users.map(user => {
            //dont send the socketId to the user.
            const {socketId, ...userToSend} = user;
            return userToSend;
        }));
    });

    //data - oldName, newName
    socket.on('user:change-name', data => {
        const { oldName, newName, room } = data;
        changeUsersName(room, oldName, newName);

        socket.broadcast.to(room).emit('user:change-name', 
            responseBuilder(MessageTypes.SERVER, 
                `'${oldName}' has changed their name to '${newName}'`, 
                MessageTypes.SERVER, 
                Date.now())
        );
    })

    //User Typing
    //data - name, room
    socket.on('user:typing', (data) => {
        const { name, room } = data;
        socket.broadcast.to(room).emit('user:typing', 
            responseBuilder(MessageTypes.USER_TYPING, `${name} is typing`, MessageTypes.SERVER, Date.now())
        );
    });

    //data - name, room
    socket.on('user:typing-stop', (data) => {
        const { name, room } = data;
        socket.broadcast.to(room).emit('user:typing-stop', 
            responseBuilder(MessageTypes.USER_STOP_TYPING, `${name}`, MessageTypes.SERVER, Date.now())
        );
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

const removeUserFromRoom = (roomName: string, name: string) => {
    if(rooms[roomName] !== null) {
        rooms[roomName].users = rooms[roomName].users.filter(user => user.name !== name);
    }
}

const changeUsersName = (roomName: string, oldName: string, newName: string) => {
    if(rooms[roomName] !== null) {
        for(let userIndex in rooms[roomName].users) {
            let user = rooms[roomName].users[userIndex];
            if(user.name === oldName) {
                user.name = newName;
            }
        }
    }

    console.log(rooms[roomName].users);
}