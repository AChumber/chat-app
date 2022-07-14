import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import Settings from '../../settingsPanel/Settings';
import './header.scss';

const Header: React.FC = () => {
    const [isSettingsPanel, setIsSettingsPanel] = useState<boolean>(false);

    const hamburgerMenuClick = () => {
        setIsSettingsPanel(!isSettingsPanel);
    }

    return (
        <header className='header'>
            <h1>Chat App</h1>
            {/* Hamburger icon to open Settings Draw - animate with <AnimatePrecense /> */}
            <div 
                className={`hamburger-menu ${isSettingsPanel ? 'panel-open' : 'panel-closed'}`}
                onClick={ hamburgerMenuClick }>
                <div className='line line-1'></div>
                <div className='line line-2'></div>
                <div className='line line-3'></div>
            </div>
            {
                isSettingsPanel && (
                    <AnimatePresence>
                        <Settings showSettingsPanel={ setIsSettingsPanel } />
                    </AnimatePresence>
                )
            }
        </header>
    )
}

export default Header