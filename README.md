# PDA Pro – Text Chat

Chat built with React Native + Expo. Local message persistence, receipts, typing indicator, emoji picker, sounds, and safe‑area aware layout.

## Features
- Chat UI with user/bot bubbles and time separators
- Receipts: sending → sent → delivered → read (read pulses)
- Typing status with animated dots
- Emoji picker sheet
- Sounds (expo-audio)

## Tech
- Expo SDK 53, React Native 0.79
- Navigation: `@react-navigation/native` (stack)
- Audio: `expo-audio`

## Getting started
```
cd pda-pro-text-chat
npm install
npm run start   # or: npm run android | npm run ios | npm run web
```

## Scripts
- `npm run start` – start Expo
- `npm run android | ios | web` – platform targets
- `npm run lint` – ESLint (Prettier integrated)
- `npm run format` – Prettier write

## Structure
```
src/
  screens/ChatScreen.tsx         # chat UI & logic
  screens/DashboardScreen.tsx    # entry card (Chat to Gale)
  components/MessageBubble.tsx   # bubble + receipt
  components/Receipt.tsx         # ticks + pulse on read
  components/EmojiPicker.tsx
  components/TypingDots.tsx
  storage/chatStore.ts           # load/save messages
  api/dummy.ts                   # mock reply + opener
  utils/colors.ts                # theme
```

## License
MIT
