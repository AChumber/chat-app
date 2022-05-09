import React from 'react';
import './modal.scss';
import { motion } from 'framer-motion';

interface Props { 
    children: React.ReactNode
}
const Modal: React.FC<Props> = ({ children }) => {
    const variants = {
        hidden: { left: '50%', top: '-25%', opacity: 0, transform: 'translate(-50%, -50%)' },
        visible: { 
            top: '50%', 
            left: '50%', 
            opacity: 1, 
            transform: 'translate(-50%, -50%)',
            transition: {
                duration: 0.5
            }
        },
        exit: { 
            top: '100%', 
            opacity: 0,
            transition: {
                duration: 0.4
            } 
        }
    };

    return (
        <>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition:{ duration: 0.2 } }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                className="modal-overlay"></motion.div>
            <motion.div initial='hidden' animate='visible' exit='exit' variants={variants} className='modal-container'>
                { children }
            </motion.div>
        </>
    )
}

export default Modal