import React, { useState, useContext } from 'react';
import UserContext from '../../context/UserContext';
import './nameModal.scss';

interface InputErrorsInterface {
    name: boolean,
    room: boolean
};

const NameModal: React.FC = () => {
    const { username, setUsername, setRoom } = useContext(UserContext);
    const [nameInput, setNameInput] = useState<string>('');
    const [roomInput, setRoomInput] = useState<string>('');
    const [errors, setErrors] = useState<InputErrorsInterface>({
        name: false,
        room: false
    });

    const handleEnterClick = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>):void => {
        if(nameInput !== '' && roomInput !== '') {
            setErrors({name: false, room: false});
            e.stopPropagation();
            setUsername(nameInput);
            setRoom(roomInput);
        
        } else {
            setErrors({
                name: nameInput === '',
                room: roomInput === ''
            });
        }
    }

    if(username !== '') return null;

    return (
        <>
            <div className="modal-overlay"></div>
            <div className='name-modal'>
                <h2>Enter a name to chat!</h2>
                <div className='form-group'>
                    <label htmlFor='name'>Name</label>
                    <input 
                        type='text' 
                        name="name" 
                        value={ nameInput }
                        onChange={ e => setNameInput(e.target.value) }
                        placeholder='Enter a name to chat...'
                        style={{border: errors.name ? '1px solid red' : ''}} />
                </div>
                <div className='form-group'>
                    <label htmlFor='room'>Room</label>
                    <input 
                        type='text' 
                        name="room" 
                        value={ roomInput }
                        onChange={ e => setRoomInput(e.target.value) }
                        placeholder='Enter a room name to chat in...'
                        style={{border: errors.room ? '1px solid red' : ''}} />
                </div>
                {
                    (errors.name || errors.room) && (
                        <p className='invalid-input-feedback'><small>Please enter a value.</small></p>
                    )
                }
                <p><small>Your name will be visible to others in the room chatting with you!</small></p>
                <button onClick={e => handleEnterClick(e)}>Enter</button>
            </div>
        </>
    )
}

export default NameModal