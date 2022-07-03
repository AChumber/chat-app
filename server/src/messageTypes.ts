export const MessageTypes = {
    'SERVER' : 'server',
    'MESSAGE' : 'message',
    'USER_JOIN' : 'user_join',
    'USER_LEFT' : 'user_left',
    'USER_TYPING' : 'user_typing',
    'USER_STOP_TYPING' : 'user_stop_typing'
} as const;

type keys = keyof typeof MessageTypes;
export type TypeOfMessages = typeof MessageTypes[keys];