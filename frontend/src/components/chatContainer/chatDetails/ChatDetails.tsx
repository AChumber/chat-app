import React, { useContext, useState } from 'react'
import { Socket } from 'socket.io-client'
import { MdModeEdit } from 'react-icons/md';
import RoomModal from '../../roomModal/RoomModal';
import UserContext from '../../../context/UserContext';
import './chatDetails.scss';

interface Props {
    socket: Socket,
    clearMessages: () => void
}

const ChatDetails: React.FC<Props> = ({ socket, clearMessages }) => {
    const [showChangeRoomModal, setShowChangeRoomModal] = useState<boolean>(false);
    const { username, room, setRoom } = useContext(UserContext);

    const handleEditRoomClick = ():void => {
        setShowChangeRoomModal(!showChangeRoomModal);
    }

    const changeRoom = (roomName:string):void => {
        //change room from this one to new one specified. Will update context 
        socket.emit('user:join-new-room',
            {name: username, room, newRoom: roomName}, 
            (isJoinNewRoom:boolean) => {
                console.log(isJoinNewRoom);
                if(isJoinNewRoom) {
                    clearMessages();
                    handleEditRoomClick();
                    setRoom(roomName);
                }
            }
        );
    };

    return (
        <>
            <div className='chat-details'>
                <p>Chatting as: { username }</p>
                <p>Room: { room } <span data-testid='edit-room-icon' 
                                        className='change-room-icon-span' 
                                        onClick={ handleEditRoomClick }><MdModeEdit /></span></p>
            </div>
            {
                showChangeRoomModal && (
                    <RoomModal setShowRoomModal={ setShowChangeRoomModal } handleJoinRoom={ changeRoom } />
                )
            }
        </>
    )
}

export default ChatDetails