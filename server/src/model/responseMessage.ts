import { MessageTypes } from "../messageTypes";

export const responseBuilder = (type: MessageTypes, content: string, sender: string, date: number, source:string = 'external_chat') => {
    return {
        type,
        content,
        sender,
        date,
        source
    }
}