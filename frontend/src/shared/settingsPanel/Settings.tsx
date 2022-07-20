import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BsFillPencilFill, BsFillXCircleFill, BsBoxArrowLeft } from 'react-icons/bs';
import './settings.scss';
import SettingsContext from '../../context/SettingsContext';
import { ColorsInterface } from '../../context/ColoursContext';
import { changeUsername, signOut } from '../../components/chatContainer/ChatContainer';

interface Props {
    showSettingsPanel: React.Dispatch<React.SetStateAction<boolean>>
}

const Settings: React.FC<Props> = ({ showSettingsPanel }) => {
    const { username, setUsername, room } = useContext(UserContext);
    const settingsContext = useContext(SettingsContext);
    const [isChangeName, setIsChangeName] = useState<boolean>(false);
    const [usernameChangeInput, setUsernameChangeInput] = useState<string>(username);
    const [enterToSendSwitch, setEnterToSendSwitch] = useState<boolean>(false);
    const [bubbleColors, setBubbleColors] = useState<ColorsInterface>({
        myMessages: '',
        recievedMessages: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        //Change settings based on settings in context when component mounts
        setEnterToSendSwitch(settingsContext.enterToSend);
        setBubbleColors({
            myMessages: settingsContext.colors.myMessages,
            recievedMessages: settingsContext.colors.recievedMessages
        });
    }, [])

    useEffect(() => {
        setUsernameChangeInput(username);
    }, [username])

    const variants = {
        hidden: { left: '250%', top: '05%', opacity: 0 },
        visible: { 
            top: '0%', 
            left: '100%', 
            opacity: 1, 
            transform: 'translate(-100%, 0%)',
            transition: {
                duration: 0.15
            }
        },
        exit: { 
            left: '250%', 
            opacity: 0,
            transition: {
                duration: 0.4
            } 
        }
    };

    const closeSettingsPanel = (e) => {
        showSettingsPanel(false);
    }

    const handleNameChange = () => {
        if(usernameChangeInput !== '') {
            //oldName, newName, room
            changeUsername(username, usernameChangeInput, room);
            setUsername(usernameChangeInput);
        }
    }

    const handleSwitchChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
        setEnterToSendSwitch(e.target.checked);
        settingsContext.setEnterToSend(e.target.checked);
    }

    const handleBubbleColourChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        //will match the properties seen in the state
        const messageType = e.target.dataset.type; 
        if(messageType === 'myMessages') {
            setBubbleColors(prevState => ({ myMessages: e.target.value, recievedMessages: prevState.recievedMessages }));
        } else {
            setBubbleColors(prevState => ({ recievedMessages: e.target.value, myMessages: prevState.myMessages }));
        }

        //save to settings context
        settingsContext.setColors(bubbleColors);
    }

    const handleSignOutClick = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        signOut(username, room);
        setUsername('');
        navigate('/');
    }

    return (
        <>
            <motion.div initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition:{ duration: 0.05 } }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }} 
                className='app-overlay' 
                onClick={ closeSettingsPanel }></motion.div>
            <motion.div initial='hidden' animate='visible' exit='exit' variants={variants} 
                className='settings-container'>
                    
                <div className='settings-close-btn' onClick={ closeSettingsPanel }><BsFillXCircleFill /></div>
                { /* User name and room here. Buttons to change both opening up the modals */ }
                <div className='settings-name-section settings-section'>
                    <h2>Username:</h2>
                    <p className='settings-name'>Chatting as: { username } 
                        <span className='settings-edit-name-btn' 
                            onClick={() => setIsChangeName(!isChangeName)}
                            title='Edit Username'>
                            <BsFillPencilFill />
                        </span>
                    </p>
                    <AnimatePresence>
                    {
                        isChangeName && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity:0 }}
                                className='settings-change-name-input'>
                                    <input type='text' value={usernameChangeInput} 
                                        onChange={(e) => setUsernameChangeInput(e.target.value)} />
                                    <button onClick={ handleNameChange }>Update Username</button>
                            </motion.div>
                        )
                    }
                    </AnimatePresence>
                </div>
                
                { /* Slider to have enter to send a message */ }
                <div className='settings-section enter-to-send-section'>
                    <h2>Enter to send</h2>
                    <p>Pressing the enter button on your keyboard will send the message you are typing</p>
                    <label className="toggle-switch">
                        <input type='checkbox' checked={ enterToSendSwitch }  onChange={ handleSwitchChange } />
                        <span className='slider'></span>
                    </label>
                </div>

                { /* Options to change the colour of the chat bubbles (my bubble and other peoples) */ }
                <div className='settings-section'>
                    <h2>Colour Customisation</h2>
                    <p>Change the colour of the chat bubbles for messages you send and recieve</p>
                    <p className='color-customisation'>My Chat Bubble colour: 
                        <input type='color' onChange={ handleBubbleColourChange } data-type="myMessages" value={ bubbleColors.myMessages }/>
                    </p>
                    <p className='color-customisation'>Message bubbles I recieve colour: 
                        <input type='color' onChange={ handleBubbleColourChange } data-type="recievedMessages" value={ bubbleColors.recievedMessages } />
                    </p>
                </div>

                <button onClick={ handleSignOutClick } className='sign-out-btn'><BsBoxArrowLeft />Sign out</button>
            </motion.div>
        </>
    )
}

export default Settings