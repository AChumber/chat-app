import { TypeOfMessages } from "../messageTypes";

export const responseBuilder = (type: TypeOfMessages, content: string, sender: string, date: number, source:string = 'external_chat') => {
    return {
        type,
        content,
        sender,
        date,
        source
    }
}