import React, { useState, useContext } from 'react';
import { MdSend } from 'react-icons/md';
import { Socket } from 'socket.io-client';
import UserContext from '../../../context/UserContext';
import { SocketMessageInterface } from '../ChatContainer';
import './chatInput.scss';

interface Props {
    socket: Socket,
    setMessages: React.Dispatch<React.SetStateAction<SocketMessageInterface[]>>
};
interface SendMessageInterface {
    room: string,
    sender: string,
    content: string,
    date: number
};

//Component to track user input and send to server
const ChatInput: React.FC<Props> = ({ socket, setMessages }) => {
    const { username, room } = useContext(UserContext);
    const [messageInput, setMessageInput] = useState<string>('');

    const handleSend = () => {
        if(messageInput !== ''){
            const message: SendMessageInterface = {
                room,
                sender: username,
                content: messageInput,
                date: Date.now()
            };
            //send via socket
            socket.emit("message:chat", message);

            //add message to state on client as server wont send message back
            setMessages(prevMessages => [...prevMessages, {  
                ...message,
                type: 'message',
                source: 'my_message'
            }]);
            setMessageInput('');
        }
    };

    return (
        <div className='chat-input-container'>
            <input 
                type='text' 
                value={ messageInput }
                onChange={ (e) => setMessageInput(e.target.value) }
                placeholder="Type to Chat..." />
            <button onClick={ handleSend }><MdSend /></button>
        </div>
    )
}

export default ChatInput