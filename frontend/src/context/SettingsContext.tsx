import { createContext, useState } from 'react';
import DefaultColours, { ColorsInterface } from './ColoursContext';

interface SettingsInterface {
    enterToSend: boolean,
    setEnterToSend: React.Dispatch<React.SetStateAction<boolean>>,
    colors: ColorsInterface
    setColors: React.Dispatch<React.SetStateAction<ColorsInterface>>
};


const SettingsContext = createContext<SettingsInterface>({
    enterToSend: false,
    setEnterToSend: () => {},
    colors: {
        myMessages: '',
        recievedMessages: ''
    },
    setColors: () => {}
});

export const SettingsProvider = ({ children }) => {
    const [enterToSend, setEnterToSend] = useState<boolean>(false);
    const [colors, setColors] = useState<ColorsInterface>({
        myMessages: DefaultColours.myMessages,
        recievedMessages: DefaultColours.recievedMessages
    })

    return(
        <SettingsContext.Provider value={{ enterToSend, setEnterToSend, colors, setColors }}>
            { children }
        </SettingsContext.Provider>
    );
}

export default SettingsContext;