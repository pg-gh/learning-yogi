import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, SessionMeta } from '../types';

const MSG_KEY = 'pda_chat_messages_v1';
const META_KEY = 'pda_chat_meta_v1';

export async function loadMessages(): Promise<Message[]> {
  try {
    const raw = await AsyncStorage.getItem(MSG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveMessages(msgs: Message[]) {
  try {
    await AsyncStorage.setItem(MSG_KEY, JSON.stringify(msgs));
  } catch { }
}

export async function loadMeta(): Promise<SessionMeta | null> {
  try {
    const raw = await AsyncStorage.getItem(META_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveMeta(meta: SessionMeta) {
  try {
    await AsyncStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch { }
}
