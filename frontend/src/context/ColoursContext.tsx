//Store Object with colours for client messages and recieved messages
export interface ColorsInterface {
    myMessages: string,
    recievedMessages: string
}

const DefaultColours:ColorsInterface = {
    myMessages: '#FFFFFF',
    recievedMessages: '#EEF8FF'
};

export default DefaultColours;