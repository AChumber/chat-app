import React, { useContext } from 'react'
import SettingsContext from '../../../context/SettingsContext';
import { SocketMessageInterface } from '../ChatContainer';
import './chatMessage.scss';

interface Props {
    message: SocketMessageInterface
}

const ChatMessage: React.FC<Props> = ({ message }) => {
    const settingsContext = useContext(SettingsContext);

    const getBackgroundColor = (message:SocketMessageInterface) => {
        if(message.source === 'my_message') return settingsContext.colors.myMessages;
        else if (message.sender === 'server') return '';
        else return settingsContext.colors.recievedMessages
    }

    return (
        <div 
            style={{ backgroundColor: getBackgroundColor(message)}}
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