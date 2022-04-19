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

    it('Should show username and room details', () => {
        customRender(<MockChatContainer />, { contextProviderProps });

        const nameDetails = screen.getByText(/Chatting as: John/i);
        const roomDetails = screen.getByText(/Room: room1/i);
        const editSpanIcon = screen.getByTestId('edit-room-icon');

        expect(nameDetails).toBeInTheDocument();
        expect(roomDetails).toBeInTheDocument();
        expect(editSpanIcon).toBeInTheDocument();
    });

    it('Should render <RoomModal /> when clicking edit room icon', () => {
        customRender(<MockChatContainer />, { contextProviderProps });
        const editSpanIcon = screen.getByTestId('edit-room-icon');
        
        fireEvent.click(editSpanIcon);

        const roomModalTitle = screen.getByText(/Change to a new chat room/i);
        const roomModalInput = screen.getByPlaceholderText(/Enter a new room to join.../i);

        expect(roomModalTitle).toBeInTheDocument();
        expect(roomModalInput).toBeInTheDocument();
    });

    it('Should close <RoomModal/> when clicking \'Cancel\' button', () => {
        customRender(<MockChatContainer />, { contextProviderProps });
        const editSpanIcon = screen.getByTestId('edit-room-icon');
        fireEvent.click(editSpanIcon);

        const roomModalTitle = screen.getByText(/Change to a new chat room/i);
        const cancelButton = screen.getByRole('button', {
            name: 'Cancel'
        });
        fireEvent.click(cancelButton);

        expect(roomModalTitle).not.toBeInTheDocument();
    });

})