import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { SocketMessageInterface } from '../ChatContainer';
import './chatFeedback.scss';

interface Props {
    feedback: Array<SocketMessageInterface>
}

const ChatFeedback: React.FC<Props> = ({ feedback }) => {
    const variants = {
        hidden: { opacity: 0, transform: 'translateY(50%)' },
        visible: { 
            opacity: 1, 
            transform: 'translateY(0%)',
            transition: {
                duration: 0.3
            }
        },
        exit: { 
            opacity: 0,
            transform: 'translateY(50%)',
            transition: {
                duration: 0.6
            } 
        }
    };

    return (
        <div className='chat-feedback'>
            <AnimatePresence>
            {
                feedback.map(feedbackMessage => (
                    <motion.div className='feedback-text-container' key={feedbackMessage.date}
                            initial='hidden' animate='visible' exit='exit' variants={variants}>
                        <p className='user-typing-feedback'>{ feedbackMessage.content }</p>
                        <div className='ellipses-wrapper'>
                            <div className='feedback-ellipses'></div>
                            <div className='feedback-ellipses'></div>
                            <div className='feedback-ellipses'></div>
                        </div>
                    </motion.div>
                ))
            }
            </AnimatePresence>
        </div>
    )
}

export default ChatFeedback