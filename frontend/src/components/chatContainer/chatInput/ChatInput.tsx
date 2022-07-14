import React, { useState, useContext, useRef } from 'react';
import { MdSend } from 'react-icons/md';
import { Socket } from 'socket.io-client';
import SettingsContext from '../../../context/SettingsContext';
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
    const settingsContext = useContext(SettingsContext);
    const [messageInput, setMessageInput] = useState<string>('');
    const [userTimeout, setUserTimeout] = useState<any>(undefined);
    const isTyping = useRef(false);


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
            socket.emit("user:typing-stop", {name: username, room})
            isTyping.current = false;

            //add message to state on client as server wont send message back
            setMessages(prevMessages => [...prevMessages, {  
                ...message,
                type: 'message',
                source: 'my_message'
            }]);
            setMessageInput('');
        }
    };

    const timeoutTyping = () => {
        isTyping.current = false;
        socket.emit("user:typing-stop", {name: username, room});
    };
    const handleMessageInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value)

        if(messageInput === '') {
            clearTimeout(userTimeout);
            isTyping.current = false;
            socket.emit("user:typing-stop", {name: username, room})
        }

        if(!isTyping.current) {
            socket.emit('user:typing', {name: username, room});
            isTyping.current = true;
            setUserTimeout(setTimeout(timeoutTyping, 5000));
        } else {
            clearTimeout(userTimeout);
            setUserTimeout(setTimeout(timeoutTyping, 5000));
        }
    }

    const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if(settingsContext.enterToSend) {
            if(e.key === 'Enter' && messageInput !== '') {
                handleSend();
                setMessageInput('');
            }
        }
    }



    return (
        <div className='chat-input-container'>
            <input 
                type='text' 
                value={ messageInput }
                onChange={ handleMessageInputChange }
                onKeyDown={ (e) => handleKeyDown(e) }
                placeholder="Type to Chat..." />
            <button onClick={ handleSend }><MdSend /><span className='send-btn-text'>Send</span></button>
        </div>
    )
}

export default ChatInput