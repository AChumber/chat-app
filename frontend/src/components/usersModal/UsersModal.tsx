import React from 'react';
import Modal from '../modal/Modal';
import './usersModal.scss';

interface Props {
    setShowUsersModal: React.Dispatch<React.SetStateAction<boolean>>,
    users: Array<any>
}

const UsersModal:React.FC<Props> = ({ setShowUsersModal, users }) => {
    return (
        <Modal>
            <h2 className='modal-title'>Users in the room</h2>
            {
                users.map((user, i) => (
                    <p className='users-modal-user' key={i}>{user.name}</p>
                    )
                )
            }
            <button onClick={()=>setShowUsersModal(false)}>Close</button>
        </Modal>
    )
}

export default UsersModal