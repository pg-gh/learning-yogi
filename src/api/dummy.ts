const RESPONSES = [
    'I hear you. Let’s take this one step at a time.',
    'That sounds tough. Try reducing demands and giving choices.',
    'Great question! For transitions, try a visual timer.',
    'It’s okay to feel overwhelmed. Small steps can make a big difference.',
    'Remember to take care of yourself, too.',
    'Would you like some ideas for supporting autonomy?',
    'You’re doing your best. Let’s brainstorm together.',
    'Sometimes a break can help reset the situation.',
    'Offering choices can reduce anxiety and resistance.',
    'Let’s focus on what’s working well right now.',
    'Visual supports can make expectations clearer.',
    'Would you like to talk through a specific scenario?',
];

const OPENERS = [
    'Hi, I’m Gale. I’m here to support you with PDA-informed strategies. What’s on your mind today?',
];

export async function sendToDummyApi(message: string): Promise<string> {
    await new Promise(r => setTimeout(r, 800));
    return RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
}

export function getRandomFirstSessionMessage() {
    return OPENERS[Math.floor(Math.random() * OPENERS.length)];
}
