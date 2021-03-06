import React, { useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import ChatInput from './chatInput/ChatInput';
import './chatContainer.scss';
import ChatMessage from './chatMessage/ChatMessage';
import UserContext from '../../context/UserContext';
import ChatDetails from './chatDetails/ChatDetails';
import ChatFeedback from './chatFeedback/ChatFeedback';

export interface SocketMessageInterface {
    type: string,
    content: string,
    sender: string,
    date: number,
    source?: string 
};

const socket = io("http://localhost:3001", {
    autoConnect: false
});

export const changeUsername = (oldName:string, newName:string, room:string) => {
    socket.emit('user:change-name', {oldName, newName, room});
};

export const signOut = (username:string, room:string) => {
    socket.emit('user:disconnect', {room, name:username});
    socket.disconnect();
};

const ChatContainer:React.FC = () => {
    const { username, room } = useContext(UserContext);
    const [messages, setMessages] = useState<Array<SocketMessageInterface>>([]);
    const [usersList, setUsersList] = useState<Array<{name: string, isActive: boolean}>>([]);
    const [feedbackList, setFeedbackList] = useState<Array<SocketMessageInterface>>([]);

    useEffect(() => {
        if(username !== '') {
            socket.connect().emit('user:new-join', {name: username, room}, getUsersInRoom);
        }
        return () => {
            socket.close();
        }
    }, []);

    useEffect(() => {
        socket.on('user:new-join', (data:SocketMessageInterface) => {
            const user:string = data.content.slice(0, (data.content.indexOf('has') || 0)).trim();
            if(user !== username) {
                setUsersList(prevUsers => [...prevUsers, {name: user, isActive: true}]);
            }
            setMessages(prevMessages => [...prevMessages, data]);
        });

        socket.on('message:new-chat', (data:SocketMessageInterface) => {
            console.log(data);
            setMessages(prevMessages => [...prevMessages, data]);
        })

        socket.on('user:disconnect', (data) => {
            setMessages(prevMessages => [...prevMessages, data.message]);
            setUsersList(data.usersInRoom);
        })

        socket.on('user:change-name', (data:SocketMessageInterface) => {
            setMessages(prevMessages => [...prevMessages, data]);
        });

        socket.on('user:left', (data:SocketMessageInterface) => {
            const userLeft:string = data.content.slice(0, (data.content.indexOf('has') || 0)).trim();
            setUsersList(prevList => prevList.filter(user => user.name !== userLeft));
            setMessages(prevMessage => [...prevMessage, data]);
        })

        socket.on('user:typing', (data:SocketMessageInterface) => {
            //display message above chat input
            setFeedbackList([data]);
        })

        socket.on('user:typing-stop', (data:SocketMessageInterface) => {
            //Remove message about the user typing
            setFeedbackList([]);
        })
    }, [socket]);

    const clearMessages = ():void => {
        setMessages([]);
    }

    const getUsersInRoom = (users:[]) => {
        setUsersList(users);
    };

    return (
        <>
            <ChatDetails socket={ socket } clearMessages={ clearMessages } users={ usersList } setUsersList={ setUsersList } />
            <div className='chat-container'>
                <div className='messages-container' data-testid="messages-container">
                    {
                        messages.map(message => (
                            <ChatMessage key={ message.date } message={ message } />
                        ))
                    }
                </div>
                <ChatFeedback feedback={ feedbackList } />
                <ChatInput socket={ socket } setMessages={ setMessages } />
            </div>
        </>
    )
}

export default ChatContainer;