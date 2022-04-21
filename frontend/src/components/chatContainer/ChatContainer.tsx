import React, { useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import ChatInput from './chatInput/ChatInput';
import './chatContainer.scss';
import ChatMessage from './chatMessage/ChatMessage';
import UserContext from '../../context/UserContext';
import ChatDetails from './chatDetails/ChatDetails';

export interface SocketMessageInterface {
    type: string,
    content: string,
    sender: string,
    date: number,
    source?: string 
};

const socket= io("http://localhost:3001", {
    autoConnect: false
});

const ChatContainer:React.FC = () => {
    const { username, room } = useContext(UserContext);
    const [messages, setMessages] = useState<Array<SocketMessageInterface>>([]);

    useEffect(() => {
        if(username !== '') {
            socket.connect().emit('user:new-join', {name: username, room});
        }
        return () => {
            socket.close();
        }
    }, [username]);

    useEffect(() => {
        socket.on('user:new-join', (data:SocketMessageInterface) => {
            console.log(data);
            setMessages(prevMessages => [...prevMessages, data]);
        });
        socket.on('message:chat', (data:SocketMessageInterface) => {
            setMessages(prevMessages => [...prevMessages, data]);
        })
        socket.on('user:left', (data:SocketMessageInterface) => {
            console.log(data);
            setMessages(prevMessage => [...prevMessage, data]);
        })
    }, [socket]);

    const clearMessages = ():void => {
        setMessages([]);
    }

    return (
        <>
            <ChatDetails socket={ socket } clearMessages={ clearMessages } />
            <div className='chat-container'>
                <div className='messages-container' data-testid="messages-container">
                    {
                        messages.map(message => (
                            <ChatMessage key={ message.date } message={ message } />
                        ))
                    }
                </div>
                <ChatInput socket={ socket } setMessages={ setMessages } />
            </div>
        </>
    )
}

export default ChatContainer;