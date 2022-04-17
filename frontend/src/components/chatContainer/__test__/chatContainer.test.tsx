import { screen, render, fireEvent } from '@testing-library/react';
import UserContext from '../../../context/UserContext';
import ChatContainer from '../ChatContainer';


const customRender = (component, {contextProviderProps, ...renderOptions}) => {
    return render(
        <UserContext.Provider {...contextProviderProps}>
            { component }
        </UserContext.Provider>,
        renderOptions
    )
}

const MockChatContainer = () => {
    return(
        <>
            <ChatContainer />
        </>
    );
}

const contextProviderProps = {
    value: {
        username: 'John',
        room: 'room1',
        setUsername: ()=>{},
        setRoom: ()=>{}
    }
};

describe('ChatContainer', () => {

    it('Should render empty messages div', () => {
        customRender(<MockChatContainer />, {contextProviderProps: contextProviderProps});

        const emptyMessagesContainer = screen.getByTestId('messages-container');
        expect(emptyMessagesContainer).toBeInTheDocument();
        expect(emptyMessagesContainer).toBeEmptyDOMElement();
    })
})