import React, { useContext } from 'react';
import UserContext from '../../../context/UserContext';
import './header.scss';

const Header: React.FC = () => {
    const { username, room } = useContext(UserContext);

    return (
        <>
            <h1>Chat App</h1>
            <div className='header-app-details'>
                <p>Chatting as: { username }</p>
                <p>Room: { room }</p>
            </div>
        </>
    )
}

export default Header