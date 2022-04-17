import React, { useState, createContext } from 'react';

interface ContextState {
    username: string,
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    room: string,
    setRoom: React.Dispatch<React.SetStateAction<string>>
}
const UserContext = createContext<ContextState>({ 
    username: '', 
    setUsername: () => {},
    room: '',
    setRoom: () => {} 
});


export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState<string>('');
    const [room, setRoom] = useState<string>('');
    
    return (
        <UserContext.Provider value={{username, setUsername, room, setRoom}}>
            { children }
        </UserContext.Provider>
    )

}

export default UserContext;