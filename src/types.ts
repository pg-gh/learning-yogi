export type Role = 'user' | 'gale';
export type ReceiptEnum = 'sending' | 'sent' | 'delivered' | 'read';

export interface Message {
    id: string;
    role: Role;
    text: string;
    ts: number;
    receipt?: ReceiptEnum;
}

export interface SessionMeta {
    threadId: string;
    assistantId: string;
    firstSession: boolean;
    lastCode: string;
}
