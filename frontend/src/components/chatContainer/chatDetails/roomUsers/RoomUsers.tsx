import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import UsersModal from '../../../usersModal/UsersModal';
import './roomUsers.scss';

interface UserProp {
    name: string,
    isActive: true
}
interface Props {
    users: Array<UserProp>
}

const RoomUsers = ({ users }:Props) => {
    const [showUsersModal, setShowUsersModal] = useState<boolean>(false);

    if(users.length > 0) {
        return (
            <>
                <div className='users-list'>
                    {
                        users.length > 0 && (
                            users.slice(0, 5).map((user, id) => <UserTile key={id} name={user.name} isActive={user.isActive} />)
                        )
                    }
                </div>
                <span className='more-users-link' onClick={()=>setShowUsersModal(!showUsersModal)}>See more Users...</span>
            
                <AnimatePresence>
                {
                    showUsersModal && (
                        <UsersModal 
                            setShowUsersModal={ setShowUsersModal } 
                            users={ users }/>
                    )
                }
                </AnimatePresence>
            </>
        )
    }

    return null;
}

const UserTile:React.FC<UserProp> = ({ name, isActive }) => {
    return(
        <p className='name-bubble'>{ name.slice(0, 1) }</p>
    )
}

export default RoomUsers