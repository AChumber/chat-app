import React from 'react';
import './modal.scss';

interface Props { 
    children: React.ReactNode
}
const Modal: React.FC<Props> = ({ children }) => {
    return (
        <>
            <div className="modal-overlay"></div>
            <div className='modal-container'>
                { children }
            </div>
        </>
    )
}

export default Modal