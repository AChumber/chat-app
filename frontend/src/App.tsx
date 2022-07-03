import React from 'react';
import ChatContainer from './components/chatContainer/ChatContainer';
import Header from './shared/layout/header/Header';
import NameModal from './components/nameModal/NameModal';
import { UserProvider } from './context/UserContext';

const App: React.FC = () => {
  return (
    <div className="App">
      <UserProvider>
        <Header />
        <NameModal />
        <ChatContainer />
      </UserProvider>
    </div>
  );
}

export default App;
