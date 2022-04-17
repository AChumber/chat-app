import { screen, render, fireEvent } from '@testing-library/react';
import App from '../../../App';
import UserContext from '../../../context/UserContext';
import NameModal from '../NameModal';

const customRender = (component, {contextProviderProps, ...renderOptions}) => {
    return render(
        <UserContext.Provider {...contextProviderProps}>
            { component }
        </UserContext.Provider>,
        renderOptions
    )
}

const MockApp = () => {
    return (
        <>
            <NameModal />
        </>
    )
}

const emptyContextProviderProps = {
    value: {
        username: '',
        room: '',
        setUsername: ()=>{},
        setRoom: ()=>{}
    }
};

describe('NameModal', () => { 
    it('Should display modal when global app context is empty - First Start of App', () => {
        customRender(<MockApp />, {contextProviderProps: emptyContextProviderProps});

        const nameModalTitle = screen.getByText(/Enter a name to chat!/i);
        expect(nameModalTitle).toBeInTheDocument();
    })

    it('Should change input value when entering in inputs', () => {
        customRender(<MockApp />, {contextProviderProps: emptyContextProviderProps});

        const nameInputElem: HTMLInputElement = screen.getByPlaceholderText(/Enter a name to chat.../i);
        const roomInputElem: HTMLInputElement = screen.getByPlaceholderText(/Enter a room name to chat in.../i);

        expect(nameInputElem).toBeInTheDocument();
        expect(roomInputElem).toBeInTheDocument();

        fireEvent.change(nameInputElem, {target: { value: 'John' }});
        fireEvent.change(roomInputElem, {target: { value: 'room1' }});
        
        expect(nameInputElem.value).toBe('John');
        expect(roomInputElem.value).toBe('room1');
    });

    it('Should outline text input when no valid input present after submit button click', () => {
        customRender(<MockApp />, {contextProviderProps: emptyContextProviderProps});

        const nameInputElem: HTMLInputElement = screen.getByPlaceholderText(/Enter a name to chat.../i);
        const roomInputElem: HTMLInputElement = screen.getByPlaceholderText(/Enter a room name to chat in.../i);
        const submitBtn: HTMLButtonElement = screen.getByRole('button', {
            name: /Enter/i
        });

        fireEvent.click(submitBtn);
        expect(nameInputElem).toHaveStyle('border: 1px solid red');
        expect(roomInputElem).toHaveStyle('border: 1px solid red');
    });

    it('Should close modal on valid input for name and room when submitted', () => {
        render(<App />);

        const nameInputElem: HTMLInputElement = screen.getByPlaceholderText(/Enter a name to chat.../i);
        const roomInputElem: HTMLInputElement = screen.getByPlaceholderText(/Enter a room name to chat in.../i);
        const submitBtn: HTMLButtonElement = screen.getByRole('button', {
            name: /Enter/i
        });

        fireEvent.change(nameInputElem, {target: { value: 'John' }});
        fireEvent.change(roomInputElem, {target: { value: 'room1' }});
        fireEvent.click(submitBtn);

        const mainPageNameDetails = screen.getByText(/Chatting as: John/i);

        expect(nameInputElem).not.toBeInTheDocument();
        expect(roomInputElem).not.toBeInTheDocument();
        expect(mainPageNameDetails).toBeInTheDocument();
    });
});