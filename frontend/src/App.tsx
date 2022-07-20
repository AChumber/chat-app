import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatContainer from './components/chatContainer/ChatContainer';
import Header from './shared/layout/header/Header';
import NameModal from './components/nameModal/NameModal';
import { UserProvider } from './context/UserContext';
import { SettingsProvider } from './context/SettingsContext';

const App: React.FC = () => {
  return (
    <div className="App">
      <UserProvider>
        <SettingsProvider>
          <Header />
          <Routes>
            <Route path='/' element={ <NameModal /> } />
            <Route path='/chat' element={ <ChatContainer/> } />
          </Routes>
        </SettingsProvider>
      </UserProvider>
    </div>
  );
}

export default App;
