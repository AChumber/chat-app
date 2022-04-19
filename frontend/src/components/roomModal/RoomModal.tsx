import React, { useContext, useState } from 'react';
import UserContext from '../../context/UserContext';
import Modal from '../modal/Modal';
import './roomModal.scss';

interface Props {
    setShowRoomModal: React.Dispatch<React.SetStateAction<boolean>>,
    handleJoinRoom: (roomName:string) => void
}

const RoomModal: React.FC<Props> = ({ setShowRoomModal, handleJoinRoom }) => {
    const [roomInput, setRoomInput] = useState<string>('');
    const [isRoomInputError, setIsRoomInputError] = useState<boolean>(false);
    const { room } = useContext(UserContext);

    const handleJoinRoomClick = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>):void => {
        if(roomInput === '') {
            setIsRoomInputError(true);
        } else {
            setIsRoomInputError(false);
            handleJoinRoom(roomInput);
        }

    }
    
    return (
        <Modal>
            <h2 className='modal-title'>Change to a new chat room</h2>
            <div className='modal-content-desc'>
                <p>Enter a new Chat Room to join or cancel to stay in {room}</p>
                <p>Joining a new chat will remove you from the current one!</p>
            </div>
            <div className='modal-form-group'>
                <label htmlFor='room'>Room</label>
                <input 
                    type='text' 
                    name='room' 
                    value={ roomInput }
                    onChange={ e => setRoomInput(e.target.value) }
                    placeholder='Enter a new room to join...'
                    style={{border: isRoomInputError ? '1px solid red' : ''}}
                    />
            </div>
            <div className='modal-buttons-container'>
                <button onClick={ () => setShowRoomModal(false) }>Cancel</button>
                <button onClick={ e => handleJoinRoomClick(e) }>Join new Room</button>
            </div>
        </Modal>
    )
}

export default RoomModal