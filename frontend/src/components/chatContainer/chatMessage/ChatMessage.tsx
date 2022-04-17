import React from 'react'
import { SocketMessageInterface } from '../ChatContainer';
import './chatMessage.scss';

interface Props {
    message: SocketMessageInterface
}

const ChatMessage: React.FC<Props> = ({ message }) => {
    return (
        <div 
            className={'message-container ' +
                (message.source === 'my_message' ? message.source : '') +
                (message.sender === 'server' ? 'server-message': '')} >
            {
                message.sender !== 'server' &&
                    (
                        <h3>{ message.sender }</h3>
                    ) 
            }
            <p className={ message.sender === 'server' ? 'server-message': 'chat-message' }>{ message.content }</p>
            {
                message.sender !== 'server' && (
                    <div className='message-date'>
                        <p>{ (new Date(message.date)).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }</p>
                    </div>
                )
            }
        </div>
    )
}

export default ChatMessage;