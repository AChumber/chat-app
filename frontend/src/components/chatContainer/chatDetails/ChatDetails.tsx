import React, { useContext, useState } from 'react'
import { Socket } from 'socket.io-client'
import { MdModeEdit } from 'react-icons/md';
import RoomModal from '../../roomModal/RoomModal';
import UserContext from '../../../context/UserContext';
import './chatDetails.scss';
import RoomUsers from './roomUsers/RoomUsers';
import { AnimatePresence } from 'framer-motion';

interface Props {
    socket: Socket,
    clearMessages: () => void,
    users: Array<any>,
    setUsersList: React.Dispatch<React.SetStateAction<any[]>>
}

const ChatDetails: React.FC<Props> = ({ socket, clearMessages, users, setUsersList }) => {
    const [showChangeRoomModal, setShowChangeRoomModal] = useState<boolean>(false);
    const { username, room, setRoom } = useContext(UserContext);

    const handleEditRoomClick = ():void => {
        setShowChangeRoomModal(!showChangeRoomModal);
    }

    const changeRoom = (roomName:string):void => {
        //change room from this one to new one specified. Will update context 
        socket.emit('user:join-new-room',
            {name: username, room, newRoom: roomName}, 
            (isJoinNewRoom:boolean, usersList:[]) => {
                console.log(isJoinNewRoom, usersList);
                if(isJoinNewRoom) {
                    clearMessages();
                    setUsersList(usersList);
                    handleEditRoomClick();
                    setRoom(roomName);
                }
            }
        );
    };

    return (
        <>
            <div className='chat-details'>
                <p>Room: { room } <span data-testid='edit-room-icon' 
                                        className='change-room-icon-span' 
                                        onClick={ handleEditRoomClick }><MdModeEdit /></span></p>
                <div>
                    <RoomUsers users={ users } />
                </div>
            </div>
            <AnimatePresence>
                {
                    showChangeRoomModal && (
                        <RoomModal setShowRoomModal={ setShowChangeRoomModal } handleJoinRoom={ changeRoom } />
                    )
                }
            </AnimatePresence>
        </>
    )
}

export default ChatDetails