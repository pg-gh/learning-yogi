import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    Pressable,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { createAudioPlayer } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio/build/AudioModule.types';
import { colors } from '../utils/colors';
import { Message, ReceiptEnum } from '../types';
import { loadMessages, saveMessages } from '../storage/chatStore';
import { sendToDummyApi, getRandomFirstSessionMessage } from '../api/dummy';
import MessageBubble from '../components/MessageBubble';
import EmojiPicker from '../components/EmojiPicker';
import TypingDots from '../components/TypingDots';

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const listRef = useRef<FlatList>(null);
    const [status, setStatus] = useState<'available' | 'online' | 'typing'>('available');
    const sendSoundRef = useRef<AudioPlayer | null>(null);
    const receiveSoundRef = useRef<AudioPlayer | null>(null);
    const insets = useSafeAreaInsets();
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const prev = await loadMessages();
            if (prev.length === 0) {
                const opener = getRandomFirstSessionMessage();
                const msg: { id: string; role: 'gale'; text: string; ts: number } = {
                    id: 'opener',
                    role: 'gale',
                    text: opener,
                    ts: Date.now(),
                };
                setMessages([msg]);
                await saveMessages([msg]);
            } else {
                setMessages(prev);
            }
        })();
    }, []);

    useEffect(() => {
        try {
            const sendPlayer = createAudioPlayer(require('../../assets/audio/send.wav'));
            const receivePlayer = createAudioPlayer(require('../../assets/audio/bubble.mp3'));
            sendSoundRef.current = sendPlayer;
            receiveSoundRef.current = receivePlayer;
        } catch { }
        return () => {
            try {
                sendSoundRef.current?.remove();
                receiveSoundRef.current?.remove();
            } catch { }
        };
    }, []);

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const formatTime = (timestamp: number) => {
        const d = new Date(timestamp);
        const now = new Date();
        const isSameDay = d.toDateString() === now.toDateString();
        const hours = d.getHours();
        const minutes = d.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const h12 = hours % 12 === 0 ? 12 : hours % 12;
        const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const timeStr = `${h12}:${mm} ${ampm}`;
        if (isSameDay) return timeStr;
        const MONTHS = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        const mon = MONTHS[d.getMonth()];
        return `${mon} ${d.getDate()}, ${timeStr}`;
    };

    const shouldShowTimeSeparator = (currentMsg: Message, prevMsg: Message | undefined) => {
        return true;
    };

    const renderMessage = ({ item, index }: { item: Message; index: number }) => {
        const prevMsg = index > 0 ? messages[index - 1] : undefined;
        const showTime = shouldShowTimeSeparator(item, prevMsg);

        return (
            <View>
                {showTime && (
                    <View style={[styles.timeSeparator, { marginTop: index === 0 ? 16 : 8 }]}>
                        <Text style={styles.timeText}>{formatTime(item.ts)}</Text>
                    </View>
                )}
                <MessageBubble m={item} />
            </View>
        );
    };

    const send = async () => {
        if (!input.trim()) return;
        const msg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input.trim(),
            ts: Date.now(),
            receipt: 'sending',
        };
        const newMsgs = [...messages, msg];
        setMessages(newMsgs);
        await saveMessages(newMsgs);
        try {
            sendSoundRef.current?.play();
        } catch { }
        setInput('');
        setTimeout(async () => {
            const updated: Message[] = newMsgs.map(m =>
                m.id === msg.id ? { ...m, receipt: 'sent' as ReceiptEnum } : m,
            );
            setMessages(updated);
            await saveMessages(updated);
        }, 200);
        setTimeout(async () => {
            const updated: Message[] = newMsgs.map(m =>
                m.id === msg.id ? { ...m, receipt: 'delivered' as ReceiptEnum } : m,
            );
            setMessages(updated);
            await saveMessages(updated);
        }, 400);
        setStatus('typing');
        const reply = await sendToDummyApi(msg.text);
        const replyMsg: Message = { id: 'g' + Date.now(), role: 'gale', text: reply, ts: Date.now() };
        const final: Message[] = [
            ...newMsgs.map(m => (m.id === msg.id ? { ...m, receipt: 'read' as ReceiptEnum } : m)),
            replyMsg,
        ];
        setMessages(final);
        await saveMessages(final);
        try {
            receiveSoundRef.current?.play();
        } catch { }
        setStatus('online');
        setTimeout(() => setStatus('available'), 2000);
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                enabled={keyboardVisible}
                keyboardVerticalOffset={0}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.backBtn}>
                        <Text style={styles.backTxt}>‹</Text>
                    </Pressable>
                    <Image source={require('../../assets/images/gale.png')} style={styles.avatar} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.name}>Gale</Text>
                        <View style={styles.statusRow}>
                            <View
                                style={[
                                    styles.statusDot,
                                    {
                                        backgroundColor:
                                            status === 'available'
                                                ? colors.accent
                                                : status === 'online'
                                                    ? '#22C55E'
                                                    : colors.typingDot,
                                    },
                                ]}
                            />
                            <Text style={styles.statusText}>
                                {status === 'available'
                                    ? 'Available'
                                    : status === 'online'
                                        ? 'Online'
                                        : 'Typing...'}
                            </Text>
                            {status === 'typing' && <TypingDots />}
                        </View>
                    </View>
                </View>
                <FlatList
                    ref={listRef}
                    data={messages}
                    keyExtractor={m => m.id}
                    renderItem={renderMessage}
                    keyboardShouldPersistTaps="always"
                    ListHeaderComponent={null}
                    onContentSizeChange={() => {
                        try { listRef.current?.scrollToEnd({ animated: true }); } catch { }
                    }}
                    contentContainerStyle={{
                        paddingTop: 12,
                        paddingBottom: (keyboardVisible ? 96 : insets.bottom + 96) + (showEmoji ? 280 : 0),
                    }}
                    style={{ flex: 1 }}
                />
                <View style={[styles.inputRow, { paddingBottom: insets.bottom }]} collapsable={false}>
                    <Pressable
                        onPress={() => {
                            Keyboard.dismiss();
                            setShowEmoji(!showEmoji);
                        }}
                        style={styles.emojiBtn}
                        hitSlop={12}
                    >
                        <Text style={{ fontSize: 20 }}>😀</Text>
                    </Pressable>
                    <TextInput
                        style={styles.input}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Type a message"
                        placeholderTextColor={colors.textSecondary}
                        selectionColor={colors.accent}
                    />
                    <Pressable onPress={send} style={styles.send} hitSlop={12}>
                        <Text style={{ color: colors.accent, fontSize: 16 }}>Send</Text>
                    </Pressable>
                </View>
                {showEmoji && (
                    <View
                        style={[styles.emojiSheetAbs, { bottom: insets.bottom + 64 }]}
                        pointerEvents="box-none"
                    >
                        <EmojiPicker
                            onSelect={e => {
                                setInput(prev => prev + e);
                            }}
                        />
                    </View>
                )}
                {!keyboardVisible && (
                    <View style={styles.legalDisclaimer}>
                        <Text style={styles.legalText}>
                            By using this chat, you agree to our Terms of Service and Privacy Policy.
                        </Text>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 8,
        zIndex: 100,
        elevation: 24,
        backgroundColor: colors.card,
    },
    emojiBtn: { padding: 8 },
    input: {
        flex: 1,
        padding: 8,
        borderRadius: 16,
        backgroundColor: colors.card,
        color: colors.textPrimary,
    },
    send: { padding: 8, borderRadius: 16, backgroundColor: colors.card },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.card,
    },
    backBtn: { paddingHorizontal: 4, paddingVertical: 4 },
    backTxt: { color: colors.textPrimary, fontSize: 22 },
    avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card },
    name: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    statusText: { color: colors.textSecondary, fontSize: 12 },
    emojiSheetAbs: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 280,
        backgroundColor: colors.card,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        zIndex: 10,
        elevation: 10,
    },
    legalDisclaimer: { paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center' },
    legalText: { color: colors.textSecondary, fontSize: 10, textAlign: 'center', opacity: 0.7 },
    timeSeparator: { alignItems: 'center', marginVertical: 8 },
    timeText: {
        color: colors.textSecondary,
        fontSize: 12,
        backgroundColor: colors.card,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
});
