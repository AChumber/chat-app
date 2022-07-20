import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { MessageTypes } from "../messageTypes";
import { ChatMessageInterface } from "../model/ChatMessage";
import { responseBuilder } from "../model/responseMessage";

export default (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, socket:Socket) => {
    socket.on('message:chat', (data: ChatMessageInterface) => {
        socket.broadcast.to(data.room).emit('message:new-chat', responseBuilder(MessageTypes.MESSAGE, data.content, data.sender, data.date));
    });
}